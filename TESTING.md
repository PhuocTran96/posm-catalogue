# Pre-Deployment Testing Guide

This guide will walk you through testing the POSM Catalogue Platform before deployment.

## Prerequisites Checklist

- [ ] Node.js 18.x or higher installed
- [ ] npm 9.x or higher installed
- [ ] Git repository initialized
- [ ] All dependencies installed (`npm install`)

## Step 1: Environment Setup (5 minutes)

### 1.1 Generate Admin Password

```bash
# Generate a secure password hash
npm run generate-password YourSecurePassword123

# Copy the output and create .env.local file
```

Create `.env.local` in the project root:

```env
VITE_ADMIN_PASSWORD_HASH="$pbkdf2$10$..."
```

**✅ Checkpoint**: Verify `.env.local` exists with the password hash

### 1.2 Verify Dependencies

```bash
# Check for any missing dependencies
npm install

# Verify no vulnerabilities
npm audit
```

**✅ Checkpoint**: No critical vulnerabilities reported

## Step 2: Development Server Testing (15 minutes)

### 2.1 Start Development Server

```bash
# Start the dev server
npm run dev

# Server should start at http://localhost:5173
```

**✅ Checkpoint**: Server starts without errors

### 2.2 Browser Testing

Open your browser to `http://localhost:5173`

#### Test 1: Home Page Load
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools (F12)
- [ ] Header displays correctly
- [ ] "Loading models..." appears briefly

**Expected**: Clean page load with header

#### Test 2: Model List Display
- [ ] Models display in grid view
- [ ] Each model card shows:
  - [ ] Thumbnail image (may be placeholder)
  - [ ] Model name
  - [ ] POSM count badge
- [ ] View toggle buttons work (grid ⟺ list)

**Expected**: Model cards render properly

#### Test 3: Search Functionality
- [ ] Click search bar or press `/` key
- [ ] Type any text
- [ ] Results update in real-time
- [ ] "Clear all filters" button appears

**Expected**: Search filters models dynamically

#### Test 4: Category Filter
- [ ] Category checkboxes appear in sidebar
- [ ] Select/deselect categories
- [ ] Model list updates accordingly
- [ ] Result count displays correctly

**Expected**: Filtering works without errors

#### Test 5: Model Detail View
- [ ] Click any model card
- [ ] Model detail page loads
- [ ] Model image displays (or error message if missing)
- [ ] "Back to Catalogue" link works
- [ ] No POSM markers (since we have no data yet)

**Expected**: Navigation works smoothly

### 2.3 Admin Authentication Testing

#### Test 6: Admin Login
```bash
# Navigate to admin
# URL: http://localhost:5173/admin
```

- [ ] Login form appears
- [ ] Enter wrong password → Error message shows
- [ ] Enter correct password → Redirects to admin panel
- [ ] Try 6 wrong passwords → Rate limiting message appears

**Expected**: Authentication works with rate limiting

#### Test 7: Admin Panel Access
- [ ] After login, admin panel loads
- [ ] "Models" and "Export" tabs visible
- [ ] Can switch between tabs
- [ ] Logout button works

**Expected**: Admin interface accessible

#### Test 8: Error Boundary Test
```bash
# Test error handling by accessing invalid route
# URL: http://localhost:5173/invalid-route
```

- [ ] 404 page displays
- [ ] "Return to Home" button works
- [ ] No app crash

**Expected**: Graceful error handling

### 2.4 Console Check

Open browser DevTools (F12) → Console tab:

- [ ] No red errors (except for missing data files - expected)
- [ ] No security warnings
- [ ] No CORS errors

**Expected**: Clean console or only expected warnings

**✅ Checkpoint**: All manual tests pass in development

## Step 3: Build Testing (10 minutes)

### 3.1 Production Build

```bash
# Create production build
npm run build
```

**Look for**:
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Bundle sizes displayed
- [ ] Files created in `dist/` folder

**Expected Output**:
```
✓ 90 modules transformed.
dist/index.html                    0.46 kB
dist/assets/index-*.css           11.41 kB (2.60 kB gzipped)
dist/assets/ExportPanel-*.js       9.55 kB (2.85 kB gzipped)
dist/assets/MarkerEditor-*.js     44.25 kB (12.90 kB gzipped)
dist/assets/index-*.js           282.28 kB (84.67 kB gzipped)
✓ built in 2.09s
```

**✅ Checkpoint**: Build succeeds

