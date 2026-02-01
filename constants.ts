
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
  'C#m': { frets: ['x', 4, 6, 6, 5, 4], barre: 4, baseFret: 4 },
  'Dbm': { frets: ['x', 4, 6, 6, 5, 4], barre: 4, baseFret: 4 },
  'Dm': { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  'D#m': { frets: ['x', 'x', 1, 3, 4, 2] },
  'Ebm': { frets: ['x', 'x', 1, 3, 4, 2] },
  'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  'Fm': { frets: [1, 3, 3, 1, 1, 1], barre: 1 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], barre: 2 },
  'Gbm': { frets: [2, 4, 4, 2, 2, 2], barre: 2 },
  'Gm': { frets: [3, 5, 5, 3, 3, 3], barre: 3 },
  'G#m': { frets: [4, 6, 6, 4, 4, 4], barre: 4, baseFret: 4 },
  'Abm': { frets: [4, 6, 6, 4, 4, 4], barre: 4, baseFret: 4 },
  'Am': { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  'A#m': { frets: ['x', 1, 3, 3, 2, 1], barre: 1 },
  'Bbm': { frets: ['x', 1, 3, 3, 2, 1], barre: 1 },
  'Bm': { frets: ['x', 2, 4, 4, 3, 2], barre: 2 },

  // SÉTIMAS
  'C7': { frets: ['x', 3, 2, 3, 1, 0] },
  'D7': { frets: ['x', 'x', 0, 2, 1, 2] },
  'E7': { frets: [0, 2, 0, 1, 0, 0] },
  'F7': { frets: [1, 3, 1, 2, 1, 1], barre: 1 },
  'G7': { frets: [3, 2, 0, 0, 0, 1] },
  'A7': { frets: ['x', 0, 2, 0, 2, 0] },
  'B7': { frets: ['x', 2, 1, 2, 0, 2] },
  'Bm7': { frets: ['x', 2, 4, 2, 3, 2], barre: 2 },
};

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  youtubeId?: string;
  rank?: string;
  imageUrl?: string;
  verified?: boolean;
}

export const TRENDING_SONGS: Partial<ExtendedSong>[] = [
  { rank: '01', title: 'Tempo Perdido', artist: 'Legião Urbana', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=50&h=50&fit=crop', verified: true },
  { rank: '02', title: 'Evidências', artist: 'Chitãozinho & Xororó', imageUrl: 'https://images.unsplash.com/photo-1459749411177-0421800673d6?w=50&h=50&fit=crop', verified: true },
  { rank: '03', title: 'Asa Branca', artist: 'Luiz Gonzaga', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=50&h=50&fit=crop', verified: true },
  { rank: '04', title: 'Hallelujah', artist: 'Leonard Cohen', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&h=50&fit=crop', verified: true },
  { rank: '05', title: 'Garota de Ipanema', artist: 'Tom Jobim', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50&h=50&fit=crop', verified: true },
];

export const MOCK_SONGS: ExtendedSong[] = [
  {
    id: '1',
    title: 'Tempo Perdido',
    artist: 'Legião Urbana',
    genre: 'Rock',
    difficulty: 'Fácil',
    tuning: 'E A D G B E',
    originalKey: 'C',
    intro: '[Intro] C Am Bm Em',
    content: `
[C] Todos os dias [Am] quando acordo
[Bm] Não tenho mais o [Em] tempo que passou
[C] Mas tenho muito [Am] tempo
[Bm] Temos todo o tempo do [Em] mundo

[C] Todos os dias [Am] antes de dormir
[Bm] Lembro e esqueço [Em] como foi o dia
[C] Sempre em [Am] frente
[Bm] Não temos tempo a per[Em]der

[C] Nosso suor sa[Am]grado
[Bm] É bem mais belo [Em] que esse sangue amargo
[C] E tão se[Am]rio e [Bm] tão cruel [Em]
[C] Sou um ani[Am]mal [Bm] sentimental [Em]
[C] Me perco a cada [Am] passo
[Bm] Me encontro em seu [Em] abraço

[C] Não me diga que [Am] tudo foi em vão
[Bm] Que o amor é uma [Em] ilusão
[C] Mas o [Am] tempo [Bm] passa sem pa[Em]rar
[C] E o deses[Am]pero [Bm] toma o seu lu[Em]gar
    `
  },
  {
    id: '6',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    tuning: 'E A D G B E',
    originalKey: 'E',
    intro: '[Intro] E G#m A B7',
    content: `
[E] Quando eu digo que deixei de te a[G#m]mar
É porque eu te [A] amo [B7]
[E] Quando eu digo que não quero mais te [G#m] ver
É porque eu te [A] quero [B7]

[A] Se eu digo que o amor já se aca[B7]bou
É porque ele apenas [E] começou
[A] Se eu finjo que não sinto [B7] nada
É porque eu sinto [E] tudo [B7]

[E] Chega de mentiras
[G#m] De negar o meu desejo
[A] Eu te quero mais que tudo
[B7] Eu preciso do seu beijo

[E] Eu entrego a minha vida
[G#m] Pra você fazer o que quiser
[A] Só não diga que não quer
[B7] O meu amor, a minha [E] fé
    `
  },
  {
    id: '3',
    title: 'Asa Branca',
    artist: 'Luiz Gonzaga',
    genre: 'MPB',
    difficulty: 'Fácil',
    tuning: 'E A D G B E',
    originalKey: 'G',
    intro: '[Intro] G C D G',
    content: `
[G] Quando olhei a terra ar[C]dendo
Qual fo[D]gueira de São Jo[G]ão
[G] Eu perguntei a [C] Deus do céu, uai
[D] Por que tamanha judi[G]ação

[G] Que brasa, que for[C]nalha
[D] Nem um pé de plan[G]tação
[G] Por falta d'água per[C]di meu gado
[D] Morreu de sede meu [G] alazão

[G] Até mesmo a asa [C] branca
[D] Bateu asas do ser[G]tão
[G] Então eu disse, adeus [C] Rosinha
[D] Guarda contigo meu cora[G]ção
    `
  }
];

export const POPULAR_ARTISTS = [
  { name: 'Legião Urbana', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=120&h=120&fit=crop' },
  { name: 'Tom Jobim', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop' },
  { name: 'Rick e Renner', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=120&h=120&fit=crop' },
];
