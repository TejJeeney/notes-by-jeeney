import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Languages, BookOpen, Star, Sparkles, Mic, Edit3, Coffee, Users, Crown, Shuffle, Flame, Skull, Heart, Zap, Shield } from 'lucide-react';
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
  
  // Story Generator enhanced states
  const [storyLength, setStoryLength] = useState('medium');
  const [storyTone, setStoryTone] = useState('friendly');
  const [storyGenre, setStoryGenre] = useState('fantasy');
  const [storyStyle, setStoryStyle] = useState('casual');
  const [storyCharacter, setStoryCharacter] = useState('heroic');
  const [storyPerspective, setStoryPerspective] = useState('third-person');
  const [storyPacing, setStoryPacing] = useState('balanced');
  const [storyTheme, setStoryTheme] = useState('adventure');
  const [storySetting, setStorySetting] = useState('fantasy');
  
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
  
  // Mythology states
  const [mythStyle, setMythStyle] = useState('mahabharata');
  const [mythLanguage, setMythLanguage] = useState('english');

  // Dark Roast Mode states
  const [roastLevel, setRoastLevel] = useState('mild');
  const [roastLanguage, setRoastLanguage] = useState('english');

  // Unfiltered Mode states
  const [unfilteredVibe, setUnfilteredVibe] = useState('dark-humor');
  const [unfilteredLanguage, setUnfilteredLanguage] = useState('english');

  // AI Confession Booth states
  const [confessionPersona, setConfessionPersona] = useState('therapist');
  const [confessionLanguage, setConfessionLanguage] = useState('english');

  // Anarchy Generator states
  const [anarchyLanguage, setAnarchyLanguage] = useState('english');

  // Toxic Text Filter states
  const [toxicResponseVibe, setToxicResponseVibe] = useState('petty');
  const [toxicLanguage, setToxicLanguage] = useState('english');

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

  const randomizeStorySettings = () => {
    const lengths = ['short', 'medium', 'expanded'];
    const tones = ['friendly', 'brutal', 'romantic', 'adventurous', 'mysterious', 'humorous', 'dark', 'optimistic', 'cynical'];
    const genres = ['fantasy', 'sci-fi', 'mystery', 'historical', 'horror', 'drama', 'fairytale', 'slice-of-life'];
    const styles = ['formal', 'casual', 'poetic', 'minimalistic', 'descriptive', 'dialogue-heavy'];
    const characters = ['heroic', 'villainous', 'anti-hero', 'relatable', 'unlikely-hero'];
    const perspectives = ['first-person', 'second-person', 'third-limited', 'third-omniscient'];
    const pacings = ['fast-paced', 'slow-burn', 'balanced'];
    const themes = ['coming-of-age', 'love', 'justice', 'survival', 'betrayal', 'revenge'];
    const settings = ['urban', 'rural', 'fantasy', 'dystopian', 'historical', 'surreal'];
    
    setStoryLength(lengths[Math.floor(Math.random() * lengths.length)]);
    setStoryTone(tones[Math.floor(Math.random() * tones.length)]);
    setStoryGenre(genres[Math.floor(Math.random() * genres.length)]);
    setStoryStyle(styles[Math.floor(Math.random() * styles.length)]);
    setStoryCharacter(characters[Math.floor(Math.random() * characters.length)]);
    setStoryPerspective(perspectives[Math.floor(Math.random() * perspectives.length)]);
    setStoryPacing(pacings[Math.floor(Math.random() * pacings.length)]);
    setStoryTheme(themes[Math.floor(Math.random() * themes.length)]);
    setStorySetting(settings[Math.floor(Math.random() * settings.length)]);
    
    toast.success('Story settings randomized!');
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
      toast.success('Your positive zodiac energy is ready!');
    }
  };

  const generateStory = async () => {
    if (!storyWords.trim() || !storyScenario.trim()) {
      toast.error('Please enter both words and scenario');
      return;
    }

    const storyPrompt = `Create a story using these words: ${storyWords} in this scenario: ${storyScenario}`;
    const story = await callGeminiAI(storyPrompt, 'story', {
      storyLength,
      tone: storyTone,
      genre: storyGenre,
      style: storyStyle,
      character: storyCharacter,
      perspective: storyPerspective,
      pacing: storyPacing,
      theme: storyTheme,
      setting: storySetting
    });
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

  // New AI Feature Functions
  const generateRoast = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to roast');
      return;
    }

    const roast = await callGeminiAI(prompt, 'roast', {
      roastLevel: roastLevel,
      language: roastLanguage
    });
    
    if (roast) {
      setResult(roast);
      toast.success('Savage roast delivered! 🔥');
    }
  };

  const generateUnfiltered = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to unleash');
      return;
    }

    const unfiltered = await callGeminiAI(prompt, 'unfiltered', {
      vibe: unfilteredVibe,
      language: unfilteredLanguage
    });
    
    if (unfiltered) {
      setResult(unfiltered);
      toast.success('Beast unleashed! 💀');
    }
  };

  const generateConfession = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter your confession');
      return;
    }

    const confession = await callGeminiAI(prompt, 'confession', {
      persona: confessionPersona,
      language: confessionLanguage
    });
    
    if (confession) {
      setResult(confession);
      toast.success('Confession heard and responded to 🧠');
    }
  };

  const generateAnarchy = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to anarchize');
      return;
    }

    const anarchy = await callGeminiAI(prompt, 'anarchy', {
      language: anarchyLanguage
    });
    
    if (anarchy) {
      setResult(anarchy);
      toast.success('Creative chaos unleashed! 🧷');
    }
  };

  const generateToxicFilter = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to analyze and respond to');
      return;
    }

    const toxicResponse = await callGeminiAI(prompt, 'toxic', {
      responseVibe: toxicResponseVibe,
      language: toxicLanguage
    });
    
    if (toxicResponse) {
      setResult(toxicResponse);
      toast.success('Toxicity disarmed! 📱');
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

  if (selectedTool === 'roast') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            Dark Roast Mode (Savage Rewrite)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="🔥 Enter your note to get brutally roasted..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Roast Level</label>
              <Select value={roastLevel} onValueChange={setRoastLevel}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select roast level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">😏 Mild Roast - Light jabs, passive-aggressive</SelectItem>
                  <SelectItem value="gordon">🔥 Gordon Ramsay Mode - Insanely harsh chef fury</SelectItem>
                  <SelectItem value="tejas">💀 Tejas-VE - Darkly funny, edgy, no filters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={roastLanguage} onValueChange={setRoastLanguage}>
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
          
          <Button onClick={generateRoast} disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-sm sm:text-base">
            {loading ? 'Preparing roast...' : '🔥 Roast This Like Your Worst Enemy\'s Diary'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Savage Roast:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-red-50 dark:bg-red-900/20 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'unfiltered') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Skull className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            Unfiltered Mode (NSFW Toggle)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="🎤 Enter text to unleash with zero filters - raw, unhinged, uncensored..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Vibe</label>
              <Select value={unfilteredVibe} onValueChange={setUnfilteredVibe}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select vibe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark-humor">😈 Dark Humor - Ruthless comedy, no boundaries</SelectItem>
                  <SelectItem value="street-talk">🏙️ Street Talk - Hood-style lingo with hard bars</SelectItem>
                  <SelectItem value="thug-poetry">🎭 Thug Poetry - Gritty, lyrical aggression</SelectItem>
                  <SelectItem value="no-mercy">💀 No Mercy - Pure savage, no empathy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={unfilteredLanguage} onValueChange={setUnfilteredLanguage}>
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
          
          <Button onClick={generateUnfiltered} disabled={loading} className="w-full bg-gray-700 hover:bg-gray-800 text-sm sm:text-base">
            {loading ? 'Unleashing beast...' : '🔓 Unleash The Beast - Zero Filters'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Unfiltered Output:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'confession') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
            AI Confession Booth
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="💬 This is a safe space. Share your confession, guilty pleasure, or intrusive thought..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Persona</label>
              <Select value={confessionPersona} onValueChange={setConfessionPersona}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="therapist">🧠 Therapist AI - Supportive, gentle validation</SelectItem>
                  <SelectItem value="priest">⛪ Mafia Priest - Mysterious, dramatic absolution</SelectItem>
                  <SelectItem value="judge">⚖️ Satirical Judge - Witty, sarcastic commentary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={confessionLanguage} onValueChange={setConfessionLanguage}>
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
          
          <Button onClick={generateConfession} disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600 text-sm sm:text-base">
            {loading ? 'Listening...' : '🎭 Confess & Receive Guidance'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Response from your chosen guide:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-pink-50 dark:bg-pink-900/20 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'anarchy') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            Anarchy Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="🧨 Enter text to unleash creative chaos - glitch logic, rearrange words, poetic irony..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
            <Select value={anarchyLanguage} onValueChange={setAnarchyLanguage}>
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">🇺🇸 English</SelectItem>
                <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={generateAnarchy} disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-sm sm:text-base">
            {loading ? 'Creating chaos...' : '🎨 Unleash Creative Chaos & Rogue Genius'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Chaotic Creation:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'toxic') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Toxic Text Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="🧪 Enter message to analyze for toxicity and get a powerful clapback response..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Response Vibe</label>
              <Select value={toxicResponseVibe} onValueChange={setToxicResponseVibe}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select response vibe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petty">💅 Petty Clapback - Sassy, smart, just enough drama</SelectItem>
                  <SelectItem value="silent-killer">🧊 Silent Killer - Ice-cold, intellectual, deadly polite</SelectItem>
                  <SelectItem value="queen">👑 Queen Energy - Empowered, iconic, emotionally superior</SelectItem>
                  <SelectItem value="zero-bs">⚡ Zero BS - Direct, raw, bulletproof truth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
              <Select value={toxicLanguage} onValueChange={setToxicLanguage}>
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
          
          <Button onClick={generateToxicFilter} disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-sm sm:text-base">
            {loading ? 'Analyzing & crafting response...' : '🛡️ Analyze & Deliver Power Clapback'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Power Response:</p>
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-blue-50 dark:bg-blue-900/20 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedTool === 'story') {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            Advanced Story Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <h3 className="text-sm sm:text-base font-semibold">Story Settings</h3>
            <Button 
              onClick={randomizeStorySettings} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              Randomize All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Length</label>
              <Select value={storyLength} onValueChange={setStoryLength}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">📝 Short (under 500 words)</SelectItem>
                  <SelectItem value="medium">📖 Medium (500-1500 words)</SelectItem>
                  <SelectItem value="expanded">📚 Expanded (1500+ words)</SelectItem>
                  <SelectItem value="random">🎲 Random Length</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Tone/Emotion</label>
              <Select value={storyTone} onValueChange={setStoryTone}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">😊 Friendly</SelectItem>
                  <SelectItem value="brutal">⚔️ Brutal</SelectItem>
                  <SelectItem value="romantic">💕 Romantic</SelectItem>
                  <SelectItem value="adventurous">🏃 Adventurous</SelectItem>
                  <SelectItem value="mysterious">🔍 Mysterious</SelectItem>
                  <SelectItem value="humorous">😂 Humorous</SelectItem>
                  <SelectItem value="dark">🌑 Dark</SelectItem>
                  <SelectItem value="optimistic">🌟 Optimistic</SelectItem>
                  <SelectItem value="cynical">🤨 Cynical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Genre</label>
              <Select value={storyGenre} onValueChange={setStoryGenre}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                  <SelectItem value="sci-fi">🚀 Sci-Fi</SelectItem>
                  <SelectItem value="mystery">🔍 Mystery/Thriller</SelectItem>
                  <SelectItem value="historical">📜 Historical Fiction</SelectItem>
                  <SelectItem value="horror">👻 Horror</SelectItem>
                  <SelectItem value="drama">🎭 Drama</SelectItem>
                  <SelectItem value="fairytale">🏰 Fairy Tale</SelectItem>
                  <SelectItem value="slice-of-life">☕ Slice of Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Style</label>
              <Select value={storyStyle} onValueChange={setStoryStyle}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">🎩 Formal</SelectItem>
                  <SelectItem value="casual">👕 Casual</SelectItem>
                  <SelectItem value="poetic">🌸 Poetic</SelectItem>
                  <SelectItem value="minimalistic">⚪ Minimalistic</SelectItem>
                  <SelectItem value="descriptive">🖼️ Descriptive</SelectItem>
                  <SelectItem value="dialogue-heavy">💬 Dialogue-heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Character Type</label>
              <Select value={storyCharacter} onValueChange={setStoryCharacter}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heroic">🦸 Heroic</SelectItem>
                  <SelectItem value="villainous">🦹 Villainous</SelectItem>
                  <SelectItem value="anti-hero">😈 Anti-Hero</SelectItem>
                  <SelectItem value="relatable">👤 Relatable</SelectItem>
                  <SelectItem value="unlikely-hero">🤔 Unlikely Hero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Perspective</label>
              <Select value={storyPerspective} onValueChange={setStoryPerspective}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-person">👁️ First Person</SelectItem>
                  <SelectItem value="second-person">👆 Second Person</SelectItem>
                  <SelectItem value="third-limited">👁️‍🗨️ Third Person Limited</SelectItem>
                  <SelectItem value="third-omniscient">🔮 Third Person Omniscient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Pacing</label>
              <Select value={storyPacing} onValueChange={setStoryPacing}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast-paced">⚡ Fast-paced</SelectItem>
                  <SelectItem value="slow-burn">🔥 Slow Burn</SelectItem>
                  <SelectItem value="balanced">⚖️ Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Theme</label>
              <Select value={storyTheme} onValueChange={setStoryTheme}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventure">🗺️ Adventure</SelectItem>
                  <SelectItem value="coming-of-age">🌱 Coming-of-age</SelectItem>
                  <SelectItem value="love">💖 Love/Heartbreak</SelectItem>
                  <SelectItem value="justice">⚖️ Justice</SelectItem>
                  <SelectItem value="survival">🏕️ Survival</SelectItem>
                  <SelectItem value="betrayal">🗡️ Betrayal</SelectItem>
                  <SelectItem value="revenge">💀 Revenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Setting</label>
              <Select value={storySetting} onValueChange={setStorySetting}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">🏙️ Urban</SelectItem>
                  <SelectItem value="rural">🌾 Rural</SelectItem>
                  <SelectItem value="fantasy">🏰 Fantasy World</SelectItem>
                  <SelectItem value="dystopian">🌆 Dystopian</SelectItem>
                  <SelectItem value="historical">📜 Historical</SelectItem>
                  <SelectItem value="surreal">🌀 Surreal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateStory} disabled={loading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base">
            {loading ? 'Creating story...' : '📚 Generate Advanced Story'}
          </Button>
          
          {result && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Generated Story:</p>
                <div className="text-xs sm:text-sm mt-2 whitespace-pre-wrap max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  {result}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
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
        <CardContent className="space-y-4 sm:space-y-6">
          <Textarea
            placeholder="Enter your text to transform into fire rap lyrics..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
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
                <pre className="text-xs sm:text-sm mt-2 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">{result}</pre>
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
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
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
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
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
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">{result}</p>
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
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
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
                <p className="text-xs sm:text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded">{result}</p>
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
            Zodiac Positive Energy
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
            {loading ? 'Channeling positive energy...' : '✨ Get Your Positive Zodiac Energy'}
          </Button>
          {zodiacAdvice && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm font-medium">Your Positive Zodiac Energy:</p>
                <p className="text-xs sm:text-sm mt-2 italic whitespace-pre-wrap bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded">{zodiacAdvice}</p>
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
            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-base"
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
