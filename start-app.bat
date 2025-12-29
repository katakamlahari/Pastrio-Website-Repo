@echo off
REM Pastebin Clone - App Launcher

echo.
echo ========================================
echo   Pastebin Clone - Starting Server
echo ========================================
echo.
echo Prerequisites:
echo - MongoDB must be running in another terminal
echo - Run: start-mongodb.bat
echo.

cd /d "%~dp0"

echo Installing dependencies...
call npm install >nul 2>&1

echo.
echo Starting server...
echo.
echo ========================================
echo Server running at: http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause
