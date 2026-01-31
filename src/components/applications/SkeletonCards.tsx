interface SkeletonCardProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ height: '1.5rem', width: '10rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }} />
        <div style={{ height: '1.5rem', width: '6rem', backgroundColor: '#e5e7eb', borderRadius: '999px' }} />
      </div>

      <div style={{ height: '1.25rem', width: '14rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.75rem' }} />

      <div style={{ height: '1rem', width: '12rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.5rem' }} />

      <div style={{ height: '0.875rem', width: '8rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: SkeletonCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

