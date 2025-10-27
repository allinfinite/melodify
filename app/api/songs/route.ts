import { NextResponse } from 'next/server';
import { getAllSongs } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const songs = getAllSongs();

    return NextResponse.json({
      success: true,
      songs,
      count: songs.length,
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

