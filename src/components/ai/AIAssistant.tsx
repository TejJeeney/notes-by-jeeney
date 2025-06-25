
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Languages, BookOpen, Star, Sparkles, Heart } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

interface AIAssistantProps {
  selectedTool?: string;
  onStickerSuggested?: (sticker: string) => void;
}

export function AIAssistant({ selectedTool, onStickerSuggested }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('es');
  const [zodiacSign, setZodiacSign] = useState('');
  const [zodiacAdvice, setZodiacAdvice] = useState('');
  const [storyWords, setStoryWords] = useState('');
  const [storyScenario, setStoryScenario] = useState('');
  const [complimentCategory, setComplimentCategory] = useState('');

  // Clear results when switching tools
  useEffect(() => {
    setResult('');
    setPrompt('');
    setZodiacAdvice('');
    setStoryWords('');
    setStoryScenario('');
    setComplimentCategory('');
  }, [selectedTool]);

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

  // Render specific tool interface based on selectedTool
  if (selectedTool === 'chat') {
    return <ChatInterface />;
  }

  if (selectedTool === 'translate') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Languages className="w-5 h-5 text-green-600" />
            Language Translator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'zodiac') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="w-5 h-5 text-yellow-600" />
            Zodiac Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'sticker') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Smart Stickers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'story') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Story Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    );
  }

  // Default fallback
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Select an AI tool to get started!</p>
      </CardContent>
    </Card>
  );
}
