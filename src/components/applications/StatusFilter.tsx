import { Circle } from 'lucide-react';
import { APPLICATION_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../lib/constants';

interface StatusFilterProps {
  activeStatus: string | null;
  onStatusChange: (status: string | null) => void;
  counts?: Record<string, number>;
}

export function StatusFilter({ activeStatus, onStatusChange, counts }: StatusFilterProps) {
  const allStatuses = [
    { value: null, label: 'Wszystkie', color: '#475569' },
    { value: APPLICATION_STATUSES.APPLIED, label: STATUS_LABELS.applied, color: STATUS_COLORS.applied },
    { value: APPLICATION_STATUSES.HR_INTERVIEW, label: STATUS_LABELS.hr_interview, color: STATUS_COLORS.hr_interview },
    { value: APPLICATION_STATUSES.TECH_INTERVIEW, label: STATUS_LABELS.tech_interview, color: STATUS_COLORS.tech_interview },
    { value: APPLICATION_STATUSES.OFFER, label: STATUS_LABELS.offer, color: STATUS_COLORS.offer },
    { value: APPLICATION_STATUSES.REJECTED, label: STATUS_LABELS.rejected, color: STATUS_COLORS.rejected },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-300 bg-white p-3 shadow-sm">
      {allStatuses.map(({ value, label, color }) => {
        const isActive = activeStatus === value;
        const count = counts && value ? counts[value] : undefined;

        return (
          <button
            key={value || 'all'}
            onClick={() => onStatusChange(value)}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
            }`}
            aria-pressed={isActive}
          >
            <Circle className="h-2.5 w-2.5" style={{ fill: color, color }} />
            <span>{label}</span>
            {count !== undefined && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
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
