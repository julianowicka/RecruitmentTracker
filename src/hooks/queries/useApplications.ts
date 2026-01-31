import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';

const STORAGE_KEY = 'recruitment-tracker-apps';

function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function initializeMockData(): Application[] {
  const stored = getStoredApplications();
  if (stored.length > 0) return stored;

  const mockData: Application[] = [
    {
      id: 1,
      company: 'Arasaka',
      role: 'Senior Frontend Developer',
      status: 'hr_interview',
      link: 'https://arasaka.com/careers',
      salaryMin: 15000,
      salaryMax: 20000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      company: 'Trauma Team International',
      role: 'Full Stack Engineer',
      status: 'applied',
      link: 'https://trauma-team-international.com/jobs',
      salaryMin: 12000,
      salaryMax: 18000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      company: 'Miltech',
      role: 'React Developer',
      status: 'offer',
      link: null,
      salaryMin: 18000,
      salaryMax: 22000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  return mockData;
}

async function fetchApplications(
  status?: string | null
): Promise<Application[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allApps = initializeMockData();

  if (status) {
    return allApps.filter(app => app.status === status);
  }

  return allApps;
}


export function useApplications(status?: string) {
  return useQuery({
    queryKey: queryKeys.applications.list({ status }),
    queryFn: () => fetchApplications(status),
    
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

