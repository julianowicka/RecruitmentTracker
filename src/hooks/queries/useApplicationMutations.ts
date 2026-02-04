import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../api/applications';
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
} from '../../lib/validations';
import * as api from '../../api/applications';


export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationInput) => api.createApplication(data),
    
    onMutate: async (newApplication) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications.lists(),
      });

      const previousApplications = queryClient.getQueriesData({
        queryKey: queryKeys.applications.lists(),
      });

      const optimisticApp: Application = {
        id: Date.now(),
        ...newApplication,
        link: newApplication.link || null,
        salaryMin: newApplication.salaryMin ?? null,
        salaryMax: newApplication.salaryMax ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueriesData(
        { queryKey: queryKeys.applications.lists() },
        (old: Application[] | undefined) => {
          if (!old) return [optimisticApp];
          return [optimisticApp, ...old];
        }
      );

      return { previousApplications };
    },

    onError: (_err, _newApplication, context) => {
      if (context?.previousApplications) {
        context.previousApplications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.lists(),
      });
    },
  });
}


export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateApplicationInput }) => 
      api.updateApplication(id, data),
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications.lists(),
      });

      const previousApplications = queryClient.getQueriesData({
        queryKey: queryKeys.applications.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.applications.lists() },
        (old: Application[] | undefined) => {
          if (!old) return old;
          return old.map((app) => {
            if (app.id === id) {
              return {
                ...app,
                ...data,
                link: data.link !== undefined ? (data.link || null) : app.link,
                salaryMin: data.salaryMin !== undefined ? (data.salaryMin ?? null) : app.salaryMin,
                salaryMax: data.salaryMax !== undefined ? (data.salaryMax ?? null) : app.salaryMax,
                updatedAt: new Date().toISOString(),
              };
            }
            return app;
          });
        }
      );

      return { previousApplications };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousApplications) {
        context.previousApplications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.lists(),
      });
    },
  });
}


export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.deleteApplication(id);
      return { id };
    },
    
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.applications.lists(),
      });

      const previousApplications = queryClient.getQueriesData({
        queryKey: queryKeys.applications.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.applications.lists() },
        (old: Application[] | undefined) => {
          if (!old) return old;
          return old.filter((app) => app.id !== deletedId);
        }
      );

      return { previousApplications };
    },

    onError: (_err, _deletedId, context) => {
      if (context?.previousApplications) {
        context.previousApplications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.lists(),
      });
    },
  });
}

