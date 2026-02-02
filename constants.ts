
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
  // COMPLEXOS
  'G#m7': { frets: [4, 6, 4, 4, 4, 4], barre: 4, baseFret: 4 },
  'C#m7': { frets: ['x', 4, 6, 4, 5, 4], barre: 4, baseFret: 4 },
  'F#m7': { frets: [2, 4, 2, 2, 2, 2], barre: 2, baseFret: 2 },
  'B7': { frets: ['x', 2, 1, 2, 0, 2] },
};

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
}

export const ZEZE_SONGS: ExtendedSong[] = [
  {
    id: 'zeze-1',
    title: 'É o Amor',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    tuning: 'Padrão',
    originalKey: 'G',
    verified: true,
    content: `[Intro]
e|-------3-------3-------3-------3---|
B|-----3---3---3---3---3---3---3---3-|
G|---0-------0-------0-------0-------|
D|-----------------------------------|
A|-----------------------------------|
E|-3---------------------------------|

[G] Eu não vou negar que sou louco por vo[D]cê
Tô mo[Am]rendo de saudades, sem sa[C]ber o que fa[G]zer
Eu não vou negar que eu [D]sou o seu a[Em]migo
Mas eu [Am]quero ser bem mais do que um a[C]migo pra vo[D]cê

[G] Eu não vou negar que a vida é sem gra[D]ça
Sem o [Am]brilho dos seus olhos, sem o [C]gosto do seu [G]beijo
Eu não vou negar que eu [D]sou o seu es[Em]cravo
Mas eu [Am]quero ser bem mais do que um es[C]cravo pra vo[D]cê

[G] É o amor, que meche com minha ca[D]beça e me deixa as[Am]sim
Que faz eu pensar em vo[C]cê e esque[D]cer de [G]mim
Que faz eu esquecer que a vida é feita pra vi[D]ver
Que faz eu acreditar que eu [Am]posso ser fe[C]liz
A[D]mando vo[G]cê`
  },
  {
    id: 'zeze-2',
    title: 'No Dia em que Eu Saí de Casa',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    tuning: 'Padrão',
    originalKey: 'C',
    verified: true,
    content: `[Intro]
e|-------0-1-0-----------------------|
B|---1-3-------3-1-0-1---------------|
G|-0---------------------------------|
D|-----------------------------------|
A|-----------------------------------|
E|-----------------------------------|

No [C]dia em que eu saí de ca[G]sa
Minha [F]mãe me disse: Fi[C]lho, vem cá
Pas[F]sou a mão em meus ca[C]belos
Olhou em meus [G]olhos e começou fa[C]lar

[C]O mundo é grande e o cami[G]nho é deserto
Mas [F]Deus estará sempre per[C]to
Aon[F]de quer que vo[C]cê vá
Olhou em meus [G]olhos e começou fa[C]lar

[C]Por onde você for, eu vou es[G]tar
Com o meu pen[F]samento a te gui[C]ar
Não im[F]porta a distân[C]cia que nos sepa[G]ra
O meu cora[F]ção sem[G]pre vai te a[C]mar`
  },
  { id: 'zeze-3', title: 'Flores em Vida', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Médio', content: '' },
  { id: 'zeze-4', title: 'Pra Não Pensar em Você', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Médio', content: '' },
  { id: 'zeze-5', title: 'Pão de Mel', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Fácil', content: '' },
  { id: 'zeze-6', title: 'Você Vai Ver', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Fácil', content: '' },
  { id: 'zeze-7', title: 'Dois Corações e uma História', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Difícil', content: '' },
  { id: 'zeze-8', title: 'Indiferença', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Médio', content: '' },
  { id: 'zeze-9', title: 'Tarde Demais', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Médio', content: '' },
  { id: 'zeze-10', title: 'Mexe Que Mexe', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Fácil', content: '' },
  { id: 'zeze-11', title: 'Como Um Anjo', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Médio', content: '' },
  { id: 'zeze-12', title: 'Fui Eu', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Médio', content: '' },
  { id: 'zeze-13', title: 'Diz Pro Meu Olhar', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Fácil', content: '' },
  { id: 'zeze-14', title: 'A Ferro e Fogo', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Difícil', content: '' },
  { id: 'zeze-15', title: 'Preciso de Você', artist: 'Zezé Di Camargo & Luciano', genre: 'Sertanejo', difficulty: 'Fácil', content: '' },
];

export const MUSIC_ICONS = [
  { name: 'Michael Jackson', imageUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop' },
  { name: 'Bob Marley', imageUrl: 'https://images.unsplash.com/photo-1548126466-4470dfd3a209?w=400&h=400&fit=crop' },
  { name: 'Freddie Mercury', imageUrl: 'https://images.unsplash.com/photo-1593011361956-2e99e4f575c3?w=400&h=400&fit=crop' },
  { name: 'Amy Winehouse', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { name: 'Tim Maia', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop' },
  { name: 'Elvis Presley', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop' },
  { name: 'David Bowie', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=400&h=400&fit=crop' },
  { name: 'Kurt Cobain', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop' },
  { name: 'Tom Jobim', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { name: 'The Beatles', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
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
];

export const MOCK_SONGS: any[] = [];
