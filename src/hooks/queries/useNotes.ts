import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import * as api from '../../api/applications';

export function useNotes(applicationId: number) {
  return useQuery({
    queryKey: queryKeys.notes.list(applicationId),
    queryFn: () => api.getNotesByApplicationId(applicationId),
    staleTime: 30 * 1000,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { applicationId: number; content: string }) => 
      api.createNote(data),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.list(variables.applicationId),
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { noteId: number; applicationId: number }) => 
      api.deleteNote(data.noteId),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.list(variables.applicationId),
      });
    },
  });
}



