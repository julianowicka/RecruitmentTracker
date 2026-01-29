import { create } from 'zustand';

/**
 * UI Store - zarządzanie stanem interfejsu użytkownika
 * (modale, drawer'y, lokalne preferencje widoku)
 */
interface UIStore {
  // Modale
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingApplicationId: number | null;
  
  // Akcje dla modali
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (applicationId: number) => void;
  closeEditModal: () => void;
  
  // Filtry lokalne (opcjonalnie - możemy też trzymać w URL)
  localFilter: string | null;
  setLocalFilter: (filter: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Stan początkowy
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingApplicationId: null,
  localFilter: null,
  
  // Akcje
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  
  openEditModal: (applicationId: number) =>
    set({ isEditModalOpen: true, editingApplicationId: applicationId }),
  
  closeEditModal: () =>
    set({ isEditModalOpen: false, editingApplicationId: null }),
  
  setLocalFilter: (filter: string | null) => set({ localFilter: filter }),
}));

