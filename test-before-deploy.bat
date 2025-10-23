@echo off
echo =========================================
echo POSM Catalogue - Pre-Deployment Tests
echo =========================================
echo.

set PASSED=0
set FAILED=0

:: Test 1: Node version
echo Test 1: Checking Node.js version...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js installed
    set /a PASSED+=1
) else (
    echo [FAIL] Node.js not found
    set /a FAILED+=1
)

:: Test 2: Dependencies
echo.
echo Test 2: Checking node_modules...
if exist "node_modules" (
    echo [OK] Dependencies installed
    set /a PASSED+=1
) else (
    echo [FAIL] Run 'npm install' first
    set /a FAILED+=1
)

:: Test 3: Sample data
echo.
echo Test 3: Checking sample data...
if exist "public\data\models.json" (
    echo [OK] models.json exists
    set /a PASSED+=1
) else (
    echo [WARN] public\data\models.json not found
)

:: Test 4: Build
echo.
echo Test 4: Running production build...
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Build succeeded
    set /a PASSED+=1
) else (
    echo [FAIL] Build failed
    set /a FAILED+=1
)

:: Test 5: Dist folder
echo.
echo Test 5: Checking build output...
if exist "dist\index.html" (
    echo [OK] Build output exists
    set /a PASSED+=1
) else (
    echo [FAIL] Build output missing
    set /a FAILED+=1
)

:: Test 6: Environment
echo.
echo Test 6: Checking environment...
if exist ".env.local" (
    echo [OK] .env.local exists
) else (
    echo [WARN] Create .env.local with admin password
)

if exist ".env.example" (
    echo [OK] .env.example documented
) else (
    echo [WARN] .env.example not found
)

:: Test 7: Deployment config
echo.
echo Test 7: Checking deployment config...
if exist "netlify.toml" (
    echo [OK] netlify.toml found
) else if exist "vercel.json" (
    echo [OK] vercel.json found
) else (
    echo [WARN] No deployment config found
)

:: Summary
echo.
echo =========================================
echo Test Summary
echo =========================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED% equ 0 (
    echo [SUCCESS] All critical tests passed!
    echo.
    echo Next steps:
    echo 1. Generate password: npm run generate-password YourPassword
    echo 2. Start dev server: npm run dev
    echo 3. Test in browser ^(see QUICK_TEST.md^)
    echo 4. Deploy to Netlify/Vercel
) else (
    echo [ERROR] Fix issues before deploying
    exit /b 1
)
