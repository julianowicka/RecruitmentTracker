import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LineChart,
  Line,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import type { DashboardRange, WindowActivityData } from '@/lib/chart-utils';

interface MonthlyBarChartProps {
  data: {
    month: string;
    count: number;
  }[];
  range: DashboardRange;
  windowData: WindowActivityData[];
}

export function MonthlyBarChart({ data, range, windowData }: MonthlyBarChartProps) {
  const colors = ['#2563eb', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4'];
  const isWindowMode = range === '7d' || range === '30d';

  const title = isWindowMode
    ? `Aktywnosc aplikacji (${range === '7d' ? 'ostatnie 7 dni' : 'ostatnie 30 dni'})`
    : 'Aplikacje per miesiac';

  const description = isWindowMode
    ? 'Dzienna liczba wyslanych aplikacji w wybranym zakresie.'
    : 'Rozklad aplikacji w poszczegolnych miesiacach';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isWindowMode ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={windowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                name="Liczba aplikacji"
                stroke="none"
                fill="rgba(37, 99, 235, 0.15)"
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Liczba aplikacji"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Brak danych do wyswietlenia
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Legend />
              <Bar dataKey="count" name="Liczba aplikacji" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.month}-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
