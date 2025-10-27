/**
 * In-memory storage for songs and user data
 * Replaces Supabase for simpler local development
 */

export interface Song {
  id: string;
  input_url: string;
  output_url: string | null;
  style: string;
  prompt: string | null;
  metadata: {
    bpm?: number;
    key?: string;
    mood?: string;
    transcription?: string;
  };
  created_at: string;
}

export interface AudioFile {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

// In-memory stores
const songsStore = new Map<string, Song>();
const audioFilesStore = new Map<string, AudioFile>();

// Song operations
export function createSong(
  inputUrl: string,
  style: string,
  prompt: string | null,
  metadata: any
): Song {
  const song: Song = {
    id: generateId(),
    input_url: inputUrl,
    output_url: null,
    style,
    prompt,
    metadata,
    created_at: new Date().toISOString(),
  };
  
  songsStore.set(song.id, song);
  return song;
}

export function updateSongOutput(songId: string, outputUrl: string): void {
  const song = songsStore.get(songId);
  if (song) {
    song.output_url = outputUrl;
    songsStore.set(songId, song);
  }
}

export function getSongById(songId: string): Song | null {
  return songsStore.get(songId) || null;
}

export function getAllSongs(): Song[] {
  return Array.from(songsStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Audio file operations
export function storeAudioFile(filename: string, buffer: Buffer): AudioFile {
  const audioFile: AudioFile = {
    id: generateId(),
    url: `/uploads/${filename}`,
    filename,
    createdAt: new Date().toISOString(),
  };
  
  audioFilesStore.set(audioFile.id, audioFile);
  return audioFile;
}

export function getAudioFile(id: string): AudioFile | null {
  return audioFilesStore.get(id) || null;
}

// Helper function to generate IDs
function generateId(): string {
  try {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  } catch (error) {
    console.error('Error generating ID:', error);
    return `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  }
}

// Clear all data (useful for testing)
export function clearAllData(): void {
  songsStore.clear();
  audioFilesStore.clear();
}

// Get stats
export function getStats() {
  return {
    totalSongs: songsStore.size,
    totalAudioFiles: audioFilesStore.size,
  };
}

