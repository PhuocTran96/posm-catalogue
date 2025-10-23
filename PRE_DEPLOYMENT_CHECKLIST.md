# Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying to production.

## 📋 Complete This Checklist

### Environment Setup
- [ ] Node.js 18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] All dependencies installed: `npm install`
- [ ] No npm audit vulnerabilities: `npm audit`

### Configuration
- [ ] `.env.example` file exists and documented
- [ ] `.env.local` created with admin password hash
- [ ] `.gitignore` includes `.env.local` and `.env`
- [ ] Password generated: `npm run generate-password YourPassword`

### Build Verification
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] Bundle size is acceptable (<100KB gzipped main bundle)
- [ ] Code split chunks created (ExportPanel, MarkerEditor)
- [ ] Preview works: `npm run preview`

### Sample Data
- [ ] `public/data/models.json` exists
- [ ] At least one model detail file exists (`public/data/models/model-001.json`)
- [ ] JSON files are valid (no syntax errors)
- [ ] Images referenced are accessible (or using placeholders)

### Feature Testing (Development)
- [ ] Home page loads without errors
- [ ] Model list displays correctly
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Model detail page loads
- [ ] POSM markers display on model
- [ ] Marker popup shows correct information
- [ ] Admin login works with correct password
- [ ] Admin login rejects wrong password
- [ ] Rate limiting works (6 failed attempts)
- [ ] Admin panel accessible after login
- [ ] Logout works correctly

### Code Quality
- [ ] `npm run lint` passes (or warnings are acceptable)
- [ ] No console errors in browser DevTools
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] All imports resolve correctly

### Security
- [ ] No hardcoded passwords in source code
- [ ] No API keys committed to repository
- [ ] `.env.local` not committed to git
- [ ] Rate limiting tested and working
- [ ] XSS prevention in place (sanitization functions)
- [ ] Authentication working properly

### UI/UX
- [ ] Error boundaries catch component errors gracefully
- [ ] Loading states display correctly
- [ ] Toast notifications work (if implemented)
- [ ] 404 page displays for invalid routes
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Mobile responsive (test at 375px, 768px, 1920px)

### Performance
- [ ] Images lazy load correctly
- [ ] Code splitting working (check Network tab)
- [ ] Admin components load on demand
- [ ] No memory leaks in long sessions
- [ ] Smooth 60fps interactions

### Documentation
- [ ] README.md is complete and accurate
- [ ] TESTING.md guide is available
- [ ] QUICK_TEST.md for rapid verification
- [ ] Deployment instructions clear
- [ ] Environment variables documented

### Deployment Configuration
- [ ] `netlify.toml` or `vercel.json` configured
- [ ] Build command correct: `npm run build`
- [ ] Publish directory correct: `dist`
- [ ] Environment variables ready for hosting platform
- [ ] Security headers configured (if using Netlify)

### Repository
- [ ] All changes committed to git
- [ ] Meaningful commit messages
- [ ] Repository pushed to GitHub/GitLab
- [ ] `.git` folder exists
- [ ] Remote origin set correctly

### Cross-Browser Testing (Optional but Recommended)
- [ ] Tested in Chrome/Edge
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] No browser-specific bugs found

### Accessibility (Optional but Recommended)
- [ ] Keyboard navigation fully functional
- [ ] ARIA labels on interactive elements
- [ ] Color contrast meets WCAG guidelines
- [ ] Screen reader friendly (test with NVDA/VoiceOver)

## 🚀 Ready to Deploy?

If all items are checked above, you're ready to deploy!

### Quick Deploy Commands

```bash
# Verify one last time
npm run build && npm run preview

# Push to repository
git add .
git commit -m "Ready for production deployment"
git push origin main

# Then connect to Netlify or Vercel via their web interface
```

### Post-Deployment Verification

After deploying, verify on the live site:
- [ ] Site loads at production URL
- [ ] All features work as in development
- [ ] Admin login works with production credentials
- [ ] No console errors in production
- [ ] SSL certificate is active (https://)
- [ ] Performance is acceptable
- [ ] Mobile experience is good

## ⚠️ Before Going Live

### Final Checks
- [ ] Change default admin password to strong password
- [ ] Update `README.md` with actual deployment URL
- [ ] Set up monitoring/analytics (optional)
- [ ] Test from different networks
- [ ] Share with stakeholders for feedback

## 🎉 Success!

Once all boxes are checked and the site is live:
1. Document any issues for future reference
2. Set up regular backups of data
3. Monitor error logs
4. Plan for future enhancements

---

**Current Status**: Use this checklist to track your progress towards production readiness!

**Estimated Time**: 30-60 minutes for complete checklist
