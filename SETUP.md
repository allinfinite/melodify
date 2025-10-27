# 🎵 Melodify - Simple Setup

## 1️⃣ Install & Run (60 seconds)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) ✨

## 2️⃣ That's It!

No database. No API keys. No configuration.

The app runs in **mock mode** by default:
- ✅ Full UI works
- ✅ Record or upload audio
- ✅ Choose music styles
- ✅ See results instantly
- ✅ Files saved locally

## 3️⃣ Add Real AI (Optional)

Want actual AI remixes? Create `.env.local`:

```env
SUNO_API_KEY=your_key        # For music generation
OPENAI_API_KEY=your_key      # For transcription
```

Get keys:
- **Suno**: [suno.ai](https://suno.ai)
- **OpenAI**: [platform.openai.com](https://platform.openai.com)

## 📚 Documentation

- **QUICKSTART.md** - Detailed walkthrough
- **README.md** - Full documentation
- **ENVIRONMENT_SETUP.md** - API key guide

## 💡 Key Features

- 🎙️ Record or upload audio
- 🎨 8 music styles (Pop, Rock, Jazz, etc.)
- 💾 In-memory storage (no database)
- 📁 Files in `public/uploads/`
- 📚 Library to view all remixes
- 🚀 Zero config needed

## 🎯 Quick Test

1. Go to `/record`
2. Click "Start Recording" or upload a file
3. Select a style (e.g., "Pop")
4. Click "Generate My Remix"
5. Play your result!
6. Check `/library` to see all remixes

## ⚡ Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Run production build
npm run lint    # Check code quality
```

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your API keys in Vercel's environment variables.

---

**Happy creating! 🎵✨**

