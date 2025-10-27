# 🧹 Clear Browser Cache & Service Worker

The audio error you're seeing is from an old service worker. Here's how to fix it:

## 🔄 Quick Fix

### Step 1: Restart Dev Server
```bash
# Stop (Ctrl+C)
npm run dev
```

### Step 2: Clear Browser Service Worker

**In Chrome/Edge:**
1. Press `F12` to open DevTools
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** next to any service workers
5. Click **Clear site data** at the top

**In Firefox:**
1. Press `F12` to open DevTools
2. Go to **Storage** tab
3. Find **Service Workers**
4. Click **Unregister** for localhost

**In Safari:**
1. Open **Develop** menu → **Empty Caches**
2. Or go to Preferences → Advanced → Show Develop menu

### Step 3: Hard Refresh
```
Mac: Cmd + Shift + R
Windows/Linux: Ctrl + Shift + R
```

Or just close the tab and open a new one.

## 🎯 What Was Wrong

The error:
```
Failed to execute 'put' on 'Cache': Partial response (status code 206) is unsupported
```

This happened because:
1. I added `Accept-Ranges: bytes` header for audio files
2. Browser requested audio with byte ranges (status 206)
3. Service Worker tried to cache it but can't cache 206 responses

**I've removed that header, so this won't happen again!**

## ✅ After Clearing

1. Visit `http://localhost:3000/test.html`
2. The audio should load without errors
3. No more service worker errors in console

## 🆘 If Still Not Working

Try **Incognito/Private Window**:
- No cache, no service workers
- Clean slate to test

Or **Different Browser**:
- Try Chrome if you're using Safari
- Try Firefox if neither works

---

**After clearing cache, the audio should work!** 🎵

