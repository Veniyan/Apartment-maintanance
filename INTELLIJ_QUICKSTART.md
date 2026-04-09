# INTELLIJ QUICK START GUIDE
## No Environment Variables Needed!

This version has been simplified to work immediately without .env files.

## Step 1: Open in IntelliJ

1. File → Open
2. Select the `Apartment-maintanance` folder
3. Click OK
4. Wait for IntelliJ to index the project

## Step 2: Install Java 21

1. File → Project Structure (Ctrl+Alt+Shift+S)
2. Project → SDK dropdown
3. Click "Download JDK..."
4. Select:
   - Version: 21
   - Vendor: Amazon Corretto or Eclipse Temurin
5. Click Download
6. Click OK

## Step 3: Configure Maven

1. File → Settings (Ctrl+Alt+S)
2. Build, Execution, Deployment → Build Tools → Maven → Runner
3. JRE → Select Java 21
4. Click OK

## Step 4: Reload Maven Project

1. Open Maven tab (right sidebar)
2. Click refresh icon 🔄
3. Wait for dependencies to download

## Step 5: Run Backend

1. Navigate to: backend/src/main/java/com/example/apartment/ApartmentApplication.java
2. Right-click → Run 'ApartmentApplication'
3. Wait for console to show: "Started ApartmentApplication"

## Step 6: Run Frontend (New Terminal Tab)

```bash
cd frontend
npm install
npm run dev
```

## Step 7: Test

Open browser: http://localhost:5173

Login:
- Admin: admin / admin123
- User: user1 / pass123

---

## If You Still Get Errors:

### Error: "java.lang.ExceptionInInitializerError"

**Fix 1: Clear IntelliJ Caches**
- File → Invalidate Caches → Invalidate and Restart

**Fix 2: Delete .idea folder**
1. Close IntelliJ
2. Delete the `.idea` folder in your project
3. Reopen project in IntelliJ

**Fix 3: Reimport Maven**
- Maven tab → Right-click project → Reimport

### Error: "Port 8081 already in use"

**Fix:**
- Close any running Java processes
- In Windows: Open Task Manager → End any "java.exe" processes
- Or change port in application.properties: `server.port=8082`

### Error: "Cannot resolve dependencies"

**Fix:**
- Check internet connection
- Maven tab → Right-click → Download Sources and Documentation

---

## Database Access (Optional)

H2 Console: http://localhost:8081/h2-console

Settings:
- JDBC URL: jdbc:h2:mem:apartmentdb
- Username: sa
- Password: (leave empty)

---

## What Changed from Original:

✅ No .env file needed
✅ Uses H2 in-memory database (easy setup)
✅ Updated to Java 21
✅ Updated Spring Boot to 3.3.0
✅ All settings hardcoded for development

For production deployment, you'll still want to use environment variables and PostgreSQL.
