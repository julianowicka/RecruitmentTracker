import { useStatusHistory } from '../../hooks/queries/useStatusHistory';
import { Clock, CheckCircle2 } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../../lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface StatusTimelineProps {
  applicationId: number;
}

export function StatusTimeline({ applicationId }: StatusTimelineProps) {
  const { data: history, isLoading } = useStatusHistory(applicationId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <CardTitle>Historia zmian</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ładowanie...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <CardTitle>Historia zmian</CardTitle>
        </div>
        <CardDescription>
          Timeline wszystkich zmian statusu aplikacji
        </CardDescription>
      </CardHeader>

      <CardContent>
        {history && history.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />

            <div className="space-y-6">
              {history.map((entry, index) => {
                const statusKey = entry.toStatus as keyof typeof STATUS_LABELS;
                const fromStatusKey = entry.fromStatus as keyof typeof STATUS_LABELS | null;
                
                return (
                  <div key={entry.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        index === 0 
                          ? 'bg-primary border-primary' 
                          : 'bg-secondary border-border'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          index === 0 ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      />
                    </div>

                    <div className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        {fromStatusKey && (
                          <>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[fromStatusKey]}`}
                            >
                              {STATUS_LABELS[fromStatusKey]}
                            </span>
                            <span className="text-muted-foreground">→</span>
                          </>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[statusKey]}`}
                        >
                          {STATUS_LABELS[statusKey]}
                        </span>
                        {index === 0 && (
                          <span className="text-xs text-primary font-medium ml-1">
                            (Aktualny)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.changedAt).toLocaleString('pl-PL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              Brak historii zmian statusu.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
