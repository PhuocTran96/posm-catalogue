# Quick Testing Guide (5 Minutes)

This is a condensed version of the full testing guide for quick verification.

## Step 1: Install and Build (2 minutes)

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

**✅ Expected**: Build succeeds with no errors

## Step 2: Start Dev Server (1 minute)

```bash
# Start development server
npm run dev
```

**✅ Expected**: Server starts at http://localhost:5173

## Step 3: Quick Feature Test (2 minutes)

Open http://localhost:5173 in your browser and verify:

### Home Page
- [ ] Page loads without errors
- [ ] 5 sample models display in grid
- [ ] Search bar is visible
- [ ] Category filters show (Beverages, Snacks, Personal Care)

### Search Test
- [ ] Type "Premium" in search → 1 result shows
- [ ] Type "Display" in search → All 5 results show
- [ ] Clear search → All models return

### Filter Test
- [ ] Check "Beverages" → Shows 3 models (Premium, End Cap, Refrigerated)
- [ ] Check "Snacks" → Shows 4 models
- [ ] Uncheck all → Shows all 5 models

### Navigation Test
- [ ] Click "Premium Shelf Display" card
- [ ] Model detail page loads with large image
- [ ] 3 blue POSM marker dots visible on image
- [ ] Click any marker → Popup shows details
- [ ] Click outside popup → Popup closes
- [ ] Click "Back to Catalogue" → Returns to home

### Admin Test (IMPORTANT)
```bash
# First, generate admin password
npm run generate-password admin123

# Copy the hash and create .env.local:
# VITE_ADMIN_PASSWORD_HASH="$pbkdf2$10$..."

# Restart dev server after creating .env.local
```

- [ ] Go to http://localhost:5173/admin
- [ ] Enter password "admin123" → Logs in
- [ ] Admin panel loads with Models/Export tabs
- [ ] Click "Logout" → Returns to home

## Step 4: Console Check

Press F12 → Check Console tab:
- [ ] No red errors (fetch 404s for other models are OK)
- [ ] Only expected warnings about missing model files

**✅ If all checks pass**: Your app is working correctly!

## Common Issues

**Models don't show?**
- Check that `public/data/models.json` exists
- Restart dev server

**Admin login doesn't work?**
- Make sure `.env.local` exists with password hash
- Restart dev server after creating .env.local

**Build fails?**
- Run `npm install` again
- Check Node version: `node --version` (need 18+)

## Next Steps

1. ✅ **All tests pass?** → Read [TESTING.md](TESTING.md) for full testing
2. ✅ **Ready to deploy?** → Follow deployment steps in [README.md](README.md)
3. ❌ **Having issues?** → Check troubleshooting section in TESTING.md

## Quick Deploy to Netlify

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. Go to netlify.com → New site from Git
# 3. Connect your repository
# 4. Build settings (auto-detected):
#    - Build command: npm run build
#    - Publish directory: dist
# 5. Add environment variable:
#    - VITE_ADMIN_PASSWORD_HASH = (your hash from npm run generate-password)
# 6. Deploy!
```

That's it! Your POSM Catalogue is ready! 🎉
