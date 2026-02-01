
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
  'D': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  'D#': { frets: ['x', 6, 8, 8, 8, 6], barre: 6, baseFret: 6 },
  'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  'F': { frets: [1, 3, 3, 2, 1, 1], barre: 1 },
  'F#': { frets: [2, 4, 4, 3, 2, 2], barre: 2 },
  'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
  'G#': { frets: [4, 6, 6, 5, 4, 4], barre: 4, baseFret: 4 },
  'A': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  'A#': { frets: ['x', 1, 3, 3, 3, 1], barre: 1 },
  'B': { frets: ['x', 2, 4, 4, 4, 2], barre: 2 },

  // MENORES
  'Cm': { frets: ['x', 3, 5, 5, 4, 3], barre: 3, baseFret: 3 },
  'C#m': { frets: ['x', 4, 6, 6, 5, 4], barre: 4, baseFret: 4 },
  'Dm': { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  'Fm': { frets: [1, 3, 3, 1, 1, 1], barre: 1 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], barre: 2 },
  'Gm': { frets: [3, 5, 5, 3, 3, 3], barre: 3 },
  'G#m': { frets: [4, 6, 6, 4, 4, 4], barre: 4, baseFret: 4 },
  'Am': { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  'Bm': { frets: ['x', 2, 4, 4, 3, 2], barre: 2 },

  // SÉTIMAS E OUTROS
  'C7': { frets: ['x', 3, 2, 3, 1, 0] },
  'D7': { frets: ['x', 'x', 0, 2, 1, 2] },
  'E7': { frets: [0, 2, 0, 1, 0, 0] },
  'G7': { frets: [3, 2, 0, 0, 0, 1] },
  'A7': { frets: ['x', 0, 2, 0, 2, 0] },
  'B7': { frets: ['x', 2, 1, 2, 0, 2] },
};

export interface ExtendedSong extends Song {
  tuning?: string;
  originalKey?: string;
  intro?: string;
  imageUrl?: string;
  verified?: boolean;
  // Added rank property to fix known property errors in TRENDING_SONGS
  rank?: string;
}

