import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'VOID_PROTOCOL.exe',
    artist: 'NEON_ARCHITECT',
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'GLITCH_DIVINITY',
    artist: 'CYBER_SORCERER',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'SYNTH_HORIZON_99',
    artist: 'DATA_DRIVE',
    cover: 'https://images.unsplash.com/photo-1633545504221-5079ad3ff717?q=80&w=800&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 2;
