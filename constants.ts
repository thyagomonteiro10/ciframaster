
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
    'B7': { frets: ['x', 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], keys: [11, 3, 6, 9] },
    'Bm': { frets: ['x', 2, 4, 4, 3, 2], barre: 2, keys: [11, 2, 6] },
    'Am': { frets: ['x', 0, 2, 2, 1, 0], keys: [9, 0, 4] },
    'Dm': { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], keys: [2, 5, 9] },
    'Bb': { frets: ['x', 1, 3, 3, 3, 1], barre: 1, keys: [10, 2, 5] },
    'F#': { frets: [2, 4, 4, 3, 2, 2], barre: 2, keys: [6, 10, 1] },
    'G#m': { frets: [4, 6, 6, 4, 4, 4], barre: 4, keys: [8, 11, 3] },
    'F#m': { frets: [2, 4, 4, 2, 2, 2], barre: 2, keys: [6, 9, 1] },
    'E7': { frets: [0, 2, 0, 1, 0, 0], keys: [4, 8, 11, 2] },
    'E/G#': { frets: [4, 'x', 2, 4, 5, 'x'], baseFret: 4, keys: [8, 11, 4] },
    'A/C#': { frets: ['x', 4, 2, 2, 2, 'x'], baseFret: 2, keys: [1, 4, 9] },
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
    'Dm': { frets: [2, 2, 1, 0], keys: [2, 5, 9] },
    'Bb': { frets: [3, 2, 1, 1], barre: 1, keys: [10, 2, 5] },
  }
};

// Aliases para facilitar busca
INSTRUMENT_CHORDS['Guitarra'] = INSTRUMENT_CHORDS['Violão'];

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
  capo?: number;
}

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

e|-------------8/10-8-7-7/8--12--13-13--10-10-10--8-8-8--6-6-6-5h6p5--------|
b|---------6-8-------------------------------------------------------6-6/8--|
g|-----5-7------------------------------------------------------------------|
d|-5/7----------------------------------------------------------------------|
a|--------------------------------------------------------------------------|
E|--------------------------------------------------------------------------|

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
Meu Deus ela é demais`
  },
  {
    id: 'rick-bares',
    title: 'Nos Bares Da Cidade',
    artist: 'Rick & Renner',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: RICK_RENNER_IMG,
    content: `[Intro] [E] [B7] [A] [B7] [E]

[Primeira Parte]

[E]
Garçom, olhe pelo espelho
                [B7]
Estou num estado deplorável
[A]
Sei que o meu rosto está vermelho
                  [E]
E o meu pranto é inevitável

[E]
Ela me deixou e foi embora
                   [B7]
Com outro alguém que nem conhece
[A]
Por isso eu estou aqui agora
                      [E]  (passagem 2)
Bebendo o que a gente merece

[Refrão]

          [A]
E nos bares da cidade
                [E]
Eu vou curtir a solidão
           [B7]
Bebendo e chorando
             [E]
A morte da minha paixão`
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
    id: 'zeze-no-dia',
    title: 'No Dia Em Que Eu Saí De Casa',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    verified: true,
    content: `[Intro] [Bm] [E] [A] [E] [A] (passagem 1)

[Tab - Passagem 1]
E|------------------------------------------------------|
B|------------------------------------------------------|
G|------------------------------------------------------|
D|------------------------------------------------------|
A|-0----------------------------------------------------|
E|---0-2-4----------------------------------------------|

[Solo Intro]
[Tab - Violão 1]
Parte 01 de 02
E|------------------------------------------------------|
B|-12b14-12b14r12-10-12-----10b12-10b12r10-9-10---------|
G|----------------------11------------------------------|
D|------------------------------------------------------|
A|------------------------------------------------------|
E|------------------------------------------------------|

Parte 02 de 02
E|-------------------7-----5----------------------------|
B|-9b10-9b10r9-7-7/9---9\\7---7\\5--2b3r2-0---------------|
G|----------------------------------------2-------------|
D|------------------------------------------------------|
A|------------------------------------------------------|
E|------------------------------------------------------|

[Tab - Violão 2]
Parte 01 de 02
E|------------------------------------------------------|
B|-15b17-15b17r15-14-15-----14b15-14b15r14-12-14--------|
G|----------------------14------------------------------|
D|------------------------------------------------------|
A|------------------------------------------------------|
E|------------------------------------------------------|

Parte 02 de 02
E|--------------------------10-------9------------------|
B|-12b14-12b14r12-10--10/12----12\\10---10\\9--5b7r5-3-2--|
G|------------------------------------------------------|
D|------------------------------------------------------|
A|------------------------------------------------------|
E|------------------------------------------------------|

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

[Tab - Passagem 2]
E|------------------------------------------------------|
B|------------------------------------------------------|
G|------------------------------------------------------|
D|------------------------------------------------------|
A|-0-0-2-4----------------------------------------------|
E|------------------------------------------------------|

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
              [D]
Eu deixei chorando
           [A]
A me abençoar

( [Bm] [E] [A] [E] [A] ) (passagem 1)

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
Que esse world inteiro é seu`
  },
  {
    id: 'zeze-cada-volta',
    title: 'Cada Volta É Um Recomeço',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [F#] [E] [B/D#] [E]
        [G#m] [F#11] [E] [F#11]
        [B/D#] [E] [B/D#] [E]

[Primeira Parte]

     [B]       [B4]
Mais uma vez
     [B]
Meu coração esquece tudo
       [G°]
Que você me fez
    [E°]
Eu volto pra esse amor insano
        [G#m]      [G#m7/F#]
Sem pensar em mim
       [E]
Pra recomeçar
      [F#]         [F#4] [F#]
Já sabendo o fim

[Segunda Parte]

    [B]        [B4]
Mas é paixão
  [B]
E essas coisas de paixão
            [G°]
Não tem explicação
   [E°]
É simplesmente se entregar
         [G#m]     [G#m7/F#]
Deixar acontecer
   [E]
E sempre acabo me envolvendo
       [F#] [F#4] [F#] [F#4]

[Refrão]

[B]              [E]
  Nesses desencontros
      [F#]
Eu insisto em te encontrar
[B]                [E]
  Como se eu partisse
       [F#]
Já pensando em voltar
[B]             [E]
  Como se no fundo eu não
    [F#]
Pudesse existir
           [B] [E] [F#] [F#11]
Sem ter você

[B]                  [E]
  Toda vez que eu volto
       [F#]
Eu te vejo sempre igual
[B]               [E]
  Como se a saudade fosse
   [F#]
A coisa mais banal
[B]                [E]
  E eu chegando sempre
         [F#]
Como um louco pra dizer
           [B]
Que amo você
          [B]
   Amo você

[Terceira Parte]

[G#m]                   [D#m]
    Que me leve pela vida ao coração
[E]       [F#]            [B] [F#/A#]
  Como versos pra canção
        [G#m]            [D#m]
Volto pra você, volto pelo amor
       [C#]            [B/D#]        [Db/F]
Não importa se é um sonho pelo avesso
      [C#]             [F#] [F#4] [F#] [F#7(4/9)]
Cada volta é um recomeço`
  }
];
