@echo off
REM Script to launch API and frontend properly

REM Set directory paths
set API_DIR=..\api
set FRONTEND_DIR=..\studlar

REM Launch API in new window
echo Starting API server...
cd /d %API_DIR%
start "API Server" cmd /k "python -m venv env && call .\env\Scripts\activate && pip install -r requirements.txt && python -m main"

REM Launch frontend in new window (after short delay)
echo Starting frontend server...
timeout /t 3 >nul
cd /d %FRONTEND_DIR%
start "Frontend Server" cmd /k "npm install && npm run dev"

REM Show info and close main window
echo Both servers are starting in separate windows...
echo - API: http://localhost:8000
echo - Frontend: http://localhost:3000
timeout /t 3 >nul
exit