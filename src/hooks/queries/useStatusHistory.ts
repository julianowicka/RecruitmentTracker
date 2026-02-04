import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import * as api from '../../api/applications';

export function useStatusHistory(applicationId: number) {
  return useQuery({
    queryKey: queryKeys.statusHistory.list(applicationId),
    queryFn: () => api.getStatusHistoryByApplicationId(applicationId),
    staleTime: 30 * 1000,
  });
}



