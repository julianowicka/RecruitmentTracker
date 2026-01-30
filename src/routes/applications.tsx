import { createFileRoute } from '@tanstack/react-router';
import { useApplications } from '../hooks/queries/useApplications';
import { useDeleteApplication } from '../hooks/queries/useApplicationMutations';
import { STATUS_LABELS, STATUS_COLORS } from '../lib/constants';

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { data: applications, isLoading, error } = useApplications();
  const deleteMutation = useDeleteApplication();

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Moje Aplikacje</h1>
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>📋 Moje Aplikacje</h1>
        <p style={{ color: 'red' }}>Błąd: {error.message}</p>
      </div>
    );
  }

  const handleDelete = (id: number, company: string) => {
    if (confirm(`Czy na pewno chcesz usunąć aplikację do ${company}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Moje Aplikacje</h1>
        <div style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#e0f2fe', 
          borderRadius: '0.5rem',
          fontSize: '0.9rem'
        }}>
          Znaleziono: <strong>{applications?.length || 0}</strong> aplikacji
        </div>
      </div>

      {!applications || applications.length === 0 ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          border: '2px dashed #e5e7eb'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
          <h3>Brak aplikacji</h3>
          <p style={{ color: '#666' }}>Dodaj swoją pierwszą aplikację o pracę!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{app.company}</h3>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: STATUS_COLORS[app.status as keyof typeof STATUS_COLORS],
                        color: 'white',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS]}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '1.1rem' }}>
                    <strong>{app.role}</strong>
                  </p>
                  {(app.salaryMin || app.salaryMax) && (
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>
                      💰 Widełki: {app.salaryMin || '?'} - {app.salaryMax || '?'} PLN
                    </p>
                  )}
                  {app.link && (
                    <p style={{ margin: '0.5rem 0' }}>
                      🔗{' '}
                      <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                        Link do ogłoszenia
                      </a>
                    </p>
                  )}
                  <p style={{ margin: '0.5rem 0', color: '#999', fontSize: '0.85rem' }}>
                    Dodano: {new Date(app.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDelete(app.id, app.company)}
                    disabled={deleteMutation.isPending}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      opacity: deleteMutation.isPending ? 0.5 : 1,
                    }}
                  >
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            </div>
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
          ✅ <strong>Wow działa!</strong> TanStack Query fetchuje dane z API. 
          Otwórz DevTools (ikonka React Query na dole ekranu) i zobacz cache w akcji!
        </p>
      </div>
    </div>
  );
}


