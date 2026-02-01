
import { Song } from './types';

export const CHROMATIC_SCALE = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export interface ChordShape {
  frets: (number | 'x')[];
  fingers?: number[];
  barre?: number;
  baseFret?: number;
}

export const CHORD_SHAPES: Record<string, ChordShape> = {
  // MAIORES
  'C': { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  'C#': { frets: ['x', 4, 6, 6, 6, 4], barre: 4, baseFret: 4 },
  'Db': { frets: ['x', 4, 6, 6, 6, 4], barre: 4, baseFret: 4 },
  'D': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  'D#': { frets: ['x', 6, 8, 8, 8, 6], barre: 6, baseFret: 6 },
  'Eb': { frets: ['x', 6, 8, 8, 8, 6], barre: 6, baseFret: 6 },
  'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  'F': { frets: [1, 3, 3, 2, 1, 1], barre: 1 },
  'F#': { frets: [2, 4, 4, 3, 2, 2], barre: 2 },
  'Gb': { frets: [2, 4, 4, 3, 2, 2], barre: 2 },
  'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
  'G#': { frets: [4, 6, 6, 5, 4, 4], barre: 4, baseFret: 4 },
  'Ab': { frets: [4, 6, 6, 5, 4, 4], barre: 4, baseFret: 4 },
  'A': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  'A#': { frets: ['x', 1, 3, 3, 3, 1], barre: 1 },
  'Bb': { frets: ['x', 1, 3, 3, 3, 1], barre: 1 },
  'B': { frets: ['x', 2, 4, 4, 4, 2], barre: 2 },
  // ... (Outros acordes menores e sétimas continuam os mesmos)
  'Cm': { frets: ['x', 3, 5, 5, 4, 3], barre: 3, baseFret: 3 },
  'Dm': { frets: ['x', 'x', 0, 2, 3, 1] },
  'Em': { frets: [0, 2, 2, 0, 0, 0] },
  'Am': { frets: ['x', 0, 2, 2, 1, 0] },
  'Bm': { frets: ['x', 2, 4, 4, 3, 2], barre: 2 },
};

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
  rank?: string;
}

export const POPULAR_ARTISTS = [
  { name: 'Ana Castela', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=200&h=200&fit=crop' },
  { name: 'Henrique & Juliano', imageUrl: 'https://images.unsplash.com/photo-1514525253344-f251357ad165?w=200&h=200&fit=crop' },
  { name: 'Gusttavo Lima', imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&h=200&fit=crop' },
  { name: 'Marília Mendonça', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop' },
  { name: 'Jorge & Mateus', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop' },
  { name: 'Luan Santana', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop' },
  { name: 'Simone Mendes', imageUrl: 'https://images.unsplash.com/photo-1459749411177-0421800673d6?w=200&h=200&fit=crop' },
  { name: 'Zé Neto & Cristiano', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=200&fit=crop' },
  { name: 'Maiara & Maraisa', imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&h=200&fit=crop' },
  { name: 'Tião Carreiro', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=200&fit=crop' },
];

export const TOP_SONGS = [
  { rank: '1', title: 'Erro Gostoso', artist: 'Simone Mendes' },
  { rank: '2', title: 'Solteiro Forçado', artist: 'Ana Castela' },
  { rank: '3', title: 'Liberdade Provisória', artist: 'Henrique & Juliano' },
  { rank: '4', title: 'Haverá Sinais', artist: 'Jorge & Mateus' },
  { rank: '5', title: 'Oi Balde', artist: 'Zé Neto & Cristiano' },
];

export const MOCK_SONGS: ExtendedSong[] = []; // Inicia vazio para priorizar busca web
