import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

// Initialize the GoogleGenAI client.
// The API key is automatically read from the GEMINI_API_KEY environment variable
// which should be set in Netlify's environment settings.
const ai = new GoogleGenAI({});

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

    const prompt = `Find the chords for the song "${title}" by ${artist}. Return only the chord progression in a JSON format like this: {"chords": "C G Am F", "originalKey": "C"}. Do not include any other text or markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using a suitable model for structured output
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // The response text should be a JSON string as requested in the prompt
    const jsonResponse = JSON.parse(response.text.trim());
    const chords = jsonResponse.chords || 'No chords found';
    const originalKey = jsonResponse.originalKey || 'C';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        artist,
        chords,
        originalKey,
      }),
    };
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch song chords from API' }),
    };
  }
};

export { handler };
