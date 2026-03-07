import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import { getAllApplications, type Application } from '../../api/applications';

export function useApplications(status?: string) {
  return useQuery<Application[]>({
    queryKey: queryKeys.applications.list({ status }),
    queryFn: () => getAllApplications(status || undefined),
  });
}
