
import { Search, Plus, Trash2, FileText } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Note } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AppSidebar({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
}: AppSidebarProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    }).format(date);
  };

  return (
    <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <SidebarHeader className="border-b border-slate-200/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Notes
            </h1>
          </div>
          <SidebarTrigger />
        </div>
        
        <Button 
          onClick={onCreateNote}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
        
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-slate-50/50 border-slate-200/60 focus:bg-white transition-colors"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs text-slate-400">Create your first note!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectNote(note)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all duration-200 group hover:bg-slate-50",
                        selectedNote?.id === note.id && "bg-indigo-50 border-l-4 border-indigo-500"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "font-medium text-sm truncate",
                            selectedNote?.id === note.id ? "text-indigo-700" : "text-slate-700"
                          )}>
                            {note.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNote(note.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {note.content.slice(0, 50) || 'No content'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(new Date(note.updated_at))}
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
