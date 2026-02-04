import { useStatusHistory } from '../../hooks/queries/useStatusHistory';
import { Clock, CheckCircle2 } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../../lib/constants';

interface StatusTimelineProps {
  applicationId: number;
}

export function StatusTimeline({ applicationId }: StatusTimelineProps) {
  const { data: history, isLoading } = useStatusHistory(applicationId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Historia zmian</h3>
        </div>
        <p className="text-gray-500">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Historia zmian</h3>
      </div>

      {history && history.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {history.map((entry, index) => {
              const statusKey = entry.toStatus as keyof typeof STATUS_LABELS;
              const fromStatusKey = entry.fromStatus as keyof typeof STATUS_LABELS | null;
              
              return (
                <div key={entry.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-purple-100' : 'bg-gray-100'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        index === 0 ? 'text-purple-600' : 'text-gray-400'
                      }`}
                    />
                  </div>

                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      {fromStatusKey && (
                        <>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[fromStatusKey]}`}
                          >
                            {STATUS_LABELS[fromStatusKey]}
                          </span>
                          <span className="text-gray-400">→</span>
                        </>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[statusKey]}`}
                      >
                        {STATUS_LABELS[statusKey]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
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
        <p className="text-gray-500 text-center py-4">
          Brak historii zmian statusu.
        </p>
      )}
    </div>
  );
}



