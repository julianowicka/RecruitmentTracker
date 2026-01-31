import { STATUS_LABELS, STATUS_COLORS, type ApplicationStatus } from '../../lib/constants';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export function Badge({ status, size = 'md' }: BadgeProps) {
  const label = STATUS_LABELS[status];
  const color = STATUS_COLORS[status];
  
  const sizeStyles = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.7rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
  };
  
  return (
    <span
      style={{
        ...sizeStyles[size],
        backgroundColor: color,
        color: 'white',
        borderRadius: '999px',
        fontWeight: 'bold',
        display: 'inline-block',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
      }}
    >
      {label}
    </span>
  );
}

