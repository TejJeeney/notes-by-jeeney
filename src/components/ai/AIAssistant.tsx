import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Download, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  selectedTool: string;
}

export function AIAssistant({ selectedTool }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const toolConfigs: { [key: string]: { title: string; description: string; inputs?: string[] } } = {
    chat: { title: "Chat Assistant", description: "Start a conversation with the AI" },
    zodiac: { title: "Zodiac Insights", description: "Get personalized zodiac readings", inputs: ["sign"] },
    translate: { title: "Language Translator", description: "Translate your notes into multiple languages", inputs: ["language"] },
    sticker: { title: "Smart Stickers", description: "Generate fun emoji stickers based on your note content" },
    story: { title: "Story Generator", description: "Create amazing stories from your words and scenarios", inputs: ["storyLength", "tone", "genre", "style", "character", "perspective", "pacing", "theme", "setting"] },
    rap: { title: "Rap Lyrics Generator", description: "Transform your notes into fire rap lyrics", inputs: ["theme", "explicit", "language", "mood", "flow", "tone", "profanity", "complexity", "rapLength", "cultural"] },
    ghost: { title: "Ghost Editor", description: "Rewrite your notes with confidence, authority, or poetic flair", inputs: ["tone", "language"] },
    haiku: { title: "Haiku Mode", description: "Transform your thoughts into beautiful traditional or free-style Haiku", inputs: ["style", "language"] },
    humanize: { title: "Humanize Text", description: "Make text sound natural and human", inputs: ["tone", "complexity", "contractions", "empathy", "humor", "language", "outputLength"] },
    character: { title: "Character Mode", description: "Rewrite text from the perspective of famous characters", inputs: ["character", "language"] },
    gamification: { title: "Gamification Mode", description: "Transform boring text into exciting quests, missions, and challenges", inputs: ["gameStyle", "language"] },
    mythology: { title: "Mythology Mode", description: "Reimagine your text as epic tales", inputs: ["mythStyle", "language"] },
    compliment: { title: "Philosophical Compliment", description: "Generate deeply thoughtful, poetic compliments" },
    summary: { title: "Summary Generator", description: "Create concise, meaningful summaries" },
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `${filename}.txt has been downloaded.`,
    });
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Content has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, action: selectedTool, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Could not complete AI request.", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{toolConfigs[selectedTool]?.title}</CardTitle>
          <CardDescription>{toolConfigs[selectedTool]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full resize-none border rounded-md shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {selectedTool === 'translate' && (
              <div>
                <Select onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="zh-CN">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Generate <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Generated Content</CardTitle>
              <CardDescription>Your AI-generated {toolConfigs[selectedTool]?.title.toLowerCase()}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(result)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={() => downloadAsText(result, `${selectedTool}-${Date.now()}`)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
