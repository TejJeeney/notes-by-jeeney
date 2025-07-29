
import { useState } from 'react';
import { Search, Plus, LogOut, Settings, Download, Upload, Filter, Trash2, FileText, HelpCircle, Edit3, Pin, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { ThemeToggleButton } from './ThemeToggleButton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernAppSidebarProps {
  selectedNote?: any;
  onSelectNote?: (note: any) => void;
}

export function ModernAppSidebar({ selectedNote, onSelectNote }: ModernAppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const { signOut } = useAuth();
  const { notes, createNote, deleteNote, searchNotes, exportNotes, importNotes } = useNotes();
  const isMobile = useIsMobile();

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

  // Mobile-specific handlers
  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          onClick={handleToggleSidebar}
          className="fixed top-4 left-4 z-50 bg-sidebar-background/90 dark:bg-sidebar-background/90 backdrop-blur-sm border border-sidebar-border shadow-lg hover:bg-sidebar-accent transition-all duration-200"
          size="sm"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      {/* Mobile Overlay - Only show when expanded */}
      {isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`${isMobile ? 'fixed top-0 left-0 z-50' : 'relative group'} transition-transform duration-300 ease-in-out ${
          isMobile 
            ? `${isExpanded ? 'translate-x-0' : '-translate-x-full'} w-80 h-screen` 
            : `${isExpanded ? 'w-72' : 'w-16'} hover:w-72`
        }`}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
      <Sidebar className={`h-full bg-white/10 dark:bg-slate-800/10 backdrop-blur-2xl border-r border-white/20 dark:border-slate-700/20 shadow-2xl transition-all duration-300 ${
        isMobile ? 'w-80' : isExpanded ? 'w-72' : 'w-16 group-hover:w-72'
      }`}>
        
        <SidebarHeader className={`p-3 border-b border-white/10 dark:border-slate-700/20 transition-all duration-300 ${
          isMobile || isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:from-purple-500 hover:to-cyan-400 transition-all duration-300">
              FunPaw
            </h1>
            <div className="flex gap-1">
              <ThemeToggleButton />
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:bg-red-500/10 backdrop-blur-lg"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative group/search">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover/search:text-cyan-400 w-4 h-4 transition-colors duration-300" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 dark:bg-slate-700/10 backdrop-blur-lg border-white/20 dark:border-slate-600/20 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
            />
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleCreateNote}
              size="sm"
              className="flex-1 bg-gradient-to-r from-cyan-500/80 to-purple-600/80 hover:from-cyan-600 hover:to-purple-700 text-white backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Note
            </Button>
            <Button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              variant={showPinnedOnly ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-300 hover:scale-105 backdrop-blur-lg ${
                showPinnedOnly 
                  ? 'bg-gradient-to-r from-amber-500/80 to-orange-500/80 border-white/30' 
                  : 'border-white/20 hover:bg-white/10'
              }`}
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

        {/* Collapsed state - only icons */}
        <div className={`absolute top-3 left-3 transition-all duration-300 ${
          isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 group-hover:opacity-0 group-hover:pointer-events-none'
        }`}>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleCreateNote}
              size="sm"
              className="w-10 h-10 p-0 bg-gradient-to-r from-cyan-500/80 to-purple-600/80 hover:from-cyan-600 hover:to-purple-700 text-white backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 transition-all duration-300 hover:scale-110 backdrop-blur-lg border-white/20 hover:bg-white/10"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <SidebarContent className={`p-3 overflow-y-auto transition-all duration-300 ${
          isMobile || isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="space-y-2">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                onClick={() => onSelectNote?.(note)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-102 group/note backdrop-blur-lg border animate-scroll-reveal ${
                  selectedNote?.id === note.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-300/30 shadow-lg shadow-cyan-500/10 scale-102'
                    : 'hover:bg-white/10 dark:hover:bg-slate-700/10 border-white/10 hover:border-white/20 dark:hover:border-slate-600/20 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate flex-1 text-sm">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    {note.is_pinned && (
                      <Badge variant="secondary" className="bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs backdrop-blur-lg border border-amber-200/30">
                        <Pin className="w-3 h-3" />
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover/note:opacity-100 transition-all duration-300 h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-500 backdrop-blur-lg hover:scale-110"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover/note:opacity-100 transition-all duration-300 h-6 w-6 p-0 hover:bg-blue-500/20 hover:text-blue-500 backdrop-blur-lg hover:scale-110"
                    >
                      <Edit3 className="w-3 h-3" />
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
                      className="text-xs bg-gradient-to-r from-cyan-50/80 to-purple-50/80 dark:from-cyan-900/20 dark:to-purple-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200/30 dark:border-cyan-700/30 hover:from-cyan-100/80 hover:to-purple-100/80 dark:hover:from-cyan-900/30 dark:hover:to-purple-900/30 transition-colors duration-200 backdrop-blur-lg"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs backdrop-blur-lg border-white/20">
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

        {/* Collapsible Footer */}
          <div 
            className={`relative transition-all duration-300 ${
              isMobile || isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          onMouseEnter={() => setShowFooter(true)}
          onMouseLeave={() => setShowFooter(false)}
        >
          <SidebarFooter className={`p-3 border-t border-white/10 dark:border-slate-700/20 space-y-2 transition-all duration-300 ${
            showFooter ? 'opacity-100' : 'opacity-70'
          }`}>
            <div className="flex gap-2">
              <Button
                onClick={exportNotes}
                variant="outline"
                size="sm"
                className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md backdrop-blur-lg border-white/20 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md backdrop-blur-lg border-white/20 hover:bg-white/10"
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
                <Button variant="outline" size="sm" className="w-full transition-all duration-300 hover:scale-105 backdrop-blur-lg border-white/20 hover:bg-white/10">
                  <FileText className="w-4 h-4 mr-1" />
                  T&C
                </Button>
              </Link>
              <Link to="/faq" className="flex-1">
                <Button variant="outline" size="sm" className="w-full transition-all duration-300 hover:scale-105 backdrop-blur-lg border-white/20 hover:bg-white/10">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  FAQ
                </Button>
              </Link>
            </div>
          </SidebarFooter>
        </div>

        {/* Collapsed footer toggle */}
        <div className={`absolute bottom-3 left-3 transition-all duration-300 ${
          isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 group-hover:opacity-0 group-hover:pointer-events-none'
        }`}>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 transition-all duration-300 hover:scale-110 backdrop-blur-lg border-white/20 hover:bg-white/10"
            onClick={() => setShowFooter(!showFooter)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </Sidebar>
      </div>
    </>
  );
}
