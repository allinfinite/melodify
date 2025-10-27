import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AudioAnalysis {
  transcription: string;
  key?: string;
  bpm?: number;
  mood?: string;
  duration?: number;
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(audioFileUrl: string): Promise<string> {
  try {
    // Convert relative URL to absolute URL if needed
    let fullUrl = audioFileUrl;
    if (audioFileUrl.startsWith('/')) {
      // In development, use localhost. In production, this should be your domain
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      fullUrl = `${baseUrl}${audioFileUrl}`;
    }

    // Download the audio file
    const audioResponse = await fetch(fullUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio file: ${audioResponse.status}`);
    }
    
    const audioBlob = await audioResponse.blob();
    
    // Convert to File object
    const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    });

    return transcription as unknown as string;
  } catch (error) {
    console.error('Whisper API error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Analyze audio file and extract metadata
 * Note: Key, BPM, and mood detection would require additional audio analysis libraries
 * This is a simplified version - in production, you'd use libraries like:
 * - Essentia.js for music analysis
 * - Web Audio API for basic analysis
 * - Or external services like Spotify Audio Analysis API
 */
export async function analyzeAudio(audioFileUrl: string): Promise<AudioAnalysis> {
  try {
    const transcription = await transcribeAudio(audioFileUrl);

    // Basic mood inference from transcription (simplified)
    const mood = inferMoodFromText(transcription);

    return {
      transcription,
      mood,
      // These would come from actual audio analysis in production
      key: 'C major', // Placeholder
      bpm: 120, // Placeholder
    };
  } catch (error) {
    console.error('Audio analysis error:', error);
    throw error;
  }
}

/**
 * Simple mood inference based on text content
 */
function inferMoodFromText(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.match(/happy|joy|excited|fun|celebrate/)) {
    return 'happy';
  } else if (lowerText.match(/sad|lonely|cry|miss|lost/)) {
    return 'sad';
  } else if (lowerText.match(/angry|mad|hate|fight/)) {
    return 'angry';
  } else if (lowerText.match(/calm|peace|relax|quiet/)) {
    return 'calm';
  } else if (lowerText.match(/love|heart|romance/)) {
    return 'romantic';
  }
  
  return 'neutral';
}

/**
 * Mock implementation for testing without API key
 */
export async function analyzeAudioMock(audioFileUrl: string): Promise<AudioAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    transcription: 'This is a sample transcription of the audio content.',
    key: 'C major',
    bpm: 120,
    mood: 'happy',
    duration: 180,
  };
}

