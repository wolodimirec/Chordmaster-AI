export const fetchSongChords = async (artist: string, title: string): Promise<SongData> => {
  try {
    const response = await fetch('/.netlify/functions/gemini-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artist, title }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch song chords');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chords:', error);
    throw error;
  }
};

export interface SongData {
  title: string;
  artist: string;
  chords: string;
  originalKey: string;
}
