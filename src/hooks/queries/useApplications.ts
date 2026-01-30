import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Application } from '../../db/schema';

// Temporary mock data - będziemy to zastąpić prawdziwym API
async function fetchApplications(
  status?: string | null
): Promise<Application[]> {
  // Symuluj opóźnienie sieciowe
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData: Application[] = [
    {
      id: 1,
      company: 'TechCorp',
      role: 'Senior Frontend Developer',
      status: 'hr_interview',
      link: 'https://techcorp.com/careers',
      salaryMin: 15000,
      salaryMax: 20000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      company: 'StartupXYZ',
      role: 'Full Stack Engineer',
      status: 'applied',
      link: 'https://startupxyz.com/jobs',
      salaryMin: 12000,
      salaryMax: 18000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      company: 'BigCompany',
      role: 'React Developer',
      status: 'offer',
      link: null,
      salaryMin: 18000,
      salaryMax: 22000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Filtruj po statusie jeśli podano
  if (status) {
    return mockData.filter(app => app.status === status);
  }

  return mockData;
}


export function useApplications(filters: { status?: string | null } = {}) {
  return useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: () => fetchApplications(filters.status),
    
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

