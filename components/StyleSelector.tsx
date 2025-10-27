'use client';

import { useState } from 'react';
import { MUSIC_STYLES, type MusicStyle } from '@/utils/prompts';

interface StyleSelectorProps {
  onSelectStyle: (style: MusicStyle) => void;
  selectedStyle: MusicStyle | null;
}

export default function StyleSelector({ onSelectStyle, selectedStyle }: StyleSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Choose Your Style
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Select a music style to transform your vocals
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MUSIC_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style)}
            className={`
              p-6 rounded-2xl border-2 transition-all transform hover:scale-105
              ${
                selectedStyle?.id === style.id
                  ? 'border-purple-600 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }
            `}
          >
            <div className="text-5xl mb-3">{style.icon}</div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">{style.name}</h3>
            <p className="text-sm text-gray-600">{style.description}</p>
          </button>
        ))}
      </div>

      {selectedStyle && (
        <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Selected Style</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedStyle.icon}</span>
            <div>
              <p className="font-bold text-gray-800">{selectedStyle.name}</p>
              <p className="text-sm text-gray-600">{selectedStyle.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

