'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';
import Link from 'next/link';

export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from session storage first
    const sessionAudioUrl = sessionStorage.getItem('resultAudioUrl');
    const sessionMetadata = sessionStorage.getItem('resultMetadata');

    console.log('=== Result Page Loading ===');
    console.log('Session audio URL:', sessionAudioUrl);
    console.log('Session metadata:', sessionMetadata);

    if (sessionAudioUrl && sessionAudioUrl !== 'undefined' && sessionAudioUrl !== 'null') {
      console.log('✅ Found audio URL in session:', sessionAudioUrl);
      
      // Ensure URL is absolute
      let fullUrl = sessionAudioUrl;
      if (sessionAudioUrl.startsWith('/')) {
        // Convert relative URL to absolute
        fullUrl = `${window.location.origin}${sessionAudioUrl}`;
        console.log('Converted to absolute URL:', fullUrl);
      } else if (sessionAudioUrl.startsWith('blob:')) {
        console.log('Using blob URL:', sessionAudioUrl);
        fullUrl = sessionAudioUrl;
      }
      
      setAudioUrl(fullUrl);
      if (sessionMetadata) {
        try {
          setMetadata(JSON.parse(sessionMetadata));
        } catch (e) {
          console.error('Error parsing metadata:', e);
        }
      }
      setLoading(false);
    } else {
      console.log('⚠️ No valid audio URL in session, fetching from API');
      // Try to fetch from API if no session data
      fetchResult(params.id);
    }
  }, [params.id]);

  const fetchResult = async (id: string) => {
    try {
      const response = await fetch(`/api/result/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched song data:', data);
        
        let fullUrl = data.output_url;
        if (fullUrl && fullUrl.startsWith('/')) {
          fullUrl = `${window.location.origin}${fullUrl}`;
        }
        
        setAudioUrl(fullUrl);
        setMetadata(data.metadata);
      } else {
        console.error('Failed to fetch result:', response.status);
      }
    } catch (error) {
      console.error('Error fetching result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex gap-2 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-gray-600">Loading your remix...</p>
        </div>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold text-gray-800">Remix Not Found</h1>
          <p className="text-gray-600">
            We couldn't find this remix. It may have expired or the link is incorrect.
          </p>
          <Link
            href="/record"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Create a New Remix
          </Link>
        </div>
      </div>
    );
  }

  const title = metadata?.style?.name
    ? `${metadata.style.name} Remix`
    : 'Your AI Remix';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🎉 Your Remix is Ready!
        </h1>
        <p className="text-gray-600">
          Listen, share, and download your AI-generated track
        </p>
      </div>

      <AudioPlayer audioUrl={audioUrl} title={title} />

      <div className="mt-8 space-y-4 text-center">
        <Link
          href="/record"
          className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Create Another Remix
        </Link>
        
        <p className="text-sm text-gray-500">
          Want more styles? Try different genres to explore your creativity!
        </p>
      </div>

      {/* Lyrics */}
      {metadata?.lyrics?.alignedWords && metadata.lyrics.alignedWords.length > 0 && (
        <div className="mt-8 max-w-2xl w-full p-6 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            🎵 Lyrics
            <span className="text-sm font-normal text-gray-500">
              (Timestamped from Suno)
            </span>
          </h3>
          <div className="text-gray-700 space-y-2 max-h-64 overflow-y-auto">
            {metadata.lyrics.alignedWords.map((word: any, idx: number) => (
              <span key={idx} className="inline-block mr-1">
                {word.word}{' '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Style Info */}
      {metadata?.style && (
        <div className="mt-8 max-w-2xl w-full p-6 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Remix Details</h3>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{metadata.style.icon}</span>
            <div>
              <p className="font-bold text-gray-800">{metadata.style.name}</p>
              <p className="text-sm text-gray-600">{metadata.style.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

