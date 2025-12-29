@echo off
REM MongoDB Setup and Pastebin App Launcher for Windows

echo.
echo ========================================
echo   Pastebin Clone - MongoDB Setup
echo ========================================
echo.

REM Check if mongod is available
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: MongoDB not found!
    echo.
    echo Please install MongoDB Community Edition:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo After installation, run this script again.
    echo.
    pause
    exit /b 1
)

echo MongoDB found!
echo.
echo Starting MongoDB on port 27017...
echo.
echo Note: Keep this window open while using the app
echo Press Ctrl+C to stop MongoDB when done
echo.
echo ========================================
echo.

mongod

pause
