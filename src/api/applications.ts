/**
 * API client for job applications
 * Handles all HTTP requests related to applications, notes, and statistics
 */
import { httpClient } from './httpClient';

/** Application entity from the database */
export interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  link: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  tags: string | null; // JSON array as string
  rating: number | null; // 1-5 stars
  createdAt: string;
  updatedAt: string;
}

/** Note attached to an application */
export interface Note {
  id: number;
  applicationId: number;
  category: string;
  content: string;
  createdAt: string;
}

/** Status change history entry */
export interface StatusHistory {
  id: number;
  applicationId: number;
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
}

/** Comprehensive statistics about applications */
export interface ApplicationStats {
  total: number;
  byStatus: {
    applied: number;
    hr_interview: number;
    tech_interview: number;
    offer: number;
    rejected: number;
  };
  recent: Application[];
  averageSalary: number | null;
  averageRecruitmentDays: number | null;
  conversionRate: number;
  successRate: number;
  inProgress: number;
}


/**
 * Fetches all applications, optionally filtered by status
 * @param status - Optional status filter
 * @returns Promise resolving to array of applications
 */
export async function getAllApplications(status?: string): Promise<Application[]> {
  return httpClient.get<Application[]>('/applications', status ? { status } : undefined);
}

/**
 * Fetches a single application by ID
 * @param id - Application ID
 * @returns Promise resolving to application or undefined if not found
 */
export async function getApplicationById(id: number): Promise<Application | undefined> {
  try {
    return await httpClient.get<Application>(`/applications/${id}`);
  } catch (error: any) {
    if (error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Creates a new application
 * @param data - Application data
 * @returns Promise resolving to created application
 */
export async function createApplication(data: {
  company: string;
  role: string;
  status: string;
  link?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string[];
  rating?: number;
}): Promise<Application> {
  // Konwertuj tags array na JSON string
  const payload = {
    ...data,
    tags: data.tags ? JSON.stringify(data.tags) : undefined,
  };
  return httpClient.post<Application>('/applications', payload);
}

export async function updateApplication(
  id: number,
  data: Partial<{
    company: string;
    role: string;
    status: string;
    link: string;
    salaryMin: number;
    salaryMax: number;
    tags: string[];
    rating: number;
  }>
): Promise<Application> {
  // Konwertuj tags array na JSON string
  const payload = {
    ...data,
    tags: data.tags ? JSON.stringify(data.tags) : undefined,
  };
  return httpClient.patch<Application>(`/applications/${id}`, payload);
}

export async function deleteApplication(id: number): Promise<void> {
  await httpClient.delete(`/applications/${id}`);
}


export async function getNotesByApplicationId(applicationId: number): Promise<Note[]> {
  return httpClient.get<Note[]>('/notes', { applicationId: applicationId.toString() });
}

export async function createNote(data: {
  applicationId: number;
  content: string;
  category?: string;
}): Promise<Note> {
  return httpClient.post<Note>('/notes', data);
}

export async function deleteNote(id: number): Promise<void> {
  await httpClient.delete(`/notes/${id}`);
}


export async function getStatusHistoryByApplicationId(
  applicationId: number
): Promise<StatusHistory[]> {
  return httpClient.get<StatusHistory[]>('/status-history', {
    applicationId: applicationId.toString(),
  });
}


export async function getApplicationStats(): Promise<ApplicationStats> {
  return httpClient.get<ApplicationStats>('/stats');
}
