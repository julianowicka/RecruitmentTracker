import { STATUS_LABELS, STATUS_COLORS, type ApplicationStatus } from '../../lib/constants';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export function Badge({ status, size = 'md' }: BadgeProps) {
  const label = STATUS_LABELS[status];
  const color = STATUS_COLORS[status];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-[0.7rem]',
    md: 'px-3 py-1 text-xs',
  };
  
  return (
    <span
      className={`inline-block rounded-full font-bold text-white uppercase tracking-wider ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

