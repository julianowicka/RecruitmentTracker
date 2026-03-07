import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/httpClient';

const isDev = import.meta.env.DEV;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: (failureCount: number, error: unknown) => {
        const apiError = error as ApiError;

        if (apiError?.status === 0) {
          return failureCount < (isDev ? 8 : 2);
        }

        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (filters: { status?: string | null }) =>
      [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.applications.details(), id] as const,
    stats: () => [...queryKeys.applications.all, 'stats'] as const,
  },
  notes: {
    all: ['notes'] as const,
    lists: () => [...queryKeys.notes.all, 'list'] as const,
    list: (applicationId: number) => [...queryKeys.notes.lists(), applicationId] as const,
  },
  statusHistory: {
    all: ['statusHistory'] as const,
    lists: () => [...queryKeys.statusHistory.all, 'list'] as const,
    list: (applicationId: number) => [...queryKeys.statusHistory.lists(), applicationId] as const,
  },
};

