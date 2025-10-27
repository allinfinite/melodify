import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

    // Check if we're on Vercel with Blob storage configured
    const isVercel = process.env.VERCEL === '1';
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    console.log('Upload environment:', { isVercel, hasBlobToken });

    // Use Vercel Blob on production, local files in dev
    if (isVercel && hasBlobToken) {
      console.log('📤 Uploading to Vercel Blob...');
      
      // Upload to Vercel Blob (persistent, publicly accessible)
      const blob = await put(fileName, audioFile, {
        access: 'public',
        contentType: audioFile.type || 'audio/webm',
      });

      console.log('✅ Uploaded to Blob:', blob.url);

      return NextResponse.json({
        success: true,
        fileUrl: blob.url, // Publicly accessible URL
        fileName: fileName,
        storage: 'vercel-blob',
      });
    } else {
      // Local development: save to public/uploads
      console.log('💾 Saving to local filesystem...');
      
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      console.log(`File saved to: ${filePath}`);

      return NextResponse.json({
        success: true,
        fileUrl: `/uploads/${fileName}`,
        fileName: fileName,
        storage: 'local',
      });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

