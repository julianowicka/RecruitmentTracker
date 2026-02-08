import { Request, Response, NextFunction } from 'express';

const VALID_STATUSES = ['applied', 'hr_interview', 'tech_interview', 'offer', 'rejected'] as const;
const VALID_NOTE_CATEGORIES = ['general', 'technical', 'company', 'interview_prep', 'followup'] as const;

export interface CreateApplicationDTO {
  company: string;
  role: string;
  status?: string;
  link?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string;
  rating?: number;
}

export interface UpdateApplicationDTO {
  company?: string;
  role?: string;
  status?: string;
  link?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string;
  rating?: number;
}

export function validateCreateApplication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { company, role, status, salaryMin, salaryMax, tags, rating } = req.body;

  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    res.status(400).json({ error: 'Company is required and must be a non-empty string' });
    return;
  }

  if (!role || typeof role !== 'string' || role.trim().length === 0) {
    res.status(400).json({ error: 'Role is required and must be a non-empty string' });
    return;
  }

  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }

  if (salaryMin !== undefined && (typeof salaryMin !== 'number' || salaryMin < 0)) {
    res.status(400).json({ error: 'salaryMin must be a positive number' });
    return;
  }

  if (salaryMax !== undefined && (typeof salaryMax !== 'number' || salaryMax < 0)) {
    res.status(400).json({ error: 'salaryMax must be a positive number' });
    return;
  }

  if (
    salaryMin !== undefined &&
    salaryMax !== undefined &&
    salaryMin > salaryMax
  ) {
    res.status(400).json({ error: 'salaryMin cannot be greater than salaryMax' });
    return;
  }

  // Walidacja tags (musi być JSON array jako string)
  if (tags !== undefined && typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (!Array.isArray(parsed)) {
        res.status(400).json({ error: 'tags must be a JSON array' });
        return;
      }
    } catch {
      res.status(400).json({ error: 'tags must be valid JSON' });
      return;
    }
  }

  // Walidacja rating (1-5)
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    res.status(400).json({ error: 'rating must be a number between 1 and 5' });
    return;
  }

  next();
}

export function validateUpdateApplication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { company, role, status, salaryMin, salaryMax, tags, rating } = req.body;

  if (
    company === undefined &&
    role === undefined &&
    status === undefined &&
    salaryMin === undefined &&
    salaryMax === undefined &&
    req.body.link === undefined &&
    tags === undefined &&
    rating === undefined
  ) {
    res.status(400).json({ error: 'At least one field must be provided for update' });
    return;
  }

  if (company !== undefined && (typeof company !== 'string' || company.trim().length === 0)) {
    res.status(400).json({ error: 'Company must be a non-empty string' });
    return;
  }

  if (role !== undefined && (typeof role !== 'string' || role.trim().length === 0)) {
    res.status(400).json({ error: 'Role must be a non-empty string' });
    return;
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }

  if (salaryMin !== undefined && (typeof salaryMin !== 'number' || salaryMin < 0)) {
    res.status(400).json({ error: 'salaryMin must be a positive number' });
    return;
  }

  if (salaryMax !== undefined && (typeof salaryMax !== 'number' || salaryMax < 0)) {
    res.status(400).json({ error: 'salaryMax must be a positive number' });
    return;
  }

  // Walidacja tags
  if (tags !== undefined && typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (!Array.isArray(parsed)) {
        res.status(400).json({ error: 'tags must be a JSON array' });
        return;
      }
    } catch {
      res.status(400).json({ error: 'tags must be valid JSON' });
      return;
    }
  }

  // Walidacja rating
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    res.status(400).json({ error: 'rating must be a number between 1 and 5' });
    return;
  }

  next();
}

export function validateIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const idParam = req.params.id;
  const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam, 10);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid ID parameter' });
    return;
  }

  (req as any).parsedId = id;
  next();
}

export function validateCreateNote(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { applicationId, content, category } = req.body;

  if (!applicationId || typeof applicationId !== 'number' || applicationId <= 0) {
    res.status(400).json({ error: 'Valid applicationId is required' });
    return;
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    return;
  }

  if (category && !VALID_NOTE_CATEGORIES.includes(category)) {
    res.status(400).json({
      error: `Invalid category. Must be one of: ${VALID_NOTE_CATEGORIES.join(', ')}`,
    });
    return;
  }

  next();
}

