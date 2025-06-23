
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/pages/Index";
import { Calendar, Clock } from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdateNote({ ...note, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdateNote({ ...note, content: newContent });
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm">
      <div className="border-b border-slate-200/60 p-6 bg-white/80">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold border-none p-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-slate-400"
        />
        
        <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created: {formatDateTime(note.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated: {formatDateTime(note.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-full min-h-[500px] border-none bg-transparent resize-none focus:ring-0 focus:outline-none text-slate-700 leading-relaxed placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
