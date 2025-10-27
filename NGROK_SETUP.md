# 🔧 Quick Fix: Use ngrok to Test Locally

## ❌ The Problem

SunoAPI.org returns: **"Can't fetch the uploaded audio"**

**Why?** Your audio files are at `http://localhost:3000/uploads/...`
- `localhost` is only accessible on YOUR computer
- SunoAPI.org's servers can't reach it
- They need a public URL on the internet

---

## ✅ The Solution: ngrok

**ngrok creates a public tunnel to your localhost!**

```
Internet → ngrok tunnel → Your localhost:3001
```

Now SunoAPI.org can download your audio files!

---

## 📝 Setup Steps (5 minutes)

### 1. Install ngrok

**Mac:**
```bash
brew install ngrok
```

**Or download:** https://ngrok.com/download

### 2. Start Your Server

```bash
cd /Users/daniellevy/Code/voiceover-music
npm run dev
```

Server should be on port 3001.

### 3. In a NEW Terminal, Start ngrok

```bash
ngrok http 3001
```

### 4. Copy the HTTPS URL

You'll see something like:
```
ngrok

Forwarding  https://abc123-xyz789.ngrok-free.app -> http://localhost:3001
```

**Copy that HTTPS URL!** Example: `https://abc123-xyz789.ngrok-free.app`

### 5. Update .env.local

Open `.env.local` and add:

```bash
NEXT_PUBLIC_BASE_URL=https://abc123-xyz789.ngrok-free.app
```

**Replace with YOUR ngrok URL!**

### 6. Restart Your Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### 7. Test!

1. **Open in browser:** Your ngrok URL (e.g., `https://abc123-xyz789.ngrok-free.app`)
2. **Record/upload** voice
3. **Generate** music
4. **Watch terminal** - uploadUrl should now be `https://abc123.ngrok-free.app/uploads/...`
5. **SunoAPI.org can now access it!** ✅

---

## 📊 What You Should See

**Before (Failed):**
```json
{
  "uploadUrl": "http://localhost:3000/uploads/...",
  "errorMessage": "Can't fetch the uploaded audio."
}
```

**After (Success):**
```json
{
  "uploadUrl": "https://abc123.ngrok-free.app/uploads/...",
  "status": "PENDING"  → "TEXT_SUCCESS" → "SUCCESS" ✅
}
```

---

## ⚠️ Important Notes

### ngrok Free Tier:
- ✅ Free to use
- ✅ Perfect for testing
- ⚠️ URL changes each time you restart ngrok
- ⚠️ Session expires after 2 hours

### When URL Changes:
1. Update `NEXT_PUBLIC_BASE_URL` in `.env.local`
2. Restart your server

### For Production:
- Deploy to Vercel/Netlify for permanent URL
- Or pay for ngrok Pro to get a fixed domain

---

## 🐛 Troubleshooting

### "Invalid Host Header"
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Forwarded-Host', value: 'ngrok' },
      ],
    },
  ];
}
```

### Can't Access ngrok URL
- Check firewall settings
- Make sure ngrok is running
- Try restarting ngrok

### Still Getting "Can't fetch"
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check that audio files exist in `public/uploads/`
- Try accessing `https://your-ngrok-url.ngrok-free.app/uploads/audio_...webm` directly in browser

---

## 🎵 Expected Result

Once ngrok is working:

```bash
🎵 Calling SunoAPI.org Add Instrumental...
uploadUrl: https://abc123.ngrok-free.app/uploads/audio_...
Response status: 200
✅ Task started
📊 Polling...
Status: PENDING
Status: TEXT_SUCCESS
Status: FIRST_SUCCESS  
Status: SUCCESS  ← Real music! 🎉
audioUrl: https://cdn.suno.ai/...
```

**Then you hear:** Your voice + AI background music! 🎵

---

## 🚀 Ready!

**Follow the steps above and try again!**

The issue isn't with the code - it's just that localhost isn't publicly accessible. ngrok fixes that! 🔥

