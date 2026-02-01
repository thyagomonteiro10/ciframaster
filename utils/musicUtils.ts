
import { CHROMATIC_SCALE } from '../constants';

export const transposeChord = (chord: string, semitones: number): string => {
  if (semitones === 0) return chord;

  // Regex for extracting the root note (e.g., C#, Ab, G)
  const chordRegex = /^([A-G][#b]?)(.*)/;
  const match = chord.match(chordRegex);

  if (!match) return chord;

  let root = match[1];
  const suffix = match[2];

  // Normalize root (convert flats to sharps for simplicity in our scale)
  const normalization: { [key: string]: string } = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
    'Cb': 'B', 'Fb': 'E'
  };
  
  const normalizedRoot = normalization[root] || root;
  const index = CHROMATIC_SCALE.indexOf(normalizedRoot);

  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return CHROMATIC_SCALE[newIndex] + suffix;
};

export const transposeContent = (content: string, semitones: number): string => {
  return content.replace(/\[(.*?)\]/g, (match, chord) => {
    return `[${transposeChord(chord, semitones)}]`;
  });
};
