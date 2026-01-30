import { create } from 'zustand';


interface UIStore {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingApplicationId: number | null;
  
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (applicationId: number) => void;
  closeEditModal: () => void;
  
  localFilter: string | null;
  setLocalFilter: (filter: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingApplicationId: null,
  localFilter: null,
  
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  
  openEditModal: (applicationId: number) =>
    set({ isEditModalOpen: true, editingApplicationId: applicationId }),
  
  closeEditModal: () =>
    set({ isEditModalOpen: false, editingApplicationId: null }),
  
  setLocalFilter: (filter: string | null) => set({ localFilter: filter }),
}));

