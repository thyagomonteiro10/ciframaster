
import { Song } from './types';

export const CHROMATIC_SCALE = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export interface ChordShape {
  frets: (number | 'x')[];
  fingers?: number[];
  barre?: number;
  baseFret?: number;
  keys?: number[]; // Usado para teclado: índices das teclas (0=C, 1=C#, etc)
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
  },
  'Baixo': {
    'C': { frets: ['x', 3, 2, 0] },
    'D': { frets: ['x', 'x', 0, 2] },
    'E': { frets: [0, 2, 2, 1] },
    'G': { frets: [3, 2, 0, 0] },
    'A': { frets: ['x', 0, 2, 2] },
  },
  'Banjo': {
    'C': { frets: [2, 0, 1, 2] },
    'G': { frets: [0, 0, 0, 0] },
    'D': { frets: [0, 2, 3, 2] },
  },
  'Violão Caipira': {
    'A': { frets: [0, 0, 0, 0, 0] },
    'E': { frets: [0, 2, 2, 1, 0] },
    'B7': { frets: ['x', 2, 1, 2, 0] },
  },
  'Teclado': {
    'C': { frets: [], keys: [0, 4, 7] },
    'D': { frets: [], keys: [2, 6, 9] },
    'E': { frets: [], keys: [4, 8, 11] },
    'F': { frets: [], keys: [5, 9, 0] },
    'G': { frets: [], keys: [7, 11, 2] },
    'A': { frets: [], keys: [9, 1, 4] },
    'B': { frets: [], keys: [11, 3, 6] },
    'Am': { frets: [], keys: [9, 0, 4] },
    'Dm': { frets: [], keys: [2, 5, 9] },
    'Em': { frets: [], keys: [4, 7, 11] },
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

[Solo da Introdução]
e|-----------------------------------------6-6--6h5----------------------
b|----------------------6h5-5/6-6h5-----------------8-6------------------
g|----------------5-5-5-------------6-6h7----------------7-5-------------
d|-----2-3-5--5/7--------------------------------------------7-5-3---3---
a|-3-5-------------------------------------------------------------5-----
E|-----------------------------------------------------------------------

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

[Pré-Refrão]

[F]      [Dm]     [Bb]
Ela sabe me prender como ninguém
[C]       [F]
Tem seus mistérios
[Dm]      [Bb]
Sabe se fazer como ninguém
[C]      [Bb] [C]
Meu caso sério

[Refrão]

[F]      [Dm]     [Bb]
Uma Deusa, uma louca, uma feiticeira
[C]      [F]
 Ela é demais
[F]      [Dm]     [Bb]
 Quando beija a minha boca e se entrega inteira
 [C]      [F]
 Meu Deus ela é demais

[Solo]

[Segunda Parte]

[F]              [Dm]
Ela tem o brilho forte brilha feito estrela
[Bb]     [C]      [Bb] [C]
Ah eu adoro vê-la fazendo aquele amor
[F]              [Dm]
Que me enlouquece me embriaga me envolve inteiro
[Bb]
Que me faz prisioneiro
[C]      [Bb] [C]
Um louco sonhador

[Refrão Final]

[F]      [Dm]     [Bb]
Uma Deusa, uma louca, uma feiticeira
[C]      [F]
Ela é demais
[F]      [Dm]     [Bb]
Quando beija a minha boca e se entrega inteira
[C]      [F]
Meu Deus ela é demais`
  },
  {
    id: 'rick-filha',
    title: 'Filha',
    artist: 'Rick & Renner',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: RICK_RENNER_IMG,
    verified: true,
    content: `Tom: [D]

[Intro] [D] [A] [G] [D]

[Primeira Parte]

[D]
Olha filha como o tempo passa
[A]
Olha como você já cresceu
[G]
Parece que foi online que você nasceu
[D]
E o primeiro presente quem deu foi Deus

[A]
Lembro de você ainda pequena
[G]
Correndo pela casa e me chamando de pai
[D]
Hoje você já é uma mulher
[A]
E o tempo não volta atrás, não volta jamais

[Refrão]

[D]
Filha, você é o meu maior tesouro
[A]
O brilho do meu ouro, a minha paz
[G]
Eu te amo tanto que nem sei dizer
[D]                    [A]
O quanto você me faz bem, o quanto você me faz

[D]
Filha, que Deus ilumine os seus passos
[A]
Te proteja em seus braços, por onde você for
[G]
Saiba que o papai sempre vai estar aqui
[D]                  [A]
Pra te dar o meu carinho, pra te dar o meu amor

[Solo] [D] [A] [G] [D]

[Final]

[D]
Olha filha como o tempo passa...
[A]
Eu te amo, minha filha.`
  }
];

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
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    content: `Tom: [E] (formato acorde em formato [D])
Capo: 2ª casa

[Intro] [A2] [B2] [C#m7] [G#m7(11)]

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
E os meus pecados levou`
  },
  {
    id: 'juliany-lindo-momento',
    title: 'Lindo Momento',
    artist: 'Juliany Souza',
    genre: 'Gospel',
    difficulty: 'Médio',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    content: `Tom: [G]

[Intro] [G] [C9] [Em7] [D4]

[Primeira Parte]

[G]
Vem e sopra em nós
[C9]
O Teu Espírito, Senhor
[Em7]
Queremos ouvir Tua voz
[D4]
Neste lugar de adoração

[G]
Não há outro nome
[C9]
Mais doce que o Teu
[Em7]
Jesus, o Rei da Glória
[D4]
A Estrela da Manhã

[Refrão]

[G]
Oh, que lindo momento
[C9]
Estar em Tua presença
[Em7]
Deixar o Teu fluir
[D4]
Mudar o meu viver

[G]
Oh, que lindo momento
[C9]
Te ver face a face
[Em7]
Saber que Tu és meu
[D4]
E eu sou Teu para sempre

[Ponte]

[C9]      [D4]
Santo, Santo
[Em7]     [G/B]
Digno é o Cordeiro
[C9]      [D4]
Santo, Santo
[Em7]     [D4]
Toda glória a Ti`
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

[Solo da Intro]
E|-------5--5--4--4--2--2--0--0------------------------|
B|-------------------------------3--3--2--2--0--0-------|
G|--4/6--------------------------------------------2----|
D|------------------------------------------------------|

[Primeira Parte]

[A]
Eu não vou negar que sou louco por você
[E]
Tô carente, tô sozinho, precisando te ver
[D]
Já tentei de tudo pra te esquecer
[E]
Mas no fundo eu sei que não dá pra viver sem você

[A]
Não me diga que o nosso amor chegou ao fim
[E]
Se você ainda guarda um segredo por mim
[D]
Olha nos meus olhos e tenta dizer
[E]
Que no seu coração não existe mais lugar pra mim

[Refrão]

[A]
É o amor
[E]
Que mexe com minha cabeça e me deixa assim
[D]
Que faz eu pensar em você e esquecer de mim
[E]
Que faz eu esquecer que a vida é feita pra viver

[A]
É o amor
[E]
Que veio como um tiro certo no meu coração
[D]
Que trouxe de volta a alegria e a minha paixão
[E]
E me fez entender que eu não sei viver sem você

[Final]

[A] [E] [D] [E] [A]
É o amor...`
  },
  {
    id: 'zeze-no-dia',
    title: 'No Dia Em Que Eu Saí De Casa',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    verified: true,
    content: `Tom: [A]

[Intro] [Bm] [E] [A] [E] [A]

[Primeira Parte]

    [A]
No dia em que eu saí de casa
Minha mãe me disse
            [D]
Filho, vem cá
    [E]
Passou a mão em meus cabelos
Olhou em meus olhos
           [A]
Começou falar

Por onde você for eu sigo
              [A7]
Com meu pensamento
                 [D]
Sempre onde estiver
Em minhas orações
    [A]
Eu vou pedir a Deus
    [E]                  [A]
Que ilumine os passos seus

[Refrão]

           [D]
Eu sei que ela nunca compreendeu
                            [A]
Os meus motivos de sair de lá
                              [E]
Mas ela sabe que depois que cresce
              [D]
O filho vira passarinho 
         [A]
E quer voar`
  }
];
