
import { MessageSquare, Star, Languages, Sparkles, FileText, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotes } from '@/hooks/useNotes';

export function ModernWelcome() {
  const { createNote } = useNotes();

  const aiFeatures = [
    {
      icon: MessageSquare,
      title: "Chat Assistant",
      description: "Chat with Gemini AI for any questions or creative ideas",
      emoji: "💬"
    },
    {
      icon: Star,
      title: "Zodiac Insights", 
      description: "Get personalized zodiac readings for your note-taking style",
      emoji: "♈️"
    },
    {
      icon: Languages,
      title: "Language Translator",
      description: "Translate your notes into multiple languages instantly",
      emoji: "🌍"
    },
    {
      icon: Sparkles,
      title: "Smart Stickers",
      description: "Generate fun emoji stickers based on your note content",
      emoji: "✨"
    },
    {
      icon: FileText,
      title: "AI Summary",
      description: "Get intelligent summaries of your notes with Gemini AI",
      emoji: "📄"
    },
    {
      icon: Bot,
      title: "Story Generator",
      description: "Create amazing stories from your words and scenarios",
      emoji: "📚"
    }
  ];

  const handleCreateNote = async () => {
    await createNote();
  };

  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-white/60 via-blue-50/60 to-indigo-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-900/60 backdrop-blur-sm">
      <div className="max-w-6xl w-full text-center">
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-scale-in">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PawNotes
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto px-4">
            Your intelligent note-taking companion powered by AI. Create, organize, and enhance your thoughts with powerful AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
          {aiFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl">{feature.emoji}</span>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={handleCreateNote} 
          size="lg" 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-semibold rounded-2xl hover:scale-105 animate-scale-in"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
          Start Taking Notes
        </Button>
      </div>
    </div>
  );
}
