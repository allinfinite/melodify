'use client';

interface LoadingWaveProps {
  message?: string;
}

export default function LoadingWave({ message = 'Composing your track...' }: LoadingWaveProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-12">
      {/* Animated Wave */}
      <div className="flex items-end gap-2 h-24">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-3 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full animate-wave"
            style={{
              animationDelay: `${i * 0.1}s`,
              height: '100%',
            }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-800 mb-2">{message}</p>
        <p className="text-sm text-gray-600">This may take a minute...</p>
      </div>

      {/* Pulsing Dots */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

