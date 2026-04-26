import { createFileRoute, Link } from '@tanstack/react-router';
import * as React from 'react';
import { lazy, useMemo, useState } from 'react';
import {  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Target,
  TrendingUp,
} from 'lucide-react';

import { useApplications } from '../hooks/queries/useApplications';
import { STATUS_COLORS, STATUS_LABELS } from '../lib/constants';
import { prepareMonthlyData, prepareTrendData, prepareWindowActivityData } from '../lib/chart-utils';
import type { Application } from '../api/applications';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { KpiCard } from '../components/dashboard/KpiCard';
import { StatusDistributionBars } from '../components/dashboard/StatusDistributionBars';
import { ActionCenterCard } from '../components/dashboard/ActionCenterCard';
import { RequireAuth } from '../components/auth/RequireAuth';

const ApplicationsTrendChart = lazy(() =>
  import('../components/charts/ApplicationsTrendChart').then((m) => ({ default: m.ApplicationsTrendChart }))
);
const MonthlyBarChart = lazy(() =>
  import('../components/charts/MonthlyBarChart').then((m) => ({ default: m.MonthlyBarChart }))
);

type TimeRangeKey = '7d' | '30d' | '90d' | 'all';

interface DerivedStats {
  total: number;
  byStatus: Record<keyof typeof STATUS_LABELS, number>;
  offers: number;
  inProgress: number;
  rejected: number;
  averageSalary: number | null;
  averageRecruitmentDays: number | null;
  conversionRate: number;
  successRate: number;
}

interface ActionItem {
  title: string;
  description: string;
}

const TIME_RANGE_OPTIONS: { key: TimeRangeKey; label: string }[] = [
  { key: '7d', label: '7 dni' },
  { key: '30d', label: '30 dni' },
  { key: '90d', label: '90 dni' },
  { key: 'all', label: 'Caly okres' },
];

