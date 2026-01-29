import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📋 Moje Aplikacje</h1>
      <p style={{ color: '#666' }}>
        Tutaj będzie lista wszystkich aplikacji o pracę...
      </p>
      <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
        ⚠️ <strong>W następnych krokach:</strong> Zintegrujemy TanStack Query, stworzymy komponenty listy i formularzy.
      </p>
    </div>
  );
}

