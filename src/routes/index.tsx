import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          📋 Recruitment Tracker
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
          Zarządzaj swoimi aplikacjami o pracę w jednym miejscu
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            to="/applications"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            Zobacz Aplikacje
          </Link>
          
          <Link
            to="/dashboard"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <FeatureCard
          icon="✅"
          title="Funkcje aplikacji"
          description="Dodawaj, edytuj i usuwaj swoje aplikacje o pracę"
        />
        <FeatureCard
          icon="📊"
          title="Statusy"
          description="Śledź postęp w procesie rekrutacyjnym"
        />
        <FeatureCard
          icon="📝"
          title="Notatki"
          description="Zapisuj ważne informacje do każdej aplikacji"
        />
        <FeatureCard
          icon="🔍"
          title="Filtrowanie"
          description="Szybko znajdź interesujące Cię aplikacje"
        />
      </div>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>{description}</p>
    </div>
  );
}
