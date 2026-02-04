import { Router } from 'express';
import { applicationService } from '../services/application.service';
import { asyncHandler } from '../middleware/errorHandler';

export const statsRouter = Router();

// GET /api/stats - Get application statistics
statsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const stats = await applicationService.getStats();
    res.json(stats);
  })
);

