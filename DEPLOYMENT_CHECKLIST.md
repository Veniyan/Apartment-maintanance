# 🚀 DEPLOYMENT CHECKLIST

## Files That Have Been Fixed/Created

### ✅ Backend Files (Copy These)

1. **pom.xml** - Fixed broken tag, added JWT dependencies
   - Path: `/backend/pom.xml`
   - Status: ✅ Fixed

2. **application.properties** - Environment variables, security config
   - Path: `/backend/src/main/resources/application.properties`
   - Status: ✅ Updated

3. **JwtUtil.java** - JWT token management
   - Path: `/backend/src/main/java/com/example/apartment/util/JwtUtil.java`
   - Status: ✅ New file

4. **JwtRequestFilter.java** - JWT authentication filter
   - Path: `/backend/src/main/java/com/example/apartment/config/JwtRequestFilter.java`
   - Status: ✅ New file

5. **SecurityConfig.java** - Spring Security with RBAC
   - Path: `/backend/src/main/java/com/example/apartment/config/SecurityConfig.java`
   - Status: ✅ Updated

6. **AuthController.java** - JWT token generation on login
   - Path: `/backend/src/main/java/com/example/apartment/controller/AuthController.java`
   - Status: ✅ Updated

7. **LoginResponse.java** - Added token field
   - Path: `/backend/src/main/java/com/example/apartment/dto/LoginResponse.java`
   - Status: ✅ Updated

### ✅ Frontend Files (Copy These)

1. **Login.jsx** - Stores JWT token
   - Path: `/frontend/src/components/Login.jsx`
   - Status: ✅ Updated

2. **api.js** - API utility with JWT handling
   - Path: `/frontend/src/utils/api.js`
   - Status: ✅ New file

### ⚠️ Frontend Files (Need Manual Update)

3. **UserDashboard.jsx** - Replace fetch() with api utility
   - Path: `/frontend/src/components/UserDashboard.jsx`
   - Status: ⚠️ Needs update (see MIGRATION_GUIDE.js)

4. **AdminDashboard.jsx** - Replace fetch() with api utility
   - Path: `/frontend/src/components/AdminDashboard.jsx`
   - Status: ⚠️ Needs update (see MIGRATION_GUIDE.js)

### 📝 Documentation Files

1. **.env.example** - Environment variable template
2. **README_UPDATED.md** - Complete documentation
3. **SECURITY_FIXES_SUMMARY.md** - All changes explained
4. **MIGRATION_GUIDE.js** - How to update dashboards
5. **DEPLOYMENT_CHECKLIST.md** - This file

## Step-by-Step Deployment

### Step 1: Copy Fixed Files to Your Project

```bash
# From the fixed directory, copy to your actual project
cd /path/to/your/Apartment-maintanance

# Backend
cp /home/claude/Apartment-maintanance/backend/pom.xml backend/
cp /home/claude/Apartment-maintanance/backend/src/main/resources/application.properties backend/src/main/resources/
cp /home/claude/Apartment-maintanance/backend/src/main/java/com/example/apartment/util/JwtUtil.java backend/src/main/java/com/example/apartment/util/
cp /home/claude/Apartment-maintanance/backend/src/main/java/com/example/apartment/config/JwtRequestFilter.java backend/src/main/java/com/example/apartment/config/
cp /home/claude/Apartment-maintanance/backend/src/main/java/com/example/apartment/config/SecurityConfig.java backend/src/main/java/com/example/apartment/config/
cp /home/claude/Apartment-maintanance/backend/src/main/java/com/example/apartment/controller/AuthController.java backend/src/main/java/com/example/apartment/controller/
cp /home/claude/Apartment-maintanance/backend/src/main/java/com/example/apartment/dto/LoginResponse.java backend/src/main/java/com/example/apartment/dto/

# Frontend
mkdir -p frontend/src/utils
cp /home/claude/Apartment-maintanance/frontend/src/utils/api.js frontend/src/utils/
cp /home/claude/Apartment-maintanance/frontend/src/components/Login.jsx frontend/src/components/

# Documentation
cp /home/claude/Apartment-maintanance/.env.example .
cp /home/claude/Apartment-maintanance/README_UPDATED.md README.md
cp /home/claude/Apartment-maintanance/SECURITY_FIXES_SUMMARY.md .
cp /home/claude/Apartment-maintanance/frontend/MIGRATION_GUIDE.js frontend/
```

