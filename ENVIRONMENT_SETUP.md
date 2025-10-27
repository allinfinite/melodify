# 🔐 Environment Variables Setup Guide

## TL;DR

**You don't need ANY environment variables to run the app!** 

Just `npm install && npm run dev` and you're good to go. The app runs in mock mode without any configuration.

---

## When You Need Environment Variables

You only need environment variables if you want:
- 🎵 **Real AI music generation** (Suno API)
- 🎤 **Real audio transcription** (OpenAI Whisper)

Otherwise, the app works perfectly in mock mode for development and testing.

## Quick Setup

Create a `.env.local` file in the project root:

```bash
# Optional - only if you want real AI features
SUNO_API_KEY=your_suno_key_here
OPENAI_API_KEY=sk-proj-your_openai_key_here
```

That's it! No database, no auth, no complex setup.

## Optional API Keys

### 🎵 SUNO API (Music Generation) via SunoAPI.org

**What it does:** Generates actual AI remixes with background music in different styles

**Without it:** Returns your input audio as output (mock mode - voice only, no music)

**How to get:**
1. Visit [SunoAPI.org](https://sunoapi.org) (third-party Suno API service)
2. Sign up for an account
3. Navigate to your dashboard/settings
4. Copy your API key/bearer token
5. Add to `.env.local`:
   ```env
   SUNO_API_KEY=your_api_key_here
   ```

**Pricing:** Check SunoAPI.org for current pricing and free tier

**Note:** This uses SunoAPI.org (a third-party service), not the official suno.ai API directly

**Full Setup Guide:** See `SUNO_SETUP.md` for detailed instructions

---

### 🤖 OPENAI API (Whisper Transcription)

**What it does:** Transcribes your audio to extract lyrics/words

**Without it:** Returns mock transcription text

**How to get:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-proj-` or `sk-`)
6. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-proj-abc123...
   ```

**Pricing:** Pay-per-use based on audio length

**Note:** Requires an OpenAI account with API access enabled

---

## Complete .env.local Template

```env
# ============================================
# MELODIFY ENVIRONMENT VARIABLES
# ============================================
# All variables are OPTIONAL - app works without them!

# Suno API (for real music generation)
# Leave empty to use mock mode
SUNO_API_KEY=

# OpenAI API (for audio transcription)
# Leave empty to use mock mode
OPENAI_API_KEY=
```

## Environment Modes

### 🧪 Mock Mode (Default - No Keys)

```env
# .env.local is empty or doesn't exist
```

**Features:**
- ✅ Full UI works
- ✅ Upload/record audio
- ✅ All pages functional
- ✅ Mock transcription
- ✅ Returns input audio as output
- ✅ Perfect for development
- ✅ No API keys needed

---

### 🎵 Suno Only Mode

```env
SUNO_API_KEY=your_key
```

**Features:**
- ✅ Real AI music generation
- ⚠️ Mock transcription (still fake)
- 🔑 Requires Suno API key

---

### 🎤 Whisper Only Mode

```env
OPENAI_API_KEY=sk-proj-your_key
```

**Features:**
- ✅ Real audio transcription
- ⚠️ Mock music generation (returns input)
- 🔑 Requires OpenAI API key

---

### 🚀 Full Production Mode

```env
SUNO_API_KEY=your_suno_key
OPENAI_API_KEY=sk-proj-your_openai_key
```

**Features:**
- ✅ Real AI music generation
- ✅ Real audio transcription
- ✅ Full production capabilities
- 🔑 Requires both API keys

---

## How the App Detects Mode

The app automatically checks for API keys:

```typescript
// In API routes
const useMock = !process.env.SUNO_API_KEY;

if (useMock) {
  // Use mock implementation
} else {
  // Use real API
}
```

You don't need to configure anything - it just works!

## Testing Without API Keys

Perfect workflow for development:

1. **Start:** `npm run dev` (no env vars)
2. **Test:** Full UI and flow works
3. **Develop:** Build features, test design
4. **Add Keys:** When ready for real AI
5. **Deploy:** Add keys on Vercel

## Development Workflow

### Recommended Approach
1. **Start with mock mode** - No setup required, instant testing
2. **Build your features** - Develop UI/UX without API dependencies
3. **Add Suno API** - When ready to test real music generation
4. **Add OpenAI API** - When you need real transcription
5. **Deploy** - Ship with the APIs you need

### Tips for Efficient Development
- Use mock mode for all UI/UX development
- Only enable real APIs when testing actual generation
- Start with small audio files for faster iterations
- Cache transcription results to avoid re-processing

## Security Best Practices

### ✅ DO
- Keep `.env.local` in `.gitignore`
- Use different keys for dev/production
- Rotate keys if exposed
- Store keys in Vercel/hosting platform

### ❌ DON'T
- Commit `.env.local` to Git
- Share keys publicly
- Use production keys in development
- Hardcode keys in source files

## Troubleshooting

### "API key not working"
- Check for typos
- Verify key is active in dashboard
- Ensure your account has API access enabled
- Check for extra spaces in `.env.local`

### "Still using mock mode"
- Restart the dev server after adding keys
- Check file is named `.env.local` exactly
- Verify keys are not commented out
- Look for console logs indicating mock mode

### "OpenAI API error"
- Check your OpenAI account status at platform.openai.com
- Review your usage limits and account settings
- Verify your API key is correct
- Or remove key to continue with mock mode

### "Suno API error"
- Verify your account is active
- Check API key permissions
- Review Suno's rate limits and status

## Development Tips

### Check Which Mode You're In

Add console logs in your API routes:

```typescript
console.log('Suno mode:', process.env.SUNO_API_KEY ? 'REAL' : 'MOCK');
console.log('Whisper mode:', process.env.OPENAI_API_KEY ? 'REAL' : 'MOCK');
```

### Temporarily Disable APIs

Comment out keys in `.env.local`:

```env
# SUNO_API_KEY=your_key    # Disabled for testing
OPENAI_API_KEY=your_key     # Still active
```

### Multiple Environment Files

Not needed for this app, but you could create:
- `.env.local` - Development
- `.env.production` - Production (handled by Vercel)

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add `SUNO_API_KEY` and `OPENAI_API_KEY`
   - Deploy!

### Other Platforms

Most hosting platforms support environment variables:
- **Netlify:** Site settings → Environment
- **Railway:** Variables tab
- **Render:** Environment section

## FAQ

**Q: Do I need a database?**  
A: No! The app uses in-memory storage. Great for development, but consider adding a database for production.

**Q: Can I use just Suno without OpenAI?**  
A: Yes! The app will generate real music but use mock transcriptions.

**Q: What happens if I remove a key later?**  
A: The app automatically falls back to mock mode. No errors!

**Q: Are API keys secure in .env.local?**  
A: Yes, `.env.local` is never committed to Git and only accessible server-side.

**Q: Can users see my API keys?**  
A: No, environment variables are only used in API routes (server-side), never exposed to the browser.

## Need Help?

- 📖 See `README.md` for full documentation
- 🚀 See `QUICKSTART.md` for setup guide
- 🐛 Open a GitHub issue for problems

---

**Remember:** The best API key is no API key! Start with mock mode and add real APIs when you need them. 🎵✨
