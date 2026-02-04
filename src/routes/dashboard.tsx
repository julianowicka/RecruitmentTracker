import { createFileRoute, Link } from '@tanstack/react-router';
import { useApplicationStats } from '../hooks/queries/useStats';
import { 
  TrendingUp, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle,
  DollarSign,
  FileText
} from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../lib/constants';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats, isLoading } = useApplicationStats();

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">Brak danych do wyświetlenia.</p>
      </div>
    );
  }

  const statusStats = [
    {
      label: STATUS_LABELS.applied,
      count: stats.byStatus.applied,
      color: 'bg-blue-500',
      icon: FileText,
    },
    {
      label: STATUS_LABELS.hr_interview,
      count: stats.byStatus.hr_interview,
      color: 'bg-yellow-500',
      icon: Clock,
    },
    {
      label: STATUS_LABELS.tech_interview,
      count: stats.byStatus.tech_interview,
      color: 'bg-purple-500',
      icon: Briefcase,
    },
    {
      label: STATUS_LABELS.offer,
      count: stats.byStatus.offer,
      color: 'bg-green-500',
      icon: CheckCircle2,
    },
    {
      label: STATUS_LABELS.rejected,
      count: stats.byStatus.rejected,
      color: 'bg-red-500',
      icon: XCircle,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Przegląd twoich aplikacji i statystyk
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Wszystkie aplikacje</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Oferty</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.byStatus.offer}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">W trakcie</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.byStatus.hr_interview + stats.byStatus.tech_interview}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Średnia pensja</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.averageSalary ? `${stats.averageSalary}` : '-'}
              </p>
              {stats.averageSalary && (
                <p className="text-xs text-gray-500">PLN</p>
              )}
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Podział według statusu</h2>
          
          <div className="space-y-4">
            {statusStats.map((stat) => {
              const percentage = stats.total > 0 
                ? Math.round((stat.count / stats.total) * 100) 
                : 0;
              const Icon = stat.icon;

              return (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {stat.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stat.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ostatnie aplikacje</h2>
          
          {stats.recent.length > 0 ? (
            <div className="space-y-3">
              {stats.recent.map((app) => {
                const statusKey = app.status as keyof typeof STATUS_LABELS;
                
                return (
                  <Link
                    key={app.id}
                    to="/applications/$id"
                    params={{ id: app.id.toString() }}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {app.company}
                    </p>
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {app.role}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[statusKey]}`}
                    >
                      {STATUS_LABELS[statusKey]}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Brak aplikacji. Dodaj swoją pierwszą aplikację!
            </p>
          )}

          <Link
            to="/applications"
            className="block mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Zobacz wszystkie →
          </Link>
        </div>
      </div>
    </div>
  );
}


