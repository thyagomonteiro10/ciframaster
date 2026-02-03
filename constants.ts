
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

export const INSTRUMENT_CHORDS: Record<string, Record<string, ChordShape>> = {
  'Violão': {
    'C': { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    'D': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    'F': { frets: [1, 3, 3, 2, 1, 1], barre: 1 },
    'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
    'A': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    'B': { frets: ['x', 2, 4, 4, 4, 2], barre: 2 },
    'Am': { frets: ['x', 0, 2, 2, 1, 0] },
    'Dm': { frets: ['x', 'x', 0, 2, 3, 1] },
    'Em': { frets: [0, 2, 2, 0, 0, 0] },
  },
  'Ukulele': {
    'C': { frets: [0, 0, 0, 3] },
    'D': { frets: [2, 2, 2, 0] },
    'E': { frets: [4, 4, 4, 2], baseFret: 1 },
    'F': { frets: [2, 0, 1, 0] },
    'G': { frets: [0, 2, 3, 2] },
    'A': { frets: [2, 1, 0, 0] },
    'B': { frets: [4, 3, 2, 2], barre: 2 },
    'Am': { frets: [2, 0, 0, 0] },
  }
};

INSTRUMENT_CHORDS['Guitarra'] = INSTRUMENT_CHORDS['Violão'];

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
  capo?: number;
  isPublic?: boolean;
  author?: string;
}

export const COMMUNITY_SONGS: ExtendedSong[] = [
  {
    id: 'pub-1',
    title: 'Tempo Perdido',
    artist: 'Legião Urbana',
    genre: 'Rock',
    difficulty: 'Médio',
    isPublic: true,
    author: 'Pedro Rocha',
    content: `Tom: [C]

[Intro] [C] [Am] [F] [G]

[C]
Todos os dias quando acordo
[Am]
Não tenho mais o tempo que passou
[F]
Mas tenho muito tempo
[G]
Temos todo o tempo do mundo`
  },
  {
    id: 'pub-2',
    title: 'O Sol',
    artist: 'Vitor Kley',
    genre: 'Pop',
    difficulty: 'Fácil',
    isPublic: true,
    author: 'Ana Paula',
    content: `Tom: [G]

[G]
Ô Sol, vê se não esquece
[D]
E me ilumina
[Em]
Preciso de você aqui
[C]
Ô Sol`
  }
];

const ZEZE_IMG = 'https://images.unsplash.com/photo-1521417531039-75e91486cc40?w=400&h=400&fit=crop';
const RICK_RENNER_IMG = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop';

export const RICK_RENNER_SONGS: ExtendedSong[] = [
  {
    id: 'rick-demais',
    title: 'Ela É Demais',
    artist: 'Rick & Renner',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: RICK_RENNER_IMG,
    verified: true,
    content: `Tom: [F]

[Intro]
[F] [Dm] [Bb] [C] [F]

[Primeira Parte]

[F]              [Dm]
Ela tem um jeito lindo de me olhar nos olhos
[Bb]
Me despertando sonhos
[C]      [Bb] [C]
Loucuras de amor
[F]              [Dm]
Ela tem um jeito doce de tocar meu corpo
[Bb]
Que me deixa louco
[C]      [Bb] [C]
Um louco sonhador

[Refrão]

[F]      [Dm]     [Bb]
Uma Deusa, uma louca, uma feiticeira
[C]      [F]
 Ela é demais
[F]      [Dm]     [Bb]
 Quando beija a minha boca e se entrega inteira
 [C]      [F]
 Meu Deus ela é demais`
  }
];

export const JULIANY_SOUZA_SONGS: ExtendedSong[] = [
  {
    id: 'juliany-1',
    title: 'Quem É Esse?',
    artist: 'Juliany Souza',
    genre: 'Gospel',
    difficulty: 'Médio',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    content: `Tom: [E]

[Intro] [A2] [B2] [C#m7] [G#m7(11)]

[Primeira Parte]

[A2]
Eu me deparei
[B2]
Com aquele cenário ensurdecedor
[G#m7(11)]
Com o dedo no chão
[C#m7]
Ouvindo em fariseus o duro falar`
  }
];

export const ZEZE_SONGS: ExtendedSong[] = [
  {
    id: 'zeze-e-o-amor',
    title: 'É o Amor',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    verified: true,
    content: `Tom: [A]

[Intro] [A] [E] [D] [E] [A]

[Primeira Parte]

[A]
Eu não vou negar que sou louco por você
[E]
Tô carente, tô sozinho, precisando te ver
[D]
Já tentei de tudo pra te esquecer
[E]
Mas no fundo eu sei que não dá pra viver sem você`
  }
];
