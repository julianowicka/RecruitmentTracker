import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusItem {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface StatusDistributionBarsProps {
  items: StatusItem[];
  total: number;
}

export function StatusDistributionBars({ items, total }: StatusDistributionBarsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statusy aplikacji</CardTitle>
        <CardDescription>Rozklad statusow dla wybranego okresu.</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Brak danych dla wybranego okresu.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
