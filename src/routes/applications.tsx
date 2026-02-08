import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useApplications } from '../hooks/queries/useApplications';
import { useApplication } from '../hooks/queries/useApplication';
import { useDeleteApplication, useCreateApplication, useUpdateApplication } from '../hooks/queries/useApplicationMutations';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { StatusFilter } from '../components/applications/StatusFilter';
import { SkeletonCards } from '../components/applications/SkeletonCards';
import { ApplicationForm } from '../components/applications/ApplicationForm';
import { ExportButton } from '../components/applications/ExportButton';
import { Modal } from '../components/ui/Modal';
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
        sortOrder: prev.sortBy === newSortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
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

  // Filtrowanie po wyszukiwanej frazie
  let filteredApplications = applications || [];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredApplications = filteredApplications.filter((app) =>
      app.company.toLowerCase().includes(searchLower) ||
      app.role.toLowerCase().includes(searchLower)
    );
  }

  // Sortowanie
  filteredApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'company') {
      comparison = a.company.localeCompare(b.company);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else {
      // sortBy === 'date' (domyślnie)
      comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  // Dla counts musimy pobrać wszystkie aplikacje (bez filtra)
  const { data: allApplications } = useApplications();
  const statusCounts = allApplications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📋 Moje Aplikacje</h1>
        <div className="flex gap-3">
          <ExportButton applications={filteredApplications} />
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-emerald-500 text-white border-none rounded-lg cursor-pointer text-base font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
          >
            ➕ Dodaj aplikację
          </button>
        </div>
      </div>

      {/* Wyszukiwarka + Sortowanie */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="search-applications" className="sr-only">
            Wyszukaj aplikacje po firmie lub stanowisku
          </label>
          <input
            id="search-applications"
            type="text"
            placeholder="🔍 Szukaj po firmie lub stanowisku..."
            value={search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
            aria-label="Wyszukiwarka aplikacji"
          />
        </div>
        
        <div className="flex gap-2" role="group" aria-label="Opcje sortowania">
          <button
            onClick={() => handleSortChange('date')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              sortBy === 'date'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-300'
            }`}
            aria-label={`Sortuj po dacie ${sortBy === 'date' ? (sortOrder === 'desc' ? 'malejąco' : 'rosnąco') : ''}`}
            aria-pressed={sortBy === 'date'}
          >
            📅 Data {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('company')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              sortBy === 'company'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-300'
            }`}
            aria-label={`Sortuj po firmie ${sortBy === 'company' ? (sortOrder === 'desc' ? 'malejąco' : 'rosnąco') : ''}`}
            aria-pressed={sortBy === 'company'}
          >
            🏢 Firma {sortBy === 'company' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('status')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              sortBy === 'status'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-300'
            }`}
            aria-label={`Sortuj po statusie ${sortBy === 'status' ? (sortOrder === 'desc' ? 'malejąco' : 'rosnąco') : ''}`}
            aria-pressed={sortBy === 'status'}
          >
            📊 Status {sortBy === 'status' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-sky-100 rounded-lg text-sm mb-6">
        Znaleziono: <strong>{filteredApplications.length}</strong> aplikacji
        {search && <span className="ml-2 text-gray-600">(wyszukiwanie: "{search}")</span>}
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

      <StatusFilter 
        activeStatus={status || null} 
        onStatusChange={handleStatusChange}
        counts={statusCounts}
      />

      {isLoading && <SkeletonCards count={3} />}

      {error && (
        <div className="p-8 bg-red-100 rounded-lg border-2 border-red-500">
          <h3 className="text-red-900 mt-0">❌ Błąd</h3>
          <p className="text-red-800">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && filteredApplications.length === 0 && (
        <div className="p-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-xl font-semibold mb-2">Brak aplikacji</h3>
          <p className="text-gray-600">
            {status 
              ? `Brak aplikacji ze statusem "${status}". Spróbuj innego filtra!`
              : 'Dodaj swoją pierwszą aplikację o pracę!'
            }
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

      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-300">
        <p className="m-0 text-sm">
          ✅ <strong>Filtrowanie </strong> TanStack Query cachuje dane osobno dla każdego statusu!
        </p>
      </div>
    </div>
  );
}


