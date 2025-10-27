# 🎵 SunoAPI.org Setup Guide

This app uses **SunoAPI.org** - a third-party API service for Suno AI music generation.

## 🔑 Getting Your API Key

### Step 1: Visit SunoAPI.org
Go to [https://sunoapi.org](https://sunoapi.org) or [https://api.sunoapi.org](https://api.sunoapi.org)

### Step 2: Sign Up / Login
Create an account or log in to get your API key

### Step 3: Get Your Bearer Token
- Navigate to your dashboard/settings
- Find your API key/bearer token
- Copy the token (it should look like a long string)

### Step 4: Add to Environment
Create or edit `.env.local`:

```bash
SUNO_API_KEY=your_api_key_here
```

### Step 5: Restart Server
```bash
# Stop server (Ctrl+C)
# Start fresh
npm run dev
```

## 🎨 How It Works

**⚠️ IMPORTANT: Generation takes 1-2 minutes!**

The app uses **async processing with polling:**
1. Take your voice recording
2. Send request to SunoAPI.org → Returns `taskId` immediately
3. **App polls every 5 seconds** to check if ready
4. SunoAPI.org processes with Suno's AI (30-120 seconds)
5. When complete, displays your song with background music

**Be patient!** The "Generating..." screen will stay up for 1-2 minutes while polling.

## 🎵 What You Get

- ✅ **Your vocals** with AI-generated background music
- ✅ **8 different styles**: Pop, Rock, Jazz, Electronic, Hip Hop, Acoustic, Lo-Fi, Country
- ✅ **Professional quality** mixing and mastering
- ✅ **Download and share** your creations

## 🧪 Testing

After adding your API key:

1. Go to http://localhost:3000/record
2. Record or upload audio
3. Select a music style
4. Click "Generate My Remix"
5. Wait 1-2 minutes for processing
6. Play your remix with full background music!

## 📊 API Parameters

The app sends to SunoAPI.org:
- **customMode**: false (simpler, auto-generates lyrics)
- **instrumental**: false (keeps your vocals)
- **model**: V3_5 (fast and good quality)
- **prompt**: Description like "Create an upbeat pop song with vocals"
- **callBackUrl**: Required by API (we use polling instead of webhooks)

## ⚠️ Important Notes

### Differences from Official Suno
- This uses SunoAPI.org (third-party service)
- Not the official suno.ai API
- May have different pricing/limits
- Check SunoAPI.org for their terms

### Mock Mode
- If no API key: Uses mock mode (returns voice only)
- If API key invalid: Falls back to mock mode
- Mock mode = no music generation

## 💰 Pricing

Check [SunoAPI.org](https://sunoapi.org) for:
- Current pricing
- Free tier limits
- Credit packages
- Rate limits

## 🐛 Troubleshooting

### "SUNO_API_KEY not configured"
- Add your API key to `.env.local`
- Restart the server

### "401 Unauthorized"
- API key is invalid
- Check you copied it correctly
- Verify it's active in your SunoAPI.org dashboard

### "429 Rate Limit"
- You've hit the API limit
- Wait a bit before trying again
- Or upgrade your plan

### Still Getting Just Voice?
- Check terminal logs for errors
- Verify API key is set correctly
- Make sure you restarted the server
- Check your SunoAPI.org account status

## 📚 Resources

- **SunoAPI.org Website**: https://sunoapi.org
- **API Documentation**: Check their docs for full API details
- **Support**: Contact SunoAPI.org support for API issues

## ✅ Verification

To verify everything is working:

```bash
# Check your .env.local has the key
cat .env.local | grep SUNO_API_KEY

# Should show:
# SUNO_API_KEY=your_key_here
```

Then check your terminal when generating:
```
🎵 Calling SunoAPI.org...
Response status: 200
API Response: { code: 200, msg: "success", data: { taskId: "..." } }
✅ Task started with ID: ...
⏳ Polling for completion...
📊 Polling attempt 1/60...
⏳ Status: processing, waiting 5s...
📊 Polling attempt 2/60...
✅ Generation complete!
```

**This will take 1-2 minutes** with multiple polling attempts. If you see this, you're all set! 🎉

