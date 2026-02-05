import { httpClient } from './httpClient';

export interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  link: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: number;
  applicationId: number;
  category: string;
  content: string;
  createdAt: string;
}

export interface StatusHistory {
  id: number;
  applicationId: number;
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
}

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
}


export async function getAllApplications(status?: string): Promise<Application[]> {
  return httpClient.get<Application[]>('/applications', status ? { status } : undefined);
}

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

export async function createApplication(data: {
  company: string;
  role: string;
  status: string;
  link?: string;
  salaryMin?: number;
  salaryMax?: number;
}): Promise<Application> {
  return httpClient.post<Application>('/applications', data);
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
  }>
): Promise<Application> {
  return httpClient.patch<Application>(`/applications/${id}`, data);
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
