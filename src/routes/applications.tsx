import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Search, Calendar, Building2, BarChart3, ClipboardList, Info, Plus } from 'lucide-react';
import { useApplications } from '../hooks/queries/useApplications';
import { useApplication } from '../hooks/queries/useApplication';
import { useDeleteApplication, useCreateApplication, useUpdateApplication } from '../hooks/queries/useApplicationMutations';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { StatusFilter } from '../components/applications/StatusFilter';
import { SkeletonCards } from '../components/applications/SkeletonCards';
import { ApplicationForm } from '../components/applications/ApplicationForm';
import { ExportButton } from '../components/applications/ExportButton';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/button';
import { useUIStore } from '../stores/ui-store';
import { APPLICATION_STATUSES } from '../lib/constants';

const applicationsSearchSchema = z.object({
  status: z
    .enum([
      APPLICATION_STATUSES.APPLIED,
      APPLICATION_STATUSES.HR_INTERVIEW,
      APPLICATION_STATUSES.TECH_INTERVIEW,
      APPLICATION_STATUSES.OFFER,
      APPLICATION_STATUSES.REJECTED,
    ])
    .optional()
    .catch(undefined),
  search: z.string().optional().catch(undefined),
  sortBy: z.enum(['date', 'company', 'status']).optional().catch('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
});

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
  validateSearch: applicationsSearchSchema,
});

function ApplicationsPage() {
  const navigate = Route.useNavigate();
  const { status, search, sortBy, sortOrder } = Route.useSearch();
  const { data: applications, isLoading, error } = useApplications(status);
  const deleteMutation = useDeleteApplication();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  const {
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isEditModalOpen,
    editingApplicationId,
    openEditModal,
    closeEditModal,
  } = useUIStore();

  const { data: editingApplication } = useApplication(editingApplicationId ?? 0, {
    enabled: !!editingApplicationId,
  });

  const handleStatusChange = (newStatus: string | null) => {
    navigate({
      search: (prev) => ({ ...prev, status: newStatus as typeof status }),
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: searchTerm || undefined }),
    });
  };

  const handleSortChange = (newSortBy: 'date' | 'company' | 'status') => {
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy: newSortBy,
        sortOrder: prev.sortBy === newSortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      }),
    });
  };

  const handleDelete = (id: number, company: string) => {
    if (confirm(`Czy na pewno chcesz usunąć aplikację do ${company}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    openEditModal(id);
  };

  const handleCreateApplication = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        closeCreateModal();
      },
    });
  };

  const handleUpdateApplication = (data: any) => {
    if (!editingApplicationId) return;

    updateMutation.mutate(
      { id: editingApplicationId, data },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  let filteredApplications = applications || [];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredApplications = filteredApplications.filter((app) =>
      app.company.toLowerCase().includes(searchLower) || app.role.toLowerCase().includes(searchLower)
    );
  }

  filteredApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'company') {
      comparison = a.company.localeCompare(b.company);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else {
      comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const { data: allApplications } = useApplications();
  const statusCounts =
    allApplications?.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
            <ClipboardList className="h-7 w-7 text-slate-700" />
            Moje Aplikacje
          </h1>
          <p className="text-sm text-slate-700">Przeglądaj, filtruj i zarządzaj procesami rekrutacyjnymi.</p>
        </div>
        <div className="flex gap-3">
          <ExportButton applications={filteredApplications} />
          <Button onClick={openCreateModal} className="h-10 px-4 font-semibold">
            <Plus className="h-4 w-4" />
            Dodaj aplikację
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <label htmlFor="search-applications" className="sr-only">
            Wyszukaj aplikacje po firmie lub stanowisku
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <input
            id="search-applications"
            type="text"
            placeholder="Szukaj po firmie lub stanowisku..."
            value={search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-11 w-full rounded-xl border-2 border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            aria-label="Wyszukiwarka aplikacji"
          />
        </div>

        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Opcje sortowania">
          <button
            onClick={() => handleSortChange('date')}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition-colors ${
              sortBy === 'date'
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
            }`}
            aria-label={`Sortuj po dacie ${sortBy === 'date' ? (sortOrder === 'desc' ? 'malejąco' : 'rosnąco') : ''}`}
            aria-pressed={sortBy === 'date'}
          >
            <Calendar className="h-4 w-4" />
            Data {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('company')}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition-colors ${
              sortBy === 'company'
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
            }`}
            aria-label={`Sortuj po firmie ${sortBy === 'company' ? (sortOrder === 'desc' ? 'malejąco' : 'rosnąco') : ''}`}
            aria-pressed={sortBy === 'company'}
          >
            <Building2 className="h-4 w-4" />
            Firma {sortBy === 'company' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('status')}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition-colors ${
              sortBy === 'status'
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
            }`}
            aria-label={`Sortuj po statusie ${sortBy === 'status' ? (sortOrder === 'desc' ? 'malejąco' : 'rosnąco') : ''}`}
            aria-pressed={sortBy === 'status'}
          >
            <BarChart3 className="h-4 w-4" />
            Status {sortBy === 'status' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800">
        Znaleziono: <strong>{filteredApplications.length}</strong> aplikacji
        {search && <span className="ml-2 text-slate-700">(wyszukiwanie: "{search}")</span>}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal} title="Dodaj nową aplikację">
        <ApplicationForm onSubmit={handleCreateApplication} isSubmitting={createMutation.isPending} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edytuj aplikację">
        <ApplicationForm
          onSubmit={handleUpdateApplication}
          isSubmitting={updateMutation.isPending}
          initialData={editingApplication || null}
          mode="edit"
        />
      </Modal>

      <StatusFilter activeStatus={status || null} onStatusChange={handleStatusChange} counts={statusCounts} />

      {isLoading && <SkeletonCards count={3} />}

      {error && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-8">
          <h3 className="mt-0 text-red-800">Błąd</h3>
          <p className="text-red-800">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && filteredApplications.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="mb-2 text-xl font-semibold text-slate-900">Brak aplikacji</h3>
          <p className="text-slate-700">
            {status
              ? `Brak aplikacji ze statusem "${status}". Spróbuj innego filtra.`
              : 'Dodaj swoją pierwszą aplikację o pracę.'}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredApplications.length > 0 && (
        <div className="flex flex-col gap-4" role="list" aria-label="Lista aplikacji o pracę">
          {filteredApplications.map((app) => (
            <div key={app.id} role="listitem">
              <ApplicationCard
                application={app}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === app.id}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-slate-300 bg-white p-4">
        <p className="m-0 flex items-center gap-2 text-sm text-slate-800">
          <Info className="h-4 w-4" />
          <strong className="text-slate-900">Filtrowanie:</strong>
          TanStack Query cachuje dane osobno dla każdego statusu.
        </p>
      </div>
    </div>
  );
}
