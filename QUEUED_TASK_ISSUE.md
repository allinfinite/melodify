# ⏳ Task Stuck in "Queued" State

## 🚨 The Problem

**Symptom:** Task status stays "queued" for 5+ minutes, never progresses to "complete"

**From logs:**
```
📊 Polling attempt 1/60...
⏳ Status: queued, waiting 5s...
📊 Polling attempt 2/60...
⏳ Status: queued, waiting 5s...
...
📊 Polling attempt 60/60...
⏳ Status: queued, waiting 5s...
Generation error: Error: Generation timeout - exceeded 5 minutes
```

---

## 🔍 Possible Causes

### 1. Suno Can't Fetch Audio File

**Most likely cause:** The uploaded audio file isn't publicly accessible or CORS issue.

**Check:**
```bash
# Test if the blob URL is accessible
curl -I "https://xwemqwnaadgxiohp.public.blob.vercel-storage.com/audio_1761601981138_recording.webm"
```

**If 403/404:**
- Vercel Blob file permissions issue
- File doesn't exist yet when Suno tries to fetch
- Timing issue

### 2. Task Never Started

**Possible reasons:**
- Invalid request format
- Audio URL in wrong format
- Missing required parameters
- API key issue

### 3. SunoAPI.org Service Issues

**Check:**
- SunoAPI.org status page
- API quota exceeded
- Service overloaded

---

## 🧪 Debugging Steps

### Step 1: Check Vercel Logs

Look for these in Vercel logs:

**Good signs:**
```
✅ Task started with ID: abc123
Status check response status: 200
Task status response: {...}
```

**Bad signs:**
```
⚠️ Task has error: {
  errorCode: 413,
  errorMessage: "Can't fetch the uploaded audio."
}
```

### Step 2: Check if Audio URL is Public

```bash
# From your computer
curl -I "https://xwemqwnaadgxiohp.public.blob.vercel-storage.com/audio_1761601981138_recording.webm"

# Should return:
# HTTP/2 200
# Content-Type: audio/webm
# content-length: 355019
```

**If 403 Forbidden:**
- Blob storage not configured correctly
- File not marked as public

**If 404 Not Found:**
- File upload failed
- File expired/deleted

### Step 3: Check Suno API Directly

```bash
# Check task status manually
curl "https://api.sunoapi.org/api/v1/generate/record-info?taskId=YOUR_TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Look for:
- `status: "PENDING"` → Task not started
- `status: "GENERATE_AUDIO_FAILED"` → Failed to fetch audio
- `errorMessage: "Can't fetch the uploaded audio"` → Most common issue

---

## ✅ Solutions

### Solution 1: Verify Blob Upload (Recommended)

Check the upload endpoint returns a valid public URL:

```typescript
// In app/api/upload/route.ts
const blob = await put(fileName, audioFile, {
  access: 'public',  // ← Must be public!
  contentType: audioFile.type,
});

console.log('Uploaded to Blob:', blob.url);
// Should print: https://xxx.public.blob.vercel-storage.com/...

// Verify it's accessible
const test = await fetch(blob.url, { method: 'HEAD' });
console.log('Blob accessibility:', test.status); // Should be 200
```

### Solution 2: Add Retry Logic

If audio file takes time to be accessible:

```typescript
// Wait for file to be accessible
let accessible = false;
for (let i = 0; i < 10; i++) {
  const test = await fetch(blob.url, { method: 'HEAD' });
  if (test.ok) {
    accessible = true;
    break;
  }
  await new Promise(r => setTimeout(r, 1000));
}
```

### Solution 3: Check Vercel Blob Configuration

In Vercel dashboard:
1. Go to Storage → Your Blob Store
2. Check permissions
3. Verify `BLOB_READ_WRITE_TOKEN` is set
4. Try uploading a test file manually

---

## 📊 What the Logs Tell Us

From your logs:

```
Task started with ID: 5a8405b7b497b794ebd5a90c222f0134
📊 Polling attempt 1/60...
Poll response: {success: true, status: 'queued', metadata: {…}}
```

**This means:**
- ✅ Task was created successfully
- ✅ Status endpoint is working
- ❌ Task never progressed beyond "queued"

**Most likely:** Suno can't fetch the audio file.

---

## 🎯 Next Steps

1. **Check Vercel Blob URL accessibility**
   - Run: `curl -I "YOUR_BLOB_URL"`
   - Should return 200 OK

2. **Check Vercel logs for error messages**
   - Look for "errorCode" or "errorMessage" in status responses

3. **Test a shorter audio file**
   - 5-10 seconds instead of 20+
   - Rule out file size issues

4. **Try a fresh deployment**
   - Ensure latest code is deployed
   - Check environment variables are set

---

## 🔧 Quick Fixes to Try

### Fix 1: Re-enable Audio Verification

Add back the audio URL test in `startSongGeneration()`:

```typescript
// Verify audio is accessible before sending to Suno
const test = await fetch(absoluteAudioUrl, { method: 'HEAD' });
if (!test.ok) {
  throw new Error('Audio file not accessible. Status: ' + test.status);
}
console.log('✅ Audio file is accessible');
```

### Fix 2: Wait Before Starting Task

Give the file time to be accessible:

```typescript
// Wait 2 seconds after upload
await new Promise(r => setTimeout(r, 2000));
const task = await startSongGeneration(fileUrl, style, prompt);
```

### Fix 3: Use ngrok for Local Testing

If testing locally:
```bash
ngrok http 3000
# Use the ngrok URL for audio files
```

---

## 📝 Summary

**Problem:** Task stuck in "queued" for 5+ minutes

**Most likely cause:** Suno can't fetch the uploaded audio file

**What to do:**
1. Verify blob URL is accessible (200 OK)
2. Check Vercel logs for Suno error messages
3. Add audio accessibility check before starting task
4. Ensure blob storage is public

**The async polling works perfectly - the issue is Suno never starts processing the task.**