### 3.2 Preview Production Build

```bash
# Preview the production build
npm run preview
```

**Test the preview** (usually at `http://localhost:4173`):
- [ ] Home page loads
- [ ] All features work as in dev mode
- [ ] Images load correctly
- [ ] Admin login works
- [ ] Performance feels snappy

**✅ Checkpoint**: Production build works correctly

### 3.3 Bundle Analysis

Check the build output:

```bash
# Check bundle sizes
ls -lh dist/assets/
```

**Verify**:
- [ ] Main bundle < 100 KB gzipped
- [ ] Admin chunks are separate files
- [ ] CSS file is minified

**✅ Checkpoint**: Bundle sizes are optimal

## Step 4: Linting & Code Quality (5 minutes)

### 4.1 Run Linter

```bash
# Check code quality
npm run lint
```

**Expected**:
- [ ] No critical errors
- [ ] Warnings are acceptable (dependency arrays, etc.)

### 4.2 TypeScript Check

```bash
# Type check
npx tsc --noEmit
```

**Expected**:
- [ ] No type errors

**✅ Checkpoint**: Code quality checks pass

## Step 5: Sample Data Testing (10 minutes)

To fully test the application, you need sample data. Here's how to add it:

### 5.1 Create Sample Model Data

Create `posm-catalogue/public/data/models.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-01-23T00:00:00Z",
  "categories": [
    {
      "id": "beverages",
      "name": "Beverages",
      "description": "Drink products"
    },
    {
      "id": "snacks",
      "name": "Snacks",
      "description": "Snack products"
    }
  ],
  "models": [
    {
      "id": "model-001",
      "name": "Sample Product Display",
      "code": "SPD-001",
      "categoryIds": ["beverages"],
      "thumbnailUrl": "/images/sample-thumbnail.jpg",
      "posmCount": 2
    }
  ]
}
```

### 5.2 Create Sample Model Detail

Create `posm-catalogue/public/data/models/model-001.json`:

```json
{
  "id": "model-001",
  "name": "Sample Product Display",
  "code": "SPD-001",
  "description": "A sample product display for testing",
  "categoryIds": ["beverages"],
  "image": {
    "url": "/images/sample-model.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "alt": "Sample product display"
  },
  "posmMarkers": [
    {
      "id": "marker-001",
      "position": {
        "x": 500,
        "y": 300
      },
      "info": {
        "title": "Shelf Display",
        "description": "Main shelf display area",
        "dimensions": {
          "width": 100,
          "height": 50,
          "depth": 30,
          "unit": "cm"
        }
      }
    }
  ]
}
```

### 5.3 Add Placeholder Images

Create `posm-catalogue/public/images/` directory and add:
- `sample-thumbnail.jpg` (any image, 400x300px recommended)
- `sample-model.jpg` (any image, 1920x1080px recommended)

Or use online placeholders in JSON:
```json
"thumbnailUrl": "https://via.placeholder.com/400x300",
"url": "https://via.placeholder.com/1920x1080"
```

### 5.4 Test with Sample Data

Restart dev server and test:

- [ ] Models appear in catalogue
- [ ] Clicking model shows detail page
- [ ] POSM markers are visible on image
- [ ] Clicking marker shows popup
- [ ] Search finds the model
- [ ] Category filter works
- [ ] Admin can edit marker positions
- [ ] Export generates valid JSON

**✅ Checkpoint**: All features work with sample data

## Step 6: Cross-Browser Testing (10 minutes)

Test in multiple browsers:

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] No console errors
- [ ] Performance is good

### Firefox
- [ ] All features work
- [ ] Drag-and-drop works in admin
- [ ] No browser-specific issues

### Safari (if available)
- [ ] All features work
- [ ] Images load correctly

**✅ Checkpoint**: Works across browsers

## Step 7: Responsive Testing (10 minutes)

### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All features accessible

### Tablet (768x1024)
- [ ] Grid adjusts to 2-3 columns
- [ ] Navigation works
- [ ] Modal dialogs fit screen

### Mobile (375x667)
- [ ] Single column layout
- [ ] Touch interactions work
- [ ] Text is readable
- [ ] Buttons are tappable

**Test in DevTools**:
1. Press F12 → Toggle device toolbar
2. Test iPhone, iPad, and responsive modes

**✅ Checkpoint**: Responsive on all devices

## Step 8: Accessibility Testing (5 minutes)

