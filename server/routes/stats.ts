import { Router } from 'express';
import { applicationService } from '../services/application.service';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

export const statsRouter = Router();

statsRouter.use(authMiddleware);

statsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = (req as AuthRequest).userId!;
    const stats = await applicationService.getStats(userId);
    res.json(stats);
  })
);

