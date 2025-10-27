import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Melodify
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-semibold">
            Transform Your Voice Into Any Music Style
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Record yourself singing or upload audio, choose a style, and let AI create
            a professional remix in seconds.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/record"
            className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            🎵 Start Creating
          </Link>
        </div>

        {/* Features */}
        <div className="pt-16 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Record or Upload</h3>
            <p className="text-gray-600">
              Sing, hum, or upload any audio file to get started
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Choose a Style</h3>
            <p className="text-gray-600">
              Pick from pop, rock, jazz, electronic, and more
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Magic</h3>
            <p className="text-gray-600">
              Get a professional remix in minutes, powered by Suno AI
            </p>
          </div>
        </div>

        {/* Social Proof / Examples */}
        <div className="pt-12">
          <p className="text-sm text-gray-500 mb-4">
            🎵 Join thousands creating amazing remixes every day
          </p>
        </div>
      </div>
    </div>
  );
}

