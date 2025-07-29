
import { useState } from 'react';
import { ModernAppSidebar } from './ModernAppSidebar';
import { ModernNoteEditor } from './ModernNoteEditor';
import { ModernWelcome } from './ModernWelcome';
import { useNotes, Note } from '@/hooks/useNotes';

export function ModernNotesView() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { updateNote, togglePin } = useNotes();

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
  };

  const handleTogglePin = (id: string) => {
    togglePin(id);
  };

  return (
    <div className="flex h-screen relative">
      <ModernAppSidebar 
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
      />
      <div className={`flex-1 transition-all duration-300 ml-16`}>
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
  );
}
