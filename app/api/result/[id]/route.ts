import { NextRequest, NextResponse } from 'next/server';
import { getSongById } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const song = getSongById(params.id);

    if (!song) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...song,
    });
  } catch (error) {
    console.error('Error fetching song:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch song' },
      { status: 500 }
    );
  }
}

