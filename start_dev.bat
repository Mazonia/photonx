@echo off
echo ===================================================
echo   Starting PhotonX - NASA Space Apps Challenge 2026
echo   SPHEREx & Planet X Sky Browser
echo ===================================================
echo.

start "PhotonX Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"
start "PhotonX Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo Backend starting at: http://localhost:8000
echo Frontend starting at: http://localhost:5173
echo.
echo Press any key to open the browser...
pause > nul
start http://localhost:5173

