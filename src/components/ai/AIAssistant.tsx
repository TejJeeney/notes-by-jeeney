import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Languages, BookOpen, Star, Sparkles, Mic, Edit3, Coffee, Users, Gamepad2, Crown } from 'lucide-react';
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
  
  // Rap Mode states
  const [rapTheme, setRapTheme] = useState('hustle');
  const [explicitMode, setExplicitMode] = useState(false);
  const [rapLanguage, setRapLanguage] = useState('english');
  const [rapMood, setRapMood] = useState('aggressive');
  const [rapFlow, setRapFlow] = useState('boom-bap');
  const [rapTone, setRapTone] = useState('confident');
  const [profanityLevel, setProfanityLevel] = useState('mild');
  const [complexityLevel, setComplexityLevel] = useState('intermediate');
  const [rapLength, setRapLength] = useState('8 bars');
  const [culturalRef, setCulturalRef] = useState('western');
  
  // Humanizer states
  const [humanTone, setHumanTone] = useState('friendly');
  const [humanComplexity, setHumanComplexity] = useState('neutral');
  const [useContractions, setUseContractions] = useState(true);
  const [empathyLevel, setEmpathyLevel] = useState('medium');
  const [humorLevel, setHumorLevel] = useState('off');
  const [humanLanguage, setHumanLanguage] = useState('english');
  const [outputLength, setOutputLength] = useState('medium');
  
  // Ghost Editor states
  const [ghostTone, setGhostTone] = useState('authoritative');
  const [ghostLanguage, setGhostLanguage] = useState('english');
  
  // Haiku Mode states
  const [haikuStyle, setHaikuStyle] = useState('traditional');
  const [haikuLanguage, setHaikuLanguage] = useState('english');
  
  // Character Mode states
  const [selectedCharacter, setSelectedCharacter] = useState('shakespeare');
  const [characterLanguage, setCharacterLanguage] = useState('english');
  
  // Gamification states
  const [gameStyle, setGameStyle] = useState('quest');
  const [gameLanguage, setGameLanguage] = useState('english');
  
  // Mythology states
  const [mythStyle, setMythStyle] = useState('mahabharata');
  const [mythLanguage, setMythLanguage] = useState('english');

  // Clear results when switching tools
  useEffect(() => {
    setResult('');
    setPrompt('');
    setZodiacAdvice('');
    setStoryWords('');
    setStoryScenario('');
  }, [selectedTool]);

  const callGeminiAI = async (text: string, action: string, options?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt: text, action, ...options }
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

    const translation = await callGeminiAI(prompt, 'translate', { language });
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

  const generateRap = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to convert to rap');
      return;
    }

    const rap = await callGeminiAI(prompt, 'rap', {
      theme: rapTheme,
      explicit: explicitMode,
      language: rapLanguage,
      mood: rapMood,
      flow: rapFlow,
      tone: rapTone,
      profanity: profanityLevel,
      complexity: complexityLevel,
      length: rapLength,
      cultural: culturalRef
    });
    
    if (rap) {
      setResult(rap);
      toast.success('Rap lyrics generated!');
    }
  };

  const humanizeText = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to humanize');
      return;
    }

    const humanized = await callGeminiAI(prompt, 'humanize', {
      tone: humanTone,
      complexity: humanComplexity,
      contractions: useContractions,
      empathy: empathyLevel,
      humor: humorLevel,
      language: humanLanguage,
      length: outputLength
    });
    
    if (humanized) {
      setResult(humanized);
      toast.success('Text humanized successfully!');
    }
  };

  const generateGhostEdit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to rewrite');
      return;
    }

    const edit = await callGeminiAI(prompt, 'ghost', {
      tone: ghostTone,
      language: ghostLanguage
    });
    
    if (edit) {
      setResult(edit);
      toast.success('Text rewritten successfully!');
    }
  };

  const generateHaiku = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to convert to haiku');
      return;
    }

    const haiku = await callGeminiAI(prompt, 'haiku', {
      style: haikuStyle,
      language: haikuLanguage
    });
    
    if (haiku) {
      setResult(haiku);
      toast.success('Haiku generated successfully!');
    }
  };

  const generateCharacterText = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to transform');
      return;
    }

    const characterText = await callGeminiAI(prompt, 'character', {
      character: selectedCharacter,
      language: characterLanguage
    });
    
    if (characterText) {
      setResult(characterText);
      toast.success('Character transformation complete!');
    }
  };

  const generateGameText = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to gamify');
      return;
    }

    const gameText = await callGeminiAI(prompt, 'gamification', {
      gameStyle: gameStyle,
      language: gameLanguage
    });
    
    if (gameText) {
      setResult(gameText);
      toast.success('Text gamified successfully!');
    }
  };

  const generateMythText = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to mythologize');
      return;
    }

    const mythText = await callGeminiAI(prompt, 'mythology', {
      mythStyle: mythStyle,
      language: mythLanguage
    });
    
    if (mythText) {
      setResult(mythText);
      toast.success('Mythological tale created!');
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

  const rapThemes = [
    { id: 'heartbreak', name: '💔 Heartbreak', emoji: '💔' },
    { id: 'hustle', name: '🔥 Hustle & Grind', emoji: '🔥' },
    { id: 'empowerment', name: '👑 Self-empowerment', emoji: '👑' },
    { id: 'money', name: '💰 Money & Power', emoji: '💰' },
    { id: 'mythology', name: '🐉 Mythology / History', emoji: '🐉' },
    { id: 'social', name: '🌍 Social Commentary', emoji: '🌍' },
    { id: 'funny', name: '😂 Funny / Roast', emoji: '😂' }
  ];

  if (selectedTool === 'chat') {
    return <ChatInterface />;
  }

  if (selectedTool === 'rap') {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            Advanced Rap Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Enter your text to transform into fire rap lyrics..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Theme</label>
              <Select value={rapTheme} onValueChange={setRapTheme}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {rapThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={rapLanguage} onValueChange={setRapLanguage}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                  <SelectItem value="hinglish">🌍 Hinglish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Mood</label>
              <Select value={rapMood} onValueChange={setRapMood}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aggressive">🔥 Aggressive</SelectItem>
                  <SelectItem value="street">🏙️ Street</SelectItem>
                  <SelectItem value="lyrical">📝 Lyrical</SelectItem>
                  <SelectItem value="conscious">🧠 Conscious</SelectItem>
                  <SelectItem value="storytelling">📚 Storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Flow</label>
              <Select value={rapFlow} onValueChange={setRapFlow}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="triplet">🎵 Triplet</SelectItem>
                  <SelectItem value="boom-bap">💥 Boom-Bap</SelectItem>
                  <SelectItem value="trap">🎧 Trap</SelectItem>
                  <SelectItem value="freestyle">🎤 Freestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Cultural Reference</label>
              <Select value={culturalRef} onValueChange={setCulturalRef}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="western">🇺🇸 Western Hip-Hop</SelectItem>
                  <SelectItem value="bollywood">🎬 Bollywood</SelectItem>
                  <SelectItem value="desi">🇮🇳 Desi Hip-Hop</SelectItem>
                  <SelectItem value="classic">👑 Classic Hip-Hop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Length</label>
              <Select value={rapLength} onValueChange={setRapLength}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4 bars">4 bars</SelectItem>
                  <SelectItem value="8 bars">8 bars</SelectItem>
                  <SelectItem value="16 bars">16 bars</SelectItem>
                  <SelectItem value="32 bars">32 bars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Profanity Level</label>
              <Select value={profanityLevel} onValueChange={setProfanityLevel}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">😇 None</SelectItem>
                  <SelectItem value="mild">😐 Mild</SelectItem>
                  <SelectItem value="explicit">🔥 Explicit</SelectItem>
                  <SelectItem value="no-limit">🚫 No Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Complexity</label>
              <Select value={complexityLevel} onValueChange={setComplexityLevel}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">🟢 Simple</SelectItem>
                  <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                  <SelectItem value="advanced">🟠 Advanced</SelectItem>
                  <SelectItem value="genius">🔴 Genius</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="explicit-mode"
                checked={explicitMode}
                onCheckedChange={setExplicitMode}
              />
              <label htmlFor="explicit-mode" className="text-xs sm:text-sm font-medium">
                Uncensored Mode 🔥
              </label>
            </div>
            
            <Button onClick={humanizeText} variant="outline" size="sm" className="text-xs sm:text-sm">
              🤖➡️👤 Humanize
            </Button>
          </div>
          
          <Button onClick={generateRap} disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-sm sm:text-base">
            {loading ? 'Cooking up bars...' : '🎤 Generate Advanced Rap Lyrics'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Fire Rap:</p>
                <pre className="text-xs sm:text-sm mt-2 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">{result}</pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'character') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Character Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to transform from a character's perspective..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Character</label>
              <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select character" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shakespeare">🎭 Shakespearean Poet</SelectItem>
                  <SelectItem value="alien">👽 Alien from Future</SelectItem>
                  <SelectItem value="teacher">👩‍🏫 Stern Teacher</SelectItem>
                  <SelectItem value="snoop">🎤 Snoop Dogg</SelectItem>
                  <SelectItem value="amitabh">🎬 Amitabh Bachchan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={characterLanguage} onValueChange={setCharacterLanguage}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateCharacterText} disabled={loading} className="w-full bg-purple-500 hover:bg-purple-600 text-sm sm:text-base">
            {loading ? 'Channeling character...' : '🎭 Transform with Character'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Character Transformation:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'gamification') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Gamification Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to transform into an exciting game scenario..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Game Style</label>
              <Select value={gameStyle} onValueChange={setGameStyle}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quest">⚔️ Epic Quest</SelectItem>
                  <SelectItem value="mission">🎯 Secret Mission</SelectItem>
                  <SelectItem value="challenge">🏆 Ultimate Challenge</SelectItem>
                  <SelectItem value="adventure">🗺️ Adventure Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={gameLanguage} onValueChange={setGameLanguage}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateGameText} disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-sm sm:text-base">
            {loading ? 'Loading game...' : '🎮 Gamify Text'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Game Scenario:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'mythology') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            Mythology Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to transform into an epic mythological tale..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Mythology Style</label>
              <Select value={mythStyle} onValueChange={setMythStyle}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mahabharata">🕉️ Mahabharata/Ramayana</SelectItem>
                  <SelectItem value="norse">⚡ Norse Saga</SelectItem>
                  <SelectItem value="greek">🏛️ Greek Myth</SelectItem>
                  <SelectItem value="arabian">🌙 Arabian Nights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={mythLanguage} onValueChange={setMythLanguage}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateMythText} disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-sm sm:text-base">
            {loading ? 'Weaving legend...' : '👑 Create Mythological Tale'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Mythological Tale:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'ghost') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Ghost Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to rewrite with AI enhancement..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Writing Tone</label>
              <Select value={ghostTone} onValueChange={setGhostTone}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authoritative">💪 Strong & Authoritative</SelectItem>
                  <SelectItem value="poetic">🌙 Poetic & Dreamy</SelectItem>
                  <SelectItem value="friendly">😊 Friendly & Approachable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={ghostLanguage} onValueChange={setGhostLanguage}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateGhostEdit} disabled={loading} className="w-full bg-purple-500 hover:bg-purple-600 text-sm sm:text-base">
            {loading ? 'Enhancing text...' : '👻 Enhance with Ghost Editor'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Enhanced Text:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'haiku') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
            Haiku Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your thoughts to transform into a beautiful haiku..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Haiku Style</label>
              <Select value={haikuStyle} onValueChange={setHaikuStyle}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">🌸 Traditional (5-7-5)</SelectItem>
                  <SelectItem value="freestyle">🎨 Free-style</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={haikuLanguage} onValueChange={setHaikuLanguage}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateHaiku} disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600 text-sm sm:text-base">
            {loading ? 'Crafting haiku...' : '🌸 Generate Haiku'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Haiku:</p>
                <div className="text-sm sm:text-base mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded text-center italic font-serif">
                  {result}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'translate') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Languages className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Language Translator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to translate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm">
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
            <Button onClick={translateText} disabled={loading} className="flex-1 text-xs sm:text-sm">
              {loading ? 'Translating...' : 'Translate'}
            </Button>
          </div>
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Translation:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'zodiac') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            Zodiac Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={zodiacSign} onValueChange={setZodiacSign}>
            <SelectTrigger className="text-xs sm:text-sm">
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
          <Button onClick={getZodiacAdvice} disabled={loading} className="w-full text-xs sm:text-sm">
            {loading ? 'Consulting the stars...' : 'Get Today\'s Note Advice'}
          </Button>
          {zodiacAdvice && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Zodiac Note Advice:</p>
                <p className="text-xs sm:text-sm mt-2 italic whitespace-pre-wrap">{zodiacAdvice}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'sticker') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Smart Stickers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe what you're writing about to get sticker suggestions..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />
          <Button onClick={getStickerSuggestion} disabled={loading} className="w-full text-xs sm:text-sm">
            {loading ? 'Getting suggestions...' : 'Get Sticker Suggestion'}
          </Button>
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Suggested Sticker:</p>
                <Badge variant="secondary" className="text-lg sm:text-2xl mt-2">{result}</Badge>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'story') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            Story Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Words to Include</label>
              <Input
                placeholder="e.g., dragon, castle, adventure"
                value={storyWords}
                onChange={(e) => setStoryWords(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Scenario</label>
              <Input
                placeholder="e.g., medieval fantasy, space exploration"
                value={storyScenario}
                onChange={(e) => setStoryScenario(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
          <Button onClick={generateStory} disabled={loading} className="w-full text-xs sm:text-sm">
            {loading ? 'Creating story...' : 'Generate Story'}
          </Button>
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Generated Story:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm sm:text-base">Select an AI tool to get started!</p>
      </CardContent>
    </Card>
  );
}
