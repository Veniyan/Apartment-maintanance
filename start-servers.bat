@echo off
echo ========================================
echo Starting Apartment Maintenance System
echo ========================================
echo.

REM Start Backend Server
echo [1/3] Starting Backend Server (Spring Boot)...
start "Backend Server" cmd /k "cd /d d:\python\apartmentmaintanance\backend && D:\apache-maven-3.9.11\bin\mvn spring-boot:run"

REM Wait for backend to start
echo Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak

REM Start Frontend Server
echo.
echo [2/3] Starting Frontend Server (Vite)...
start "Frontend Server" cmd /k "cd /d d:\python\apartmentmaintanance\frontend && npm run dev"

REM Wait for frontend to start
echo Waiting 10 seconds for frontend to start...
timeout /t 10 /nobreak

REM Open Browser
echo.
echo [3/3] Opening browser...
start chrome http://localhost:5173

echo.
echo ========================================
echo All servers started successfully!
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
