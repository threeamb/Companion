# PWA Debugging Guide for GitHub Pages

## 🔧 Issues Fixed:

1. **Path Mismatch**: Updated manifest.json and service worker paths from `/guidebook/` to `/Companion/` to match your GitHub Pages URL
2. **Missing PWA Icons**: Added proper 192x192 and 512x512 icons to manifest
3. **Service Worker Cache**: Updated cache URLs to match deployment path

## 📋 PWA Installation Requirements Checklist:

### ✅ Basic Requirements:
- [ ] **HTTPS**: GitHub Pages provides this automatically ✅
- [ ] **Valid Manifest**: Now fixed with correct paths ✅ 
- [ ] **Service Worker**: Registered and configured ✅
- [ ] **Icons**: 192x192 and 512x512 PNG icons ✅

### 🔍 Debugging Steps:

#### Step 1: Check Browser Console
1. Open your GitHub Pages site: `https://threeamb.github.io/Companion`
2. Press F12 → Console tab
3. Look for errors related to:
   - Manifest loading
   - Service worker registration
   - PWA install prompt

#### Step 2: Check Application Tab (Chrome DevTools)
1. F12 → Application tab
2. **Manifest**: Should show your app details without errors
3. **Service Workers**: Should show registered worker
4. **Storage**: Should show cached files

#### Step 3: Force PWA Install Check
```javascript
// Run in browser console to check install availability
console.log('PWA installable:', window.deferredPrompt !== null);
console.log('Already installed:', window.matchMedia('(display-mode: standalone)').matches);
```

## 🚀 Deployment Steps:

1. **Rebuild with fixes**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Clear browser cache** completely (important!)

4. **Wait 5-10 minutes** for GitHub Pages to update

5. **Test on mobile** (PWA install works better on mobile)

## 📱 Testing Process:

### Desktop (Chrome/Edge):
1. Visit site in incognito mode
2. Look for install icon in address bar
3. Check for install button in your app header

### Mobile (Recommended):
1. Open site in Chrome/Safari mobile
2. Look for "Add to Home Screen" in browser menu
3. Your app should show install prompt

## 🔧 Common Issues & Solutions:

### Issue: "No install button visible"
**Solutions:**
- Clear browser cache completely
- Try incognito/private mode
- Check if already installed (uninstall first)
- Test on different browser
- Wait for cache to clear (5-10 minutes)

### Issue: "Manifest not loading"
**Check:**
- URL paths match deployment
- No 404 errors in console
- HTTPS is working

### Issue: "Service worker fails"
**Check:**
- Service worker paths are correct
- No JavaScript errors
- Browser supports service workers

## 🎯 Quick Test Commands:

```javascript
// Check in browser console:
navigator.serviceWorker.getRegistrations().then(console.log);
navigator.serviceWorker.controller && console.log('SW active');
```

## 📞 If Still Not Working:

1. **Check actual GitHub Pages URL** - make sure you're visiting the right link
2. **Try different browsers** - Chrome/Edge have best PWA support
3. **Test on mobile** - mobile browsers show install prompts more reliably
4. **Check network tab** for any 404 errors on manifest.json or service worker

Remember: PWA features can take time to activate after deployment!
