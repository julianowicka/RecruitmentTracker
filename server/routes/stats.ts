import { Router } from 'express';
import { applicationService } from '../services/application.service';
import { asyncHandler } from '../middleware/errorHandler';

export const statsRouter = Router();

statsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const stats = await applicationService.getStats();
    res.json(stats);
  })
);

