# 🎵 Melodify - AI Music Remixer

Transform your voice into any music style with AI-powered remixing using Suno API.

## ✨ Features

- 🎙️ **Record or Upload** - Sing, hum, or upload any audio file
- 🎨 **Multiple Styles** - Choose from Pop, Rock, Jazz, Electronic, Hip Hop, Acoustic, Lo-Fi, and Country
- ✨ **AI-Powered** - Generate professional remixes using Suno AI
- 💾 **Save & Share** - Download your creations and share them with friends
- 📚 **Library** - View all your created remixes in one place
- 🚀 **No Database Required** - Everything runs locally with in-memory storage

## 🚀 Quick Start (2 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File (Optional)
```bash
# Create .env.local file (copy from template)
SUNO_API_KEY=          # Optional - uses mock mode if not set
OPENAI_API_KEY=        # Optional - uses mock mode if not set
```

### 3. Run the App
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

**That's it!** No database setup, no API keys required to start.

## 🎮 How It Works

1. **Record/Upload** - Go to `/record` and record your voice or upload an audio file
2. **Select Style** - Choose from 8 music styles
3. **Generate** - AI creates your remix (takes 1-2 minutes)
4. **Play & Share** - Listen to your remix, download it, or share it

## 🧪 Mock Mode

The app includes **mock implementations** so you can test without API keys:

- ✅ **Works without any setup** - Just `npm install && npm run dev`
- ✅ **Suno Mock** - Returns the input audio as output for testing
- ✅ **Whisper Mock** - Returns sample transcription data
- ✅ **Full UI testing** - All features work in development
- ✅ **In-memory storage** - Songs stored in memory (resets on restart)

## 📦 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: In-memory (no database required!)
- **File Storage**: Local filesystem (`public/uploads/`)
- **AI Processing**: 
  - Suno API (music generation) - optional
  - OpenAI Whisper (transcription) - optional

## 🔑 Adding Real API Keys (Optional)

To use real AI generation, add API keys to `.env.local`:

### Get Suno API Key
1. Visit [SunoAPI.org](https://sunoapi.org) and sign up
2. Get your API key/bearer token from the dashboard
3. Add to `.env.local`: `SUNO_API_KEY=your_key`
4. See `SUNO_SETUP.md` for detailed setup instructions

**Note:** We use SunoAPI.org (third-party service) for music generation

### Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `.env.local`: `OPENAI_API_KEY=sk-proj-...`

The app automatically switches from mock mode to real APIs when keys are detected!

## 📁 Project Structure

```
melodify/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── record/            # Record/upload page
│   ├── generate/          # Style selection
│   ├── result/[id]/       # Playback page
│   ├── library/           # View all remixes
│   └── api/               # API routes
│       ├── upload/        # File upload
│       ├── process/       # Audio analysis
│       ├── suno/          # Music generation
│       ├── songs/         # Get all songs
│       └── result/[id]/   # Get song by ID
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Recorder.tsx
│   ├── StyleSelector.tsx
│   ├── LoadingWave.tsx
│   └── AudioPlayer.tsx
├── lib/
│   ├── storage.ts        # In-memory data storage
│   ├── sunoClient.ts     # Suno API client
│   └── whisperClient.ts  # Whisper API client
├── utils/
│   ├── audioUtils.ts     # Audio utilities
│   └── prompts.ts        # Music style definitions
└── public/
    └── uploads/          # Uploaded audio files
```

## 🎨 Music Styles

- 🎤 **Pop** - Catchy, upbeat, radio-friendly
- 🎸 **Rock** - Powerful guitars and driving rhythm
- 🎷 **Jazz** - Smooth, sophisticated, soulful
- 🎹 **Electronic** - Synths, beats, digital textures
- 🎧 **Hip Hop** - Urban beats and rhythmic flow
- 🪕 **Acoustic** - Organic, intimate, natural
- 🌙 **Lo-Fi** - Chill, nostalgic, relaxed
- 🤠 **Country** - Storytelling with twang and heart

## 📝 API Endpoints

### POST `/api/upload`
Upload audio file to local storage.

**Body**: `FormData` with `audio` file  
**Response**: `{ success: true, fileUrl: "/uploads/audio_123.mp3" }`

### POST `/api/process`
Analyze audio using Whisper API (or mock).

**Body**: `{ fileUrl: "/uploads/audio_123.mp3" }`  
**Response**: `{ transcription, key, bpm, mood }`

### POST `/api/suno`
Generate remix using Suno API (or mock).

**Body**: `{ fileUrl, style, prompt, metadata }`  
**Response**: `{ audioUrl, songId, metadata }`

### GET `/api/songs`
Get all songs from memory.

**Response**: `{ songs: [...], count: 5 }`

### GET `/api/result/[id]`
Get song by ID.

**Response**: `{ id, input_url, output_url, style, metadata }`

## 🛠️ Development

### Reset Data
Since data is stored in memory, simply restart the dev server to clear all songs.

### Add New Styles
Edit `utils/prompts.ts` to add more music styles:

```typescript
export const MUSIC_STYLES: MusicStyle[] = [
  {
    id: 'reggae',
    name: 'Reggae',
    description: 'Laid-back island vibes',
    icon: '🌴',
    prompt: 'reggae with island rhythms, laid-back groove',
    tags: ['reggae', 'island', 'chill'],
  },
  // ... add more
];
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (if using real APIs)
4. Deploy!

**Note**: In-memory storage resets on each deployment. For production, consider adding a database like:
- Vercel KV (Redis)
- Vercel Postgres
- MongoDB Atlas
- Supabase

## ⚠️ Important Notes

### Data Persistence
- ✅ **Development**: Files saved to `public/uploads/`
- ⚠️ **Memory**: Song metadata stored in memory (resets on restart)
- 💡 **Production**: Add a database for persistent storage

### File Storage
Uploaded files are saved to `public/uploads/`. This folder is:
- Created automatically on first upload
- Included in `.gitignore`
- Accessible via `/uploads/filename.mp3`

### Limitations
- Songs reset when server restarts
- Not suitable for multi-user production without a database
- File uploads limited to 25MB

## 🔮 Future Enhancements

Want to make this production-ready? Consider adding:

- 🗄️ **Database** - Add Vercel Postgres or Supabase for persistence
- 🔐 **Authentication** - Add user accounts
- ☁️ **Cloud Storage** - Use S3 or Vercel Blob for files
- 🎙 **Voice Cloning** - Retain singer's tone across styles
- 💬 **Social Features** - Share and discover remixes
- 🤝 **Duet Mode** - Combine two vocals
- 🌈 **Album Art** - Auto-generate covers with DALL·E
- 🎼 **Advanced Controls** - Tempo, key, and style mixing
- 📱 **Mobile App** - Native iOS/Android versions

## 🐛 Troubleshooting

Having issues? Check these resources:
- **TROUBLESHOOTING.md** - Common issues and solutions
- **DEBUG.md** - How to debug API errors with logs

**Quick fixes:**
1. Restart the dev server: `Ctrl+C` then `npm run dev`
2. Clear cache: `rm -rf .next && npm run dev`
3. Check terminal output for error details

## 📖 More Documentation

- See `QUICKSTART.md` for detailed setup
- See `ENVIRONMENT_SETUP.md` for API key configuration
- See `TROUBLESHOOTING.md` for common issues
- See `DEBUG.md` for debugging help
- See `prd.md` for product requirements

## 🤝 Contributing

Feel free to open issues or submit PRs!

## 📄 License

MIT

---

Made with ❤️ using Next.js and Suno AI
