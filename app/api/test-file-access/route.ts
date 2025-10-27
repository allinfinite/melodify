import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';

export const runtime = 'nodejs';

/**
 * Test endpoint to check what files are in /tmp
 */
export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST FILE ACCESS ===');
    
    // List all files in /tmp
    const files = await readdir('/tmp');
    const audioFiles = files.filter(f => f.startsWith('audio_'));
    
    console.log('Total files in /tmp:', files.length);
    console.log('Audio files:', audioFiles);
    
    return NextResponse.json({
      success: true,
      totalFiles: files.length,
      audioFiles: audioFiles,
      allFiles: files.slice(0, 50), // First 50 files
    });
  } catch (error: any) {
    console.error('Error listing /tmp:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

