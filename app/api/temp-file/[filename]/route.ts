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
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    
    console.log('=== TEMP FILE REQUEST ===');
    console.log('Filename:', filename);
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers));
    
    // Security: Only allow files that start with 'audio_'
    if (!filename.startsWith('audio_')) {
      console.error('Invalid filename:', filename);
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const filePath = join('/tmp', filename);
    console.log('Reading from:', filePath);
    
    // Check if file exists first
    const fs = await import('fs/promises');
    try {
      const stats = await fs.stat(filePath);
      console.log('File exists! Size:', stats.size, 'bytes');
    } catch (statError: any) {
      console.error('File does not exist:', filePath);
      console.error('Stat error:', statError.message);
      
      // List /tmp directory to see what files are there
      try {
        const files = await fs.readdir('/tmp');
        console.log('Files in /tmp:', files.filter(f => f.startsWith('audio_')));
      } catch (lsError) {
        console.error('Cannot list /tmp:', lsError);
      }
      
      return NextResponse.json(
        { error: 'File not found', filename, checked: filePath },
        { status: 404 }
      );
    }
    
    try {
      const fileBuffer = await readFile(filePath);
      console.log('File found, size:', fileBuffer.length, 'bytes');
      
      // Determine content type from filename
      const contentType = filename.endsWith('.webm') 
        ? 'audio/webm'
        : filename.endsWith('.mp3')
        ? 'audio/mpeg'
        : filename.endsWith('.wav')
        ? 'audio/wav'
        : 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    } catch (fileError: any) {
      console.error('File not found:', filePath, fileError.message);
      return NextResponse.json(
        { error: 'File not found or expired' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error serving temp file:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

