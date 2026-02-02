
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
  // MAIORES E ADICIONAIS
  'C': { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  'D': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  'F': { frets: [1, 3, 3, 2, 1, 1], barre: 1 },
  'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
  'A': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  'B': { frets: ['x', 2, 4, 4, 4, 2], barre: 2 },
  
  // ACORDES DA JULIANY SOUZA
  'A2': { frets: ['x', 0, 2, 2, 0, 0], fingers: [0, 0, 2, 3, 0, 0] },
  'B2': { frets: ['x', 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1], barre: 2 },
  'C#m7': { frets: ['x', 4, 6, 4, 5, 4], barre: 4, baseFret: 4 },
  'G#m7(11)': { frets: [4, 'x', 4, 4, 2, 'x'], fingers: [3, 0, 4, 2, 1, 0] },
  'F#m7(11)': { frets: [2, 'x', 2, 2, 0, 0], fingers: [2, 0, 3, 4, 0, 0] },
  'E/G#': { frets: [4, 'x', 2, 4, 5, 'x'], baseFret: 4 },
  
  // OUTROS
  'F#7': { frets: [2, 4, 2, 3, 2, 2], barre: 2 },
  'B7': { frets: ['x', 2, 1, 2, 0, 2] },
  'D#°': { frets: ['x', 'x', 1, 2, 1, 2] },
  'C#m/B': { frets: [7, 'x', 6, 6, 5, 'x'] },
  'Am': { frets: ['x', 0, 2, 2, 1, 0] },
  'Bm': { frets: ['x', 2, 4, 4, 3, 2], barre: 2 },
};

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
  capo?: number;
}

export const JULIANY_SOUZA_SONGS: ExtendedSong[] = [
  {
    id: 'juliany-1',
    title: 'Quem É Esse?',
    artist: 'Juliany Souza',
    genre: 'Gospel',
    difficulty: 'Médio',
    tuning: 'Padrão',
    originalKey: 'E',
    capo: 2,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop',
    content: `Tom: [E] (formato acorde em formato [D])
Capo: 2ª casa

[Intro] [A2] [B2] [C#m7] [G#m7(11)]

[Tab - Intro]
   A2      B2      C#m7    G#m7(11)
e|-----------------------------------|
B|-----0-------2-------5-------0-----|
G|---2---2---4---4---4---4---4---4---|
D|-----------------------------------|
A|-0-------2-------4-----------------|
E|-------------------------4---------|

[Primeira Parte]

[A2]
Eu me deparei
[B2]
Com aquele cenário ensurdecedor
[G#m7(11)]
Com o dedo no chão
[C#m7]
Ouvindo em fariseus o duro falar

[A2]
Que a Lei de Moisés
[B2]
Me condenava por meus erros
[G#m7(11)]
Mas nenhuma pedra
[C#m7]
Ele pegou pra me apedrejar

[Pré-Refrão]

[A2]
Eu só tinha os meus pecados
[B2]
Pra Lhe oferecer
[G#m7(11)]
Mas mesmo assim me amou
[C#m7]
Mas mesmo assim me amou

[A2]
Com uma frase, atire a pedra
[B2]
Quem nunca pecou
[G#m7(11)]
Ele me perdoou
[C#m7]
Ele me perdoou

[F#m7(11)] [E/G#] [A2]
Sua irresistível graça me alcançou

[Refrão]

[B]
Quem é esse?
[C#m7]
Que viu meu pecado e não me condenou
[A2]
No lugar da morte, vida me ofertou
[F#m7(11)] [B]
O Cordeiro que por nós se entregou
[A2]
E os meus pecados levou

[Final] [A2] [B2] [C#m7] [G#m7(11)]`
  }
];

export const ZEZE_SONGS: ExtendedSong[] = [
  {
    id: 'zeze-1',
    title: 'É o Amor',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    tuning: 'Padrão',
    originalKey: 'B',
    verified: true,
    content: `[Intro] [E] [B] [F#7] [B] [F#7]

[Tab - Solo Intro]
e|----12p11-12p11-12--11-12--12-12-12-------|
B|-12---------------------------------------|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|

e|------------------------------------------|
B|-14/16-16--12p11-12p11-12--12-12-12-------|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|

e|------------------------------------------|
B|-12/14p12-11--14-12-14-12-14--------------|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|

e|----------12--11--------------------------|
B|-12-14-12--------12-----------------------|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|

[Primeira Parte]

[B] Eu não vou negar que sou louco por você
Tô maluco pra te ver, eu não vou ne[F#7]gar
Eu [C#m]não vou negar, sem vo[C#m/B]cê tudo é sau[F#7]dade
Você traz feli[C#m7]cidade
[F#] Eu não vou ne[B]gar [C#m] [F#]
[B] Eu não vou negar, você é meu doce mel
Meu pedacinho de [B7]céu, eu não vou ne[E]gar

[Pré-Refrão]

Você é minha doce amada
Minha ale[B]gria, meu conto de fada
Minha fanta[C#m7]sia
A paz que eu pre[F#7]ciso pra sobrevi[B]ver [B7]
Eu [E]sou o seu apaixonado, de alma transpa[B]rente
Um louco alucinado meio inconse[C#m7]quente
Um caso compli[F#7]cado de se enten[B]der

[Refrão]

É o a[E]mor, que mexe com a minha cabeça 
E me deixa as[B]sim
Que faz eu pensar em você 
E esque[F#7]cer de mim
Que [C#m7]faz eu esquecer que a [F#7]vida 
É feita pra vi[B]ver [B7]
É o a[E]mor
Que veio como um tiro certo no meu cora[B]ção
Que derrubou a base forte da minha pai[F#7]xão
Que [C#m7]fez eu entender que a [F#7]vida é nada sem vo[B]cê [C#m] [F#]

[Ponte]

[B] Eu não vou negar, você é meu doce mel
Meu pedacinho de [D#°]céu, eu não vou ne[E]gar

[Pré-Refrão]

Você é minha doce amada
Minha ale[B]gria, meu conto de fada
Minha fanta[C#m7]sia
A paz que eu pre[F#7]ciso pra sobrevi[B]ver [B7]
Eu [E]sou o seu apaixonado, de alma transpa[B]rente
Um louco alucinado meio inconse[C#m7]quente
Um caso compli[F#7]cado de se enten[B]der [B7]

[Refrão]

É o a[E]mor, que mexe com a minha cabeça 
E me deixa as[B]sim
Que faz eu pensar em você 
E esque[F#7]cer de mim
Que [C#m7]faz eu esquecer que a [F#7]vida 
É feita pra vi[B]ver [B7]
É o a[E]mor
Que veio como um tiro certo no meu cora[B]ção
Que derrubou a base forte da minha pai[F#7]xão
Que [C#m7]fez eu entender 
Que a [F#7]vida é nada sem vo[B]cê`
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

[C]O world é grande e o cami[G]nho é deserto
Mas [F]Deus estará sempre per[C]to
Aon[F]de quer que vo[C]cê vá
Olhou em meus [G]olhos e começou fa[C]lar

[C]Por onde você for, eu vou es[G]tar
Com o meu pen[F]samento a te gui[C]ar
Não im[F]porta a distân[C]cia que nos sepa[G]ra
O meu cora[F]ção sem[G]pre vai te a[C]mar`
  },
];

export const MOCK_SONGS: any[] = [];
