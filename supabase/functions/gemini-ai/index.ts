
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
    const { prompt, action = 'chat', language = 'en' } = await req.json();

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
      case 'translate':
        systemPrompt = `You are a professional translator. Translate the following text to ${language}. Only return the translated text, nothing else.`;
        break;
      case 'sticker':
        systemPrompt = 'You are a creative assistant that suggests fun animated stickers based on text. Respond with a single emoji that would make a good sticker for the given text. Only return the emoji, nothing else.';
        break;
      case 'zodiac':
        systemPrompt = 'You are a fun zodiac advisor for note-taking. Based on the zodiac sign provided, give a quirky and humorous advice about how to write notes today. Be creative and entertaining!';
        break;
      case 'story':
        systemPrompt = 'You are a creative storyteller. Create an engaging, imaginative story based on the words and scenario provided. Make it interesting and fun to read.';
        break;
      case 'compliment':
        systemPrompt = 'You are a philosophical poet who generates deeply thoughtful, poetic, and surprisingly profound compliments about mundane things. Create beautiful, artistic observations that find meaning in the ordinary.';
        break;
      case 'summary':
        systemPrompt = 'You are a helpful assistant that creates concise, meaningful summaries. Provide a summary in 1-3 sentences that captures the main points and key information.';
        break;
      case 'chat':
      default:
        systemPrompt = 'You are a helpful AI assistant for a note-taking app called PawNotes. Help users with their notes, provide suggestions, and be friendly and encouraging.';
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
