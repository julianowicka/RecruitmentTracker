import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
} from '../../lib/validations';

const STORAGE_KEY = 'recruitment-tracker-apps';

function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveApplications(apps: Application[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

async function createApplication(
  data: CreateApplicationInput
): Promise<Application> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newApp: Application = {
    id: Date.now(),
    ...data,
    link: data.link || null,
    salaryMin: data.salaryMin ?? null,
    salaryMax: data.salaryMax ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const allApps = getStoredApplications();
  saveApplications([newApp, ...allApps]);

  return newApp;
}


export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    
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

  const result: { data: Application; error?: string } = await response.json();

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
  
  const allApps = getStoredApplications();
  const filtered = allApps.filter(app => app.id !== id);
  saveApplications(filtered);
  
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

