import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          📋 Recruitment Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Zarządzaj swoimi aplikacjami o pracę w jednym miejscu
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            to="/applications"
            className="px-8 py-4 bg-blue-500 text-white no-underline rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors"
          >
            Zobacz Aplikacje
          </Link>
          
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-purple-500 text-white no-underline rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-12">
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
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
