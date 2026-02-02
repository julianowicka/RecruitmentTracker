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
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allApps = getStoredApplications();
  const appIndex = allApps.findIndex(app => app.id === id);
  
  if (appIndex === -1) {
    throw new Error('Application not found');
  }

  const updatedApp: Application = {
    ...allApps[appIndex],
    ...data,
    link: data.link !== undefined ? (data.link || null) : allApps[appIndex].link,
    salaryMin: data.salaryMin !== undefined ? (data.salaryMin ?? null) : allApps[appIndex].salaryMin,
    salaryMax: data.salaryMax !== undefined ? (data.salaryMax ?? null) : allApps[appIndex].salaryMax,
    updatedAt: new Date().toISOString(),
  };

  allApps[appIndex] = updatedApp;
  saveApplications(allApps);

  return updatedApp;
}


export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplication,
    
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

