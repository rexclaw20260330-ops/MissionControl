@echo off
echo Supabase CLI Login Helper
echo ==========================
echo.
echo 1. Please visit: https://app.supabase.com/account/tokens
echo 2. Click "Generate New Token"
echo 3. Copy the token (starts with sbp_)
echo 4. Paste it here and press Enter:
echo.
set /p TOKEN="Token: "
echo.
echo Logging in with token...
cd /d "C:\Users\Rex\.openclaw\workspace\mission-control"
npx supabase login --token %TOKEN%
echo.
echo Press any key to run migrations...
pause

REM Run migrations
npx supabase db push

echo.
echo Done!
pause
