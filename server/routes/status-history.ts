import { Router } from 'express';
import { db } from '../db';
import { applications, statusHistory } from '../db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { applicationService } from '../services/application.service';

export const statusHistoryRouter = Router();

statusHistoryRouter.use(authMiddleware);

statusHistoryRouter.get(
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
        id: statusHistory.id,
        applicationId: statusHistory.applicationId,
        fromStatus: statusHistory.fromStatus,
        toStatus: statusHistory.toStatus,
        changedAt: statusHistory.changedAt,
      })
      .from(statusHistory)
      .innerJoin(applications, eq(statusHistory.applicationId, applications.id))
      .where(and(eq(statusHistory.applicationId, appId), eq(applications.userId, userId)))
      .orderBy(desc(statusHistory.changedAt));

    res.json(result);
  })
);

