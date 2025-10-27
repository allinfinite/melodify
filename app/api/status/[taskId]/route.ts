import { NextRequest, NextResponse } from 'next/server';
import { getGenerationStatus, getTimestampedLyrics } from '@/lib/sunoClient';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    console.log('=== Status Check ===');
    console.log('Task ID:', taskId);

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SUNO_API_KEY;
    
    // Get current task status
    const status = await getGenerationStatus(taskId, apiKey);
    
    console.log('Task status:', status.status);
    console.log('Has audio URL:', !!status.audio_url);

    // If complete, fetch lyrics
    let lyrics = null;
    if (status.status === 'complete' && status.audioId) {
      try {
        lyrics = await getTimestampedLyrics(taskId, status.audioId);
        console.log('Got timestamped lyrics');
      } catch (lyricError) {
        console.warn('Failed to get lyrics:', lyricError);
      }
    }

    return NextResponse.json({
      success: true,
      status: status.status,
      audioUrl: status.audio_url,
      imageUrl: status.image_url,
      metadata: status.metadata,
      lyrics: lyrics,
      error: status.error_message,
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check status' },
      { status: 500 }
    );
  }
}

