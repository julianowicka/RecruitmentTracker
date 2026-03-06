import { STATUS_LABELS, STATUS_COLORS, type ApplicationStatus } from '../../lib/constants';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

function getContrastText(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#111827' : '#ffffff';
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
      className={`inline-block rounded-full font-bold uppercase tracking-wider ${sizeClasses[size]}`}
      style={{ backgroundColor: color, color: getContrastText(color) }}
    >
      {label}
    </span>
  );
}
