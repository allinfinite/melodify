import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Serve files from /tmp directory (Vercel serverless)
 * This is needed because /tmp is not publicly accessible
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Security: Only allow files that start with 'audio_'
    if (!filename.startsWith('audio_')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const filePath = join('/tmp', filename);
    
    try {
      const fileBuffer = await readFile(filePath);
      
      // Determine content type from filename
      const contentType = filename.endsWith('.webm') 
        ? 'audio/webm'
        : filename.endsWith('.mp3')
        ? 'audio/mpeg'
        : filename.endsWith('.wav')
        ? 'audio/wav'
        : 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Disposition': `inline; filename="${filename}"`,
        },
      });
    } catch (fileError) {
      console.error('File not found:', filePath);
      return NextResponse.json(
        { error: 'File not found or expired' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error serving temp file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

