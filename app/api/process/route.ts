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

    // Analyze the audio using Whisper
    // Use mock if API key is not configured
    const useMock = !process.env.OPENAI_API_KEY;
    
    let analysis;
    if (useMock) {
      console.log('Using mock mode for audio analysis');
      analysis = await analyzeAudioMock(fileUrl);
    } else {
      console.log('Using real Whisper API for audio analysis');
      try {
        analysis = await analyzeAudio(fileUrl);
      } catch (error) {
        console.warn('Whisper API failed, falling back to mock mode:', error);
        analysis = await analyzeAudioMock(fileUrl);
      }
    }

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

