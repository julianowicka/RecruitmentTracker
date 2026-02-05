import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useApplications } from '../hooks/queries/useApplications';
import { useApplication } from '../hooks/queries/useApplication';
import { useDeleteApplication, useCreateApplication, useUpdateApplication } from '../hooks/queries/useApplicationMutations';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { StatusFilter } from '../components/applications/StatusFilter';
import { SkeletonCards } from '../components/applications/SkeletonCards';
import { ApplicationForm } from '../components/applications/ApplicationForm';
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
});

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
  validateSearch: applicationsSearchSchema,
});

function ApplicationsPage() {
  const navigate = Route.useNavigate();
  const { status } = Route.useSearch();
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
      search: { status: newStatus as typeof status },
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

  // Hook już filtruje po statusie, więc nie trzeba filtrować ponownie
  const filteredApplications = applications || [];

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
        <div className="flex gap-4 items-center">
          <div className="px-4 py-2 bg-sky-100 rounded-lg text-sm">
            Znaleziono: <strong>{filteredApplications.length}</strong> aplikacji
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-emerald-500 text-white border-none rounded-lg cursor-pointer text-base font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
          >
            ➕ Dodaj aplikację
          </button>
        </div>
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
        <div className="flex flex-col gap-4">
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === app.id}
            />
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


