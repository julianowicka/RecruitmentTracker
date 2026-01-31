import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';

async function fetchApplications(
  status?: string | null
): Promise<Application[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
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

  if (status) {
    return mockData.filter(app => app.status === status);
  }

  return mockData;
}


export function useApplications(status?: string) {
  return useQuery({
    queryKey: queryKeys.applications.list({ status }),
    queryFn: () => fetchApplications(status),
    
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

