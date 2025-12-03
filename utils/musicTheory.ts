const SCALES = {
  SHARPS: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  FLATS:  ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
};

const CHORD_REGEX = /([A-G])(#|b)?(maj|min|m|sus|dim|aug|add|M)?(\d)?(\/[A-G](#|b)?)?/;

// Heuristic to detect if a line is a "chord line" or a "lyric line"
export const isChordLine = (line: string): boolean => {
  const trimmed = line.trim();
  if (trimmed.length === 0) return false;
  
  // Split by spaces to check tokens
  const tokens = trimmed.split(/\s+/);
  let chordCount = 0;

  tokens.forEach(token => {
    // Check if token looks like a chord
    if (CHORD_REGEX.test(token)) {
      chordCount++;
    }
  });

  // If more than 50% of tokens look like chords, or if strictly chords
  // (We use a loose threshold because "I" "A" "Am" can be words or chords)
  return (chordCount / tokens.length) > 0.4;
};

const getNoteIndex = (note: string) => {
  const sharpIndex = SCALES.SHARPS.indexOf(note);
  if (sharpIndex !== -1) return sharpIndex;
  return SCALES.FLATS.indexOf(note);
};

export const transposeChord = (chord: string, semitones: number): string => {
  // Regex to separate root from the rest (suffix, slash bass)
  // Matches: Root (A-G), accidental (#/b), and the rest
  const match = chord.match(/^([A-G])(#|b)?(.*)$/);
  
  if (!match) return chord;

  const root = match[1];
  const accidental = match[2] || '';
  const suffix = match[3] || '';
  
  const fullRoot = root + accidental;
  const index = getNoteIndex(fullRoot);

  if (index === -1) return chord; // Unknown chord root

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  // Decision: Use sharps or flats based on semi-random simple logic
  // Real implementation would depend on the target Key signature.
  // For simplicity, we default to sharps unless the original had flats, 
  // but here we just stick to Sharps for consistency in simple transposer.
  // Or cycle through SHARPS array.
  
  const newRoot = SCALES.SHARPS[newIndex];

  // Handle Slash chords (e.g., C/G)
  if (suffix.includes('/')) {
      const parts = suffix.split('/');
      const modifier = parts[0];
      const bass = parts[1];
      
      const bassMatch = bass.match(/^([A-G])(#|b)?$/);
      if (bassMatch) {
          const bassRoot = bassMatch[1] + (bassMatch[2] || '');
          const bassIndex = getNoteIndex(bassRoot);
          if (bassIndex !== -1) {
              let newBassIndex = (bassIndex + semitones) % 12;
              if (newBassIndex < 0) newBassIndex += 12;
              return `${newRoot}${modifier}/${SCALES.SHARPS[newBassIndex]}`;
          }
      }
      return `${newRoot}${suffix}`;
  }

  return `${newRoot}${suffix}`;
};

export const transposeLine = (line: string, semitones: number): string => {
  if (semitones === 0) return line;

  // We need to replace chords while preserving whitespace formatting.
  // We use a replacer function on words that look like chords.
  return line.replace(/[A-G](#|b)?(maj|min|m|sus|dim|aug|add|M)?(\d)?(\/[A-G](#|b)?)?/g, (match) => {
    // Determine if this specific match is likely a chord or a word (like "A" or "I" or "Am")
    // Since we already determined the *Line* is a chord line, we assume matches are chords.
    return transposeChord(match, semitones);
  });
};

export const transposeKey = (key: string, semitones: number): string => {
  return transposeChord(key, semitones);
};
