import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useApplications } from '../hooks/queries/useApplications';
import { useDeleteApplication } from '../hooks/queries/useApplicationMutations';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { StatusFilter } from '../components/applications/StatusFilter';
import { SkeletonCards } from '../components/applications/SkeletonCards';
import { APPLICATION_STATUSES } from '../lib/constants';

const applicationsSearchSchema = z.object({
  status: z
    .enum([
      APPLICATION_STATUSES.APPLIED,
      APPLICATION_STATUSES.HR_INTERVIEW,
      APPLICATION_STATUSES.TECH_INTERVIEW,
      APPLICATION_STATUSES.OFFER,
      APPLICATION_STATUSES.REJECTED,
    ])
    .optional()
    .catch(undefined),
});

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
  validateSearch: applicationsSearchSchema,
});

function ApplicationsPage() {
  const navigate = Route.useNavigate();
  const { status } = Route.useSearch();
  const { data: applications, isLoading, error } = useApplications(status);
  const deleteMutation = useDeleteApplication();

  const handleStatusChange = (newStatus: string | null) => {
    navigate({
      search: { status: newStatus as typeof status },
    });
  };

  const handleDelete = (id: number, company: string) => {
    if (confirm(`Czy na pewno chcesz usunąć aplikację do ${company}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredApplications = applications?.filter((app) => 
    !status || app.status === status
  ) || [];

  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>📋 Moje Aplikacje</h1>
        <div style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#e0f2fe', 
          borderRadius: '0.5rem',
          fontSize: '0.9rem'
        }}>
          Znaleziono: <strong>{filteredApplications.length}</strong> aplikacji
        </div>
      </div>

      <StatusFilter 
        activeStatus={status || null} 
        onStatusChange={handleStatusChange}
        counts={statusCounts}
      />

      {isLoading && <SkeletonCards count={3} />}

      {error && (
        <div style={{ 
          padding: '2rem', 
          backgroundColor: '#fee2e2', 
          borderRadius: '0.5rem',
          border: '2px solid #ef4444'
        }}>
          <h3 style={{ color: '#991b1b', marginTop: 0 }}>❌ Błąd</h3>
          <p style={{ color: '#7f1d1d' }}>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && filteredApplications.length === 0 && (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          border: '2px dashed #e5e7eb'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
          <h3>Brak aplikacji</h3>
          <p style={{ color: '#666' }}>
            {status 
              ? `Brak aplikacji ze statusem "${status}". Spróbuj innego filtra!`
              : 'Dodaj swoją pierwszą aplikację o pracę!'
            }
          </p>
        </div>
      )}

      {!isLoading && !error && filteredApplications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === app.id}
            />
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '0.5rem',
        border: '1px solid #86efac'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          ✅ <strong>Filtrowanie </strong> TanStack Query cachuje dane osobno dla każdego statusu!
        </p>
      </div>
    </div>
  );
}


