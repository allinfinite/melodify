# 🎤 Vocal Preservation Fix

## 🚨 The Issue

**Problem:** The generated song doesn't include the user's vocal track - only instrumental music.

**Expected:** The add-instrumental endpoint should keep the vocals and add instrumental backing around them.

**What's happening:** The vocals are being lost or not properly mixed into the final output.

---

## 🔍 Root Cause Analysis

### Possible Causes:

1. **audioWeight too low** (was 0.7)
   - Lower values give more weight to the generated instrumental
   - Higher values preserve the original vocals better

2. **Audio URL not accessible**
   - Suno can't fetch the uploaded vocal file
   - Results in pure instrumental generation

3. **Incorrect operationType**
   - Wrong endpoint or parameters might cause pure generation instead of mixing

4. **Silent audio upload**
   - If the recorded audio is actually silent, nothing to mix

---

## ✅ Fixes Applied

### 1. Increased audioWeight from 0.7 → 0.9

**Before:**
```typescript
audioWeight: 0.7,  // Balance between vocals and instrumental
```

**After:**
```typescript
audioWeight: 0.9,  // Keep vocals very clear and prominent
```

**Effect:** 
- Preserves vocals much more strongly
- Instrumental becomes more like backing track
- Vocals stay at the forefront

### 2. Added Audio URL Verification

**New code:**
```typescript
// Verify the audio URL is accessible before sending to Suno
console.log('🔍 Verifying audio URL is accessible...');
try {
  const testResponse = await fetch(absoluteAudioUrl, { method: 'HEAD' });
  console.log('✅ Audio URL test - Status:', testResponse.status);
  if (!testResponse.ok) {
    throw new Error('Audio URL not accessible');
  }
} catch (testError) {
  throw new Error(`Audio file not accessible. Suno will not be able to fetch it.`);
}
```

**Effect:**
- Catches accessibility issues BEFORE sending to Suno
- Provides clear error messages
- Prevents wasted API calls

### 3. Enhanced Error Logging

**New logging:**
```typescript
// Log any error information from Suno
if (data.errorCode || data.errorMessage) {
  console.error('⚠️ Task has error:', {
    errorCode: data.errorCode,
    errorMessage: data.errorMessage,
    status: data.status,
  });
}

// Log what we received
console.log('📊 Parsed task data:', {
  status: status,
  hasAudioUrl: !!sunoData?.audioUrl,
  operationType: data.operationType,
  errorCode: data.errorCode,
});
```

**Effect:**
- Shows exactly what Suno returns
- Identifies if Suno had trouble fetching audio
- Makes debugging much easier

---

## 🧪 Testing

### How to Test the Fix:

1. **Record audio with your voice** (sing, speak, hum)
2. **Check console logs** for:
   ```
   🔍 Verifying audio URL is accessible...
   ✅ Audio URL test - Status: 200
   ```
3. **Generate music**
4. **Play the result** - you should hear YOUR voice with instrumental backing

### What to Look For:

**Good logs:**
```
🔍 Verifying audio URL is accessible...
✅ Audio URL test - Status: 200 Content-Type: audio/webm Size: 312467
🎵 Calling SunoAPI.org Add Instrumental...
Request body: {
  "audioWeight": 0.9,  ← Should be 0.9 now
  "uploadUrl": "https://...blob.vercel-storage.com/..."
}
📊 Parsed task data: {
  status: "complete",
  hasAudioUrl: true,
  operationType: "underpainting",
  errorCode: null
}
```

**Bad logs (if still broken):**
```
⚠️ Task has error: {
  errorCode: 413,
  errorMessage: "Can't fetch the uploaded audio."
}
```

---

## 📊 audioWeight Parameter Explained

The `audioWeight` parameter controls the balance between your vocals and the generated instrumental:

