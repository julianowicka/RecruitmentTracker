import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import { getApplicationById, type Application } from '../../api/applications';

async function fetchApplication(id: number): Promise<Application> {
  const app = await getApplicationById(id);
  
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

