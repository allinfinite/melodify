/**
 * Style presets and prompt templates for Suno API
 */

export interface MusicStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  tags: string[];
}

export const MUSIC_STYLES: MusicStyle[] = [
  {
    id: 'pop',
    name: 'Pop',
    description: 'Catchy, upbeat, and radio-friendly',
    icon: '🎤',
    prompt: 'modern pop with catchy hooks, bright production, contemporary sound',
    tags: ['pop', 'upbeat', 'catchy', 'modern'],
  },
  {
    id: 'rock',
    name: 'Rock',
    description: 'Powerful guitars and driving rhythm',
    icon: '🎸',
    prompt: 'rock with electric guitars, powerful drums, energetic arrangement',
    tags: ['rock', 'electric guitar', 'powerful', 'energetic'],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    description: 'Smooth, sophisticated, and soulful',
    icon: '🎷',
    prompt: 'smooth jazz with sophisticated harmonies, soulful arrangement, swing feel',
    tags: ['jazz', 'smooth', 'soulful', 'swing'],
  },
  {
    id: 'electronic',
    name: 'Electronic',
    description: 'Synths, beats, and digital textures',
    icon: '🎹',
    prompt: 'electronic music with synthesizers, modern beats, digital production',
    tags: ['electronic', 'synth', 'edm', 'modern'],
  },
  {
    id: 'hiphop',
    name: 'Hip Hop',
    description: 'Urban beats and rhythmic flow',
    icon: '🎧',
    prompt: 'hip hop with urban beats, rhythmic flow, modern production',
    tags: ['hip hop', 'rap', 'urban', 'beats'],
  },
  {
    id: 'acoustic',
    name: 'Acoustic',
    description: 'Organic, intimate, and natural',
    icon: '🪕',
    prompt: 'acoustic arrangement with organic instruments, intimate feel, natural sound',
    tags: ['acoustic', 'organic', 'intimate', 'natural'],
  },
  {
    id: 'lofi',
    name: 'Lo-Fi',
    description: 'Chill, nostalgic, and relaxed',
    icon: '🌙',
    prompt: 'lo-fi hip hop with chill beats, nostalgic atmosphere, relaxed vibe',
    tags: ['lofi', 'chill', 'nostalgic', 'relaxed'],
  },
  {
    id: 'country',
    name: 'Country',
    description: 'Storytelling with twang and heart',
    icon: '🤠',
    prompt: 'country music with storytelling, acoustic guitars, heartfelt vocals',
    tags: ['country', 'acoustic', 'storytelling', 'americana'],
  },
];

export function buildSunoPrompt(style: MusicStyle, customPrompt?: string): string {
  if (customPrompt) {
    return customPrompt;
  }
  return `Remix the vocals into a ${style.prompt}`;
}

export function getStyleById(styleId: string): MusicStyle | undefined {
  return MUSIC_STYLES.find(style => style.id === styleId);
}

