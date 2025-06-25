import { useState } from 'react';
import { Search, Plus, LogOut, Settings, Download, Upload, Filter, Trash2, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { ThemeToggleButton } from './ThemeToggleButton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ModernAppSidebarProps {
  selectedNote?: any;
  onSelectNote?: (note: any) => void;
}

export function ModernAppSidebar({ selectedNote, onSelectNote }: ModernAppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const { signOut } = useAuth();
  const { notes, createNote, deleteNote, searchNotes, exportNotes, importNotes } = useNotes();

  const filteredNotes = searchNotes(searchQuery).filter(note => 
    showPinnedOnly ? note.is_pinned : true
  );

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote && onSelectNote) {
      onSelectNote(newNote);
    }
  };

  const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
      if (selectedNote?.id === noteId && onSelectNote) {
        onSelectNote(null);
      }
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importNotes(file);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sidebar className="border-r border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
      <SidebarHeader className="p-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            PawNotes
          </h1>
          <div className="flex gap-1">
            <ThemeToggleButton />
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-red-500 transition-all duration-300 hover:scale-110"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-purple-500 w-4 h-4 transition-colors duration-300" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-50/80 dark:bg-slate-700/80 border-slate-200/60 dark:border-slate-600/60 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 hover:shadow-md focus:shadow-lg"
          />
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleCreateNote}
            size="sm"
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Note
          </Button>
          <Button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            variant={showPinnedOnly ? "default" : "outline"}
            size="sm"
            className="transition-all duration-300 hover:scale-105"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Made with love by JEENEY */}
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Made with love by{' '}
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold animate-pulse hover:animate-bounce transition-all duration-300">
              JEENEY
            </span>
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3 overflow-y-auto">
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote?.(note)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-102 border group hover:shadow-md ${
                selectedNote?.id === note.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 shadow-md scale-102'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate flex-1 text-sm">
                  {note.title}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  {note.is_pinned && (
                    <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs">
                      📌
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 hover:scale-110"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                {note.content || 'No content'}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                  >
                    #{tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {formatDate(note.updated_at)}
              </div>
            </div>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 animate-fade-in">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </div>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={exportNotes}
            variant="outline"
            size="sm"
            className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md"
            onClick={() => document.getElementById('import-input')?.click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <input
            id="import-input"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        
        <div className="flex gap-2">
          <Link to="/terms" className="flex-1">
            <Button variant="outline" size="sm" className="w-full transition-all duration-300 hover:scale-105">
              <FileText className="w-4 h-4 mr-1" />
              T&C
            </Button>
          </Link>
          <Link to="/faq" className="flex-1">
            <Button variant="outline" size="sm" className="w-full transition-all duration-300 hover:scale-105">
              <HelpCircle className="w-4 h-4 mr-1" />
              FAQ
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
