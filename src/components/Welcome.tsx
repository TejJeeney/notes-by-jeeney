
import { Plus, FileText, Search, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onCreateNote: () => void;
}

export function Welcome({ onCreateNote }: WelcomeProps) {
  const features = [
    {
      icon: FileText,
      title: "Rich Text Editing",
      description: "Write and format your notes with ease"
    },
    {
      icon: Search,
      title: "Powerful Search",
      description: "Find any note instantly with smart search"
    },
    {
      icon: Palette,
      title: "Beautiful Design",
      description: "Enjoy a clean, distraction-free interface"
    }
  ];

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <FileText className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Notes</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Your beautiful, simple note-taking companion. Capture thoughts, ideas, and inspiration in one organized place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200"
            >
              <feature.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <Button 
          onClick={onCreateNote}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Note
        </Button>
      </div>
    </div>
  );
}
