
import { Song } from './types';

export const CHROMATIC_SCALE = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export interface ChordShape {
  frets: (number | 'x')[];
  fingers?: number[];
  barre?: number;
  baseFret?: number;
  // Para teclado, usamos índices das teclas (0 a 11 em uma oitava)
  keys?: number[]; 
}

// Dicionário por instrumento
export const INSTRUMENT_CHORDS: Record<string, Record<string, ChordShape>> = {
  'Violão': {
    'C': { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], keys: [0, 4, 7] },
    'D': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], keys: [2, 6, 9] },
    'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], keys: [4, 8, 11] },
    'F': { frets: [1, 3, 3, 2, 1, 1], barre: 1, keys: [5, 9, 0] },
    'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], keys: [7, 11, 2] },
    'A': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], keys: [9, 1, 4] },
    'B': { frets: ['x', 2, 4, 4, 4, 2], barre: 2, keys: [11, 3, 6] },
    'A7': { frets: ['x', 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], keys: [9, 1, 4, 7] },
    'Bm': { frets: ['x', 2, 4, 4, 3, 2], barre: 2, keys: [11, 2, 6] },
    'Am': { frets: ['x', 0, 2, 2, 1, 0], keys: [9, 0, 4] },
  },
  'Ukulele': {
    'C': { frets: [0, 0, 0, 3], keys: [0, 4, 7] },
    'D': { frets: [2, 2, 2, 0], keys: [2, 6, 9] },
    'E': { frets: [4, 4, 4, 2], baseFret: 1, keys: [4, 8, 11] },
    'F': { frets: [2, 0, 1, 0], keys: [5, 9, 0] },
    'G': { frets: [0, 2, 3, 2], keys: [7, 11, 2] },
    'A': { frets: [2, 1, 0, 0], keys: [9, 1, 4] },
    'B': { frets: [4, 3, 2, 2], barre: 2, keys: [11, 3, 6] },
    'Am': { frets: [2, 0, 0, 0], keys: [9, 0, 4] },
    'Bm': { frets: [4, 2, 2, 2], barre: 2, keys: [11, 2, 6] },
  },
  'Teclado': {
    'C': { frets: [], keys: [0, 4, 7] },
    'Cm': { frets: [], keys: [0, 3, 7] },
    'D': { frets: [], keys: [2, 6, 9] },
    'Dm': { frets: [], keys: [2, 5, 9] },
    'E': { frets: [], keys: [4, 8, 11] },
    'Em': { frets: [], keys: [4, 7, 11] },
    'F': { frets: [], keys: [5, 9, 0] },
    'G': { frets: [], keys: [7, 11, 2] },
    'A': { frets: [], keys: [9, 1, 4] },
    'Am': { frets: [], keys: [9, 0, 4] },
    'B': { frets: [], keys: [11, 3, 6] },
    'Bm': { frets: [], keys: [11, 2, 6] },
  }
};

// Aliases para facilitar busca
INSTRUMENT_CHORDS['Guitarra'] = INSTRUMENT_CHORDS['Violão'];
INSTRUMENT_CHORDS['Baixo'] = {
  'C': { frets: ['x', 3, 'x', 'x'], keys: [0] },
  'D': { frets: ['x', 5, 'x', 'x'], keys: [2] },
  'E': { frets: [0, 'x', 'x', 'x'], keys: [4] },
  'F': { frets: [1, 'x', 'x', 'x'], keys: [5] },
  'G': { frets: [3, 'x', 'x', 'x'], keys: [7] },
  'A': { frets: [5, 'x', 'x', 'x'], keys: [9] },
  'B': { frets: [7, 'x', 'x', 'x'], keys: [11] },
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
    imageUrl: 'https://images.unsplash.com/photo-1521417531039-75e91486cc40?w=400&h=400&fit=crop',
    content: `[Intro] [E] [B] [F#7] [B] [F#7]

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
    originalKey: 'A',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1521417531039-75e91486cc40?w=400&h=400&fit=crop',
    content: `[Intro] [Bm] [E] [A] [E] [A] (passagem 1)

[Tab - Passagem 1]
E|------------------------------------------------------|
B|------------------------------------------------------|
G|------------------------------------------------------|
D|------------------------------------------------------|
A|-0----------------------------------------------------|
E|---0-2-4----------------------------------------------|

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
    [E]                  [A] (passagem 2)
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
         [A] (passagem 2)
E quer voar

           [D]
Eu bem queria continuar ali
                              [A]
But o destino quis me contrariar
                           [E]
E o olhar de minha mãe na porta
              
Eu deixei chorando
           [A]
A me abençoar

([Bm] [E] [A] [E] [A]) (passagem 1)

[Segunda Parte]

   [A]
A minha mãe naquele dia
                           [D]
Me falou do mundo como ele é
   [E]
Parece que ela conhecia
                              [A]
Cada pedra que eu iria por o pé

E sempre ao lado do meu pai
              [A7]               [D]
Da pequena cidade ela jamais saiu

Ela me disse assim:
     [A]
Meu filho, vá com Deus
    [E]                     [A] (passagem 2)
Que esse mundo inteiro é seu

[Refrão]

           [D]
Eu sei que ela nunca compreendeu
                            [A]
Os meus motivos de sair de lá
                              [E]
Mas ela sabe que depois que cresce
              [D]
O filho vira passarinho 
         [A] (passagem 2)
E quer voar

           [D]
Eu bem queria continuar ali
                              [A]
Mas o destino quis me contrariar
                           [E]
E o olhar de minha mãe na porta
                             [A]
Eu deixei chorando a me abençoar

                           [E]
E o olhar de minha mãe na porta
                              [A]  
Eu deixei chorando a me abençoar

[Final] [E] [A] [D/A] [E] [A]`
  },
];
