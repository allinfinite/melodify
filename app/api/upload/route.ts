import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file size (25MB max)
    const maxSize = 25 * 1024 * 1024;
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `audio_${timestamp}_${audioFile.name}`;

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Vercel serverless functions can only write to /tmp
    const isVercel = process.env.VERCEL === '1';
    const uploadsDir = isVercel ? '/tmp' : join(process.cwd(), 'public', 'uploads');
    
    // Create uploads directory if it doesn't exist (local dev only)
    if (!isVercel && !existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    console.log(`File saved to: ${filePath}`);

    // Return public URL
    // On Vercel, serve from API route; locally, serve from /uploads
    const fileUrl = isVercel ? `/api/temp-file/${fileName}` : `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

