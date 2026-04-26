import { Router } from 'express';
import { applicationService } from '../services/application.service';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import {
  validateCreateApplication,
  validateUpdateApplication,
  validateIdParam,
} from '../middleware/validation';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const applicationsRouter = Router();

applicationsRouter.use(authMiddleware);

applicationsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const userId = (req as AuthRequest).userId!;
    const result = await applicationService.getAll(
      userId,
      status && typeof status === 'string' ? status : undefined
    );
    res.json(result);
  })
);

applicationsRouter.get(
  '/:id',
  validateIdParam,
  asyncHandler(async (req, res) => {
    const id = (req as any).parsedId;
    const userId = (req as AuthRequest).userId!;
    const result = await applicationService.getById(id, userId);

    if (!result) {
      throw new AppError('Application not found', 404);
    }

    res.json(result);
  })
);

applicationsRouter.post(
  '/',
  validateCreateApplication,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthRequest).userId!;
    const { company, role, status = 'applied', link, salaryMin, salaryMax } = req.body;

    const result = await applicationService.create(userId, {
      company,
      role,
      status,
      link: link || null,
      salaryMin: salaryMin ?? null,
      salaryMax: salaryMax ?? null,
    });

    res.status(201).json(result);
  })
);

applicationsRouter.patch(
  '/:id',
  validateIdParam,
  validateUpdateApplication,
  asyncHandler(async (req, res) => {
    const id = (req as any).parsedId;
    const userId = (req as AuthRequest).userId!;
    const updates = req.body;

    const result = await applicationService.update(id, userId, updates);

    if (!result) {
      throw new AppError('Application not found', 404);
    }

    res.json(result);
  })
);

applicationsRouter.delete(
  '/:id',
  validateIdParam,
  asyncHandler(async (req, res) => {
    const id = (req as any).parsedId;
    const userId = (req as AuthRequest).userId!;
    const deleted = await applicationService.delete(id, userId);

    if (!deleted) {
      throw new AppError('Application not found', 404);
    }

    res.status(204).send();
  })
);

