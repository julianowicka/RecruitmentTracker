import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">
        Tutaj będą statystyki i podsumowanie aplikacji...
      </p>
      <p className="mt-4 p-4 bg-yellow-100 rounded-lg">
        ⚠️ <strong>W następnych krokach:</strong> wykresy, liczniki statusów, ostatnie aktywności.
      </p>
    </div>
  );
}


