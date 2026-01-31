import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
} from '../../lib/validations';

async function createApplication(
  data: CreateApplicationInput
): Promise<Application> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: Date.now(),
    ...data,
    link: data.link || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}


export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.lists(),
      });
    },
  });
}


async function updateApplication({
  id,
  data,
}: {
  id: number;
  data: UpdateApplicationInput;
}): Promise<Application> {
  const response = await fetch(`/api/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Application> = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update application');
  }

  return result.data;
}


export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplication,
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(data.id),
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.lists(),
      });
    },
  });
}


async function deleteApplication(id: number): Promise<{ id: number }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { id };
}


export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    
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

