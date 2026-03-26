@echo off
setlocal
set ROOT=%~dp0

echo Starting Prelegal...
echo.

REM ── Backend ────────────────────────────────────────────────────────────────
echo Starting backend (FastAPI)...
start "Prelegal - Backend" cmd /k ^
  "cd /d "%ROOT%backend" ^
  && if not exist .venv ( python -m venv .venv ) ^
  && .venv\Scripts\activate ^
  && pip install -r requirements.txt -q ^
  && python -m uvicorn main:app --reload --port 8000"

REM ── Frontend ───────────────────────────────────────────────────────────────
echo Starting frontend (Next.js)...
start "Prelegal - Frontend" cmd /k ^
  "cd /d "%ROOT%frontend" ^
  && npm install ^
  && npm run dev"

echo.
echo Both services launching in separate windows.
echo   Backend:  http://localhost:8000/api/health
echo   Frontend: http://localhost:3000
echo.
echo Run stop.bat to stop both services.
