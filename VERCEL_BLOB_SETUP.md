# 🎯 Vercel Blob Setup - Fix "Can't fetch the uploaded audio"

## What's Fixed

✅ **Persistent file storage** - Files survive between function calls  
✅ **Publicly accessible URLs** - Suno can fetch your audio  
✅ **No /tmp issues** - Cloud storage, not ephemeral filesystem  
✅ **Fast CDN delivery** - Vercel's global CDN

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Blob Store in Vercel

1. Go to your Vercel dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Blob**
5. Choose a name (e.g., `melodify-audio`)
6. Click **Create**

**You'll get a token starting with `vercel_blob_rw_...`**

---

### Step 2: Add Token to Environment Variables

#### In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: `vercel_blob_rw_...` (the token from Step 1)
   - **Environments**: Select **Production**, **Preview**, and **Development**
3. Click **Save**

#### For Local Development (Optional):

Add to your `.env.local`:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

---

### Step 3: Redeploy

The code is already updated! Just redeploy:

```bash
# Already done - code is pushed!
# Just trigger a redeploy in Vercel dashboard
# Or make any small commit:

git commit --allow-empty -m "Trigger redeploy with Blob storage"
git push
```

---

## 📊 How It Works Now

### Before (Broken):
```
Upload → /tmp in Function A
  ↓
Suno tries to fetch
  ↓
/api/temp-file (Function B) → Different /tmp!
  ↓
❌ File not found
```

### After (Working):
```
Upload → Vercel Blob (persistent cloud storage)
  ↓
Returns: https://abc123.public.blob.vercel-storage.com/audio_xxx.webm
  ↓
Suno fetches → ✅ Public URL works!
  ↓
Music generation succeeds! 🎵
```

---

## ✅ What Changed in the Code

### Updated `app/api/upload/route.ts`:

```typescript
import { put } from '@vercel/blob';

// On Vercel with token: Upload to Blob
if (isVercel && hasBlobToken) {
  const blob = await put(fileName, audioFile, {
    access: 'public',
    contentType: 'audio/webm',
  });
  
  return { fileUrl: blob.url }; // Public URL!
}

// Local dev: Still uses /public/uploads
else {
  // ... save to local filesystem
}
```

### Benefits:

- ✅ **Publicly accessible** - No need for `/api/temp-file` proxy
- ✅ **Persistent** - Files don't disappear
- ✅ **Fast** - Global CDN delivery
- ✅ **Simple** - One API call

---

## 🧪 Testing

### 1. Check Upload:

```bash
# In browser console after recording:
# You should see:
{
  "success": true,
  "fileUrl": "https://xxx.public.blob.vercel-storage.com/audio_xxx.webm",
  "storage": "vercel-blob"
}
```

### 2. Test URL Directly:

Copy the `fileUrl` and open it in a new tab - you should be able to download/play the audio.

### 3. Generate Music:

Record audio → Select style → Generate

**Logs should show:**
```
📤 Uploading to Vercel Blob...
✅ Uploaded to Blob: https://...
🎵 Calling SunoAPI.org...
Using existing absolute URL (likely Vercel Blob)
```

**No more "Can't fetch the uploaded audio" error!** ✅

---

## 💰 Pricing

### Vercel Blob Free Tier:

- **Storage**: 500GB total
- **Bandwidth**: 500GB per month
- **Requests**: Unlimited

**For your app:**
- Each audio file: ~1-5MB
- 100 users/day = 500MB/day
- Free tier = ~30,000 uploads/month

**More than enough to start!** 🎉

---

## 🐛 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN not configured"

**Solution:**
- Make sure you added the token in Vercel dashboard
- Redeploy after adding environment variables
- Check all environments are selected (Production, Preview, Development)

### Files still use /api/temp-file?

**Solution:**
- Make sure `BLOB_READ_WRITE_TOKEN` is set
- Check logs: Should see "Uploading to Vercel Blob"
- If not, token might be missing or invalid

### Local dev not working?

**Solution:**
- Local dev doesn't need Blob token
- It falls back to `public/uploads` (works fine)
- Only production needs Blob storage

---

## 📚 Resources

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
- [Free Tier Limits](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)

---

## 🎯 Summary

**What you need to do:**

1. ✅ Create Blob store in Vercel dashboard
2. ✅ Add `BLOB_READ_WRITE_TOKEN` to environment variables
3. ✅ Redeploy (code is already ready!)

**Result:**

- ✅ Files are publicly accessible
- ✅ Suno can fetch your audio
- ✅ Music generation works!
- ✅ No more "Can't fetch" errors!

**Total time: 5 minutes** ⏱️

---

**The code is already pushed and ready! Just add the token and redeploy!** 🚀

