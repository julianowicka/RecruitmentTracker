import { Link } from '@tanstack/react-router';
import { ArrowRight, BellRing } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActionItem {
  title: string;
  description: string;
}

interface ActionCenterCardProps {
  items: ActionItem[];
}

export function ActionCenterCard({ items }: ActionCenterCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Nastepne akcje
        </CardTitle>
        <CardDescription>Rzeczy, ktore warto wykonac teraz.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Brak pilnych akcji. Dashboard wyglada zdrowo.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.title} className="rounded-lg border bg-secondary/40 p-3">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
            <Link
              to="/applications"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Otworz aplikacje
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
