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
    <div className="flex gap-2 flex-wrap mb-6 p-4 bg-gray-50 rounded-lg">
      {allStatuses.map(({ value, label, color }) => {
        const isActive = activeStatus === value;
        const count = counts && value ? counts[value] : undefined;

        return (
          <button
            key={value || 'all'}
            onClick={() => onStatusChange(value)}
            className={`px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 flex items-center gap-2 ${
              isActive 
                ? 'text-white font-bold' 
                : 'bg-white text-gray-700 font-normal hover:shadow-md'
            }`}
            style={{
              backgroundColor: isActive ? color : undefined,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: isActive ? color : '#e5e7eb',
            }}
          >
            {label}
            {count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/30' : 'bg-gray-200'
                }`}
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

