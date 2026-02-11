import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import * as api from '../../api/applications';

export function useApplicationStats() {
  return useQuery({
    queryKey: queryKeys.applications.stats(),
    queryFn: () => api.getApplicationStats(),
    staleTime: 60 * 1000, 
  });
}