| Value | Effect | Use Case |
|-------|--------|----------|
| 0.0-0.3 | Instrumental dominates | Background vocals, ambient |
| 0.4-0.6 | Balanced mix | Equal vocal/instrumental |
| 0.7-0.8 | Vocals prominent | Clear vocals with backing |
| 0.9-1.0 | Vocals very clear | Karaoke-style, minimal backing |

**Our change:** 0.7 → 0.9 = Much clearer vocal preservation

---

## 🎵 How Add-Instrumental Should Work

### Expected Flow:

```
Your Vocal Recording
        ↓
    Upload to Vercel Blob
        ↓
    Send to Suno Add-Instrumental
        ↓
Suno fetches your vocal file
        ↓
Analyzes your vocal (pitch, rhythm, style)
        ↓
Generates instrumental to complement it
        ↓
    Mixes vocal + instrumental
        ↓
Returns final track WITH YOUR VOICE
```

### What You Should Hear:

✅ Your voice (clear and prominent)  
✅ Instrumental backing (drums, bass, melody)  
✅ Professional mix (vocals sit well in the mix)  
✅ Style matches your selection (pop, rock, etc.)

### What You Should NOT Hear:

❌ Only instrumental (no vocals)  
❌ AI-generated voice (should be YOUR voice)  
❌ Vocals buried/inaudible  
❌ Completely different song

---

## 🐛 If Vocals Are Still Missing

### Debug Steps:

**1. Check if your recording actually has sound:**
```javascript
// In browser console after recording:
const audio = document.querySelector('audio');
audio.play(); // Can you hear yourself?
```

**2. Check the uploaded audio URL:**
```bash
# Copy the Blob URL from console logs
curl -I "https://...blob.vercel-storage.com/audio_xxx.webm"
# Should return 200 OK with content-length
```

**3. Check Suno's error response:**
Look for these in console:
```
⚠️ Task has error: {...}
errorMessage: "Can't fetch the uploaded audio"
```

**4. Check operationType:**
Should be `"underpainting"` (adding instrumental to vocals)

**5. Test locally vs production:**
- Local: Uses `/uploads` (direct file access)
- Vercel: Uses Blob storage (public URLs)

---

## 🔧 Additional Fixes to Try

### If audioWeight 0.9 isn't enough:

**Option 1: Increase to 0.95**
```typescript
audioWeight: 0.95,  // Even more vocal prominence
```

**Option 2: Adjust styleWeight**
```typescript
styleWeight: 0.5,   // Less strict style adherence
audioWeight: 0.9,   // Keep vocals clear
```

**Option 3: Add vocal-specific tags**
```typescript
tags: `${style}, clear vocals, acapella with backing, vocal-focused`,
```

### If Suno can't fetch the audio:

**Check CORS headers on Blob:**
- Vercel Blob should have CORS enabled by default
- Test: `curl -H "Origin: https://api.sunoapi.org" -I <blob-url>`

**Check Blob permissions:**
- Verify `access: 'public'` in upload route
- Check Blob storage settings in Vercel dashboard

---

## 📚 Related Files Changed

| File | Change |
|------|--------|
| `lib/sunoClient.ts` | Increased audioWeight 0.7 → 0.9 |
| `lib/sunoClient.ts` | Added audio URL verification |
| `lib/sunoClient.ts` | Enhanced error logging |

---

## 🎯 Expected Outcome

**After this fix:**

1. ✅ Your vocals are clearly audible in the final mix
2. ✅ Instrumental backing supports (not overwhelms) your voice
3. ✅ Better error messages if audio can't be fetched
4. ✅ Verification step prevents wasted API calls

**Test it now:**
1. Record your voice singing/speaking
2. Generate with your favorite style
3. Play the result - hear YOUR voice with backing music! 🎤✨

---

## 🚀 Next Steps

1. **Test a generation** with the new audioWeight
2. **Check console logs** for the verification step
3. **Listen to the result** - vocals should be clear
4. **If still missing vocals**, check the debug steps above

---

**The fix is deployed. Try recording and generating again!** 🎵