export const TRENDING_SONGS: Partial<ExtendedSong>[] = [
  { rank: '01', title: 'Liberdade Provisória', artist: 'Henrique & Juliano', imageUrl: 'https://images.unsplash.com/photo-1514525253344-f251357ad165?w=50&h=50&fit=crop' },
  { rank: '02', title: 'Erro Gostoso', artist: 'Simone Mendes', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=50&h=50&fit=crop' },
  { rank: '03', title: 'Solteiro Forçado', artist: 'Ana Castela', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=50&h=50&fit=crop' },
];

export const MOCK_SONGS: ExtendedSong[] = [
  // --- SERTANEJO UNIVERSITÁRIO ---
  {
    id: 'hj-rec-1',
    title: 'Recaída',
    artist: 'Henrique & Juliano',
    genre: 'Sertanejo Universitário',
    difficulty: 'Fácil',
    originalKey: 'G',
    content: `
[G] Eu jurei não te ligar [D]
[Em] Mas a saudade não quis [C] escutar
[G] Tomei um copo e a [D] mão tremeu
[Em] Quando vi, o dedo já [C] bateu

[G] Oi, sumida [D]
[Em] Sei que não devia [C] estar ligando
[G] Mas meu coração [D] tá reclamando
[Em] Que essa cama tá so[C]zinha sem você
    `
  },
  {
    id: 'ac-sf-1',
    title: 'Solteiro Forçado',
    artist: 'Ana Castela',
    genre: 'Sertanejo Universitário',
    difficulty: 'Médio',
    originalKey: 'A',
    content: `
[A] Eu tô num bar, [E] no meio do povo
[F#m] Tentando achar meu [D] sorriso de novo
[A] Mas a boca que eu [E] beijo não é a sua
[F#m] A saudade me [D] segue no meio da rua

[A] Eu tô sendo sol[E]teiro forçado
[F#m] Com o coração [D] todo quebrado
[A] Bebendo pra ver [E] se eu te esqueço
[F#m] Mas cada gole [D] tem o seu endereço
    `
  },
  {
    id: 'zn-lt-1',
    title: 'Largado às Traças',
    artist: 'Zé Neto & Cristiano',
    genre: 'Sertanejo Universitário',
    difficulty: 'Fácil',
    originalKey: 'G',
    content: `
[G] Meu orgulho caiu [D] quando vi você chegar
[Em] Com esse sorriso [C] que me faz pirar
[G] Mas você nem olhou [D] pro meu lado
[Em] Me deixou aqui [C] todo acabado

[G] Tô aqui no bar [D] largado às traças
[Em] Bebendo cerveja [C] e ouvindo moda brava
[G] O garçom já virou [D] meu melhor amigo
[Em] Porque você não quer [C] ficar mais comigo
    `
  },

  // --- SERTANEJO TRADICIONAL / RAIZ ---
  {
    id: 'tc-am-1',
    title: 'Amargurado',
    artist: 'Tião Carreiro & Pardinho',
    genre: 'Sertanejo',
    difficulty: 'Difícil',
    originalKey: 'A',
    intro: `
e|---5---4---2---0---|
B|---5---5---3---2---|
G|---6---4---2---2---|
D|-------------------|
A|---0---------------|
E|-------------------|
    `,
    content: `
[A] No lugar onde eu [E] morava
[D] Hoje resta só o [A] chão
[A] A casinha de ma[E]deira
[D] Virou cinza no fo[A]gão

[A] O meu peito está [E] doendo
[D] De tanta amargura[A]ção
[A] Perdido neste [E] mundo
[D] Sem paz no cora[A]ção
    `
  },
  {
    id: 'tpd-tm-1',
    title: 'Telefone Mudo',
    artist: 'Trio Parada Dura',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    originalKey: 'G',
    content: `
[G] Com a minha voz [D] embargada
[C] Eu liguei pra te di[G]zer
[G] Que o nosso amor [D] não deu nada
[C] E eu cansei de so[G]frer

[G] Quero que o meu [D] telefone
[C] Fique mudo de uma [G] vez
[G] Pra não ouvir [D] o seu nome
[C] Nem saber o que você [G] fez
    `
  },
  {
    id: 'mjr-ba-1',
    title: 'Boate Azul',
    artist: 'Milionário & José Rico',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    originalKey: 'Am',
    content: `
[Am] Doente de amor procu[E]rei remédio na vida notur[Am]na
[Am] Com a flor da noi[E]te em uma boate azul eu me encon[Am]trei
[A7] Beber com emer[Dm]gência
[G] Eu não sou vagabun[C]do, eu não sou delin[E]quente

[Am] E na zona sul [E] eu me senti um rei
[Am] Com as mulheres [E] que eu nunca amei
[Am] Bebendo e choran[E]do por quem me dei[Am]xou
    `
  },
  {
    id: 'zz-nd-1',
    title: 'No Dia Em Que Eu Saí De Casa',
    artist: 'Zezé Di Camargo & Luciano',
    genre: 'Sertanejo',
    difficulty: 'Médio',
    originalKey: 'E',
    content: `
[E] No dia em que eu saí de [B] casa
[A] Minha mãe me disse: [E] Filho, vem cá
[E] Passou a mão em meus ca[B]belos
[A] Olhou em meus olhos e come[E]çou falar

[E] O mundo é grande e o [B] destino
[A] Pode te levar pra [E] longe daqui
[E] Mas nunca se eske[B]ça, meu filho
[A] Do lugar onde você [E] nasceu
    `
  },
  {
    id: 'll-pm-1',
    title: 'Pense em Mim',
    artist: 'Leandro & Leonardo',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    originalKey: 'C',
    content: `
[C] Em vez de você ficar [G] pensando nele
[Am] Em vez de você viver [F] chorando por ele
[C] Pense em [G] mim, chore por [Am] mim
[F] Liga pra [C] mim, não não liga pra [G] ele

[C] Pra que viver as[G]sim
[Am] Se você tem a [F] mim
[C] Eskeça esse cara e [G] vem me fazer fe[C]liz
    `
  },
  {
    id: 'vl-fa-1',
    title: 'Fada',
    artist: 'Victor & Leo',
    genre: 'Sertanejo',
    difficulty: 'Fácil',
    originalKey: 'D',
    content: `
[D] Fada, por que você me [A] deixou
[G] Se o meu mundo era [D] você
[D] Fada, meu sonho se [A] apagou
[G] Eu não sei como eske[D]cer

[D] Volta, traz o meu [A] sorriso
[G] Tudo o que eu [D] preciso
[D] É de um beijo [A] seu
[G] Pra me sentir no [D] céu
    `
  },
  {
    id: 'mm-qc-1',
    title: 'De Quem É A Culpa',
    artist: 'Marília Mendonça',
    genre: 'Sofrência',
    difficulty: 'Médio',
    originalKey: 'A',
    content: `
[A] De quem é a culpa [E] se eu te amo tanto
[F#m] De quem é a culpa [D] desse meu pranto
[A] Eu tentei fugir, [E] tentei me esconder
[F#m] Mas meu coração só [D] quer você

[A] E agora eu tô [E] aqui
[F#m] Sozinha no meu [D] quarto
[A] Olhando sua [E] foto
[F#m] E morrendo de [D] saudade
    `
  }
];

export const POPULAR_ARTISTS = [
  { name: 'Ana Castela', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=120&h=120&fit=crop' },
  { name: 'Henrique & Juliano', imageUrl: 'https://images.unsplash.com/photo-1514525253344-f251357ad165?w=120&h=120&fit=crop' },
  { name: 'Tião Carreiro', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=120&h=120&fit=crop' },
  { name: 'Marília Mendonça', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=120&h=120&fit=crop' },
  { name: 'Zezé Di Camargo', imageUrl: 'https://images.unsplash.com/photo-1459749411177-0421800673d6?w=120&h=120&fit=crop' },
  { name: 'Jorge & Mateus', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop' },
];
