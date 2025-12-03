@echo off
echo ========================================
echo Creating Admin and User Accounts
echo ========================================
echo.

echo Waiting for backend to be ready...
timeout /t 5 /nobreak

echo Creating Admin account...
powershell -Command "Invoke-WebRequest -Uri http://localhost:8081/api/auth/signup -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"username\":\"admin\",\"password\":\"admin123\",\"email\":\"admin@example.com\",\"role\":\"ADMIN\"}'"

echo.
echo Creating User account...
powershell -Command "Invoke-WebRequest -Uri http://localhost:8081/api/auth/signup -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"username\":\"user1\",\"password\":\"pass123\",\"email\":\"user1@example.com\",\"role\":\"USER\"}'"

echo.
echo ========================================
echo Accounts created successfully!
echo Admin: admin / admin123
echo User: user1 / pass123
echo ========================================
echo.
pause