### Keyboard Navigation
- [ ] Tab key navigates through interactive elements
- [ ] Enter key activates buttons/links
- [ ] Escape key closes modals
- [ ] All features accessible without mouse

### Screen Reader (Optional)
- [ ] Install NVDA (Windows) or VoiceOver (Mac)
- [ ] Navigate through the site
- [ ] All content is announced properly

**✅ Checkpoint**: Keyboard navigation works

## Step 9: Performance Testing (5 minutes)

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" mode
4. Check all categories
5. Click "Analyze page load"

**Target Scores**:
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 80

### Network Throttling

1. DevTools → Network tab
2. Set throttling to "Fast 3G"
3. Reload page
4. Verify:
   - [ ] Page loads within 5 seconds
   - [ ] Images lazy load properly
   - [ ] No broken resources

**✅ Checkpoint**: Performance is acceptable

## Step 10: Security Verification (5 minutes)

### 10.1 Check for Exposed Secrets

```bash
# Search for potential secrets
grep -r "password" posm-catalogue/src/
grep -r "api_key" posm-catalogue/src/
grep -r "secret" posm-catalogue/src/
```

**Verify**:
- [ ] No hardcoded passwords
- [ ] No API keys in code
- [ ] .env.local is in .gitignore

### 10.2 Test Rate Limiting

1. Go to admin login
2. Try wrong password 6 times
3. Verify rate limiting message appears

**✅ Checkpoint**: Security measures work

## Step 11: Pre-Deployment Checklist

Before deploying, verify:

### Files & Configuration
- [ ] `.env.local` exists (for local testing)
- [ ] `.env.example` documented
- [ ] `.gitignore` includes `.env.local`
- [ ] `README.md` is complete
- [ ] `netlify.toml` or deployment config exists

### Build
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No critical ESLint errors
- [ ] Bundle size < 100KB gzipped

### Features
- [ ] All core features work
- [ ] Admin authentication works
- [ ] Error boundaries catch errors
- [ ] 404 page displays

### Data
- [ ] Sample data loads correctly
- [ ] Images display (or graceful fallback)
- [ ] Export generates valid JSON

### Documentation
- [ ] README has deployment instructions
- [ ] Environment variables documented
- [ ] Password generation script works

**✅ Final Checkpoint**: Ready for deployment!

## Deployment Steps

Once all tests pass:

### Option 1: Netlify

1. Push code to GitHub/GitLab
2. Log in to Netlify
3. Click "New site from Git"
4. Connect repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - Key: `VITE_ADMIN_PASSWORD_HASH`
   - Value: (your generated hash)
7. Click "Deploy site"

### Option 2: Vercel

1. Push code to GitHub
2. Log in to Vercel
3. Click "New Project"
4. Import repository
5. Settings are auto-detected
6. Add environment variable in dashboard
7. Deploy

### Post-Deployment Testing

After deployment, test the live site:

- [ ] Visit deployed URL
- [ ] Test all features again
- [ ] Verify admin login with production password
- [ ] Check browser console for errors
- [ ] Test on mobile device

## Troubleshooting

### Common Issues

**Issue**: "Failed to fetch" errors
- **Fix**: Check that `public/data/` files exist
- **Fix**: Verify file paths are correct

**Issue**: Admin login doesn't work
- **Fix**: Verify environment variable is set correctly
- **Fix**: Check that `.env.local` is not committed to Git

**Issue**: Images don't load
- **Fix**: Add sample images to `public/images/`
- **Fix**: Use placeholder URLs in JSON

**Issue**: Build fails
- **Fix**: Run `npm install` again
- **Fix**: Check Node version (need 18+)

**Issue**: Slow performance
- **Fix**: Check bundle size with `npm run build`
- **Fix**: Verify lazy loading is working

## Success Criteria

✅ **Your application is ready for deployment when**:

1. All manual tests pass
2. Build completes without errors
3. Production preview works correctly
4. All core features function properly
5. No critical console errors
6. Security measures verified
7. Documentation complete

## Next Steps After Deployment

1. Monitor error logs in hosting dashboard
2. Set up custom domain (optional)
3. Add SSL certificate (usually automatic)
4. Share the URL with stakeholders
5. Gather feedback and iterate

---

**Need Help?**
- Check the [README.md](README.md) for setup instructions
- Review error messages in browser console
- Check the [GitHub Issues](https://github.com/your-org/posm-catalogue/issues)
