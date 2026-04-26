
import { db } from '../db';
import { applications, statusHistory } from '../db/schema';
import { and, eq, desc } from 'drizzle-orm';
import type { Application, InsertApplication } from '../db/schema';

/**
 * Service for managing job applications
 * Handles CRUD operations and status tracking
 */
export class ApplicationService {
  /**
   * Retrieves all applications, optionally filtered by status
   * @param statusFilter - Optional status to filter by (e.g., 'applied', 'interview')
   * @returns Promise resolving to array of applications
   */
  async getAll(userId: number, statusFilter?: string): Promise<Application[]> {
    if (statusFilter) {
      return await db
        .select()
        .from(applications)
        .where(and(eq(applications.userId, userId), eq(applications.status, statusFilter)))
        .orderBy(desc(applications.createdAt));
    }

    return await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));
  }

  /**
   * Retrieves a single application by ID
   * @param id - Application ID
   * @returns Promise resolving to application or null if not found
   */
  async getById(id: number, userId: number): Promise<Application | null> {
    const result = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Creates a new application and records initial status in history
   * Uses transaction to ensure data consistency
   * @param data - Application data (without timestamps)
   * @returns Promise resolving to created application
   */
  async create(
    userId: number,
    data: Omit<InsertApplication, 'createdAt' | 'updatedAt' | 'userId'>
  ): Promise<Application> {
    const result = await db.transaction(async (tx) => {
      const [newApp] = await tx
        .insert(applications)
        .values({
          ...data,
          userId,
        })
        .returning();

      await tx.insert(statusHistory).values({
        applicationId: newApp.id,
        fromStatus: null,
        toStatus: newApp.status,
      });

      return newApp;
    });

    return result;
  }

  /**
   * Updates an existing application and tracks status changes
   * Uses transaction to ensure atomicity
   * @param id - Application ID to update
   * @param data - Partial application data to update
   * @returns Promise resolving to updated application or null if not found
   */
  async update(
    id: number,
    userId: number,
    data: Partial<Omit<InsertApplication, 'id' | 'createdAt' | 'userId'>>
  ): Promise<Application | null> {
    const current = await this.getById(id, userId);
    
    if (!current) {
      return null;
    }

    const result = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(applications)
        .set(data)
        .where(and(eq(applications.id, id), eq(applications.userId, userId)))
        .returning();

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

  /**
   * Deletes an application by ID
   * @param id - Application ID to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  async delete(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    return result.changes > 0;
  }

  /**
   * Calculates comprehensive statistics about all applications
   * @returns Promise resolving to statistics object containing:
   *   - total: Total number of applications
   *   - byStatus: Count by status
   *   - avgSalary: Average expected salary
   *   - conversionRate: Percentage reaching offer stage
   *   - successRate: Percentage of successful outcomes
   *   - averageRecruitmentTime: Average days from applied to offer
   */
  async getStats(userId: number) {
    const allApps = await this.getAll(userId);

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

    // Oblicz średni czas rekrutacji (od applied do offer/rejected)
    const completedApps = allApps.filter(app => 
      app.status === 'offer' || app.status === 'rejected'
    );
    
    let totalDays = 0;
    completedApps.forEach(app => {
      const created = new Date(app.createdAt).getTime();
      const updated = new Date(app.updatedAt).getTime();
      const days = (updated - created) / (1000 * 60 * 60 * 24);
      totalDays += days;
    });

    const averageRecruitmentDays = completedApps.length > 0 
      ? Math.round(totalDays / completedApps.length) 
      : null;

    // Conversion rate (offer / total aplikacji)
    const conversionRate = allApps.length > 0
      ? Math.round((byStatus.offer / allApps.length) * 100)
      : 0;

    // Success rate (offer / (offer + rejected))
    const finalizedApps = byStatus.offer + byStatus.rejected;
    const successRate = finalizedApps > 0
      ? Math.round((byStatus.offer / finalizedApps) * 100)
      : 0;

    const recent = allApps.slice(0, 5);

    return {
      total: allApps.length,
      byStatus,
      recent,
      averageSalary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : null,
      averageRecruitmentDays,
      conversionRate,
      successRate,
      inProgress: byStatus.hr_interview + byStatus.tech_interview,
    };
  }
}

export const applicationService = new ApplicationService();
