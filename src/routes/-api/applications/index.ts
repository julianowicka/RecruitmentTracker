import { json } from '@tanstack/react-start';
import { db } from '../../../db';
import { applications } from '../../../db/schema';
import { createApplicationSchema } from '../../../lib/validations';
import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';


export async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let query = db.select().from(applications);
    
    if (status) {
      query = query.where(eq(applications.status, status));
    }

    const result = await query.orderBy(desc(applications.createdAt));

    return json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return json(
      {
        success: false,
        error: 'Failed to fetch applications',
      },
      { status: 500 }
    );
  }
}


export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();

    const validatedData = createApplicationSchema.parse(body);

    const dataToInsert = {
      ...validatedData,
      link: validatedData.link || null,
    };

    const [newApplication] = await db
      .insert(applications)
      .values(dataToInsert)
      .returning();

    return json(
      {
        success: true,
        data: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error creating application:', error);
    return json(
      {
        success: false,
        error: 'Failed to create application',
      },
      { status: 500 }
    );
  }
}

