# 🔧 Troubleshooting Guide

## Recording Issues

### "Not recording any sound"

**Check browser permissions:**
1. Click the 🔒 or ⓘ icon in your browser's address bar
2. Find "Microphone" permissions
3. Set to "Allow"
4. Refresh the page

**Browser compatibility:**
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (may have limitations)
- ❌ Older browsers may not support recording

**Test your microphone:**
1. Open your system settings
2. Test that your microphone is working
3. Ensure it's not muted
4. Select the correct input device

**Browser console:**
Open DevTools (F12) and check the Console tab for errors:
- Look for permission errors
- Check for "Audio chunk received" messages when recording
- Verify blob size is > 0

### "Recording but no audio"

1. **Check system volume:** Ensure your microphone isn't muted
2. **Try another browser:** Some browsers handle MediaRecorder differently
3. **Check console logs:** Open browser DevTools (F12) → Console
4. **Test with upload:** If recording fails, try uploading an audio file instead

### "Failed to parse URL" error

This is fixed in the latest version. If you still see it:
1. Restart your dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache
3. Make sure you have the latest code

## API Issues

### Next.js Config Warning

**Error:** `Invalid next.config.js options detected: experimental.serverActions`

**Solution:** Already fixed! Restart your server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Whisper API Errors

**Error:** `Failed to parse URL from /uploads/...`

**Cause:** Trying to use real Whisper API without proper URL configuration

**Solution:** The app now automatically falls back to mock mode. You'll see:
```
Using mock mode for audio analysis
```

To use real Whisper API:
1. Add `OPENAI_API_KEY` to `.env.local`
2. Ensure the API key is valid
3. Restart the server

### Upload Errors

**Error:** "Failed to upload file"

**Possible causes:**
1. File too large (max 25MB)
2. Unsupported format (use MP3, WAV, OGG, WebM)
3. No write permissions

**Solutions:**
- Check file size: must be < 25MB
- Use supported formats
- Ensure `public/uploads/` directory can be created

## Development Issues

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

### Changes Not Showing

1. **Hard refresh:** `Cmd/Ctrl + Shift + R`
2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```
3. **Clear browser cache**

### Module Not Found

**Error:** `Module not found: Can't resolve...`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Browser-Specific Issues

### Chrome/Edge
- Usually works best
- Make sure to allow microphone access
- Check DevTools Console for errors

### Firefox
- May ask for microphone permission each time
- Codec support might differ
- Use `audio/ogg` if `audio/webm` fails

### Safari
- MediaRecorder support limited in older versions
- Use Safari 14.1 or newer
- May need different audio codecs

### Mobile Browsers
- iOS Safari: Limited recording support
- Android Chrome: Usually works well
- Consider using file upload instead

## Common Fixes

### Reset Everything

```bash
# Stop the server
Ctrl+C

# Clear Next.js cache
rm -rf .next

# Clear uploads
rm -rf public/uploads

# Reinstall dependencies (if needed)
rm -rf node_modules
npm install

# Start fresh
npm run dev
```

### Check Logs

Always check the terminal where you ran `npm run dev` for:
- ✅ "Using mock mode" - Good, app is working
- ⚠️ API errors - Check your API keys
- ❌ Server errors - May need to restart

### Browser DevTools

Press `F12` or `Cmd+Option+I` to open DevTools:
1. **Console tab:** See JavaScript errors
2. **Network tab:** Check API requests
3. **Application tab:** Check storage/cache

## Still Having Issues?

1. **Check the console output** when you record/upload
2. **Look for error messages** in terminal and browser
3. **Try the mock mode** - it should always work
4. **Use file upload** instead of recording
5. **Try a different browser**

## Quick Verification

To verify everything is working:

1. Start the server: `npm run dev`
2. Go to http://localhost:3000
3. Click "Create"
4. Try uploading an audio file (easier than recording)
5. Select a style
6. Click "Generate"
7. You should see mock results

If file upload works but recording doesn't, it's a microphone/browser issue, not the app!

## Environment Check

Make sure you have:
- ✅ Node.js 18 or newer: `node --version`
- ✅ npm installed: `npm --version`
- ✅ All dependencies: `npm install`
- ✅ Server running: `npm run dev`
- ✅ Modern browser (Chrome, Firefox, Edge)

## Getting Help

If none of this helps:
1. Check your browser's console (F12)
2. Check your terminal output
3. Look for specific error messages
4. Include error details when asking for help

