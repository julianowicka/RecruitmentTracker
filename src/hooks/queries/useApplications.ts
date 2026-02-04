import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import { getAllApplications, type Application } from '../../api/applications';

async function fetchApplications(
  status?: string | null
): Promise<Application[]> {
  return await getAllApplications(status || undefined);
}

export function useApplications(status?: string) {
  return useQuery({
    queryKey: queryKeys.applications.list({ status }),
    queryFn: () => fetchApplications(status),
    
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

