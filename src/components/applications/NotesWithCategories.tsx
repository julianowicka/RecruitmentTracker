import { useState } from 'react';
import { useNotes, useCreateNote, useDeleteNote } from '../../hooks/queries/useNotes';
import { Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { 
  NOTE_CATEGORIES, 
  NOTE_CATEGORY_LABELS, 
  NOTE_CATEGORY_ICONS,
  NOTE_CATEGORY_DESCRIPTIONS,
  NoteCategory 
} from '../../lib/constants';

interface NotesWithCategoriesProps {
  applicationId: number;
}

export function NotesWithCategories({ applicationId }: NotesWithCategoriesProps) {
  const [newNoteContent, setNewNoteContent] = useState<Record<NoteCategory, string>>({
    general: '',
    technical: '',
    company: '',
    interview_prep: '',
    followup: '',
  });
  
  const [activeTab, setActiveTab] = useState<NoteCategory>(NOTE_CATEGORIES.GENERAL);
  
  const { data: allNotes, isLoading } = useNotes(applicationId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  // Group notes by category
  const notesByCategory = (allNotes || []).reduce((acc, note) => {
    const category = (note.category || 'general') as NoteCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(note);
    return acc;
  }, {} as Record<NoteCategory, typeof allNotes>);

  const handleAddNote = async (category: NoteCategory) => {
    const content = newNoteContent[category]?.trim();
    if (!content) return;
    
    try {
      await createNote.mutateAsync({
        applicationId,
        content,
        category,
      });
      setNewNoteContent(prev => ({ ...prev, [category]: '' }));
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
          <CardTitle>Notatki</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ładowanie...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notatki</CardTitle>
        <CardDescription>
          Organizuj informacje według kategorii
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NoteCategory)}>
          <TabsList className="grid w-full grid-cols-5">
            {Object.values(NOTE_CATEGORIES).map((category) => {
              const count = notesByCategory[category]?.length || 0;
              return (
                <TabsTrigger key={category} value={category} className="relative">
                  <span className="mr-1">{NOTE_CATEGORY_ICONS[category]}</span>
                  <span className="hidden sm:inline">{NOTE_CATEGORY_LABELS[category]}</span>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.values(NOTE_CATEGORIES).map((category) => {
            const categoryNotes = notesByCategory[category] || [];
            
            return (
              <TabsContent key={category} value={category} className="space-y-4 mt-4">
                {/* Category Description */}
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <span className="mr-2">{NOTE_CATEGORY_ICONS[category]}</span>
                  {NOTE_CATEGORY_DESCRIPTIONS[category]}
                </div>

                {/* Add Note Form */}
                <div className="flex gap-2">
                  <textarea
                    value={newNoteContent[category]}
                    onChange={(e) => setNewNoteContent(prev => ({
                      ...prev,
                      [category]: e.target.value
                    }))}
                    placeholder={`Dodaj notatkę do kategorii "${NOTE_CATEGORY_LABELS[category]}"...`}
                    className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-none bg-background"
                    rows={3}
                  />
                  <Button
                    onClick={() => handleAddNote(category)}
                    disabled={!newNoteContent[category]?.trim() || createNote.isPending}
                    size="sm"
                    className="h-fit"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Dodaj
                  </Button>
                </div>

                {/* Notes List */}
                {categoryNotes.length > 0 ? (
                  <div className="space-y-3">
                    {categoryNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-muted rounded-lg border border-border group hover:border-muted-foreground/20 transition-colors"
                      >
                        <div className="flex justify-between gap-4">
                          <p className="text-sm whitespace-pre-wrap flex-1">{note.content}</p>
                          <Button
                            onClick={() => handleDeleteNote(note.id)}
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8"
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
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
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

