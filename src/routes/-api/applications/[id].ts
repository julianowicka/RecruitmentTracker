import { json } from '@tanstack/react-start';
import { db } from '../../../db';
import { applications } from '../../../db/schema';
import { updateApplicationSchema } from '../../../lib/validations';
import { eq } from 'drizzle-orm';
import { z } from 'zod';


export async function GET({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return json(
        {
          success: false,
          error: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!application) {
      return json(
        {
          success: false,
          error: 'Application not found',
        },
        { status: 404 }
      );
    }

    return json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return json(
      {
        success: false,
        error: 'Failed to fetch application',
      },
      { status: 500 }
    );
  }
}


export async function PATCH({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return json(
        {
          success: false,
          error: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validatedData = updateApplicationSchema.parse(body);

    const dataToUpdate = {
      ...validatedData,
      link: validatedData.link === '' ? null : validatedData.link,
    };

    const [updatedApplication] = await db
      .update(applications)
      .set({
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(applications.id, id))
      .returning();

    if (!updatedApplication) {
      return json(
        {
          success: false,
          error: 'Application not found',
        },
        { status: 404 }
      );
    }

    return json({
      success: true,
      data: updatedApplication,
    });
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

    console.error('Error updating application:', error);
    return json(
      {
        success: false,
        error: 'Failed to update application',
      },
      { status: 500 }
    );
  }
}


export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return json(
        {
          success: false,
          error: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const [deletedApplication] = await db
      .delete(applications)
      .where(eq(applications.id, id))
      .returning();

    if (!deletedApplication) {
      return json(
        {
          success: false,
          error: 'Application not found',
        },
        { status: 404 }
      );
    }

    return json({
      success: true,
      data: { id: deletedApplication.id },
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return json(
      {
        success: false,
        error: 'Failed to delete application',
      },
      { status: 500 }
    );
  }
}

