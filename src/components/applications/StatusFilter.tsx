import { APPLICATION_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../lib/constants';

interface StatusFilterProps {
  activeStatus: string | null;
  onStatusChange: (status: string | null) => void;
  counts?: Record<string, number>;
}

export function StatusFilter({ activeStatus, onStatusChange, counts }: StatusFilterProps) {
  const allStatuses = [
    { value: null, label: 'Wszystkie', color: '#6b7280' },
    { value: APPLICATION_STATUSES.APPLIED, label: STATUS_LABELS.applied, color: STATUS_COLORS.applied },
    { value: APPLICATION_STATUSES.HR_INTERVIEW, label: STATUS_LABELS.hr_interview, color: STATUS_COLORS.hr_interview },
    { value: APPLICATION_STATUSES.TECH_INTERVIEW, label: STATUS_LABELS.tech_interview, color: STATUS_COLORS.tech_interview },
    { value: APPLICATION_STATUSES.OFFER, label: STATUS_LABELS.offer, color: STATUS_COLORS.offer },
    { value: APPLICATION_STATUSES.REJECTED, label: STATUS_LABELS.rejected, color: STATUS_COLORS.rejected },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
    }}>
      {allStatuses.map(({ value, label, color }) => {
        const isActive = activeStatus === value;
        const count = counts && value ? counts[value] : undefined;

        return (
          <button
            key={value || 'all'}
            onClick={() => onStatusChange(value)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isActive ? color : 'white',
              color: isActive ? 'white' : '#374151',
              border: `2px solid ${isActive ? color : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: isActive ? 'bold' : 'normal',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {label}
            {count !== undefined && (
              <span
                style={{
                  padding: '0.125rem 0.5rem',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#e5e7eb',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

