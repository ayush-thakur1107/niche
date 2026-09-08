import { create } from 'zustand';

export type CursorMode =
  | 'DEFAULT'
  | 'WATCH'
  | 'OPEN'
  | 'PAN'
  | 'PLAY'
  | 'DRAG'
  | 'EXPLORE'
  | 'EXPAND'
  | 'HIDDEN';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  duration: string;
  externalUrl: string;
  genre: string;
  spotifyEmbedUrl?: string;
}

export function parseSpotifyEmbedUrl(input: string): string {
  if (!input || !input.trim()) return '';
  const trimmed = input.trim();

  // Already an embed URL
  if (trimmed.includes('open.spotify.com/embed/')) {
    return trimmed;
  }

  // Handle spotify:type:id URI
  if (trimmed.startsWith('spotify:')) {
    const parts = trimmed.split(':');
    if (parts.length >= 3) {
      const type = parts[1];
      const id = parts[2];
      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    }
  }

  // Handle open.spotify.com/type/id
  const match = trimmed.match(/open\.spotify\.com\/(track|playlist|album|artist|episode)\/([a-zA-Z0-9]+)/);
  if (match) {
    const [, type, id] = match;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  // Fallback search embed
  return `https://open.spotify.com/embed/search/${encodeURIComponent(trimmed)}?theme=0`;
}

export const CURATED_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Raga Yaman (Vilambit Ektaal)',
    artist: 'Ustad Shahid Parvez',
    album: 'Echoes of Ancient Sitar',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    duration: '14:28',
    externalUrl: 'https://open.spotify.com/search/Raga%20Yaman%20Shahid%20Parvez',
    genre: 'Indian Classical Sitar',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/2b8fOtg0nmWPn8qN28H2gq?theme=0'
  },
  {
    id: 'track-2',
    title: '2049 (Synth Atmosphere)',
    artist: 'Hans Zimmer & Benjamin Wallfisch',
    album: 'Blade Runner 2049',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    duration: '03:37',
    externalUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    genre: 'Cyberpunk Ambient',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT?theme=0'
  },
  {
    id: 'track-3',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    album: 'Minimalist Reveries',
    coverImage: 'https://images.unsplash.com/photo-1520523839898-5071212c1c69?w=300&auto=format&fit=crop&q=80',
    duration: '03:12',
    externalUrl: 'https://open.spotify.com/track/5NGtFXV1hlunSlIuiz9a23',
    genre: 'Minimalist Classical',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/5NGtFXV1hlunSlIuiz9a23?theme=0'
  },
  {
    id: 'track-4',
    title: 'Stalker: Meditation Theme',
    artist: 'Eduard Artemyev',
    album: 'Tarkovsky Soundscapes',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    duration: '05:40',
    externalUrl: 'https://open.spotify.com/search/Eduard%20Artemyev%20Stalker',
    genre: 'Philosophical Ambient',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/7l5M2xPcrwL6hAaoVqfWvG?theme=0'
  }
];

export interface SpotifyPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  embedUrl: string;
  description: string;
}

export const SPOTIFY_PRESETS: SpotifyPreset[] = [
  {
    id: 'preset-focus',
    name: 'Deep Focus & Flow State',
    category: 'AMBIENT',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?theme=0',
    description: 'Post-rock and atmospheric soundscapes for deep intellectual concentration.'
  },
  {
    id: 'preset-noir',
    name: 'Cyberpunk & Neo-Noir',
    category: 'CINEMATIC',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX9uKNf5jGX6m',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m?theme=0',
    description: 'Dark synth, Vangelis echoes, and brutalist cinematic sound.'
  },
  {
    id: 'preset-sitar',
    name: 'Indian Classical Heritage',
    category: 'RAGAS',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?theme=0',
    description: 'Vilambit and Drut sitar, sarod, and rudra veena ragas.'
  },
  {
    id: 'preset-classical',
    name: 'Peaceful Classical Piano',
    category: 'PIANO',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?theme=0',
    description: 'Debussy, Chopin, Satie, and contemporary neoclassical works.'
  }
];

interface InteractionState {
  // Cursor
  cursorMode: CursorMode;
  cursorText?: string;
  setCursor: (mode: CursorMode, text?: string) => void;
  resetCursor: () => void;

  // Music Player
  currentTrack: Track | null;
  isPlaying: boolean;
  isPlayerExpanded: boolean;
  volume: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  togglePlayerExpanded: () => void;
  setPlayerExpanded: (expanded: boolean) => void;

  // Spotify Personal Layer
  userSpotifyLink: string;
  userSpotifyEmbedUrl: string;
  setSpotifyLink: (link: string) => void;
}

const getStoredSpotifyLink = (): { link: string; embedUrl: string } => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nm_spotify_link');
    if (saved) {
      return { link: saved, embedUrl: parseSpotifyEmbedUrl(saved) };
    }
  }
  const defaultLink = 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM';
  return {
    link: defaultLink,
    embedUrl: parseSpotifyEmbedUrl(defaultLink)
  };
};

const initialSpotify = getStoredSpotifyLink();

export const useInteractionStore = create<InteractionState>((set) => ({
  cursorMode: 'DEFAULT',
  cursorText: undefined,
  setCursor: (mode, text) => set({ cursorMode: mode, cursorText: text }),
  resetCursor: () => set({ cursorMode: 'DEFAULT', cursorText: undefined }),

  currentTrack: CURATED_TRACKS[0],
  isPlaying: false,
  isPlayerExpanded: false,
  volume: 0.8,
  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (vol) => set({ volume: vol }),
  togglePlayerExpanded: () => set((state) => ({ isPlayerExpanded: !state.isPlayerExpanded })),
  setPlayerExpanded: (expanded) => set({ isPlayerExpanded: expanded }),

  userSpotifyLink: initialSpotify.link,
  userSpotifyEmbedUrl: initialSpotify.embedUrl,
  setSpotifyLink: (link) => {
    const embedUrl = parseSpotifyEmbedUrl(link);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nm_spotify_link', link);
    }
    set({ userSpotifyLink: link, userSpotifyEmbedUrl: embedUrl });
  }
}));
