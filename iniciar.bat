@echo off
setlocal enabledelayedexpansion
title Patrician III 2D - Hanseatic League
mode con: cols=72 lines=20
color 0E

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not installed.
    pause
    exit /b 1
)

cls
echo.
echo ====== PATRICIAN III 2D - HANSEATIC LEAGUE ======
echo ====== Hanseatic League Economic Simulation ======
echo.

echo [1/5] Detecting occupied ports...
for %%p in (3000 5173 8080 8000) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p"') do (
        if not "%%a"=="" if %%a neq 0 (
            taskkill /F /PID %%a >nul 2>&1
            if !errorlevel! equ 0 echo    Port %%p freed
        )
    )
)
echo    Ports verified
echo.

echo [2/5] Checking dependencies...
if not exist "node_modules\react" (
    echo    Installing dependencies...
    call npm install --silent
    if !errorlevel! neq 0 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)
echo    Dependencies ready
echo.

echo [3/5] Starting Vite dev server...
start /B "" npx vite --host 127.0.0.1 --port 5173 >nul 2>&1
echo    Server starting...
echo.

echo [4/5] Launching browser...
start http://localhost:5173/
echo.

echo [5/5] Server ready
echo.

echo ---
echo URL: http://localhost:5173/
echo Close this window to stop the server
echo ---
echo.

echo Vite is running in background (PID visible in Task Manager)
echo.
:keepAlive
timeout /t 30 /nobreak >nul
goto keepAlive
