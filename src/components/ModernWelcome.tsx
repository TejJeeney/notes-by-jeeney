
import { MessageSquare, Star, Languages, Sparkles, FileText, Bot, Camera, Mic, Edit3, Coffee, Users, Crown, Flame, Skull, Heart, Zap, Shield } from 'lucide-react';
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
      icon: Crown,
      title: "Mythology Mode",
      description: "Reimagine your text as epic tales from Mahabharata, Norse sagas, or Greek myths",
      emoji: "👑",
      id: "mythology"
    },
    {
      icon: Flame,
      title: "Dark Roast Mode",
      description: "Savage rewrite with brutal honesty - from mild jabs to Gordon Ramsay fury",
      emoji: "🔥",
      id: "roast"
    },
    {
      icon: Skull,
      title: "Unfiltered Mode",
      description: "Raw, unhinged, uncensored rewrites with zero filters and no boundaries",
      emoji: "💀",
      id: "unfiltered"
    },
    {
      icon: Heart,
      title: "AI Confession Booth",
      description: "Safe space for confessions with therapist, priest, or judge personas",
      emoji: "🧠",
      id: "confession"
    },
    {
      icon: Zap,
      title: "Anarchy Generator",
      description: "Unleash creative chaos with glitch-poetry and rebellious brilliance",
      emoji: "🧷",
      id: "anarchy"
    },
    {
      icon: Shield,
      title: "Toxic Text Filter",
      description: "Analyze toxicity and generate powerful clapbacks with queen energy",
      emoji: "📱",
      id: "toxic"
    }
  ];

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
              FunPaw
            </span>
          </h1>
          
          <div className="mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto px-2 sm:px-4">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4">
              <strong className="text-slate-800 dark:text-slate-100">
                This is majorly a fun AI space with an additional feature to create Notes and all.
              </strong>
            </p>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mb-4">
              Whether you're writing poetry, plotting revenge, or confessing your dark secrets to a digital therapist — this ain't your grandma's notes app.
              It's where scribbles turn into Shakespeare, roasts go full Gordon Ramsay, and chaos becomes ✨content✨.
            </p>
            <p className="text-sm sm:text-base md:text-lg font-medium bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
              ✨"Think it. Dump it. Watch AI fix it. Or ruin it for fun. Either way, you're winning."✨
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-1 sm:px-2">
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
      </div>
    </div>
  );
}
