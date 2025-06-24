
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'Image generation service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image. Please try again.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.data?.[0]?.b64_json) {
      console.error('Unexpected OpenAI response format:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image. Please try again.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageData = `data:image/png;base64,${data.data[0].b64_json}`;

    return new Response(JSON.stringify({ image: imageData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in image-generator function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
