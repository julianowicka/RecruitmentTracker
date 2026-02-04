import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      
      gcTime: 5 * 60 * 1000,
      
      refetchOnWindowFocus: true,
      
      retry: 1,
      
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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

