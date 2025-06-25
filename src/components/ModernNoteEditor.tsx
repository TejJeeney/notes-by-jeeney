
import { useState, useEffect, useRef } from 'react';
import { Note } from '@/hooks/useNotes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagInput } from './TagInput';
import { DrawingCanvas } from './DrawingCanvas';
import { Calendar, Clock, Pin, PinOff, Save, Sparkles, Brush, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [showDrawing, setShowDrawing] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
    setHasChanges(false);
    setSummary('');
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

  const generateSummary = async () => {
    if (!content && !title) {
      toast.error('Please add some content to summarize');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const textToSummarize = title ? `Title: ${title}\n\nContent: ${content}` : content;
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt: textToSummarize, action: 'summary' }
      });

      if (error) throw error;

      setSummary(data.result);
      toast.success('Summary generated!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please check if Gemini API key is configured.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSaveDrawing = (imageData: string, drawingTitle: string) => {
    const imageHtml = `<div class="note-image" style="text-align: center; margin: 20px 0;"><img src="${imageData}" alt="${drawingTitle}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /><p style="font-size: 12px; color: #666; margin-top: 8px;">${drawingTitle}</p></div>`;
    const newContent = content + '\n\n' + imageHtml;
    setContent(newContent);
    setShowDrawing(false);
    toast.success('Drawing added to note!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const fileName = file.name;
      
      if (file.type.startsWith('image/')) {
        const imageHtml = `<div class="note-image" style="text-align: center; margin: 20px 0;"><img src="${result}" alt="${fileName}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /><p style="font-size: 12px; color: #666; margin-top: 8px;">${fileName}</p></div>`;
        setContent(prev => prev + '\n\n' + imageHtml);
      } else {
        const attachmentHtml = `<div class="note-attachment" style="margin: 20px 0; padding: 12px; border: 2px dashed #ddd; border-radius: 8px; text-align: center;"><p style="margin: 0; color: #666;">📎 Attachment: ${fileName}</p></div>`;
        setContent(prev => prev + '\n\n' + attachmentHtml);
      }
      
      toast.success(`${file.type.startsWith('image/') ? 'Image' : 'File'} added to note!`);
    };
    reader.readAsDataURL(file);
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

  if (showDrawing) {
    return (
      <DrawingCanvas
        onSave={handleSaveDrawing}
        onClose={() => setShowDrawing(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <div className="border-b border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl sm:text-2xl font-bold border-none p-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => setShowDrawing(true)}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-110"
            >
              <Brush className="w-4 h-4 mr-1" />
              Draw
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-110"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
            <Button
              onClick={generateSummary}
              disabled={isGeneratingSummary}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-110"
            >
              {isGeneratingSummary ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
            </Button>
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
        
        {summary && (
          <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-indigo-800 dark:text-indigo-200">AI Summary</span>
            </div>
            <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">{summary}</p>
          </div>
        )}
        
        <div className="mb-4">
          <TagInput 
            tags={tags} 
            onTagsChange={setTags}
            placeholder="Add tags... (press Enter or comma to add)"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-500 dark:text-slate-400">
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
      
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note... Click 'Draw' to add sketches, 'Upload' to add files, or just type your thoughts!"
          className="w-full h-full min-h-[300px] sm:min-h-[500px] border-none bg-transparent resize-none focus:ring-0 focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
