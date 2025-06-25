
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Languages, BookOpen, Star, Sparkles, Heart } from 'lucide-react';

interface AIAssistantProps {
  onStickerSuggested?: (sticker: string) => void;
}

export function AIAssistant({ onStickerSuggested }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('es');
  const [zodiacSign, setZodiacSign] = useState('');
  const [zodiacAdvice, setZodiacAdvice] = useState('');
  const [storyWords, setStoryWords] = useState('');
  const [storyScenario, setStoryScenario] = useState('');
  const [complimentCategory, setComplimentCategory] = useState('');

  const callGeminiAI = async (text: string, action: string, lang?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt: text, action, language: lang }
      });

      if (error) throw error;
      return data.result;
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      toast.error('Failed to get AI response. Please check if Gemini API key is configured.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const translateText = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    const translation = await callGeminiAI(prompt, 'translate', language);
    if (translation) {
      setResult(translation);
      toast.success('Text translated successfully!');
    }
  };

  const getStickerSuggestion = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text for sticker suggestion');
      return;
    }

    const sticker = await callGeminiAI(prompt, 'sticker');
    if (sticker && onStickerSuggested) {
      onStickerSuggested(sticker);
      setResult(sticker);
      toast.success('Sticker suggestion generated!');
    }
  };

  const getZodiacAdvice = async () => {
    if (!zodiacSign) {
      toast.error('Please select your zodiac sign');
      return;
    }

    const advice = await callGeminiAI(zodiacSign, 'zodiac');
    if (advice) {
      setZodiacAdvice(advice);
      toast.success('Your zodiac note advice is ready!');
    }
  };

  const chatWithAI = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const response = await callGeminiAI(prompt, 'chat');
    if (response) {
      setResult(response);
    }
  };

  const generateStory = async () => {
    if (!storyWords.trim() || !storyScenario.trim()) {
      toast.error('Please enter both words and scenario');
      return;
    }

    const storyPrompt = `Create a story using these words: ${storyWords} in this scenario: ${storyScenario}`;
    const story = await callGeminiAI(storyPrompt, 'story');
    if (story) {
      setResult(story);
      toast.success('Story generated successfully!');
    }
  };

  const generateCompliment = async () => {
    if (!complimentCategory.trim()) {
      toast.error('Please enter a category');
      return;
    }

    const complimentPrompt = `Generate an obscure, philosophical, poetic compliment about: ${complimentCategory}`;
    const compliment = await callGeminiAI(complimentPrompt, 'compliment');
    if (compliment) {
      setResult(compliment);
      toast.success('Obscure compliment generated!');
    }
  };

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ];

  const aiTools = [
    { id: 'chat', icon: MessageSquare, title: 'Chat Assistant', emoji: '💬' },
    { id: 'translate', icon: Languages, title: 'Translator', emoji: '🌍' },
    { id: 'zodiac', icon: Star, title: 'Zodiac Insights', emoji: '♈️' },
    { id: 'sticker', icon: Sparkles, title: 'Smart Stickers', emoji: '✨' },
    { id: 'story', icon: BookOpen, title: 'Story Generator', emoji: '📚' },
    { id: 'compliment', icon: Heart, title: 'Compliment Generator', emoji: '💫' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI Assistant Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {aiTools.map((tool) => (
              <TabsTrigger key={tool.id} value={tool.id} className="text-xs flex flex-col items-center gap-1 p-2">
                <span className="text-lg">{tool.emoji}</span>
                <span className="hidden sm:inline">{tool.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Chat with AI</h3>
            </div>
            <Textarea
              placeholder="Ask me anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={chatWithAI} disabled={loading} className="w-full">
              {loading ? 'Thinking...' : 'Chat with AI'}
            </Button>
            {result && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm whitespace-pre-wrap">{result}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="translate" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Language Translator</h3>
            </div>
            <Textarea
              placeholder="Enter text to translate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={translateText} disabled={loading} className="flex-1">
                {loading ? 'Translating...' : 'Translate'}
              </Button>
            </div>
            {result && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Translation:</p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{result}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="zodiac" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold">Zodiac Insights</h3>
            </div>
            <Select value={zodiacSign} onValueChange={setZodiacSign}>
              <SelectTrigger>
                <SelectValue placeholder="Select your zodiac sign" />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign} value={sign}>
                    {sign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={getZodiacAdvice} disabled={loading} className="w-full">
              {loading ? 'Consulting the stars...' : 'Get Today\'s Note Advice'}
            </Button>
            {zodiacAdvice && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Your Zodiac Note Advice:</p>
                  <p className="text-sm mt-2 italic whitespace-pre-wrap">{zodiacAdvice}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sticker" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Smart Stickers</h3>
            </div>
            <Textarea
              placeholder="Describe what you're writing about to get sticker suggestions..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={getStickerSuggestion} disabled={loading} className="w-full">
              {loading ? 'Getting suggestions...' : 'Get Sticker Suggestion'}
            </Button>
            {result && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Suggested Sticker:</p>
                  <Badge variant="secondary" className="text-2xl mt-2">{result}</Badge>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="story" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Story Generator</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Words to Include</label>
                <Input
                  placeholder="e.g., dragon, castle, adventure"
                  value={storyWords}
                  onChange={(e) => setStoryWords(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Scenario</label>
                <Input
                  placeholder="e.g., medieval fantasy, space exploration"
                  value={storyScenario}
                  onChange={(e) => setStoryScenario(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={generateStory} disabled={loading} className="w-full">
              {loading ? 'Creating story...' : 'Generate Story'}
            </Button>
            {result && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Your Generated Story:</p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{result}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compliment" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Obscure Compliment Generator</h3>
            </div>
            <Input
              placeholder="Enter any object or concept (e.g., doorknob, left elbow, sound of rain)"
              value={complimentCategory}
              onChange={(e) => setComplimentCategory(e.target.value)}
            />
            <Button onClick={generateCompliment} disabled={loading} className="w-full">
              {loading ? 'Crafting compliment...' : 'Generate Philosophical Compliment'}
            </Button>
            {result && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Your Obscure Compliment:</p>
                  <p className="text-sm mt-2 italic whitespace-pre-wrap">{result}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
