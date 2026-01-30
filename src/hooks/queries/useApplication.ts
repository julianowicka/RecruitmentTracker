import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';

interface ApplicationResponse {
  success: boolean;
  data: Application;
}


async function fetchApplication(id: number): Promise<Application> {
  const response = await fetch(`/api/applications/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Application not found');
    }
    throw new Error('Failed to fetch application');
  }

  const result: ApplicationResponse = await response.json();
  return result.data;
}


export function useApplication(id: number) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  });
}

