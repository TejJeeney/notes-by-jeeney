
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

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
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
    setLoading(false);
  };

  const createNote = async (title: string = 'Untitled Note', content: string = '') => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title,
        content,
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
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;

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
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

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

      for (const note of importedNotes) {
        await createNote(note.title || 'Imported Note', note.content || '');
      }
      
      toast.success(`Imported ${importedNotes.length} notes`);
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
