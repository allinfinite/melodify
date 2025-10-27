'use client';

import { useState, useRef, useEffect } from 'react';
import { downloadAudio } from '@/utils/audioUtils';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  onShare?: () => void;
}

export default function AudioPlayer({ audioUrl, title = 'Your Remix', onShare }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = (e: Event) => {
      console.error('Audio error event:', e);
      setIsLoading(false);
      setIsPlaying(false);
      
      const audioElement = e.target as HTMLAudioElement;
      const errorCode = audioElement.error?.code;
      const errorMessage = audioElement.error?.message;
      
      console.error('Error code:', errorCode);
      console.error('Error message:', errorMessage);
      console.error('Audio src:', audioElement.src);
      console.error('Audio currentSrc:', audioElement.currentSrc);
      
      let displayMessage = 'Unable to play audio file';
      if (errorCode === 4) {
        displayMessage = 'Audio file not found (404) or format not supported';
      } else if (errorCode === 3) {
        displayMessage = 'Audio file is corrupted or unreadable';
      } else if (errorCode === 2) {
        displayMessage = 'Network error loading audio';
      } else if (errorCode === 1) {
        displayMessage = 'Audio loading aborted';
      }
      
      setError(`${displayMessage} (Error code: ${errorCode})`);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Check if audio URL is valid
    if (!audioUrl || audioUrl === '') {
      setError('No audio URL provided');
      setIsLoading(false);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.error('Play error:', err);
      setError(err.message || 'Unable to play audio');
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    downloadAudio(audioUrl, `${title}.mp3`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out my AI-generated remix on Melodify! 🎵`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl">
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous">
        <source src={audioUrl} type="audio/webm" />
        <source src={audioUrl} type="audio/webm;codecs=opus" />
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p className="font-semibold">⚠️ Audio Error</p>
          <p className="text-sm mb-2">{error}</p>
          <details className="text-xs">
            <summary className="cursor-pointer font-semibold">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <p><strong>Audio URL:</strong> {audioUrl}</p>
              <p><strong>URL Type:</strong> {audioUrl?.startsWith('http') ? 'Absolute' : audioUrl?.startsWith('/') ? 'Relative' : 'Blob/Other'}</p>
              <p><strong>File exists test:</strong> <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="underline">Click to test</a></p>
            </div>
          </details>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">Your AI-generated remix is ready!</p>
      </div>

      {/* Waveform Visualization (Simplified) */}
      <div className="mb-6 h-24 bg-white rounded-lg p-4 flex items-center justify-center gap-1">
        {[...Array(50)].map((_, i) => {
          const height = Math.random() * 60 + 20;
          const isActive = (currentTime / duration) * 50 > i;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-colors ${
                isActive ? 'bg-purple-600' : 'bg-gray-300'
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Play/Pause Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            disabled={isLoading || !!error}
            className={`w-16 h-16 rounded-full text-white transition shadow-lg flex items-center justify-center text-2xl ${
              isLoading || error 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶️'}
          </button>
        </div>
        
        {isLoading && !error && (
          <p className="text-center text-sm text-gray-600">Loading audio...</p>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2"
          >
            📥 Download
          </button>
          
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold flex items-center gap-2"
          >
            🔗 Copy Link
          </button>
          
          <button
            onClick={handleShareTwitter}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center gap-2"
          >
            🐦 Share
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

