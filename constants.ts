
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
    'F#': { frets: [2, 4, 4, 3, 2, 2], barre: 2, keys: [6, 10, 1] },
    'G#m': { frets: [4, 6, 6, 4, 4, 4], barre: 4, keys: [8, 11, 3] },
    'F#m': { frets: [2, 4, 4, 2, 2, 2], barre: 2, keys: [6, 9, 1] },
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

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
  capo?: number;
}

const ZEZE_IMG = 'https://images.unsplash.com/photo-1521417531039-75e91486cc40?w=400&h=400&fit=crop';

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
E|------------------------------------------------------|
B|-12b14-12b14r12-10-12-----10b12-10b12r10-9-10---------|
G|----------------------11------------------------------|
D|------------------------------------------------------|

[Tab - Violão 2]
E|--------------------------10-------9------------------|
B|-12b14-12b14r12-10--10/12----12\10---10\9--5b7r5-3-2--|

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
E quer voar`
  },
  {
    id: 'zeze-cada-volta',
    title: 'Cada Volta É Um Recomeço',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [F#] [E] [B/D#] [E] [G#m] [F#11] [E] [F#11] [B/D#] [E] [B/D#] [E]

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

[Refrão]

[B]              [E]
  Nesses desencontros
      [F#]
Eu insisto em te encontrar
[B]                [E]
  Como se eu partisse
       [F#]
Já pensando em voltar`
  },
  {
    id: 'zeze-sera-que',
    title: 'Será Que Foi Saudade?',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [C] [G/B] [Am7] [F9] [C] [G/B] [F9] [C]

[Primeira Parte]

 [C]            [F9]             [C] [F9]
Diga logo o que te trouxe aqui
 [C]              [F9]           [G] 

( [Am7] [A#°] [G/B] )

       [F9]         [G]            [C]
O que fez você mudar tão de repente
          [E7]            [Am]
O que te fez pensar na gente
      [D7]          [G] [G4] [G]

[Refrão]

                 [G]
Será que foi saudade
                     [F]
Que te machucou por dentro
                     [C]                     
Que te fez por um momento 
                 [G]
Entender de solidão?`
  },
  {
    id: 'zeze-flores',
    title: 'Flores Em Vida',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [Am] [C] [G] [D] (x2)

[Primeira Parte]

                 [Am]
Quero seu amor agora
[C]                  [G] [D]
  Não a saudade depois
                        [Am]
Seu carinho pela vida afora
             [C]          [G]           [D] 
Antes que o fim pare entre nós dois

[Refrão]

[Am]        [C]       [G]
Eu quero viver a vida
        [D]        [Am]
Quero flores em vida
    [C]           [G]          [D]
Colhidas no jardim do amor`
  },
  {
    id: 'zeze-mentes',
    title: 'Mentes Tão Bem',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Difícil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [G] [D11/F#] [D/F#] [D9/F#] [D/F#]

[Primeira Parte]

[C]                     [D9/F#]
  Me promete amor sincero 
     [D/F#]   [G]    [D/F#]
Uma vida inteira
[C/E]            [C]          [D5(9)]
    Que com você o meu inverno 
       [D/F#]    [G] [D/F#]
Vira primavera

[Refrão]

 [C]          [D5(9)] 
Mentes tão bem
[D/F#]                [G] [D6(11)/F#]
     Que parece verdade
               [Em7]
O que você me fala
       [D5(9)]
Vou acreditando`
  },
  {
    id: 'zeze-sonho-de-amor',
    title: 'Sonho de Amor',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [Am] [G] [E]

[Primeira Parte]

[Am]
   Se uma estrela cadente o céu cruzar
                             [G]
E uma chama no corpo me acender
                             [E]
Vou fazer um pedido e te chamar
Pro começo do sonho acontecer

[Refrão]

[F]     [G]            [C]              [Am]
  As noites sabem como eu te esperei
[F]      [G]             [C] [Am]
  Não conto pra ninguém
[F]    [G]           [C]            [Am]
  A lua sabe que eu me apaixonei`
  },
  {
    id: 'zeze-dois-coracoes',
    title: 'Dois Corações e Uma História',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [D] [E] [A]

[Primeira Parte]

               [Bm]
No meio da conversa
                 [E]
De um caso terminando
                     [A] [A7M]
Um fala e o outro escuta 
            [A6]         [F#m]
E os olhos vão chorando

[Refrão]

              [D]
E longe um do outro
                 [E]
A vida é toda errada
                  [A]
O homem não se importa 
                   [F#]`
  },
  {
    id: 'zeze-pra-nao-pensar',
    title: 'Pra Não Pensar Em Você',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [A9] [C#m7/E] [A9] [C#m7/E]

[Primeira Parte]

[A]
  Quando a saudade doer
                  [C#m7/E]
E a solidão machucar
[A]
  Pra não pensar em você
                    [C#m7/E]

[Refrão]

[D]                     [Bm]
   Mas eu me engano, me desespero
[F#m]
    Porque te amo, porque te quero`
  },
  {
    id: 'zeze-pra-mudar',
    title: 'Pra Mudar Minha Vida',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [F#m] [A] [E]

[Primeira Parte]

Queria tanto te dizer
                 [E] [E4]
Que eu já não te amo 
     [E]                     
Que seu amor em minha vida
               [B7]
Foi mais um engano

[Refrão]

                            [A] [B]
Você chegou me deixou sem saída
                 
Me fez te querer
                       [E]`
  },
  {
    id: 'zeze-dou-a-vida',
    title: 'Dou a Vida Por Um Beijo',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [G] [Am7] [C] [G]

[Primeira Parte]

[Am7]                      [G]
    Difícil demais, te amar assim
[Am7]                        [G]
    Minha timidez tem que ter um fim

[Refrão]

[G]       [D/F#] [Em]        [C]         [G]
  Eu te amo,     eu preciso te dizer
      [D/F#]      [Am7] 
Todo dia, toda noite 
   [G/B] [C]    [D/F#] [G]`
  },
  {
    id: 'zeze-voce-vai-ver',
    title: 'Você Vai Ver',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [C] [Dm] [A7] [Bb2] [F] [C] [F] [C7]

[Primeira Parte]

[F]                  [C]           [Dm] [Dm/C]
  Você pode encontrar muitos amores
[Bb2]                     [F/A]             
    Mas ninguém vai te dar 
             [Gm] [Gm7]

[Refrão]

          [F]             [C]          [Dm]
Eu vou ficar, guardado no seu coração
           [F7]       [Bb2]
Na noite fria, solidão`
  },
  {
    id: 'zeze-e-o-amor',
    title: 'É o Amor',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    tuning: 'Padrão',
    originalKey: 'B',
    verified: true,
    imageUrl: ZEZE_IMG,
    content: `[Intro] [E] [B] [F#7] [B] [F#7]

[Primeira Parte]

[B] Eu não vou negar que sou louco por você
Tô maluco pra te ver, eu não vou ne[F#7]gar
Eu [C#m]não vou negar, sem vo[C#m/B]cê tudo é sau[F#7]dade
Você traz feli[C#m7]cidade
[F#] Eu não vou ne[B]gar [C#m] [F#]
[B] Eu não vou negar, você é meu doce mel
Meu pedacinho de [B7]céu, eu não vou ne[E]gar

[Refrão]

É o a[E]mor, que mexe com a minha cabeça 
E me deixa as[B]sim
Que faz eu pensar em você 
E esque[F#7]cer de mim`
  }
];
