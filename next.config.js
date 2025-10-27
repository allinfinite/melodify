/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/webm',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

