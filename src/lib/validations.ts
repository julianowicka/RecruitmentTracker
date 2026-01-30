import { z } from 'zod';
import { APPLICATION_STATUSES } from './constants';

// Base schema bez refine
const baseApplicationSchema = z.object({
  company: z.string().min(1, 'Nazwa firmy jest wymagana').max(255),
  role: z.string().min(1, 'Nazwa stanowiska jest wymagana').max(255),
  status: z.enum([
    APPLICATION_STATUSES.APPLIED,
    APPLICATION_STATUSES.HR_INTERVIEW,
    APPLICATION_STATUSES.TECH_INTERVIEW,
    APPLICATION_STATUSES.OFFER,
    APPLICATION_STATUSES.REJECTED,
  ]).default(APPLICATION_STATUSES.APPLIED),
  link: z.string().url('Nieprawidłowy URL').optional().or(z.literal('')),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
});

// Create schema z walidacją salaryMax >= salaryMin
export const createApplicationSchema = baseApplicationSchema.refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: 'Maksymalne wynagrodzenie musi być większe lub równe minimalnemu',
    path: ['salaryMax'],
  }
);

// Update schema - partial bez refine (bo przy partial nie możemy zagwarantować że oba pola są obecne)
export const updateApplicationSchema = baseApplicationSchema.partial();


export const createNoteSchema = z.object({
  applicationId: z.number().int().positive(),
  content: z.string().min(1, 'Treść notatki jest wymagana'),
});


export const updateStatusSchema = z.object({
  applicationId: z.number().int().positive(),
  newStatus: z.enum([
    APPLICATION_STATUSES.APPLIED,
    APPLICATION_STATUSES.HR_INTERVIEW,
    APPLICATION_STATUSES.TECH_INTERVIEW,
    APPLICATION_STATUSES.OFFER,
    APPLICATION_STATUSES.REJECTED,
  ]),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

