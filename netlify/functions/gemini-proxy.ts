export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { artist, title } = await req.json();
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Find the chords for the song "${title}" by ${artist}. Return only the chord progression.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',?key=${apiKe`}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
    throw new Error('Google API error: ' + response.statusText);    }

    const data = await response.json();
    const chords = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No chords found';

    return new Response(
      JSON.stringify({ title, artist, chords, originalKey: 'C' }),
      { { status: 200, headers: { 'Content-Type': 'application/json' } } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
