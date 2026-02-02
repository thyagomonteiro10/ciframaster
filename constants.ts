
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
Mas o destino quis me contrariar
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
Que esse mundo inteiro é seu`
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
  },
  {
    id: 'zeze-sera-que',
    title: 'Será Que Foi Saudade?',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [C] [G/B] [Am7] [F9]
        [C] [G/B] [F9] [C]

[Primeira Parte]

 [C]            [F9]             [C] [F9]
Diga logo o que te trouxe aqui
 [C]              [F9]           [G] 
Fala que eu tô louco para saber

( [Am7] [A#°] [G/B] )

       [F9]         [G]            [C]
O que fez você mudar tão de repente
          [E7]            [Am]
O que te fez pensar na gente
      [D7]          [G] [G4] [G]
Por que voltou aqui?

[Segunda Parte]

 [C]          [F9]             [C] [F9] 
Fala que você não me esqueceu
       [C]           [F9]         [G] 
Que a solidão não doeu só em mim

( [Am7] [A#°] [G/B] )

       [F]          [G]            [C]
O que fez você mudar seu pensamento
         [E7]           [Am]
O que tocou seu sentimento
      [D7]          [G] [G4] [G]
Por que voltou aqui?

[Pré-Refrão]

        [F]           [G/F]         [C]
Eu não posso acreditar nessa mudança
        [E7]        [Am]
Onde a fera vira santa
    [F]      [G]       [C] [F] [C]
E quer voltar pra mim

[Refrão]

                 [G]
Será que foi saudade
                     [F]
Que te machucou por dentro
                     [C]                     
Que te fez por um momento 
                 [G]
Entender de solidão?

Será que foi saudade
                          [F]
Que te fez que quebrar a cara?
                    [C]           
Sou doença que não sara 
        [G]          [C] [F] 

[Tab - Interlúdio]
Parte 1 de 2
   [C]           [G/B]  [Am7]          [F] 
E|------------------------------------------|
B|-------6/8-6/8~\\-----------5-8/10~\\-------|
G|-----5-------------------5----------------|
D|---5-----------------5/7------------------|

Parte 2 de 2
         [C]          [G]       [F]     
E|------------------------------------------|
B|-6/8\\6-5---5/6\\5--------------------------|
G|-----------------7---5\\4------------------|
D|--------------------------7---------------|`
  },
  {
    id: 'zeze-flores',
    title: 'Flores Em Vida',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [Am] [C] [G] [D]
        [Am] [C] [G] [D]

[Tab - Intro]
Parte 1 de 2
         [Am]        [C]      [G]      [D]
E|---------------------------------------------|
B|---8p6-8~----8p6-8~--11\\6~--11\\6~------------|
G|-5---------5---------------------------------|

Parte 2 de 2
         [Am]            [C]      [G]         [D]
E|---------------------------------------------|
B|---8p6-8p6-8~----8p6-8~--11\\6~--10h11p10-----|
G|-5-------------5-----------------------------|

[Primeira Parte]

                 [Am]
Quero seu amor agora
[C]                  [G] [D]
  Não a saudade depois
                        [Am]
Seu carinho pela vida afora
             [C]          [G]           [D] 
Antes que o fim pare entre nós dois

                 [Am]
Quero sua companhia
[C]                   [G]         [D]
  Caminhar na mesma   direção
                      [Am]
É certo que um certo dia
                [C]           [G]       [D]
A vida nos separe em alguma estação

[Pré-Refrão]

                 [Am] [C]
Quero flores em vida
                   [G] [D]
Seu sorriso a me iluminar
                     [Am]
As lágrimas de despedida
                 [C] [G] [D] 
Não estarei por perto pra enxugar

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
        [G] [D/F#] [Em] [D/F#]

[Tab - Intro]
Parte 1 de 4
   [G]
E|-------3--------3--------3--------3------|
B|-------3--------3--------3--------3------|
G|-----0--------0--------0--------0--------|
D|---0--------0--------0--------0----------|

Parte 2 de 4
   [D11/F#] [D/F#]      [D9/F#]     [D/F#]
E|-------3-------2---------0---------------|
B|-------3-------3---------3---------3-----|
G|-----2-------2---------2---------2-------|
D|---0-------0---------0---------0---------|

[Solo]
E|--------7---8p7--5-----------------------|
B|-----8------8----7--3--------------------|
G|--7--------------------------------------|

[Primeira Parte]

[C]                     [D9/F#]
  Me promete amor sincero 
     [D/F#]   [G]    [D/F#]
Uma vida inteira
[C/E]            [C]          [D5(9)]
    Que com você o meu inverno 
       [D/F#]    [G] [D/F#]
Vira primavera
[Em]            [D4(6)]             [C]
   Vive me jurando estar apaixonada
            [G7M/B]                [Am]
Prometeu o mundo e nunca me deu nada
[Am/G]                  [D/F#]
     Você não cumpre nada

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

[Tab - Intro]
    [Am]
E|----------------------------------------|
B|--------0--1-------------0--1--0--------|
G|--2--2---------2---2--2-----------2-----| (x2)

    [G]
E|----------------------------------------|
B|----------------------------------------|
G|--0--0--2--4---0---0--0--2--4--2--0-----|

[Primeira Parte]

[Am]
   Se uma estrela cadente o céu cruzar
                             [G]
E uma chama no corpo me acender
                             [E]
Vou fazer um pedido e te chamar
Pro começo do sonho acontecer

[Am]
   Quando os dedos tocarem lá no céu
                            [G]
O universo vai todo estremecer
                                [E]
E as estrelas rodando em carrossel
Testemunhas do amor, eu e você

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
    content: `[Intro]
Parte 1 de 5
             [D]          [E]
E|-------5-4-2------------------------------|
B|---------------3------5-------5-----------|
G|---4/6---4---2------------4-------4-------|
D|-----------0------4/6---6---6---6---6-----|

Parte 2 de 5
               [D]       [E]
E|----9--9-7-7-5-----4-4h5p4------4---------|
B|---10-10-9-9-7---7-5-5------5-------5-----|

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
                   [F#]
Com a roupa amarrotada
                [Bm]
E a mulher em crise 
                [E]
Quantas vezes chora
                 [D]               [E]
A dor de ter perdido um grande amor 
     [A]         [F] [Bb]`
  },
  {
    id: 'zeze-pra-nao-pensar',
    title: 'Pra Não Pensar Em Você',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [A9] [C#m7/E] [A9] [C#m7/E]

[Tab - Intro]
E|-17----19--21--------10/9-----------------|
B|---------------17---------12/10--9/---2---|

[Primeira Parte]

[A]
  Quando a saudade doer
                  [C#m7/E]
E a solidão machucar
[A]
  Pra não pensar em você
                    [C#m7/E]

[Pré-Refrão]

[D]
  Vou enganar a paixão
[A/C#]             [A] 
     Mentir pro meu coração
[Bm]            [E]          [A]
   Que já deixei de te amar

[Refrão]

[D]                     [Bm]
   But eu me engano, me desespero
[F#m]
    Porque te amo, porque te quero
[Em]                               
   E a minha vida 
[A]                   [D]
  É só pensar em você`
  },
  {
    id: 'zeze-pra-mudar',
    title: 'Pra Mudar Minha Vida',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    imageUrl: ZEZE_IMG,
    content: `[Intro] [F#m] [A] [E]

[Tab - Intro]
E|------------------------------------------|
B|------------------------------------------|
G|-------4----------------------------------|
D|-2-4/6---6\\4-2-4--4-6-7-------------------|

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

[Tab - Intro]
E|-10-8-7---------------------------------------------|
B|--------10-8-10-8-7---7-----------------------------|
G|--------------------9----9\\7--5---------------------|

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

[Tab - Solo Final]
E|-8-6-5-----------------------------------------------|
B|-------8-6-5-----------------------------------------|
G|-------------7-5-------------------------------------|
D|-----------------8-7-5-------------------------------|
A|-----------------------8-7-5-------------------------|
E|-----------------------------8-6-5-------------------|

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
