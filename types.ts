export interface SongData {
  title: string;
  artist: string;
  originalKey: string;
  content: string; // The full text with chords and lyrics
  sources?: string[]; // URLs used for grounding
}

export interface TranspositionState {
  semitones: number;
}