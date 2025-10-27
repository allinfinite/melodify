'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StyleSelector from '@/components/StyleSelector';
import LoadingWave from '@/components/LoadingWave';
import { type MusicStyle } from '@/utils/prompts';

export default function GeneratePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    // Get data from session storage
    const fileUrl = sessionStorage.getItem('audioFileUrl');
    const metadataStr = sessionStorage.getItem('audioMetadata');

    if (!fileUrl) {
      router.push('/record');
      return;
    }

    setAudioFileUrl(fileUrl);
    if (metadataStr) {
      setMetadata(JSON.parse(metadataStr));
    }
  }, [router]);

  const handleGenerate = async () => {
    if (!selectedStyle || !audioFileUrl) return;

    setIsGenerating(true);
    setError(null);

    try {
      console.log('🎵 Starting generation...');
      console.log('Audio file URL:', audioFileUrl);
      console.log('Selected style:', selectedStyle.id);

      const response = await fetch('/api/suno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: audioFileUrl,
          style: selectedStyle.id,
          metadata: metadata,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      // Store result and navigate to result page
      const resultId = data.songId || Date.now().toString();
      const audioUrl = data.audioUrl || audioFileUrl; // Fallback to input if no output
      
      console.log('Result song ID:', resultId);
      console.log('Result audio URL:', audioUrl);
      
      if (!audioUrl) {
        console.error('No audio URL in response!');
        throw new Error('No audio URL returned from generation');
      }

      sessionStorage.setItem('resultAudioUrl', audioUrl);
      sessionStorage.setItem('resultMetadata', JSON.stringify({
        style: selectedStyle,
        ...data.metadata,
      }));
      
      console.log('✅ Stored in sessionStorage, navigating to result page');
      router.push(`/result/${resultId}`);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGenerating(false);
    }
  };

  if (!audioFileUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <LoadingWave message="Creating your masterpiece..." />
          <p className="mt-4 text-gray-600 text-sm max-w-md mx-auto">
            ⏳ This takes 1-2 minutes. The AI is composing your music and checking every 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <StyleSelector
        onSelectStyle={setSelectedStyle}
        selectedStyle={selectedStyle}
      />

      {selectedStyle && (
        <div className="mt-8 text-center">
          <button
            onClick={handleGenerate}
            className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            ✨ Generate My Remix
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-2xl">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {metadata && (
        <div className="mt-8 max-w-2xl w-full p-6 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Audio Analysis</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {metadata.transcription && (
              <div className="col-span-2">
                <p className="text-gray-600 font-semibold">Transcription:</p>
                <p className="text-gray-800 italic">"{metadata.transcription}"</p>
              </div>
            )}
            {metadata.mood && (
              <div>
                <p className="text-gray-600 font-semibold">Mood:</p>
                <p className="text-gray-800 capitalize">{metadata.mood}</p>
              </div>
            )}
            {metadata.key && (
              <div>
                <p className="text-gray-600 font-semibold">Key:</p>
                <p className="text-gray-800">{metadata.key}</p>
              </div>
            )}
            {metadata.bpm && (
              <div>
                <p className="text-gray-600 font-semibold">BPM:</p>
                <p className="text-gray-800">{metadata.bpm}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

