import { NextRequest, NextResponse } from 'next/server';
import { analyzeAudio, analyzeAudioMock } from '@/lib/whisperClient';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileUrl } = body;

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'No file URL provided' },
        { status: 400 }
      );
    }

    // Audio analysis is optional - use mock mode for now
    // Whisper transcription requires the file to be publicly accessible
    // which can be tricky in serverless environments
    console.log('Using mock mode for audio analysis (Whisper skipped)');
    const analysis = await analyzeAudioMock(fileUrl);

    return NextResponse.json({
      success: true,
      transcription: analysis.transcription,
      key: analysis.key,
      bpm: analysis.bpm,
      mood: analysis.mood,
      duration: analysis.duration,
    });
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

