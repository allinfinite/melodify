/**
 * Audio utility functions for file validation and processing
 */

export const SUPPORTED_FORMATS = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm'];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return { valid: false, error: 'Unsupported audio format. Please use WAV, MP3, OGG, or WebM.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 25MB.' };
  }

  return { valid: true };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function downloadAudio(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

