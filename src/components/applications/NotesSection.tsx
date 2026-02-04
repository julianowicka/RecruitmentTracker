import { useState } from 'react';
import { useNotes, useCreateNote, useDeleteNote } from '../../hooks/queries/useNotes';
import { Trash2, PlusCircle, StickyNote } from 'lucide-react';

interface NotesSectionProps {
  applicationId: number;
}

export function NotesSection({ applicationId }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const { data: notes, isLoading } = useNotes(applicationId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await createNote.mutateAsync({
        applicationId,
        content: newNote.trim(),
      });
      setNewNote('');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tę notatkę?')) return;
    
    try {
      await deleteNote.mutateAsync({ noteId, applicationId });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <StickyNote className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Notatki</h3>
        </div>
        <p className="text-gray-500">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Notatki</h3>
      </div>

      {/* Add Note Form */}
      <div className="mb-4">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Dodaj notatkę..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim() || createNote.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
          >
            <PlusCircle className="w-4 h-4" />
            Dodaj
          </button>
        </div>
      </div>

      {/* Notes List */}
      {notes && notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between gap-4">
                <p className="text-gray-700 whitespace-pre-wrap flex-1">{note.content}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Usuń notatkę"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(note.createdAt).toLocaleString('pl-PL', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          Brak notatek. Dodaj pierwszą notatkę powyżej.
        </p>
      )}
    </div>
  );
}



