import { Plus, FileText, Search, Tag, Pin, Palette, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotes } from '@/hooks/useNotes';
export function ModernWelcome() {
  const {
    createNote
  } = useNotes();
  const features = [{
    icon: FileText,
    title: "Rich Text Editing",
    description: "Write and format your notes with ease"
  }, {
    icon: Tag,
    title: "Smart Tagging",
    description: "Organize with #tags for quick access"
  }, {
    icon: Search,
    title: "Powerful Search",
    description: "Find any note instantly with smart search"
  }, {
    icon: Pin,
    title: "Pin Important Notes",
    description: "Keep important notes at the top"
  }, {
    icon: Palette,
    title: "Beautiful Themes",
    description: "Choose from light, dark, or custom themes"
  }, {
    icon: Zap,
    title: "Lightning Fast",
    description: "Smooth animations and instant sync"
  }];
  const handleCreateNote = async () => {
    await createNote();
  };
  return <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-white/60 via-blue-50/60 to-indigo-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-900/60 backdrop-blur-sm px-[16px]">
      <div className="max-w-4xl text-center">
        <div className="mb-12 animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-scale-in">
            <FileText className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-100 mb-6 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Notes
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Your beautiful, intelligent note-taking companion. Capture thoughts, organize ideas, 
            and find inspiration in one seamless, distraction-free space.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => <div key={index} className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-lg">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
            </div>)}
        </div>

        <Button onClick={handleCreateNote} size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 px-12 py-4 text-xl font-semibold rounded-2xl hover:scale-105 animate-scale-in">
          <Plus className="w-6 h-6 mr-3" />
          Create Your First Note
        </Button>
      </div>
    </div>;
}