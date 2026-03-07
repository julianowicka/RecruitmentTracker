import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DeltaTone = 'positive' | 'negative' | 'neutral';

interface KpiCardProps {
  title: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  delta: string;
  deltaTone: DeltaTone;
}

const deltaClassMap: Record<DeltaTone, string> = {
  positive: 'text-emerald-600',
  negative: 'text-rose-600',
  neutral: 'text-muted-foreground',
};

function DeltaIcon({ tone }: { tone: DeltaTone }) {
  if (tone === 'positive') {
    return <ArrowUpRight className="h-3.5 w-3.5" />;
  }

  if (tone === 'negative') {
    return <ArrowDownRight className="h-3.5 w-3.5" />;
  }

  return <Minus className="h-3.5 w-3.5" />;
}

export function KpiCard({ title, value, hint, icon: Icon, delta, deltaTone }: KpiCardProps) {
  return (
    <Card className="border-border/70 shadow-sm transition-transform hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
        <div className={`inline-flex items-center gap-1 text-xs font-medium ${deltaClassMap[deltaTone]}`}>
          <DeltaIcon tone={deltaTone} />
          <span>{delta}</span>
        </div>
      </CardContent>
    </Card>
  );
}
