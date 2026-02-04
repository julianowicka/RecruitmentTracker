import { Request, Response, NextFunction } from 'express';

// Valid application statuses
const VALID_STATUSES = ['applied', 'hr_interview', 'tech_interview', 'offer', 'rejected'] as const;

export interface CreateApplicationDTO {
  company: string;
  role: string;
  status?: string;
  link?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface UpdateApplicationDTO {
  company?: string;
  role?: string;
  status?: string;
  link?: string;
  salaryMin?: number;
  salaryMax?: number;
}

// Validation middleware for creating application
export function validateCreateApplication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { company, role, status, salaryMin, salaryMax } = req.body;

  // Required fields
  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    res.status(400).json({ error: 'Company is required and must be a non-empty string' });
    return;
  }

  if (!role || typeof role !== 'string' || role.trim().length === 0) {
    res.status(400).json({ error: 'Role is required and must be a non-empty string' });
    return;
  }

  // Optional status validation
  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }

  // Salary validation
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

  next();
}

// Validation middleware for updating application
export function validateUpdateApplication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { company, role, status, salaryMin, salaryMax } = req.body;

  // At least one field must be provided
  if (
    company === undefined &&
    role === undefined &&
    status === undefined &&
    salaryMin === undefined &&
    salaryMax === undefined &&
    req.body.link === undefined
  ) {
    res.status(400).json({ error: 'At least one field must be provided for update' });
    return;
  }

  // Validate provided fields
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

  next();
}

// Validate ID parameter
export function validateIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid ID parameter' });
    return;
  }

  // Attach parsed ID to request for use in handlers
  (req as any).parsedId = id;
  next();
}

// Validate note creation
export function validateCreateNote(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { applicationId, content } = req.body;

  if (!applicationId || typeof applicationId !== 'number' || applicationId <= 0) {
    res.status(400).json({ error: 'Valid applicationId is required' });
    return;
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    return;
  }

  next();
}

