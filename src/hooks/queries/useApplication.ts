import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';

const STORAGE_KEY = 'recruitment-tracker-apps';

function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

async function fetchApplication(id: number): Promise<Application> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allApps = getStoredApplications();
  const app = allApps.find(a => a.id === id);
  
  if (!app) {
    throw new Error('Application not found');
  }
  
  return app;
}

export function useApplication(
  id: number, 
  options?: Omit<UseQueryOptions<Application>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => fetchApplication(id),
    enabled: !!id,
    ...options,
  });
}

