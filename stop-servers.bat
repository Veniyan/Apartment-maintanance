@echo off
echo ========================================
echo Stopping Apartment Maintenance System
echo ========================================
echo.

echo Stopping all Java processes...
taskkill /F /IM java.exe 2>nul
if %errorlevel% == 0 (
    echo Backend stopped successfully
) else (
    echo No backend server running
)

echo.
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo Frontend stopped successfully
) else (
    echo No frontend server running
)

echo.
echo ========================================
echo All servers stopped!
echo ========================================
echo.
pause
