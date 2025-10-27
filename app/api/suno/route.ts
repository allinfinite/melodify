import { NextRequest, NextResponse } from 'next/server';
import { generateSong, generateSongMock, getTimestampedLyrics } from '@/lib/sunoClient';
import { createSong, updateSongOutput } from '@/lib/storage';
import { buildSunoPrompt, getStyleById } from '@/utils/prompts';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for long generation

export async function POST(request: NextRequest) {
  try {
    console.log('=== Suno API Route Called ===');
    
    const body = await request.json();
    const { fileUrl, style, prompt, metadata } = body;
    
    console.log('Request body:', { fileUrl, style, prompt, metadata });

    if (!fileUrl || !style) {
      console.error('Missing required parameters');
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get style information
    console.log('Looking up style:', style);
    const styleInfo = getStyleById(style);
    if (!styleInfo) {
      console.error('Invalid style:', style);
      return NextResponse.json(
        { success: false, error: 'Invalid style' },
        { status: 400 }
      );
    }
    console.log('Style found:', styleInfo.name);

    // Build the prompt
    const sunoPrompt = buildSunoPrompt(styleInfo, prompt);
    console.log('Built prompt:', sunoPrompt);

    // Create song record in memory
    console.log('Creating song record...');
    let songRecord;
    try {
      songRecord = createSong(fileUrl, style, prompt || null, metadata || {});
      console.log('Song record created:', songRecord.id);
    } catch (error) {
      console.error('Error creating song record:', error);
      throw error;
    }

    // Generate song using Suno API (or mock)
    const apiKey = process.env.SUNO_API_KEY;
    const useMock = !apiKey || apiKey.trim() === '';
    console.log('SUNO_API_KEY exists:', !!apiKey);
    console.log('SUNO_API_KEY value (masked):', apiKey ? apiKey.substring(0, 10) + '...' : 'not set');
    console.log('Using mock mode:', useMock);
    
    let result;
    try {
      if (useMock) {
        console.log('Calling generateSongMock...');
        result = await generateSongMock(fileUrl, style, sunoPrompt);
      } else {
        console.log('Calling real Suno API...');
        try {
          result = await generateSong(fileUrl, style, sunoPrompt);
          console.log('✅ Got result from API:', result.audio_url ? 'Has audio URL' : 'No audio URL');
        } catch (apiError: any) {
          console.error('Real Suno API failed, falling back to mock:', apiError.message);
          result = await generateSongMock(fileUrl, style, sunoPrompt);
        }
      }
      console.log('Generation result:', result);
    } catch (error) {
      console.error('Error during generation:', error);
      throw error;
    }

    if (result.status === 'error') {
      console.error('Generation returned error status:', result.error_message);
      return NextResponse.json(
        { success: false, error: result.error_message || 'Generation failed' },
        { status: 500 }
      );
    }

    // Update song record with output URL
    if (result.audio_url) {
      console.log('Updating song output URL:', result.audio_url);
      updateSongOutput(songRecord.id, result.audio_url);
    }

    // Fetch timestamped lyrics if available
    let lyrics = null;
    if (result.taskId && result.audioId && !useMock) {
      console.log('Fetching timestamped lyrics...');
      lyrics = await getTimestampedLyrics(result.taskId, result.audioId);
      if (lyrics) {
        console.log('✅ Got timestamped lyrics:', lyrics.alignedWords.length, 'words');
      }
    }

    console.log('=== Suno API Success ===');
    return NextResponse.json({
      success: true,
      status: result.status,
      audioUrl: result.audio_url,
      songId: songRecord.id,
      metadata: result.metadata,
      previewImage: result.image_url,
      lyrics: lyrics,
    });
  } catch (error: any) {
    console.error('=== Suno generation error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate song' },
      { status: 500 }
    );
  }
}

