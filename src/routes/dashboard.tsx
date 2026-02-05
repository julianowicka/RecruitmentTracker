import { createFileRoute, Link } from '@tanstack/react-router';
import { useApplicationStats } from '../hooks/queries/useStats';
import { useApplications } from '../hooks/queries/useApplications';
import { 
  TrendingUp, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle,
  DollarSign,
  FileText,
  ArrowRight
} from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatusPieChart } from '../components/charts/StatusPieChart';
import { ApplicationsTrendChart } from '../components/charts/ApplicationsTrendChart';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart';
import { prepareStatusPieData, prepareTrendData, prepareMonthlyData } from '../lib/chart-utils';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data: applications, isLoading: appsLoading } = useApplications();

  const isLoading = statsLoading || appsLoading;

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

  const pieData = prepareStatusPieData(stats.byStatus);
  const trendData = prepareTrendData(applications || []);
  const monthlyData = prepareMonthlyData(applications || []);

  const statusStats = [
    {
      label: STATUS_LABELS.applied,
      count: stats.byStatus.applied,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: STATUS_LABELS.hr_interview,
      count: stats.byStatus.hr_interview,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: STATUS_LABELS.tech_interview,
      count: stats.byStatus.tech_interview,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: STATUS_LABELS.offer,
      count: stats.byStatus.offer,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: STATUS_LABELS.rejected,
      count: stats.byStatus.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Przegląd twoich aplikacji i statystyk
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wszystkie aplikacje
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Łącznie wysłanych aplikacji
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Oferty pracy
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.byStatus.offer}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Otrzymanych ofert
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              W trakcie
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.byStatus.hr_interview + stats.byStatus.tech_interview}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rozmów kwalifikacyjnych
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Średnia pensja
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageSalary ? `${stats.averageSalary.toLocaleString()}` : '-'}
            </div>
            {stats.averageSalary && (
              <p className="text-xs text-muted-foreground mt-1">PLN</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatusPieChart data={pieData} />
        <ApplicationsTrendChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyBarChart data={monthlyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Szczegółowy podział</CardTitle>
            <CardDescription>
              Wszystkie statusy z liczbą aplikacji
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusStats.map((stat) => {
                const percentage = stats.total > 0 
                  ? Math.round((stat.count / stats.total) * 100) 
                  : 0;
                const Icon = stat.icon;

                return (
                  <div key={stat.label} className="flex items-center gap-4">
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {stat.label}
                        </span>
                        <span className="text-sm font-semibold">
                          {stat.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${stat.bgColor.replace('bg-', '')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ostatnie aplikacje</CardTitle>
            <CardDescription>
              5 najnowszych aplikacji
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.recent.map((app) => {
                  const statusKey = app.status as keyof typeof STATUS_LABELS;
                  
                  return (
                    <Link
                      key={app.id}
                      to="/applications/$id"
                      params={{ id: app.id.toString() }}
                      className="block p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {app.company}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {app.role}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[statusKey]}`}
                          >
                            {STATUS_LABELS[statusKey]}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-3">
                  Brak aplikacji. Dodaj swoją pierwszą aplikację!
                </p>
                <Link
                  to="/applications"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Dodaj aplikację →
                </Link>
              </div>
            )}

            {stats.recent.length > 0 && (
              <Link
                to="/applications"
                className="block mt-4 text-center text-primary hover:underline text-sm font-medium"
              >
                Zobacz wszystkie →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
