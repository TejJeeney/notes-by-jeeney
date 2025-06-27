
import { useState } from 'react';
import { ModernAppSidebar } from './ModernAppSidebar';
import { ModernNoteEditor } from './ModernNoteEditor';
import { ModernWelcome } from './ModernWelcome';
import { useNotes, Note } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ModernNotesView() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const { updateNote, togglePin } = useNotes();

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
  };

  const handleTogglePin = (id: string) => {
    togglePin(id);
  };

  const handleSelectNote = (note: Note | null) => {
    setSelectedNote(note);
    if (note) {
      setShowWelcome(false);
    }
  };

  const handleCreateNote = () => {
    setShowWelcome(false);
  };

  const handleGoBack = () => {
    setSelectedNote(null);
    setShowWelcome(true);
  };

  // Show welcome screen if showWelcome is true and no note is selected
  if (showWelcome && !selectedNote) {
    return <ModernWelcome onCreateNote={handleCreateNote} />;
  }

  return (
    <div className="flex h-screen">
      <ModernAppSidebar 
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
      />
      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back to Home
            </Button>
          </div>
        )}
        <div className="flex-1">
          {selectedNote ? (
            <ModernNoteEditor
              note={selectedNote}
              onUpdateNote={handleUpdateNote}
              onTogglePin={handleTogglePin}
            />
          ) : (
            <ModernWelcome onCreateNote={handleCreateNote} />
          )}
        </div>
      </div>
    </div>
  );
}
