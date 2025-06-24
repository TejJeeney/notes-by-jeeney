
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Input validation constants
const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 100000;
const MAX_TAGS_COUNT = 50;
const MAX_TAG_LENGTH = 50;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const validateNoteInput = (title: string, content: string, tags: string[] = []) => {
    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
    }
    
    if (content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Content must be ${MAX_CONTENT_LENGTH} characters or less`);
    }
    
    if (tags.length > MAX_TAGS_COUNT) {
      throw new Error(`Cannot have more than ${MAX_TAGS_COUNT} tags`);
    }
    
    tags.forEach(tag => {
      if (tag.length > MAX_TAG_LENGTH) {
        throw new Error(`Tag "${tag}" is too long. Tags must be ${MAX_TAG_LENGTH} characters or less`);
      }
    });
  };

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to load notes');
      } else {
        setNotes(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string = 'Untitled Note', content: string = '') => {
    if (!user) return;

    try {
      validateNoteInput(title, content);

      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: title.trim(),
          content: content.trim(),
          user_id: user.id,
          tags: [],
          is_pinned: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        toast.error('Failed to create note');
      } else {
        setNotes(prev => [data, ...prev]);
        toast.success('Note created');
        return data;
      }
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create note');
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;

    try {
      // Validate updates if they include title, content, or tags
      if (updates.title || updates.content || updates.tags) {
        const currentNote = notes.find(n => n.id === id);
        if (currentNote) {
          validateNoteInput(
            updates.title ?? currentNote.title,
            updates.content ?? currentNote.content,
            updates.tags ?? currentNote.tags
          );
        }
      }

      // Trim string values
      if (updates.title) updates.title = updates.title.trim();
      if (updates.content) updates.content = updates.content.trim();

      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        toast.error('Failed to update note');
      } else {
        setNotes(prev => prev.map(note => note.id === id ? data : note));
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      } else {
        setNotes(prev => prev.filter(note => note.id !== id));
        toast.success('Note deleted');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const togglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { is_pinned: !note.is_pinned });
    }
  };

  const searchNotes = (query: string): Note[] => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Notes exported successfully');
  };

  const importNotes = async (file: File) => {
    try {
      const text = await file.text();
      const importedNotes = JSON.parse(text);
      
      if (!Array.isArray(importedNotes)) {
        throw new Error('Invalid file format');
      }

      let importedCount = 0;
      for (const note of importedNotes) {
        try {
          await createNote(note.title || 'Imported Note', note.content || '');
          importedCount++;
        } catch (error) {
          console.error('Error importing note:', error);
        }
      }
      
      toast.success(`Imported ${importedCount} notes`);
    } catch (error) {
      console.error('Error importing notes:', error);
      toast.error('Failed to import notes');
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
    exportNotes,
    importNotes,
    refetch: fetchNotes,
  };
}
