import { createFileRoute, Link } from '@tanstack/react-router';
import { useApplication } from '../hooks/queries/useApplication';
import { NotesSection } from '../components/applications/NotesSection';
import { StatusTimeline } from '../components/applications/StatusTimeline';
import { ArrowLeft, ExternalLink, DollarSign, Calendar } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../lib/constants';

export const Route = createFileRoute('/applications/$id')({
  component: ApplicationDetailPage,
});

function ApplicationDetailPage() {
  const { id } = Route.useParams();
  const appId = parseInt(id, 10);
  const { data: application, isLoading, error } = useApplication(appId);

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Nie znaleziono aplikacji.</p>
          <Link to="/applications" className="text-red-600 underline mt-2 inline-block">
            Wróć do listy aplikacji
          </Link>
        </div>
      </div>
    );
  }

  const statusKey = application.status as keyof typeof STATUS_LABELS;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do aplikacji
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {application.role}
              </h1>
              <p className="text-xl text-gray-600">{application.company}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded ${STATUS_COLORS[statusKey]}`}>
              {STATUS_LABELS[statusKey]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {application.link && (
              <div className="flex items-center gap-2 text-gray-600">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={application.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  Link do oferty
                </a>
              </div>
            )}

            {(application.salaryMin || application.salaryMax) && (
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>
                  {application.salaryMin && application.salaryMax
                    ? `${application.salaryMin} - ${application.salaryMax} PLN`
                    : application.salaryMin
                    ? `od ${application.salaryMin} PLN`
                    : `do ${application.salaryMax} PLN`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(application.createdAt).toLocaleDateString('pl-PL')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <NotesSection applicationId={appId} />
        </div>

        <div className="space-y-6">
          <StatusTimeline applicationId={appId} />
        </div>
      </div>
    </div>
  );
}



