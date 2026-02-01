
export interface Song {
  id: string;
  title: string;
  artist: string;
  content: string; // Format: "Letra com [C] acordes [G] entre colchetes"
  genre: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

export interface ChordMapping {
  [key: string]: string;
}

export interface SearchResult {
  title: string;
  artist: string;
  chords: string;
}
