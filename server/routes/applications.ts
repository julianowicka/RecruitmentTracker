import { Router } from 'express';
import { applicationService } from '../services/application.service';
import {
  validateCreateApplication,
  validateUpdateApplication,
  validateIdParam,
} from '../middleware/validation';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const applicationsRouter = Router();

applicationsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const result = await applicationService.getAll(
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
    const result = await applicationService.getById(id);

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
    const { company, role, status = 'applied', link, salaryMin, salaryMax } = req.body;

    const result = await applicationService.create({
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
    const updates = req.body;

    const result = await applicationService.update(id, updates);

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
    const deleted = await applicationService.delete(id);

    if (!deleted) {
      throw new AppError('Application not found', 404);
    }

    res.status(204).send();
  })
);

