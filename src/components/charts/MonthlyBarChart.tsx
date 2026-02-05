import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface MonthlyBarChartProps {
  data: {
    month: string;
    count: number;
  }[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const colors = [
    'hsl(221.2 83.2% 70%)',
    'hsl(221.2 83.2% 60%)',
    'hsl(221.2 83.2% 53.3%)',
    'hsl(221.2 83.2% 45%)',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Aplikacje per miesiąc
        </CardTitle>
        <CardDescription>
          Rozkład aplikacji w poszczególnych miesiącach
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Brak danych do wyświetlenia
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Liczba aplikacji"
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

