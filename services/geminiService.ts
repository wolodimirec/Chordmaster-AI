export const fetchSongChords = async (artist: string, title: string): Promise<SongData> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `Find the chords for the song "${title}" by ${artist}. Return only the chord progression.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    const chords = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No chords found';

    return { title, artist, chords, originalKey: 'C' };
  } catch (error) {
    throw new Error('Failed to fetch song chords');
  }
};

export interface SongData {
  title: string;
  artist: string;
  chords: string;
  originalKey: string;
}
