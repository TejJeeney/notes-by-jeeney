
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, Sparkles, Camera, FileText, Plus } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

interface ModernWelcomeProps {
  onCreateNote?: () => void;
}

export function ModernWelcome({ onCreateNote }: ModernWelcomeProps) {
  const { createNote } = useNotes();

  const handleStartTakingNotes = async () => {
    const newNote = await createNote('My First Note', '');
    if (newNote && onCreateNote) {
      onCreateNote();
    }
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Smart Notes',
      description: 'Take organized notes with tags, search, and cloud sync'
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: 'Drawing Canvas',
      description: 'Sketch ideas and create visual notes with our drawing tools'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Assistant',
      description: 'Get help with writing, translations, and creative content'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Vintage Camera',
      description: 'Apply retro filters to your photos with nostalgic effects'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to PawNotes
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your all-in-one creative workspace for notes, drawings, AI assistance, and vintage photography
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleStartTakingNotes}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start Taking Notes
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3"
            onClick={() => window.location.href = '/'}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore Features
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">∞</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Notes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">12+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">AI Modes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">12+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Vintage Filters</div>
          </div>
        </div>
      </div>
    </div>
  );
}