const STATUS_KEYS = Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>;

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('all');
  const { data: applications, isLoading, isError, error, refetch, isFetching } = useApplications();

  const allApplications = applications ?? [];

  const scopedApplications = useMemo(
    () => filterByRange(allApplications, timeRange),
    [allApplications, timeRange]
  );

  const previousPeriodApplications = useMemo(
    () => filterPreviousRange(allApplications, timeRange),
    [allApplications, timeRange]
  );

  const stats = useMemo(() => buildDerivedStats(scopedApplications), [scopedApplications]);
  const previousStats = useMemo(
    () => buildDerivedStats(previousPeriodApplications),
    [previousPeriodApplications]
  );

  const trendData = useMemo(() => prepareTrendData(scopedApplications), [scopedApplications]);
  const monthlyData = useMemo(() => prepareMonthlyData(scopedApplications, timeRange), [scopedApplications, timeRange]);
  const windowActivityData = useMemo(() => prepareWindowActivityData(scopedApplications, timeRange), [scopedApplications, timeRange]);

  const statusItems = useMemo(
    () =>
      STATUS_KEYS.map((key) => ({
        key,
        label: STATUS_LABELS[key],
        count: stats.byStatus[key],
        color: STATUS_COLORS[key],
      })),
    [stats.byStatus]
  );

  const recentApplications = useMemo(
    () =>
      [...scopedApplications]
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
        .slice(0, 6),
    [scopedApplications]
  );

  const actionItems = useMemo(() => buildActionItems(scopedApplications), [scopedApplications]);

  const kpis = [
    {
      title: 'Wszystkie aplikacje',
      value: String(stats.total),
      hint: 'Liczba wyslanych aplikacji w okresie.',
      icon: FileText,
      delta: formatDelta(stats.total - previousStats.total, 'vs poprzedni okres'),
      deltaTone: getDeltaTone(stats.total - previousStats.total),
    },
    {
      title: 'Otrzymane oferty',
      value: String(stats.offers),
      hint: 'Ile procesow zakonczylo sie oferta.',
      icon: CheckCircle2,
      delta: formatDelta(stats.offers - previousStats.offers, 'vs poprzedni okres'),
      deltaTone: getDeltaTone(stats.offers - previousStats.offers),
    },
    {
      title: 'Procesy w toku',
      value: String(stats.inProgress),
      hint: 'Rozmowa HR lub techniczna.',
      icon: Clock,
      delta: formatDelta(stats.inProgress - previousStats.inProgress, 'vs poprzedni okres'),
      deltaTone: getDeltaTone(stats.inProgress - previousStats.inProgress),
    },
    {
      title: 'Srednia pensja',
      value: formatSalary(stats.averageSalary),
      hint: 'Srednia z widelka wynagrodzen.',
      icon: DollarSign,
      delta: formatDelta(
        roundNumber((stats.averageSalary ?? 0) - (previousStats.averageSalary ?? 0)),
        'PLN vs poprzedni okres'
      ),
      deltaTone: getDeltaTone((stats.averageSalary ?? 0) - (previousStats.averageSalary ?? 0)),
    },
    {
      title: 'Konwersja do oferty',
      value: `${stats.conversionRate}%`,
      hint: 'Oferty / wszystkie aplikacje.',
      icon: Target,
      delta: formatDelta(
        roundNumber(stats.conversionRate - previousStats.conversionRate),
        'pp vs poprzedni okres'
      ),
      deltaTone: getDeltaTone(stats.conversionRate - previousStats.conversionRate),
    },
    {
      title: 'Skutecznosc procesu',
      value: `${stats.successRate}%`,
      hint: 'Oferty / (oferty + odrzucone).',
      icon: TrendingUp,
      delta: formatDelta(
        roundNumber(stats.successRate - previousStats.successRate),
        'pp vs poprzedni okres'
      ),
      deltaTone: getDeltaTone(stats.successRate - previousStats.successRate),
    },
  ] as const;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
        <div className="h-12 w-72 animate-pulse rounded-lg bg-secondary" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    );
    }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <Card className="border-rose-200 bg-rose-50/70">
          <CardContent className="space-y-4 p-6">
            <p className="text-lg font-semibold text-rose-900">Nie udalo sie pobrac danych z backendu</p>
            <p className="text-sm text-rose-800">
              {error instanceof Error ? error.message : 'Sprawdz, czy serwer API dziala na porcie 3001.'}
            </p>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Ladowanie...' : 'Sprobuj ponownie'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Przeglad pipeline rekrutacji z metrykami, trendami i podpowiedziami kolejnych krokow.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex rounded-lg border bg-secondary/30 p-1">
              {TIME_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setTimeRange(option.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    timeRange === option.key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button asChild>
              <Link to="/applications">
                <Plus className="h-4 w-4" />
                Dodaj aplikacje
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            hint={kpi.hint}
            icon={kpi.icon}
            delta={kpi.delta}
            deltaTone={kpi.deltaTone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {trendData.length < 2 ? (
            <Card>
              <CardContent className="space-y-3 p-6">
                <p className="text-lg font-semibold">Trend aplikacji</p>
                <p className="text-sm text-muted-foreground">
                  Za malo punktow danych, aby narysowac trend. Zmien zakres czasu albo dodaj kolejne aplikacje.
                </p>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Aplikacje w okresie</p>
                  <p className="mt-1 text-3xl font-semibold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <React.Suspense
              fallback={
                <Card>
                  <CardContent className="p-6">Ladowanie wykresu...</CardContent>
                </Card>
              }
            >
              <ApplicationsTrendChart data={trendData} />
            </React.Suspense>
          )}
        </div>

        <StatusDistributionBars items={statusItems} total={stats.total} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <React.Suspense
            fallback={
              <Card>
                <CardContent className="p-6">Ladowanie wykresu...</CardContent>
              </Card>
            }
          >
            <MonthlyBarChart data={monthlyData} range={timeRange} windowData={windowActivityData} />
          </React.Suspense>
        </div>

        <ActionCenterCard items={actionItems} />
      </section>

      <section>
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Najnowsze aplikacje</p>
                <p className="text-sm text-muted-foreground">Ostatnie wpisy w wybranym zakresie czasu.</p>
              </div>
              <Link to="/applications" className="text-sm font-medium text-primary hover:underline">
                Zobacz wszystkie
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Brak aplikacji w tym okresie.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {recentApplications.map((app) => {
                  const statusKey = app.status as keyof typeof STATUS_LABELS;

                  return (
                    <Link
                      key={app.id}
                      to="/applications/$id"
                      params={{ id: app.id.toString() }}
                      className="rounded-lg border p-3 transition-colors hover:bg-secondary/40"
                    >
                      <p className="truncate text-sm font-semibold">{app.company}</p>
                      <p className="truncate text-xs text-muted-foreground">{app.role}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className="inline-flex rounded px-2 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: STATUS_COLORS[statusKey] }}
                        >
                          {STATUS_LABELS[statusKey]}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(app.createdAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function getRangeDays(range: TimeRangeKey): number | null {
  if (range === '7d') return 7;
  if (range === '30d') return 30;
  if (range === '90d') return 90;
  return null;
}

function filterByRange(applications: Application[], range: TimeRangeKey): Application[] {
  const days = getRangeDays(range);
  if (!days) return applications;

  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - days);

  return applications.filter((app) => new Date(app.createdAt) >= from);
}

function filterPreviousRange(applications: Application[], range: TimeRangeKey): Application[] {
  const days = getRangeDays(range);
  if (!days) return [];

  const now = new Date();
  const currentFrom = new Date(now);
  currentFrom.setDate(now.getDate() - days);

  const previousFrom = new Date(currentFrom);
  previousFrom.setDate(currentFrom.getDate() - days);

  return applications.filter((app) => {
    const createdAt = new Date(app.createdAt);
    return createdAt >= previousFrom && createdAt < currentFrom;
  });
}

function buildDerivedStats(applications: Application[]): DerivedStats {
  const byStatus = {
    applied: 0,
    hr_interview: 0,
    tech_interview: 0,
    offer: 0,
    rejected: 0,
  };

  let salaryTotal = 0;
  let salaryCount = 0;
  let recruitmentDaysTotal = 0;
  let recruitmentDaysCount = 0;

  for (const app of applications) {
    if (app.status in byStatus) {
      const key = app.status as keyof typeof byStatus;
      byStatus[key] += 1;
    }

    const estimatedSalary = getEstimatedSalary(app);
    if (estimatedSalary !== null) {
      salaryTotal += estimatedSalary;
      salaryCount += 1;
    }

    if (app.status === 'offer' || app.status === 'rejected') {
      const createdAt = new Date(app.createdAt);
      const updatedAt = new Date(app.updatedAt);
      const days = Math.ceil((Number(updatedAt) - Number(createdAt)) / (1000 * 60 * 60 * 24));

      if (days >= 0) {
        recruitmentDaysTotal += days;
        recruitmentDaysCount += 1;
      }
    }
  }

  const total = applications.length;
  const offers = byStatus.offer;
  const rejected = byStatus.rejected;
  const inProgress = byStatus.hr_interview + byStatus.tech_interview;

  return {
    total,
    byStatus,
    offers,
    inProgress,
    rejected,
    averageSalary: salaryCount > 0 ? Math.round(salaryTotal / salaryCount) : null,
    averageRecruitmentDays:
      recruitmentDaysCount > 0 ? Math.round(recruitmentDaysTotal / recruitmentDaysCount) : null,
    conversionRate: total > 0 ? roundNumber((offers / total) * 100) : 0,
    successRate: offers + rejected > 0 ? roundNumber((offers / (offers + rejected)) * 100) : 0,
  };
}

function getEstimatedSalary(app: Application): number | null {
  if (app.salaryMin !== null && app.salaryMax !== null) {
    return (app.salaryMin + app.salaryMax) / 2;
  }

  if (app.salaryMin !== null) return app.salaryMin;
  if (app.salaryMax !== null) return app.salaryMax;

  return null;
}

function buildActionItems(applications: Application[]): ActionItem[] {
  const now = new Date();

  const staleApplied = applications.filter((app) => {
    if (app.status !== 'applied') return false;
    const updatedAt = new Date(app.updatedAt);
    const dayDiff = (Number(now) - Number(updatedAt)) / (1000 * 60 * 60 * 24);
    return dayDiff >= 7;
  }).length;

  const interviewInProgress = applications.filter((app) => {
    if (app.status !== 'hr_interview' && app.status !== 'tech_interview') return false;
    const updatedAt = new Date(app.updatedAt);
    const dayDiff = (Number(now) - Number(updatedAt)) / (1000 * 60 * 60 * 24);
    return dayDiff >= 4;
  }).length;

  const pendingOffers = applications.filter((app) => {
    if (app.status !== 'offer') return false;
    const updatedAt = new Date(app.updatedAt);
    const dayDiff = (Number(now) - Number(updatedAt)) / (1000 * 60 * 60 * 24);
    return dayDiff >= 3;
  }).length;

  const items: ActionItem[] = [];

  if (staleApplied > 0) {
    items.push({
      title: `Wyslij follow-up (${staleApplied})`,
      description: 'Aplikacje bez odpowiedzi przez co najmniej 7 dni.',
    });
  }

  if (interviewInProgress > 0) {
    items.push({
      title: `Domknij kolejne etapy (${interviewInProgress})`,
      description: 'Procesy interview bez aktualizacji od kilku dni.',
    });
  }

  if (pendingOffers > 0) {
    items.push({
      title: `Decyzja dla ofert (${pendingOffers})`,
      description: 'Warto oznaczyc akceptacje lub zamknac status.',
    });
  }

  return items.slice(0, 3);
}

function formatSalary(value: number | null): string {
  if (value === null) return 'Brak danych';
  return `${value.toLocaleString('pl-PL')} PLN`;
}

function formatDelta(delta: number, suffix: string): string {
  if (delta === 0) return `0 ${suffix}`;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta} ${suffix}`;
}

function getDeltaTone(delta: number): 'positive' | 'negative' | 'neutral' {
  if (delta > 0) return 'positive';
  if (delta < 0) return 'negative';
  return 'neutral';
}

function roundNumber(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}










