
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Download, RefreshCw, ArrowUpDown, Languages } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

interface AIAssistantProps {
  selectedTool: string;
}

export function AIAssistant({ selectedTool }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('english');
  const [isDetecting, setIsDetecting] = useState(false);

  const languages = [
    { id: 'auto', name: '🔍 Auto Detect', code: 'auto' },
    { id: 'english', name: '🇺🇸 English', code: 'en' },
    { id: 'hindi', name: '🇮🇳 Hindi', code: 'hi' },
    { id: 'bengali', name: '🇧🇩 Bengali', code: 'bn' },
    { id: 'tamil', name: '🇮🇳 Tamil', code: 'ta' },
    { id: 'telugu', name: '🇮🇳 Telugu', code: 'te' },
    { id: 'marathi', name: '🇮🇳 Marathi', code: 'mr' },
    { id: 'gujarati', name: '🇮🇳 Gujarati', code: 'gu' },
    { id: 'kannada', name: '🇮🇳 Kannada', code: 'kn' },
    { id: 'malayalam', name: '🇮🇳 Malayalam', code: 'ml' },
    { id: 'punjabi', name: '🇮🇳 Punjabi', code: 'pa' },
    { id: 'urdu', name: '🇵🇰 Urdu', code: 'ur' },
    { id: 'spanish', name: '🇪🇸 Spanish', code: 'es' },
    { id: 'french', name: '🇫🇷 French', code: 'fr' },
    { id: 'german', name: '🇩🇪 German', code: 'de' },
    { id: 'chinese', name: '🇨🇳 Chinese', code: 'zh' },
    { id: 'japanese', name: '🇯🇵 Japanese', code: 'ja' },
    { id: 'korean', name: '🇰🇷 Korean', code: 'ko' },
    { id: 'arabic', name: '🇸🇦 Arabic', code: 'ar' },
    { id: 'russian', name: '🇷🇺 Russian', code: 'ru' }
  ];

  const getToolConfig = (tool: string) => {
    const configs = {
      chat: {
        title: '💬 Chat Assistant',
        placeholder: 'Ask me anything! I\'m here to chat and help...',
        action: 'chat',
        prompt: input
      },
      zodiac: {
        title: '♈️ Zodiac Insights',
        placeholder: 'Enter your zodiac sign and what you want to know...',
        action: 'zodiac',
        prompt: `Provide zodiac insights for: ${input}`
      },
      translate: {
        title: '🌍 Language Translator',
        placeholder: 'Enter text to translate...',
        action: 'translate',
        prompt: `Translate from ${sourceLanguage} to ${targetLanguage}: ${input}`
      },
      sticker: {
        title: '✨ Smart Stickers',
        placeholder: 'Describe what you want stickers for...',
        action: 'sticker',
        prompt: `Generate fun emoji stickers for: ${input}`
      },
      story: {
        title: '📚 Story Generator',
        placeholder: 'Give me a theme, characters, or setting for your story...',
        action: 'story',
        prompt: `Create an engaging story based on: ${input}`
      },
      rap: {
        title: '🎤 Advanced Rap Mode',
        placeholder: 'Enter your topic or message for rap lyrics...',
        action: 'rap',
        prompt: `Create advanced rap lyrics with humanized flow about: ${input}`
      },
      ghost: {
        title: '👻 Ghost Editor',
        placeholder: 'Enter text to rewrite with confidence and authority...',
        action: 'ghost',
        prompt: `Rewrite this with confidence, authority, and poetic flair: ${input}`
      },
      haiku: {
        title: '🌸 Haiku Mode',
        placeholder: 'Enter your thoughts to transform into haiku...',
        action: 'haiku',
        prompt: `Transform this into beautiful haiku (traditional or free-style): ${input}`
      },
      character: {
        title: '🎭 Character Mode',
        placeholder: 'Enter text and I\'ll rewrite it from famous perspectives...',
        action: 'character',
        prompt: `Rewrite this from the perspective of famous characters like Shakespeare, Snoop Dogg, or Einstein: ${input}`
      },
      mythology: {
        title: '👑 Mythology Mode',
        placeholder: 'Enter text to transform into epic mythological tales...',
        action: 'mythology',
        prompt: `Reimagine this as epic tales from Mahabharata, Norse sagas, or Greek myths: ${input}`
      }
    };
    return configs[tool as keyof typeof configs] || configs.chat;
  };

  const config = getToolConfig(selectedTool);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: config.prompt, 
          action: config.action 
        }
      });

      if (error) throw error;
      setOutput(data.result);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHumanize = async () => {
    if (!output.trim()) {
      toast.error('No content to humanize');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: `Humanize this text by making it more conversational, relatable, and easier to understand for everyday users. Remove complex AI words and make it natural: ${output}`, 
          action: 'humanize' 
        }
      });

      if (error) throw error;
      setOutput(data.result);
      toast.success('Content humanized successfully!');
    } catch (error) {
      console.error('Error humanizing content:', error);
      toast.error('Failed to humanize content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetectAndTranslate = async () => {
    if (!input.trim()) {
      toast.error('Please enter text to detect and translate');
      return;
    }

    setIsDetecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: `Detect the language of this text and translate it to English: "${input}"`, 
          action: 'translate' 
        }
      });

      if (error) throw error;
      setOutput(data.result);
      toast.success('Language detected and translated!');
    } catch (error) {
      console.error('Error detecting/translating:', error);
      toast.error('Failed to detect and translate. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto' && targetLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
    }
  };

  const handleExportPDF = () => {
    if (!output.trim()) {
      toast.error('No content to export');
      return;
    }

    const success = exportToPDF(output, config.title);
    if (success) {
      toast.success('PDF exported successfully!');
    } else {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTool === 'translate' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">From</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">To</label>
                <div className="flex gap-2">
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.filter(lang => lang.id !== 'auto').map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSwapLanguages}
                    variant="outline"
                    size="sm"
                    className="px-2"
                    disabled={sourceLanguage === 'auto' || targetLanguage === 'auto'}
                  >
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">Input</label>
            <Textarea
              placeholder={config.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-xs sm:text-sm min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              {loading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {loading ? 'Generating...' : 'Generate'}
            </Button>

            {selectedTool === 'translate' && (
              <Button
                onClick={handleDetectAndTranslate}
                disabled={isDetecting}
                variant="outline"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                {isDetecting ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {isDetecting ? 'Detecting...' : 'Detect & Translate to English'}
              </Button>
            )}
          </div>

          {output && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm font-medium">Output</label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleHumanize}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Humanize
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    Export PDF
                  </Button>
                </div>
              </div>
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="text-xs sm:text-sm min-h-[150px] bg-slate-50 dark:bg-slate-900"
                rows={6}
                readOnly
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
