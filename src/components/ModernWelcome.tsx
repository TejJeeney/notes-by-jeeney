
import { MessageSquare, Star, Languages, Sparkles, FileText, Bot, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotes } from '@/hooks/useNotes';
import { useState } from 'react';
import { AIAssistant } from './ai/AIAssistant';
import { CameraFilters } from './ai/CameraFilters';

export function ModernWelcome() {
  const { createNote } = useNotes();
  const [selectedAITool, setSelectedAITool] = useState<string | null>(null);

  const aiFeatures = [
    {
      icon: MessageSquare,
      title: "Chat Assistant",
      description: "Chat with JEENEY for some fun and good time - persistent conversation with history",
      emoji: "💬",
      id: "chat"
    },
    {
      icon: Star,
      title: "Zodiac Insights", 
      description: "Get personalized zodiac readings for your note-taking style",
      emoji: "♈️",
      id: "zodiac"
    },
    {
      icon: Languages,
      title: "Language Translator",
      description: "Translate your notes into multiple languages instantly",
      emoji: "🌍",
      id: "translate"
    },
    {
      icon: Sparkles,
      title: "Smart Stickers",
      description: "Generate fun emoji stickers based on your note content",
      emoji: "✨",
      id: "sticker"
    },
    {
      icon: FileText,
      title: "AI Summary",
      description: "Get intelligent summaries of your notes with Gemini AI",
      emoji: "📄",
      id: "summary"
    },
    {
      icon: Bot,
      title: "Story Generator",
      description: "Create amazing stories from your words and scenarios",
      emoji: "📚",
      id: "story"
    },
    {
      icon: Camera,
      title: "Vintage Camera",
      description: "Apply vintage filters and effects to your photos",
      emoji: "📷",
      id: "camera"
    }
  ];

  const handleCreateNote = async () => {
    await createNote();
  };

  const handleFeatureClick = (featureId: string) => {
    setSelectedAITool(featureId);
  };

  if (selectedAITool === 'camera') {
    return (
      <div className="h-full overflow-auto bg-gradient-to-br from-white/60 via-blue-50/60 to-indigo-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-900/60 backdrop-blur-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vintage Camera Filters
            </h2>
            <Button 
              onClick={() => setSelectedAITool(null)}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              ← Back to Features
            </Button>
          </div>
          <CameraFilters />
        </div>
      </div>
    );
  }

  if (selectedAITool) {
    return (
      <div className="h-full overflow-auto bg-gradient-to-br from-white/60 via-blue-50/60 to-indigo-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-900/60 backdrop-blur-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <Button 
              onClick={() => setSelectedAITool(null)}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              ← Back to Features
            </Button>
          </div>
          <AIAssistant selectedTool={selectedAITool} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 sm:p-6 bg-gradient-to-br from-white/60 via-blue-50/60 to-indigo-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-900/60 backdrop-blur-sm">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:shadow-2xl hover:drop-shadow-[0_0_20px_rgba(139,69,255,0.3)] transition-all duration-500 cursor-pointer">
              PawNotes
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto px-4">
            Your intelligent note-taking companion powered by AI. Create, organize, and enhance your thoughts with powerful AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 px-2">
          {aiFeatures.map((feature, index) => (
            <Card 
              key={index} 
              onClick={() => handleFeatureClick(feature.id)}
              className="group hover:shadow-2xl hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 animate-fade-in border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm cursor-pointer hover:bg-white/90 dark:hover:bg-slate-800/90"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                  <span className="text-2xl sm:text-3xl group-hover:animate-pulse">{feature.emoji}</span>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleCreateNote} 
            size="lg" 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl hover:shadow-purple-500/40 transition-all duration-300 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-2xl hover:scale-105 animate-scale-in"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Start Taking Notes
          </Button>
        </div>
      </div>
    </div>
  );
}
