'use client';

import { useState, useRef, useEffect } from 'react';

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

export default function Recorder({ onRecordingComplete, onFileUpload }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        alert('MediaRecorder is not supported in your browser.');
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      // Determine best MIME type for browser
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          console.log('📦 Audio chunk received:', e.data.size, 'bytes');
          chunksRef.current.push(e.data);
        } else {
          console.warn('⚠️ Empty chunk received');
        }
      };

      mediaRecorder.onstart = () => {
        console.log('✅ Recording actually started');
      };

      mediaRecorder.onstop = () => {
        console.log('🛑 Recording stopped, total chunks:', chunksRef.current.length);
        
        // Calculate total size
        const totalSize = chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
        console.log('📊 Total audio data:', totalSize, 'bytes');
        
        if (totalSize === 0) {
          alert('Recording failed: No audio data captured. Please check your microphone.');
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          return;
        }
        
        if (chunksRef.current.length === 0) {
          alert('Recording failed: No audio chunks. Try recording for longer.');
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          return;
        }
        
        const finalMimeType = mediaRecorder.mimeType || mimeType;
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        console.log('🎵 Created blob:', blob.size, 'bytes, type:', blob.type);
        
        if (blob.size < 500) {
          alert(`Recording too short (${blob.size} bytes). Please record for at least 2 seconds.`);
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          return;
        }

        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        console.log('✅ Blob URL created:', url);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (e) => {
        console.error('❌ MediaRecorder error:', e);
        alert('Recording error occurred. Please try again.');
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      // Start recording with periodic data collection
      // Using 1000ms timeslice for better reliability
      console.log('🎤 Starting recording with MIME type:', mimeType);
      mediaRecorder.start(1000); // Get data every second
      setIsRecording(true);
      setRecordingTime(0);

      console.log('⏱️ Recording timer started');

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else {
        alert(`Could not access microphone: ${error.message}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('🛑 User clicked stop, duration:', recordingTime, 'seconds');
      console.log('📊 Current chunks count:', chunksRef.current.length);
      console.log('🎙️ Recorder state:', mediaRecorderRef.current.state);
      
      // Stop the timer first
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Request final data and stop
      if (mediaRecorderRef.current.state === 'recording') {
        console.log('📦 Requesting final data...');
        
        // Request any remaining buffered data
        try {
          mediaRecorderRef.current.requestData();
        } catch (e) {
          console.warn('Could not request data:', e);
        }
        
        // Wait a moment for the final data chunk, then stop
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            console.log('⏹️ Stopping MediaRecorder...');
            mediaRecorderRef.current.stop();
          }
        }, 200);
      } else {
        console.log('⚠️ Recorder already stopped');
        setIsRecording(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUseRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Record Your Voice or Upload Audio
      </h2>

      {/* Recording Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-16 bg-purple-500 rounded-full animate-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <p className="text-xl font-mono text-gray-700">{formatTime(recordingTime)}</p>
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-semibold"
              >
                ⏹ Stop Recording
              </button>
            </div>
          ) : (
            <button
              onClick={startRecording}
              className="px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-semibold shadow-lg"
            >
              🎙️ Start Recording
            </button>
          )}
        </div>

        {/* Playback Section */}
        {audioUrl && !isRecording && (
          <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl">
            <audio controls src={audioUrl} className="w-full" />
            <div className="flex gap-3">
              <button
                onClick={handleUseRecording}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Use This Recording
              </button>
              <button
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Record Again
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Upload Section */}
        <div className="flex flex-col items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition font-semibold"
          >
            📁 Upload Audio File
          </button>
          <p className="text-sm text-gray-500">
            Supports MP3, WAV, OGG, WebM (max 25MB)
          </p>
        </div>
      </div>
    </div>
  );
}

