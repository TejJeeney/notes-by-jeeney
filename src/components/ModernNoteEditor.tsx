
import { useState, useEffect } from 'react';
import { Note } from '@/hooks/useNotes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagInput } from './TagInput';
import { Calendar, Clock, Pin, PinOff, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModernNoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onTogglePin: (id: string) => void;
}

export function ModernNoteEditor({ note, onUpdateNote, onTogglePin }: ModernNoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
    setHasChanges(false);
  }, [note]);

  useEffect(() => {
    const titleChanged = title !== note.title;
    const contentChanged = content !== note.content;
    const tagsChanged = JSON.stringify(tags) !== JSON.stringify(note.tags);
    setHasChanges(titleChanged || contentChanged || tagsChanged);
  }, [title, content, tags, note]);

  const handleSave = () => {
    onUpdateNote(note.id, { title, content, tags });
    setHasChanges(false);
  };

  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <div className="border-b border-slate-200/60 dark:border-slate-700/60 p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-2xl font-bold border-none p-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button 
                onClick={handleSave}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-105"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            )}
            <Button
              onClick={() => onTogglePin(note.id)}
              variant="ghost"
              size="sm"
              className={`transition-all duration-200 hover:scale-110 ${
                note.is_pinned 
                  ? 'text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-900/20' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {note.is_pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <TagInput 
            tags={tags} 
            onTagsChange={setTags}
            placeholder="Add tags... (press Enter or comma to add)"
          />
        </div>
        
        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created: {formatDateTime(note.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated: {formatDateTime(note.updated_at)}</span>
          </div>
          {note.is_pinned && (
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              <Pin className="w-3 h-3 mr-1" />
              Pinned
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-full min-h-[500px] border-none bg-transparent resize-none focus:ring-0 focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base"
        />
      </div>
    </div>
  );
}
