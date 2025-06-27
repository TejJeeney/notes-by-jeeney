
import { useState } from 'react';
import { ModernAppSidebar } from './ModernAppSidebar';
import { ModernNoteEditor } from './ModernNoteEditor';
import { ModernWelcome } from './ModernWelcome';
import { useNotes, Note } from '@/hooks/useNotes';

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
    setShowWelcome(false);
  };

  const handleBackToHome = () => {
    setSelectedNote(null);
    setShowWelcome(true);
  };

  return (
    <div className="flex h-screen">
      <ModernAppSidebar 
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
      />
      <div className="flex-1">
        {showWelcome ? (
          <ModernWelcome />
        ) : selectedNote ? (
          <ModernNoteEditor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            onTogglePin={handleTogglePin}
            onBack={handleBackToHome}
          />
        ) : (
          <ModernWelcome />
        )}
      </div>
    </div>
  );
}
