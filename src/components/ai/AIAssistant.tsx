
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Download, FileText, Copy } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

export function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('compliment');

  const modes = [
    { id: 'compliment', name: '💝 Compliment Generator', description: 'Generate heartfelt compliments' },
    { id: 'story', name: '📚 Story Generator', description: 'Create engaging stories' },
    { id: 'rap', name: '🎤 Advanced Rap Mode', description: 'Generate rap lyrics with flow' },
    { id: 'ghost', name: '👻 Ghost Editor', description: 'Professional writing assistance' },
    { id: 'haiku', name: '🌸 Haiku Mode', description: 'Create beautiful haiku poems' },
    { id: 'character', name: '🎭 Character Mode', description: 'Develop fictional characters' },
    { id: 'mythology', name: '⚡ Mythology Mode', description: 'Explore mythological stories' },
    { id: 'translate', name: '🌐 Translator', description: 'Translate between languages' },
  ];

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      let enhancedPrompt = prompt;
      
      // Enhance prompt based on mode
      switch (mode) {
        case 'story':
          enhancedPrompt = `Write an engaging story based on: ${prompt}. Make it creative, with good pacing and interesting characters.`;
          break;
        case 'rap':
          enhancedPrompt = `Create advanced rap lyrics about: ${prompt}. Include good flow, rhythm, wordplay, and make it catchy.`;
          break;
        case 'ghost':
          enhancedPrompt = `As a professional ghost editor, improve and refine this text: ${prompt}. Make it more polished, clear, and engaging while maintaining the original voice.`;
          break;
        case 'haiku':
          enhancedPrompt = `Create a beautiful haiku poem about: ${prompt}. Follow the 5-7-5 syllable structure and capture the essence poetically.`;
          break;
        case 'character':
          enhancedPrompt = `Develop a detailed fictional character based on: ${prompt}. Include personality, background, motivations, and interesting traits.`;
          break;
        case 'mythology':
          enhancedPrompt = `Create or explain a mythological story related to: ${prompt}. Make it rich in detail and cultural significance.`;
          break;
        case 'translate':
          enhancedPrompt = `Translate the following text accurately: ${prompt}`;
          break;
        default:
          enhancedPrompt = `Generate a thoughtful compliment or positive message about: ${prompt}`;
      }

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: enhancedPrompt,
          action: mode 
        }
      });

      if (error) throw error;
      setResponse(data.result);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const humanizeContent = async () => {
    if (!response) {
      toast.error('No content to humanize');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: `Please rewrite this text in simple, everyday language that anyone can understand. Remove complex words and technical jargon, make it conversational and easy to read: ${response}`,
          action: 'humanize'
        }
      });

      if (error) throw error;
      setResponse(data.result);
      toast.success('Content humanized successfully!');
    } catch (error) {
      console.error('Error humanizing content:', error);
      toast.error('Failed to humanize content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!response) {
      toast.error('No content to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(response);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadPDF = () => {
    if (!response) {
      toast.error('No content to export');
      return;
    }

    const selectedMode = modes.find(m => m.id === mode);
    const title = selectedMode ? selectedMode.name.replace(/[^\w\s]/gi, '') : 'AI Generated Content';
    
    exportToPDF(response, title);
    toast.success('PDF downloaded successfully!');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">AI Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Prompt</label>
            <Textarea
              placeholder={`Enter your ${modes.find(m => m.id === mode)?.name.toLowerCase()} prompt here...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={generateContent} 
            disabled={loading}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>

          {response && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Generated Content</label>
                <Textarea
                  value={response}
                  readOnly
                  className="min-h-[200px] bg-gray-50"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={humanizeContent}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {loading ? 'Humanizing...' : 'Humanize'}
                </Button>
                
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>

                <Button
                  onClick={downloadPDF}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Export PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
