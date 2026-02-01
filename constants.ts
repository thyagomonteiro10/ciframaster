
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
  // MENORES
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

export const MUSIC_ICONS = [
  { name: 'Michael Jackson', imageUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop' },
  { name: 'Bob Marley', imageUrl: 'https://images.unsplash.com/photo-1548126466-4470dfd3a209?w=400&h=400&fit=crop' },
  { name: 'Freddie Mercury', imageUrl: 'https://images.unsplash.com/photo-1593011361956-2e99e4f575c3?w=400&h=400&fit=crop' },
  { name: 'Amy Winehouse', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { name: 'Tim Maia', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop' },
  { name: 'Elvis Presley', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop' },
  { name: 'David Bowie', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=400&h=400&fit=crop' },
  { name: 'Kurt Cobain', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop' },
  { name: 'Janis Joplin', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { name: 'Jimi Hendrix', imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop' },
  { name: 'Madonna', imageUrl: 'https://images.unsplash.com/photo-1514525253344-f251357ad165?w=400&h=400&fit=crop' },
  { name: 'Tom Jobim', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { name: 'Legião Urbana', imageUrl: 'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=400&h=400&fit=crop' },
  { name: 'The Beatles', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { name: 'Elis Regina', imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop' },
];

export const POPULAR_ARTISTS = MUSIC_ICONS.slice(0, 8);

export const TOP_SONGS = [
  { rank: '1', title: 'Erro Gostoso', artist: 'Simone Mendes' },
  { rank: '2', title: 'Solteiro Forçado', artist: 'Ana Castela' },
  { rank: '3', title: 'Liberdade Provisória', artist: 'Henrique & Juliano' },
  { rank: '4', title: 'Haverá Sinais', artist: 'Jorge & Mateus' },
  { rank: '5', title: 'Tempo Perdido', artist: 'Legião Urbana' },
  { rank: '6', title: 'Hallelujah', artist: 'Gabriela Rocha' },
  { rank: '7', title: 'Evidências', artist: 'Chitãozinho & Xororó' },
  { rank: '8', title: 'Bohemian Rhapsody', artist: 'Queen' },
  { rank: '9', title: 'A Casa É Sua', artist: 'Casa Worship' },
  { rank: '10', title: 'Oceanos', artist: 'Ana Nóbrega' },
  { rank: '11', title: 'Lanterna dos Afogados', artist: 'Paralamas do Sucesso' },
  { rank: '12', title: 'Metamorfose Ambulante', artist: 'Raul Seixas' },
  { rank: '13', title: 'Como É Grande o Meu Amor Por Você', artist: 'Roberto Carlos' },
  { rank: '14', title: 'Pais e Filhos', artist: 'Legião Urbana' },
  { rank: '15', title: 'Amarelo, Azul e Branco', artist: 'ANAVITÓRIA' },
];

export const MOCK_SONGS: ExtendedSong[] = [];
