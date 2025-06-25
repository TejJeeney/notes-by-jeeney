
import { MessageSquare, Star, Languages, Sparkles, FileText, Bot, Camera, Mic, Edit3, Coffee, Users, Gamepad2, Crown } from 'lucide-react';
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
    },
    {
      icon: Mic,
      title: "Advanced Rap Mode",
      description: "Transform your notes into fire rap lyrics with advanced controls and humanization",
      emoji: "🎤",
      id: "rap"
    },
    {
      icon: Edit3,
      title: "Ghost Editor",
      description: "Rewrite your notes with confidence, authority, or poetic flair",
      emoji: "👻",
      id: "ghost"
    },
    {
      icon: Coffee,
      title: "Haiku Mode",
      description: "Transform your thoughts into beautiful traditional or free-style Haiku",
      emoji: "🌸",
      id: "haiku"
    },
    {
      icon: Users,
      title: "Character Mode",
      description: "Rewrite text from the perspective of famous characters like Shakespeare or Snoop Dogg",
      emoji: "🎭",
      id: "character"
    },
    {
      icon: Gamepad2,
      title: "Gamification Mode",
      description: "Transform boring text into exciting quests, missions, and challenges",
      emoji: "🎮",
      id: "gamification"
    },
    {
      icon: Crown,
      title: "Mythology Mode",
      description: "Reimagine your text as epic tales from Mahabharata, Norse sagas, or Greek myths",
      emoji: "👑",
      id: "mythology"
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
        <div className="p-2 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vintage Camera Filters
            </h2>
            <Button 
              onClick={() => setSelectedAITool(null)}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200 text-xs sm:text-sm"
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
        <div className="p-2 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <Button 
              onClick={() => setSelectedAITool(null)}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200 text-xs sm:text-sm"
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
    <div className="h-full overflow-auto p-2 sm:p-4 md:p-6 bg-gradient-to-br from-white/60 via-blue-50/60 to-indigo-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-900/60 backdrop-blur-sm">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-4 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:shadow-2xl hover:drop-shadow-[0_0_20px_rgba(139,69,255,0.3)] transition-all duration-500 cursor-pointer">
              PawNotes
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto px-2 sm:px-4">
            Your intelligent note-taking companion powered by AI. Create, organize, and enhance your thoughts with powerful AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-1 sm:px-2">
          {aiFeatures.map((feature, index) => (
            <Card 
              key={index} 
              onClick={() => handleFeatureClick(feature.id)}
              className="group hover:shadow-2xl hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 animate-fade-in border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm cursor-pointer hover:bg-white/90 dark:hover:bg-slate-800/90"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-2 sm:pb-3 p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl group-hover:animate-pulse">{feature.emoji}</span>
                </div>
                <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 pt-0">
                <CardDescription className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300 text-center">
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
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl hover:shadow-purple-500/40 transition-all duration-300 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold rounded-2xl hover:scale-105 animate-scale-in w-full sm:w-auto"
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
            Start Taking Notes
          </Button>
        </div>
      </div>
    </div>
  );
}
