import { STATUS_LABELS } from './constants';

interface ChartApplication {
  createdAt: string;
}

export type DashboardRange = '7d' | '30d' | '90d' | 'all';

export const CHART_COLORS = {
  applied: '#3b82f6',
  hr_interview: '#eab308',
  tech_interview: '#a855f7',
  offer: '#22c55e',
  rejected: '#ef4444',
} as const;

export interface StatusPieData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  date: string;
  count: number;
  cumulative: number;
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface WindowActivityData {
  day: string;
  count: number;
}

export function prepareStatusPieData(byStatus: Record<string, number>): StatusPieData[] {
  return Object.entries(byStatus)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
      value: count,
      color: CHART_COLORS[status as keyof typeof CHART_COLORS] || '#888',
    }))
    .filter((item) => item.value > 0);
}

export function prepareTrendData(applications: ChartApplication[]): TrendData[] {
  if (!applications || applications.length === 0) return [];

  const dateMap = new Map<string, number>();

  applications.forEach((app) => {
    const date = new Date(app.createdAt).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
    });
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  const sortedDates = Array.from(dateMap.entries()).sort((a, b) => {
    const [dayA, monthA] = a[0].split('.').map(Number);
    const [dayB, monthB] = b[0].split('.').map(Number);
    return monthA !== monthB ? monthA - monthB : dayA - dayB;
  });

  let cumulative = 0;
  return sortedDates.map(([date, count]) => {
    cumulative += count;
    return {
      date,
      count,
      cumulative,
    };
  });
}

export function prepareMonthlyData(
  applications: ChartApplication[],
  range: DashboardRange = 'all'
): MonthlyData[] {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthCountMap = new Map<string, number>();

  for (const app of applications) {
    const date = new Date(app.createdAt);
    const key = getMonthKey(date);
    monthCountMap.set(key, (monthCountMap.get(key) || 0) + 1);
  }

  if (range === '7d' || range === '30d') {
    return [];
  }

  if (range === '90d') {
    return buildMonthlySeries(addMonths(currentMonth, -2), currentMonth, monthCountMap);
  }

  const earliestDataMonth = applications.length > 0
    ? applications
        .map((app) => new Date(app.createdAt))
        .reduce((minDate, currentDate) => (currentDate < minDate ? currentDate : minDate))
    : currentMonth;

  const startMonth = new Date(earliestDataMonth.getFullYear(), earliestDataMonth.getMonth(), 1);
  return buildMonthlySeries(startMonth, currentMonth, monthCountMap);
}

export function prepareWindowActivityData(
  applications: ChartApplication[],
  range: DashboardRange
): WindowActivityData[] {
  if (range !== '7d' && range !== '30d') {
    return [];
  }

  const days = range === '7d' ? 7 : 30;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));

  const countMap = new Map<string, number>();

  for (const app of applications) {
    const date = new Date(app.createdAt);
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (normalized < start || normalized > today) {
      continue;
    }

    const key = getDayKey(normalized);
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  const data: WindowActivityData[] = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const key = getDayKey(cursor);
    data.push({
      day: cursor.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }),
      count: countMap.get(key) || 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return data;
}

function buildMonthlySeries(
  startMonth: Date,
  endMonth: Date,
  monthCountMap: Map<string, number>
): MonthlyData[] {
  const data: MonthlyData[] = [];
  const cursor = new Date(startMonth);

  while (cursor <= endMonth) {
    const key = getMonthKey(cursor);
    data.push({
      month: cursor.toLocaleDateString('pl-PL', { month: 'long' }),
      count: monthCountMap.get(key) || 0,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return data;
}

function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return new Date(next.getFullYear(), next.getMonth(), 1);
}
