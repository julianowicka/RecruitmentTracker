import { useState } from 'react';
import { useNotes, useCreateNote, useDeleteNote } from '../../hooks/queries/useNotes';
import { Trash2, PlusCircle, StickyNote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { 
  NOTE_CATEGORIES, 
  NOTE_CATEGORY_LABELS, 
  NOTE_CATEGORY_ICONS,
  NOTE_CATEGORY_DESCRIPTIONS,
  type NoteCategory 
} from '../../lib/note-constants';

interface NotesSectionProps {
  applicationId: number;
}

export function NotesSection({ applicationId }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoteCategory>(NOTE_CATEGORIES.GENERAL);
  
  const { data: allNotes, isLoading } = useNotes(applicationId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  // Group notes by category
  const notesByCategory = (allNotes || []).reduce((acc, note) => {
    const category = (note.category || NOTE_CATEGORIES.GENERAL) as NoteCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(note);
    return acc;
  }, {} as Record<NoteCategory, typeof allNotes>);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await createNote.mutateAsync({
        applicationId,
        content: newNote.trim(),
        category: activeCategory,
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            <CardTitle>Notatki</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ładowanie...</p>
        </CardContent>
      </Card>
    );
  }

  const categories = Object.values(NOTE_CATEGORIES) as NoteCategory[];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <CardTitle>Notatki</CardTitle>
        </div>
        <CardDescription>
          Organizuj notatki według kategorii
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(val) => setActiveCategory(val as NoteCategory)}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const count = notesByCategory[category]?.length || 0;
              return (
                <TabsTrigger key={category} value={category} className="text-xs">
                  <span className="mr-1">{NOTE_CATEGORY_ICONS[category]}</span>
                  <span className="hidden sm:inline">{NOTE_CATEGORY_LABELS[category]}</span>
                  {count > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 px-1.5 rounded-full">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => {
            const notes = notesByCategory[category] || [];
            
            return (
              <TabsContent key={category} value={category} className="space-y-4">
                {/* Description */}
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {NOTE_CATEGORY_ICONS[category]} {NOTE_CATEGORY_DESCRIPTIONS[category]}
                </div>

                {/* Add note form */}
                <div className="space-y-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={`Dodaj notatkę w kategorii "${NOTE_CATEGORY_LABELS[category]}"...`}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
                    rows={4}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || createNote.isPending}
                    className="w-full"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Dodaj notatkę
                  </Button>
                </div>

                {/* Notes list */}
                {notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-muted/50 rounded-lg border border-border group hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between gap-4">
                          <p className="text-sm whitespace-pre-wrap flex-1">{note.content}</p>
                          <Button
                            onClick={() => handleDeleteNote(note.id)}
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            title="Usuń notatkę"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
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
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">
                      Brak notatek w tej kategorii. Dodaj pierwszą notatkę powyżej.
                    </p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

