'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              🎵 Melodify
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/record" className="text-gray-700 hover:text-purple-600 transition font-medium">
              Create
            </Link>
            
            <Link href="/library" className="text-gray-700 hover:text-purple-600 transition font-medium">
              Library
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

