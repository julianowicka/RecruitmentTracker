import { createFileRoute, Link } from '@tanstack/react-router';
import { useApplication } from '../hooks/queries/useApplication';
import { NotesWithCategories } from '../components/applications/NotesWithCategories';
import { StatusTimeline } from '../components/applications/StatusTimeline';
import { ArrowLeft, ExternalLink, DollarSign, Calendar, Briefcase, Building } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-2">Nie znaleziono aplikacji.</p>
            <Link to="/applications" className="text-primary hover:underline">
              Wróć do listy aplikacji
            </Link>
          </CardContent>
        </Card>
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
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do aplikacji
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-3xl">{application.role}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <CardDescription className="text-xl">{application.company}</CardDescription>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded ${STATUS_COLORS[statusKey]}`}>
                {STATUS_LABELS[statusKey]}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {application.link && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    Link do oferty
                  </a>
                </div>
              )}

              {(application.salaryMin || application.salaryMax) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">
                    {application.salaryMin && application.salaryMax
                      ? `${application.salaryMin.toLocaleString()} - ${application.salaryMax.toLocaleString()} PLN`
                      : application.salaryMin
                      ? `od ${application.salaryMin.toLocaleString()} PLN`
                      : `do ${application.salaryMax?.toLocaleString()} PLN`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(application.createdAt).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="notes">📝 Notatki</TabsTrigger>
          <TabsTrigger value="timeline">🕒 Historia</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <NotesWithCategories applicationId={appId} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <StatusTimeline applicationId={appId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
