// Service Layer - Business Logic
import { db } from '../db';
import { applications, statusHistory } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import type { Application, InsertApplication } from '../db/schema';

export class ApplicationService {
  async getAll(statusFilter?: string): Promise<Application[]> {
    if (statusFilter) {
      return await db
        .select()
        .from(applications)
        .where(eq(applications.status, statusFilter))
        .orderBy(desc(applications.createdAt));
    }

    return await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));
  }

  async getById(id: number): Promise<Application | null> {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: Omit<InsertApplication, 'createdAt' | 'updatedAt'>): Promise<Application> {
    // Use transaction to ensure both application and history are created
    const result = await db.transaction(async (tx) => {
      const [newApp] = await tx
        .insert(applications)
        .values(data)
        .returning();

      // Create initial status history entry
      await tx.insert(statusHistory).values({
        applicationId: newApp.id,
        fromStatus: null,
        toStatus: newApp.status,
      });

      return newApp;
    });

    return result;
  }

  async update(
    id: number,
    data: Partial<Omit<InsertApplication, 'id' | 'createdAt'>>
  ): Promise<Application | null> {
    const current = await this.getById(id);
    
    if (!current) {
      return null;
    }

    // Use transaction for update + status history
    const result = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(applications)
        .set(data)
        .where(eq(applications.id, id))
        .returning();

      // Track status change if status was updated
      if (data.status && data.status !== current.status) {
        await tx.insert(statusHistory).values({
          applicationId: id,
          fromStatus: current.status,
          toStatus: data.status,
        });
      }

      return updated;
    });

    return result;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(applications)
      .where(eq(applications.id, id));

    // Check if anything was deleted
    return result.changes > 0;
  }

  async getStats() {
    const allApps = await this.getAll();

    const byStatus = {
      applied: 0,
      hr_interview: 0,
      tech_interview: 0,
      offer: 0,
      rejected: 0,
    };

    let totalSalary = 0;
    let salaryCount = 0;

    allApps.forEach((app) => {
      if (app.status in byStatus) {
        byStatus[app.status as keyof typeof byStatus]++;
      }

      if (app.salaryMin && app.salaryMax) {
        totalSalary += (app.salaryMin + app.salaryMax) / 2;
        salaryCount++;
      }
    });

    const recent = allApps.slice(0, 5);

    return {
      total: allApps.length,
      byStatus,
      recent,
      averageSalary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : null,
    };
  }
}

// Export singleton instance
export const applicationService = new ApplicationService();

