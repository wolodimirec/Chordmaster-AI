import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { artist, title } = JSON.parse(event.body || '{}');
    
    if (!artist || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing artist or title in request body' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    const prompt = `Find the chords for the song "${title}" by ${artist}. Return only the chord progression in a simple text format.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch from Gemini API' }),
      };
    }

    const data = await response.json();
    const chords = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No chords found';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        artist,
        chords,
        originalKey: 'C',
      }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