### Step 2: Create Environment File

```bash
cp .env.example .env
nano .env  # Edit with your values
```

Required variables:
```
DB_PASSWORD=your_password
JWT_SECRET=$(openssl rand -base64 32)
```

### Step 3: Update Dashboard Components

Option A - Use migration script:
```bash
cd frontend
./update_api_calls.sh
```

Option B - Manual update:
1. Open `frontend/MIGRATION_GUIDE.js`
2. Follow the examples to update `UserDashboard.jsx` and `AdminDashboard.jsx`

### Step 4: Build Backend

```bash
cd backend
mvn clean install
```

Expected output:
```
[INFO] BUILD SUCCESS
```

### Step 5: Build Frontend

```bash
cd frontend
npm install
npm run build
```

### Step 6: Test Locally

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 7: Verify Security

Test these scenarios:
- [ ] Login as admin (admin/admin123)
- [ ] Login as user (user1/pass123)
- [ ] Access admin endpoint as user → Should get 403
- [ ] Access endpoint without token → Should redirect to login
- [ ] Create maintenance request with token → Should work
- [ ] Upload file with token → Should work
- [ ] Logout → Should clear token and redirect

## Quick Command Reference

### Backend
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Test
mvn test

# Package for production
mvn clean package
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment
```bash
# Generate JWT secret
openssl rand -base64 32

# View environment
cat .env

# Edit environment
nano .env
```

## Production Deployment

### Docker (Recommended)

Create `Dockerfile` for backend:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/apartment-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: apartmentdb
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    
  backend:
    build: ./backend
    ports:
      - "8081:8081"
    environment:
      - DB_URL=jdbc:postgresql://postgres:5432/apartmentdb
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      
  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
    ports:
      - "80:80"
```

Deploy:
```bash
docker-compose up -d
```

### Manual Deployment

1. **Database Setup**
```sql
CREATE DATABASE apartmentdb;
CREATE USER apartmentuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE apartmentdb TO apartmentuser;
```

2. **Backend Deployment**
```bash
# Build JAR
mvn clean package

# Run with production profile
java -jar target/apartment-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --DB_URL=jdbc:postgresql://your-db:5432/apartmentdb \
  --DB_USERNAME=apartmentuser \
  --DB_PASSWORD=secure_password \
  --JWT_SECRET=your_secret
```

3. **Frontend Deployment**
```bash
# Build
npm run build

# Copy to web server
cp -r dist/* /var/www/html/
```

4. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8081;
    }
}
```

## Troubleshooting

### Backend Issues

**Port 8081 in use:**
```bash
# Find process
lsof -i :8081
# Kill it
kill -9 <PID>
```

**Database connection failed:**
```bash
# Check PostgreSQL status
systemctl status postgresql
# Test connection
psql -U apartmentuser -d apartmentdb -h localhost
```

**JWT issues:**
```bash
# Verify secret is set
echo $JWT_SECRET
# Check logs
tail -f backend/logs/spring.log
```

### Frontend Issues

**API calls failing:**
```bash
# Check network tab in browser
# Verify Authorization header is present
# Check CORS settings in SecurityConfig
```

**Build fails:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

## Security Checklist

Before going to production:

- [ ] Changed default passwords (admin/user1)
- [ ] Generated secure JWT secret
- [ ] Using PostgreSQL (not H2)
- [ ] Environment variables in .env (not hardcoded)
- [ ] .env is in .gitignore
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Strong database password
- [ ] File upload size limits set
- [ ] Error messages don't leak info
- [ ] Logging configured
- [ ] Backup strategy in place

## Support

If you encounter issues:

1. Check `SECURITY_FIXES_SUMMARY.md` for detailed explanations
2. Review `MIGRATION_GUIDE.js` for frontend examples
3. Check backend logs: `backend/logs/spring.log`
4. Enable debug logging in `application.properties`

## Success Criteria

✅ Your deployment is successful when:
- Backend starts without errors
- Frontend connects to backend
- Login returns JWT token
- Token is used in subsequent requests
- Admin endpoints blocked for regular users
- File uploads work
- No credentials in git repository

## Final Notes

- **Backup your data** before deploying
- **Test thoroughly** in staging environment
- **Monitor logs** after deployment
- **Have rollback plan** ready
- **Document any custom changes**

Good luck! 🚀
