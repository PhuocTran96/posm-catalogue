#!/bin/bash

# Pre-Deployment Test Script
# Run this script before deploying to production

echo "========================================="
echo "POSM Catalogue - Pre-Deployment Tests"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: Node version
echo "Test 1: Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "${GREEN}✓ Node.js $NODE_VERSION.x installed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Node.js 18+ required (found: $NODE_VERSION)${NC}"
    ((FAILED++))
fi

# Test 2: Dependencies installed
echo ""
echo "Test 2: Checking node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Run 'npm install' first${NC}"
    ((FAILED++))
fi

# Test 3: Sample data exists
echo ""
echo "Test 3: Checking sample data..."
if [ -f "public/data/models.json" ]; then
    echo -e "${GREEN}✓ models.json exists${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ public/data/models.json not found (app will show empty)${NC}"
fi

# Test 4: Build
echo ""
echo "Test 4: Running production build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build succeeded${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Build failed - check errors with: npm run build${NC}"
    ((FAILED++))
fi

# Test 5: Check dist folder
echo ""
echo "Test 5: Checking build output..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    MAIN_JS=$(find dist/assets -name "index-*.js" | head -1)
    if [ -f "$MAIN_JS" ]; then
        SIZE=$(stat -f%z "$MAIN_JS" 2>/dev/null || stat -c%s "$MAIN_JS" 2>/dev/null)
        SIZE_KB=$((SIZE / 1024))
        if [ $SIZE_KB -lt 500 ]; then
            echo -e "${GREEN}✓ Bundle size: ${SIZE_KB}KB (good)${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ Bundle size: ${SIZE_KB}KB (large)${NC}"
            ((PASSED++))
        fi
    fi
else
    echo -e "${RED}✗ Build output missing${NC}"
    ((FAILED++))
fi

# Test 6: Environment file check
echo ""
echo "Test 6: Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local exists${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ .env.local not found - create it with admin password${NC}"
fi

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓ .env.example documented${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ .env.example not found${NC}"
fi

# Test 7: Deployment config
echo ""
echo "Test 7: Checking deployment configuration..."
if [ -f "netlify.toml" ] || [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓ Deployment config found${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ No deployment config (netlify.toml or vercel.json)${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "Failed: ${RED}$FAILED${NC}"
else
    echo -e "Failed: $FAILED"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Generate admin password: npm run generate-password YourPassword"
    echo "2. Start dev server: npm run dev"
    echo "3. Test manually in browser (see QUICK_TEST.md)"
    echo "4. Deploy to Netlify/Vercel"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Fix issues before deploying.${NC}"
    exit 1
fi
