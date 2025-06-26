
import { useState } from 'react';
import { ModernAppSidebar } from './ModernAppSidebar';
import { ModernNoteEditor } from './ModernNoteEditor';
import { ModernWelcome } from './ModernWelcome';
import { useNotes, Note } from '@/hooks/useNotes';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export function ModernNotesView() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { updateNote, togglePin } = useNotes();

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
  };

  const handleTogglePin = (id: string) => {
    togglePin(id);
  };

  const handleBackToWelcome = () => {
    setSelectedNote(null);
  };

  return (
    <div className="flex h-screen">
      <ModernAppSidebar 
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
      />
      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <div className="p-2 sm:p-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <Button
              onClick={handleBackToWelcome}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
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
            <ModernWelcome />
          )}
        </div>
      </div>
    </div>
  );
}
