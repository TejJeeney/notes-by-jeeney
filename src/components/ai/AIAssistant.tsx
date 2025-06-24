
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
import { Sparkles, Languages, Image, Star, Wand2 } from 'lucide-react';

interface AIAssistantProps {
  onImageGenerated?: (imageData: string) => void;
  onStickerSuggested?: (sticker: string) => void;
}

export function AIAssistant({ onImageGenerated, onStickerSuggested }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('es');
  const [zodiacSign, setZodiacSign] = useState('');
  const [zodiacAdvice, setZodiacAdvice] = useState('');

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

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for image generation');
      return;
    }

    setLoading(true);
    try {
      // First get an enhanced prompt from Gemini
      const enhancedPrompt = await callGeminiAI(prompt, 'generateImage');
      if (!enhancedPrompt) return;

      // Then generate the image
      const { data, error } = await supabase.functions.invoke('image-generator', {
        body: { prompt: enhancedPrompt }
      });

      if (error) throw error;

      if (data.image && onImageGenerated) {
        onImageGenerated(data.image);
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please check if OpenAI API key is configured.');
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="sticker">Stickers</TabsTrigger>
            <TabsTrigger value="zodiac">Zodiac</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Textarea
              placeholder="Ask me anything about your notes..."
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
                  <p className="text-sm">{result}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="translate" className="space-y-4">
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
                <Languages className="w-4 h-4 mr-2" />
                {loading ? 'Translating...' : 'Translate'}
              </Button>
            </div>
            {result && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Translation:</p>
                  <p className="text-sm mt-2">{result}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={generateImage} disabled={loading} className="w-full">
              <Image className="w-4 h-4 mr-2" />
              {loading ? 'Generating...' : 'Generate Image'}
            </Button>
          </TabsContent>

          <TabsContent value="sticker" className="space-y-4">
            <Textarea
              placeholder="Describe what you're writing about to get sticker suggestions..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={getStickerSuggestion} disabled={loading} className="w-full">
              <Wand2 className="w-4 h-4 mr-2" />
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

          <TabsContent value="zodiac" className="space-y-4">
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
              <Star className="w-4 h-4 mr-2" />
              {loading ? 'Consulting the stars...' : 'Get Today\'s Note Advice'}
            </Button>
            {zodiacAdvice && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">Your Zodiac Note Advice:</p>
                  <p className="text-sm mt-2 italic">{zodiacAdvice}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
