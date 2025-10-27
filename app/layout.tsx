import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Melodify - AI Music Remixer',
  description: 'Transform your voice into any music style with AI-powered remixing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`} style={{ 
        background: 'linear-gradient(to bottom right, #faf5ff, #ffffff, #fdf2f8)',
        minHeight: '100vh'
      }}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

