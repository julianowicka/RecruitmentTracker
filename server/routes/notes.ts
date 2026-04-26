import { Router } from 'express';
import { db } from '../db';
import { applications, notes } from '../db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validateCreateNote, validateIdParam } from '../middleware/validation';
import { applicationService } from '../services/application.service';

export const notesRouter = Router();

notesRouter.use(authMiddleware);

notesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { applicationId } = req.query;
    const userId = (req as AuthRequest).userId!;

    if (!applicationId) {
      throw new AppError('applicationId is required', 400);
    }

    const appId = parseInt(applicationId as string, 10);

    if (Number.isNaN(appId) || appId <= 0) {
      throw new AppError('Valid applicationId is required', 400);
    }

    const application = await applicationService.getById(appId, userId);

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    const result = await db
      .select({
        id: notes.id,
        applicationId: notes.applicationId,
        category: notes.category,
        content: notes.content,
        createdAt: notes.createdAt,
      })
      .from(notes)
      .innerJoin(applications, eq(notes.applicationId, applications.id))
      .where(and(eq(notes.applicationId, appId), eq(applications.userId, userId)))
      .orderBy(desc(notes.createdAt));

    res.json(result);
  })
);

notesRouter.post(
  '/',
  validateCreateNote,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthRequest).userId!;
    const { applicationId, content, category = 'general' } = req.body;

    const application = await applicationService.getById(applicationId, userId);

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    const result = await db
      .insert(notes)
      .values({
        applicationId,
        content,
        category,
      })
      .returning();

    res.status(201).json(result[0]);
  })
);

notesRouter.delete(
  '/:id',
  validateIdParam,
  asyncHandler(async (req, res) => {
    const noteId = (req as any).parsedId;
    const userId = (req as AuthRequest).userId!;

    const [existingNote] = await db
      .select({
        id: notes.id,
      })
      .from(notes)
      .innerJoin(applications, eq(notes.applicationId, applications.id))
      .where(and(eq(notes.id, noteId), eq(applications.userId, userId)))
      .limit(1);

    if (!existingNote) {
      throw new AppError('Note not found', 404);
    }

    await db.delete(notes).where(eq(notes.id, noteId));

    res.status(204).send();
  })
);

