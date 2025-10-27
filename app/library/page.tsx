'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Song } from '@/lib/storage';

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      if (response.ok) {
        const data = await response.json();
        setSongs(data.songs || []);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Library</h1>
          <p className="text-gray-600">
            {songs.length === 0
              ? 'No remixes yet. Create your first one!'
              : `${songs.length} remix${songs.length !== 1 ? 'es' : ''} created`}
          </p>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Remixes Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start creating your first AI-powered remix!
            </p>
            <Link
              href="/record"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Create Your First Remix
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/result/${song.id}`}
                className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">
                    {getStyleIcon(song.style)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 capitalize">
                      {song.style} Remix
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(song.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {song.metadata?.transcription && (
                  <p className="text-sm text-gray-600 italic line-clamp-2 mb-3">
                    "{song.metadata.transcription}"
                  </p>
                )}

                <div className="flex gap-2 text-xs text-gray-500">
                  {song.metadata?.mood && (
                    <span className="px-2 py-1 bg-gray-100 rounded capitalize">
                      {song.metadata.mood}
                    </span>
                  )}
                  {song.metadata?.bpm && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {song.metadata.bpm} BPM
                    </span>
                  )}
                  {song.metadata?.key && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {song.metadata.key}
                    </span>
                  )}
                </div>

                {song.output_url && (
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                      ▶️ Play
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getStyleIcon(style: string): string {
  const icons: Record<string, string> = {
    pop: '🎤',
    rock: '🎸',
    jazz: '🎷',
    electronic: '🎹',
    hiphop: '🎧',
    acoustic: '🪕',
    lofi: '🌙',
    country: '🤠',
  };
  return icons[style] || '🎵';
}

