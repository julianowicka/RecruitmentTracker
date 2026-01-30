import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <p style={{ color: '#666' }}>
        Tutaj będą statystyki i podsumowanie aplikacji...
      </p>
      <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
        ⚠️ <strong>W następnych krokach:</strong> wykresy, liczniki statusów, ostatnie aktywności.
      </p>
    </div>
  );
}


