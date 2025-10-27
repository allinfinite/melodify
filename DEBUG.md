# 🐛 Debug Guide - Suno API Error

## What I've Added

Added extensive logging to `/app/api/suno/route.ts` to help diagnose the 500 error.

## How to Debug

1. **Restart your dev server:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

2. **Try generating a remix again:**
   - Go to http://localhost:3000/record
   - Upload or record audio
   - Select a style
   - Click "Generate My Remix"

3. **Check your terminal output** for detailed logs:

You should see something like:
```
=== Suno API Route Called ===
Request body: { fileUrl: '/uploads/...', style: 'pop', ... }
Looking up style: pop
Style found: Pop
Built prompt: ...
Creating song record...
Song record created: 1234_abc
Using mock mode: true
Calling generateSongMock...
Generation result: { id: 'mock_...', status: 'complete', ... }
Updating song output URL: /uploads/...
=== Suno API Success ===
```

4. **If there's an error**, you'll see:
```
=== Suno generation error ===
Error type: TypeError
Error message: [the actual error]
Error stack: [stack trace]
```

## Common Issues

### Issue: "Cannot read property 'name' of undefined"
**Cause:** Style not found in MUSIC_STYLES array
**Fix:** Check that the style ID matches one in `utils/prompts.ts`

### Issue: "generateId is not a function"
**Cause:** Missing function in storage.ts
**Fix:** Already fixed in the code

### Issue: "fetch is not defined"
**Cause:** Node.js version issue
**Fix:** Make sure you're using Node 18+

### Issue: Module import errors
**Cause:** TypeScript/build cache
**Fix:**
```bash
rm -rf .next
npm run dev
```

## What to Share

If the error persists, please share:
1. The terminal output (everything from "=== Suno API Route Called ===" to the error)
2. The browser console error
3. What you were doing when it happened

## Quick Fix Attempt

If the logs show the error is in a specific place, here are quick fixes:

### If error is in `createSong`:
Check that `lib/storage.ts` has the `generateId` function (it should be there)

### If error is in `generateSongMock`:
The mock should always work - if it doesn't, there might be a deeper issue

### If error is in imports:
Try clearing the cache:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

