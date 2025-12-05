export const fetchSongChords = async (artist: string, title: string): Promise<SongData> => {
  try {
    // Call the Netlify Function instead of directly calling Google API
    const response = await fetch('/.netlify/functions/get-chords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artist, title })
    });

    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    
    return {
      title: data.title,
      artist: data.artist,
      chords: data.chords,
      originalKey: data.originalKey
    };
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
