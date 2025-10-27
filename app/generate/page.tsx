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

      // Check if we got a taskId (async processing) or audioUrl (mock/complete)
      if (data.taskId) {
        // Real Suno API - poll for status
        console.log('Polling for task completion:', data.taskId);
        const status = await pollTaskStatus(data.taskId);
        
        // Store result and navigate
        const resultId = data.songId || Date.now().toString();
        sessionStorage.setItem('resultAudioUrl', status.audioUrl);
        sessionStorage.setItem('resultMetadata', JSON.stringify({
          style: selectedStyle,
          ...status.metadata,
          lyrics: status.lyrics,
        }));
        
        console.log('✅ Stored in sessionStorage, navigating to result page');
        router.push(`/result/${resultId}`);
      } else if (data.audioUrl) {
        // Mock mode - has audioUrl immediately
        const resultId = data.songId || Date.now().toString();
        sessionStorage.setItem('resultAudioUrl', data.audioUrl);
        sessionStorage.setItem('resultMetadata', JSON.stringify({
          style: selectedStyle,
          ...data.metadata,
          lyrics: data.lyrics,
        }));
        
        console.log('✅ Stored in sessionStorage, navigating to result page');
        router.push(`/result/${resultId}`);
      } else {
        throw new Error('No taskId or audioUrl returned from generation');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGenerating(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    console.log('🔍 Starting to poll task status...');
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`📊 Polling attempt ${attempt}/${maxAttempts}...`);
        
        const response = await fetch(`/api/status/${taskId}`);
        const data = await response.json();
        
        console.log('Poll response:', data);
        
        if (data.status === 'complete') {
          console.log('✅ Generation complete!');
          return data;
        }
        
        if (data.status === 'error') {
          throw new Error(data.error || 'Generation failed');
        }
        
        // Still processing - wait 5 seconds
        if (attempt < maxAttempts) {
          console.log(`⏳ Status: ${data.status}, waiting 5s...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (pollError) {
        console.error('Polling error:', pollError);
        throw pollError;
      }
    }
    
    throw new Error('Generation timeout - exceeded 5 minutes');
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
            ⏳ This takes 1-2 minutes. We're polling Suno API every 5 seconds to check if your music is ready...
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

