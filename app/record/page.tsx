'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Recorder from '@/components/Recorder';
import { validateAudioFile } from '@/utils/audioUtils';

export default function RecordPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File | Blob) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file if it's a File object
      if (file instanceof File) {
        const validation = validateAudioFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Invalid file');
          setIsUploading(false);
          return;
        }
      }

      // Upload to API
      const formData = new FormData();
      formData.append('audio', file, file instanceof File ? file.name : 'recording.webm');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      // Process the audio
      const processResponse = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: uploadData.fileUrl }),
      });

      const processData = await processResponse.json();

      if (!processData.success) {
        throw new Error(processData.error || 'Processing failed');
      }

      // Store data and navigate to generate page
      sessionStorage.setItem('audioFileUrl', uploadData.fileUrl);
      sessionStorage.setItem('audioMetadata', JSON.stringify(processData));
      router.push('/generate');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    handleUpload(blob);
  };

  const handleFileUpload = (file: File) => {
    handleUpload(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {isUploading ? (
        <div className="text-center space-y-4">
          <div className="flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-12 bg-purple-600 rounded-full animate-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <p className="text-xl font-semibold text-gray-700">
            Uploading and processing your audio...
          </p>
        </div>
      ) : (
        <>
          <Recorder
            onRecordingComplete={handleRecordingComplete}
            onFileUpload={handleFileUpload}
          />
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-2xl">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

