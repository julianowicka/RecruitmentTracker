import { Application } from '../../server/db/schema';
import { STATUS_LABELS } from './constants';

export const CHART_COLORS = {
  applied: '#3b82f6',      // blue-500
  hr_interview: '#eab308', // yellow-500
  tech_interview: '#a855f7',// purple-500
  offer: '#22c55e',         // green-500
  rejected: '#ef4444',      // red-500
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

export function prepareStatusPieData(byStatus: Record<string, number>): StatusPieData[] {
  return Object.entries(byStatus)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
      value: count,
      color: CHART_COLORS[status as keyof typeof CHART_COLORS] || '#888',
    }))
    .filter((item) => item.value > 0);
}

export function prepareTrendData(applications: Application[]): TrendData[] {
  if (!applications || applications.length === 0) return [];

  const dateMap = new Map<string, number>();
  
  applications.forEach((app) => {
    const date = new Date(app.createdAt).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
    });
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  const sortedDates = Array.from(dateMap.entries())
    .sort((a, b) => {
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

export function prepareMonthlyData(applications: Application[]): MonthlyData[] {
  if (!applications || applications.length === 0) return [];

  const monthMap = new Map<string, number>();
  
  applications.forEach((app) => {
    const month = new Date(app.createdAt).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
    });
    monthMap.set(month, (monthMap.get(month) || 0) + 1);
  });

  return Array.from(monthMap.entries())
    .map(([month, count]) => ({
      month: month.split(' ')[0],
      count,
    }))
    .slice(-6);
}

