import { Badge } from '../ui/Badge';
import type { Application } from '../../db/schema';
import type { ApplicationStatus } from '../../lib/constants';

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: number, company: string) => void;
  isDeleting?: boolean;
}

export function ApplicationCard({ application, onDelete, isDeleting = false }: ApplicationCardProps) {
  const { id, company, role, status, link, salaryMin, salaryMax, createdAt } = application;

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s',
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
              🏢 {company}
            </h3>
            <Badge status={status as ApplicationStatus} />
          </div>

          <p style={{ margin: '0.5rem 0', color: '#374151', fontSize: '1.1rem' }}>
            <strong>{role}</strong>
          </p>

          {(salaryMin || salaryMax) && (
            <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
              💰 Widełki: {salaryMin || '?'} - {salaryMax || '?'} PLN
            </p>
          )}

          {link && (
            <p style={{ margin: '0.5rem 0' }}>
              🔗{' '}
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#3b82f6', textDecoration: 'none' }}
              >
                Link do ogłoszenia
              </a>
            </p>
          )}

          <p style={{ margin: '0.5rem 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            📅 Dodano: {new Date(createdAt).toLocaleDateString('pl-PL')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onDelete(id, company)}
            disabled={isDeleting}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              opacity: isDeleting ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            🗑️ Usuń
          </button>
        </div>
      </div>
    </div>
  );
}

