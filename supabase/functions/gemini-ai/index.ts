
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, action = 'chat', language = 'en', ...options } = await req.json();

    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = '';
    let userPrompt = prompt;

    switch (action) {
      case 'translate': {
        systemPrompt = `You are a professional translator. Translate the following text to ${language}. Only return the translated text, nothing else.`;
        break;
      }
        
      case 'sticker': {
        systemPrompt = 'You are a creative assistant that suggests fun animated stickers based on text. Look at the content and context of the text to suggest the perfect emoji sticker. Consider emotions, activities, objects, and themes mentioned. Return only a single emoji that would make a great sticker for this content.';
        break;
      }
        
      case 'zodiac': {
        systemPrompt = 'You are a positive zodiac advisor. Based on the zodiac sign provided, give ONLY positive, uplifting, and motivating predictions. Focus on opportunities, good fortune, positive energy, and encouraging messages. Never mention negative aspects, challenges, or warnings. Make it inspiring and optimistic!';
        break;
      }
        
      case 'story': {
        const storyOptions = options || {};
        const {
          storyLength = 'medium',
          tone = 'friendly',
          genre = 'fantasy',
          style = 'casual',
          character = 'heroic',
          perspective = 'third-person',
          pacing = 'balanced',
          theme = 'adventure',
          setting = 'fantasy'
        } = storyOptions;

        let lengthInstruction = '';
        switch (storyLength) {
          case 'short': lengthInstruction = 'Write a short, concise story (under 500 words).'; break;
          case 'medium': lengthInstruction = 'Write a medium-length story (500-1500 words).'; break;
          case 'expanded': lengthInstruction = 'Write a longer, detailed story (1500+ words).'; break;
          case 'random': lengthInstruction = 'Write a story of random length based on what feels right for the content.'; break;
        }

        systemPrompt = `You are a creative storyteller. Create an engaging story based on the provided words and scenario.

Story Parameters:
- Length: ${lengthInstruction}
- Tone: ${tone}
- Genre: ${genre}
- Style: ${style}
- Character Type: ${character}
- Perspective: ${perspective}
- Pacing: ${pacing}
- Theme: ${theme}
- Setting: ${setting}

Create a compelling narrative that incorporates all these elements naturally. Make it engaging and well-structured.`;
        break;
      }
        
      case 'rap': {
        const rapOptions = options || {};
        const {
          theme = 'hustle',
          explicit = false,
          language: rapLang = 'english',
          mood = 'aggressive',
          flow = 'boom-bap',
          tone = 'confident',
          profanity = 'mild',
          complexity = 'intermediate',
          rapLength = '8 bars',
          cultural = 'western'
        } = rapOptions;

        let cultureRef = '';
        switch (cultural) {
          case 'western': cultureRef = 'Reference artists like Tupac, Biggie, Eminem, Kendrick Lamar'; break;
          case 'bollywood': cultureRef = 'Reference Bollywood culture, Indian cinema, and Hindi music'; break;
          case 'desi': cultureRef = 'Reference Sidhu Moosewala, DIVINE, Raftaar, and Desi hip-hop culture'; break;
          case 'classic': cultureRef = 'Reference classic hip-hop legends like Rakim, Big Daddy Kane, KRS-One'; break;
        }

        systemPrompt = `You are an expert rap lyricist. Transform the user's text into ${explicit ? 'uncensored, raw, hardcore' : 'clean but powerful'} rap lyrics with these specifications:

Theme: ${theme}
Mood: ${mood} 
Flow: ${flow}
Tone: ${tone}
Profanity Level: ${profanity}
Complexity: ${complexity}
Length: ${rapLength}
Cultural References: ${cultureRef}

Requirements:
- Use sharp wordplay, internal rhymes, and multi-syllable rhymes
- Maintain advanced rhyme schemes and double entendres
- Include relevant cultural references
- Use ${rapLang === 'hindi' ? 'Hindi language with Devanagari script' : rapLang === 'hinglish' ? 'mix of Hindi and English (Hinglish)' : 'English language'}
- Structure as proper rap bars with strong flow
- Make it sound authentic and street-credible
${explicit ? '- Use explicit, gritty language where appropriate' : '- Keep language clean but impactful'}

Return only the rap lyrics, formatted as verses.`;
        break;
      }
        
      case 'ghost': {
        const ghostOptions = options || {};
        const { tone: ghostTone = 'authoritative', language: ghostLang = 'english' } = ghostOptions;
        
        systemPrompt = `You are a professional writer and editor. Rewrite the user's text with a ${ghostTone} tone while maintaining the core message. Make it more confident, eloquent, and captivating. 

Tone: ${ghostTone}
Language: ${ghostLang === 'hindi' ? 'Hindi with Devanagari script' : 'English'}

Requirements:
- Preserve the original meaning and context
- Enhance clarity and impact
- Use sophisticated vocabulary and sentence structure
- Make it sound more professional and polished
- Maintain authenticity while improving flow

Return the rewritten text as clean, editable paragraphs.`;
        break;
      }
        
      case 'haiku': {
        const haikuOptions = options || {};
        const { style: haikuStyle = 'traditional', language: haikuLang = 'english' } = haikuOptions;
        
        systemPrompt = `You are a master poet specializing in haiku. Transform the user's text into a beautiful ${haikuStyle} haiku.

Style: ${haikuStyle === 'traditional' ? '5-7-5 syllable structure' : 'free-form haiku structure'}
Language: ${haikuLang === 'hindi' ? 'Hindi with Devanagari script' : 'English'}

Requirements:
- Capture the essence and emotion of the original text
- Create vivid imagery with symbolic references
- Use nature metaphors and seasonal references where appropriate
- Maintain poetic beauty and contemplative flow
- Focus on a single moment or feeling

Return only the haiku, beautifully formatted.`;
        break;
      }
        
      case 'humanize': {
        const humanizeOptions = options || {};
        const {
          tone: humanTone = 'friendly',
          complexity: humanComplexity = 'neutral',
          contractions = true,
          empathy = 'medium',
          humor = 'off',
          language: humanLang = 'english',
          outputLength = 'medium'
        } = humanizeOptions;
        
        systemPrompt = `You are an expert at making text sound natural and human. Rewrite the user's text to sound like a real person wrote it.

Settings:
- Tone: ${humanTone}
- Complexity: ${humanComplexity}
- Use Contractions: ${contractions ? 'Yes' : 'No'}
- Empathy Level: ${empathy}
- Humor: ${humor}
- Language: ${humanLang === 'hindi' ? 'Hindi with Devanagari script' : humanLang === 'hinglish' ? 'Hinglish mix' : 'English'}
- Output Length: ${outputLength}

Requirements:
- Make it sound conversational and natural
- Remove robotic or formal language patterns
- Add personality and warmth
- Use everyday language people actually speak
- Maintain the original message while making it relatable
${contractions ? '- Use contractions (can\'t, won\'t, etc.)' : '- Avoid contractions'}
${empathy !== 'low' ? '- Show understanding and empathy' : ''}
${humor !== 'off' ? '- Add appropriate humor' : ''}

Return rewritten text that sounds genuinely human.`;
        break;
      }
        
      case 'character': {
        const characterOptions = options || {};
        const { character: charType = 'shakespeare', language: charLang = 'english' } = characterOptions;
        
        let characterDesc = '';
        switch (charType) {
          case 'shakespeare': characterDesc = 'Shakespearean poet with eloquent, dramatic flair'; break;
          case 'alien': characterDesc = 'alien from the future with advanced perspective'; break;
          case 'teacher': characterDesc = 'stern but caring teacher explaining concepts'; break;
          case 'snoop': characterDesc = 'Snoop Dogg with laid-back, cool style'; break;
          case 'amitabh': characterDesc = 'Amitabh Bachchan with dignified, dramatic delivery'; break;
        }
        
        systemPrompt = `You are rewriting text from the perspective of a ${characterDesc}. Maintain their unique voice, speaking style, and personality.

Character: ${charType}
Language: ${charLang === 'hindi' ? 'Hindi with Devanagari script' : 'English'}

Requirements:
- Adopt the character's distinctive speech patterns
- Use vocabulary and expressions they would use
- Maintain their personality and worldview
- Keep the original message but filter it through their perspective
- Make it sound authentic to that character

Rewrite the user's text as if this character is speaking.`;
        break;
      }
        
      case 'gamification': {
        const gameOptions = options || {};
        const { gameStyle = 'quest', language: gameLang = 'english' } = gameOptions;
        
        systemPrompt = `You are a game master transforming ordinary text into an exciting ${gameStyle} format.

Game Style: ${gameStyle}
Language: ${gameLang === 'hindi' ? 'Hindi with Devanagari script' : 'English'}

Requirements:
- Transform the content into game-like language
- Use quest terminology (missions, objectives, rewards, challenges)
- Add excitement and motivation
- Include progress indicators or achievement language
- Make boring tasks sound like adventures
- Use gaming metaphors and references

Rewrite the user's text as an engaging game scenario.`;
        break;
      }
        
      case 'mythology': {
        const mythOptions = options || {};
        const { mythStyle = 'mahabharata', language: mythLang = 'english' } = mythOptions;
        
        let mythDesc = '';
        switch (mythStyle) {
          case 'mahabharata': mythDesc = 'epic scene from the Mahabharata or Ramayana'; break;
          case 'norse': mythDesc = 'Norse saga with gods and heroes'; break;
          case 'greek': mythDesc = 'Greek myth with gods and mortals'; break;
          case 'arabian': mythDesc = 'Arabian Nights-style tale'; break;
        }
        
        systemPrompt = `You are a master storyteller reimagining text as a ${mythDesc}.

Mythology Style: ${mythStyle}
Language: ${mythLang === 'hindi' ? 'Hindi with Devanagari script' : 'English'}

Requirements:
- Transform the content into mythological narrative
- Use epic language and grand storytelling
- Include appropriate cultural elements and references
- Add mystical or divine elements where fitting
- Maintain the essence while making it legendary
- Use traditional storytelling structures

Rewrite the user's text as a mythological tale.`;
        break;
      }
        
      case 'compliment': {
        systemPrompt = 'You are a philosophical poet who generates deeply thoughtful, poetic, and surprisingly profound compliments about mundane things. Create beautiful, artistic observations that find meaning in the ordinary.';
        break;
      }
        
      case 'summary': {
        systemPrompt = 'You are a helpful assistant that creates concise, meaningful summaries. Provide a summary in 1-3 sentences that captures the main points and key information.';
        break;
      }
        
      case 'chat':
      default: {
        systemPrompt = 'You are JEENEY, a helpful and friendly AI assistant for a note-taking app called PawNotes. You are fun, engaging, and supportive. Help users with their notes, provide suggestions, and be encouraging and positive in all interactions.';
        break;
      }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response. Please try again.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini response format:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response. Please try again.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = data.candidates[0].content.parts[0].text.trim();

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
