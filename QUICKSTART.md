# 🚀 Melodify Quick Start Guide

Get your Melodify app up and running in **60 seconds**!

## Fastest Start Ever (1 minute)

```bash
# Clone or navigate to the project
cd melodify

# Install dependencies
npm install

# Run the app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

**That's it!** No database, no API keys, no configuration needed.

## What Just Happened?

The app is now running in **mock mode**:
- ✅ Full UI works perfectly
- ✅ You can record or upload audio
- ✅ Choose any music style
- ✅ "Generate" returns your input audio (for testing)
- ✅ Songs stored in memory
- ✅ View your library

## Testing the Flow

1. Click **"Start Creating"** or go to `/record`
2. **Record your voice** or upload an audio file
3. **Select a style** (Pop, Rock, Jazz, etc.)
4. Click **"Generate My Remix"**
5. See your result and play it!
6. Go to **Library** to see all your remixes

## Adding Real AI (Optional)

Want actual AI-generated remixes? Just add API keys:

### Option 1: Suno API Only

Create `.env.local`:
```env
SUNO_API_KEY=your_suno_api_key
```

This enables real music generation! Transcription will still use mock data.

### Option 2: Full AI Power

Create `.env.local`:
```env
SUNO_API_KEY=your_suno_api_key
OPENAI_API_KEY=sk-proj-your_openai_key
```

This enables both music generation AND audio transcription.

### Getting API Keys

**Suno API:**
1. Visit [suno.ai](https://suno.ai)
2. Sign up and get your API key
3. Add to `.env.local`

**OpenAI (Whisper):**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `.env.local`

## Understanding Mock Mode

### What Works in Mock Mode?
- ✅ **Everything!** The entire UI and flow
- ✅ Upload/record audio files
- ✅ Style selection
- ✅ Mock transcription (sample text)
- ✅ "Generation" completes instantly
- ✅ Playback (returns your original audio)
- ✅ Library view

### Why Mock Mode?
- 🚀 **Instant setup** - No configuration needed
- 💰 **No costs** - Test without API charges
- 🧪 **Development** - Perfect for UI/UX work
- 🎨 **Design** - See the full flow

### When to Use Real APIs?
- 🎵 You want actual AI remixes
- 🎤 You want real transcriptions
- 🚢 You're ready to deploy
- 👥 You're sharing with users

## File Storage

### Where Are Files Stored?

Uploaded audio files are saved to:
```
public/uploads/
```

This folder:
- ✅ Created automatically on first upload
- ✅ Files accessible at `/uploads/filename.mp3`
- ✅ Included in `.gitignore` (not committed)

### Song Metadata

Song information (style, transcription, etc.) is stored:
- 💾 **In memory** during development
- ⚠️ **Resets** when you restart the server
- 💡 Files remain in `public/uploads/` even after restart

## Common Tasks

### Clear All Songs
```bash
# Just restart the dev server
# Ctrl+C then npm run dev
```

### Delete Uploaded Files
```bash
# Remove all uploaded audio files
rm -rf public/uploads/*
```

### Add a New Music Style
Edit `utils/prompts.ts`:
```typescript
{
  id: 'reggae',
  name: 'Reggae',
  description: 'Laid-back island vibes',
  icon: '🌴',
  prompt: 'reggae with island rhythms',
  tags: ['reggae', 'island', 'chill'],
}
```

## Troubleshooting

### Port 3000 Already in Use?
```bash
# Use a different port
npm run dev -- -p 3001
```

### Can't Record Audio?
- Allow microphone permissions in your browser
- Use HTTPS or localhost (required for microphone access)

### Files Not Uploading?
- Check you have write permissions in the project folder
- The `public/uploads/` folder will be created automatically

### Want to Reset Everything?
```bash
# Stop the server (Ctrl+C)
# Delete uploads
rm -rf public/uploads/*
# Restart
npm run dev
```

## Production Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add in Vercel dashboard:
```env
SUNO_API_KEY=your_key
OPENAI_API_KEY=your_key
```

### ⚠️ Important for Production

**Data Storage:** The current setup uses in-memory storage, which:
- Resets on each deployment
- Doesn't persist between server restarts
- Not suitable for multi-user production

**For production, consider adding:**
- Database (Vercel Postgres, MongoDB, etc.)
- Cloud storage (Vercel Blob, S3, etc.)
- User authentication

See `README.md` for adding a database.

## Next Steps

### Customize Styles
Edit the 8 music styles in `utils/prompts.ts`

### Change Design
All styling uses Tailwind CSS - edit component classes

### Add Features
Check the "Future Enhancements" section in `README.md`

### Deploy
Push to GitHub and deploy on Vercel

## Need Help?

- 📖 See `README.md` for full documentation
- 🔧 See `ENVIRONMENT_SETUP.md` for API configuration
- 🐛 Open a GitHub issue

Happy creating! 🎵✨

---

**Pro Tip:** Start with mock mode to understand the flow, then add real APIs when you're ready to create actual remixes!
