# Apartment Maintenance Management System

A secure full-stack web application for managing apartment maintenance requests, payments, and communication between administrators and residents.

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Separate permissions for admins and users
- **Password Encryption** - BCrypt password hashing
- **Secure API Endpoints** - All endpoints require authentication
- **Environment Variables** - Sensitive data stored securely

## Features

### Admin Dashboard
* **User Management** - View and manage resident accounts
* **Maintenance Requests** - Track and update maintenance issues
* **Payment Management** - Create and manage monthly maintenance payments
* **Expense Tracker** - Track building income and expenses with real-time balance
* **Messaging** - Chat with residents with file sharing support

### User Dashboard
* **Submit Requests** - Create maintenance requests with priority levels
* **Track Requests** - View status of submitted requests
* **Payment History** - View maintenance payment records by month
* **Messaging** - Chat with admin with file sharing support

### Key Capabilities
* 📁 **File Sharing** - Share images, PDFs, and documents in messages
* 💰 **Expense Tracking** - Monitor building finances with income vs expense tracking
* 🔐 **Role-Based Access** - Separate admin and user interfaces with JWT security
* 💬 **Real-Time Chat** - Communication between admin and residents

## Tech Stack

### Backend
* **Java 17** with Spring Boot 3.2.3
* **Spring Security** with JWT authentication
* **Spring Data JPA** for database operations
* **H2 Database** (in-memory for development)
* **PostgreSQL** (for production)
* **Maven** for dependency management

### Frontend
* **React 19** with Vite
* **React Router** for navigation
* **JWT Token Management** for secure authentication
* **Vanilla CSS** for styling

## Prerequisites

* Java 17 or higher
* Maven 3.9+
* Node.js 18+ and npm
* PostgreSQL (for production) or H2 (for development)
* Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Veniyan/Apartment-maintanance.git
cd Apartment-maintanance
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
# For local development with H2:
DB_URL=jdbc:h2:mem:apartmentdb
DB_USERNAME=sa
DB_PASSWORD=

# For production with PostgreSQL:
# DB_URL=jdbc:postgresql://your-host:5432/apartmentdb
# DB_USERNAME=your_username
# DB_PASSWORD=your_secure_password

# JWT Configuration (IMPORTANT: Change this in production!)
JWT_SECRET=your_very_secure_random_secret_key_here_min_32_chars
JWT_EXPIRATION=86400000
```

**⚠️ SECURITY WARNING:**
- NEVER commit `.env` to version control
- Generate a secure JWT secret: `openssl rand -base64 32`
- Use strong database credentials in production

### 3. Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

**Note:** On first run, the application will automatically create:
- Admin user: `admin` / `admin123`
- Regular user: `user1` / `pass123`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Update Dashboard Components (IMPORTANT!)

The dashboard components need to be updated to use JWT authentication. See `frontend/MIGRATION_GUIDE.js` for detailed instructions on updating:
- `UserDashboard.jsx`
- `AdminDashboard.jsx`

Key changes needed:
1. Import the API utility: `import { api, logout } from '../utils/api';`
2. Replace all `fetch()` calls with `api.get()`, `api.post()`, etc.
3. Use `logout()` function for logging out
4. Remove manual header construction

## Project Structure

```
apartment-maintenance/
├── backend/
│   ├── src/main/java/com/example/apartment/
│   │   ├── config/          # Security & JWT configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── dto/             # Data transfer objects
│   │   └── util/            # JWT utility classes
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/           # API utility (JWT handling)
│   │   ├── App.jsx
│   │   └── App.css
│   ├── MIGRATION_GUIDE.js   # Guide for updating API calls
│   └── package.json
├── .env.example             # Example environment variables
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication (Public)
* `POST /api/auth/signup` - Register new user
* `POST /api/auth/login` - User login (returns JWT token)

### Maintenance Requests (Authenticated)
* `GET /api/maintenance` - Get all requests (admin only)
* `GET /api/maintenance/user/{username}` - Get user's requests
* `POST /api/maintenance` - Create new request
* `PUT /api/maintenance/{id}` - Update request status

### Payments (Authenticated)
* `GET /api/payments` - Get all payments (admin only)
* `GET /api/payments/user/{username}` - Get user's payments
* `GET /api/payments/user/{username}/month/{month}` - Get payments by month
* `POST /api/payments` - Create payment record (admin only)
* `PUT /api/payments/{id}/status` - Update payment status
* `DELETE /api/payments/{id}` - Delete payment (admin only)

### Expenses (Admin Only)
* `GET /api/expenses` - Get all expenses
* `GET /api/expenses/month/{year}/{month}` - Get expenses by month
* `POST /api/expenses` - Create expense record

### Messages (Authenticated)
* `GET /api/chat/history/{user1}/{user2}` - Get chat history
* `POST /api/chat/send` - Send message

### Files (Authenticated)
* `POST /api/files/upload` - Upload file (max 10MB)
* `GET /api/files/{filename}` - Download file

**Note:** All authenticated endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

## Default Credentials

### Admin Account
* Username: `admin`
* Password: `admin123`

### User Account
* Username: `user1`
* Password: `pass123`

**⚠️ IMPORTANT:** Change these default passwords in production!

## Security Best Practices

1. **JWT Secret**: Generate a secure random secret for production
   ```bash
   openssl rand -base64 32
   ```

2. **Database Credentials**: Use strong passwords and never commit them to Git

3. **HTTPS**: Use HTTPS in production (configure reverse proxy like Nginx)

4. **Password Policy**: Implement strong password requirements in production

5. **Token Expiration**: Adjust JWT expiration time based on your security needs

6. **Input Validation**: The backend validates all inputs, but add frontend validation too

## Development

### Running Tests

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
mvn clean package
# JAR file will be in target/ directory

# Frontend
cd frontend
npm run build
# Build files will be in dist/ directory
```

## Database Configuration

### H2 (Development)
```properties
spring.datasource.url=jdbc:h2:mem:apartmentdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

Access H2 console at: `http://localhost:8081/h2-console`

### PostgreSQL (Production)
```properties
spring.datasource.url=jdbc:postgresql://your-host:5432/apartmentdb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## Troubleshooting

### Backend won't start
- Check if port 8081 is available
- Verify database connection settings in `.env`
- Ensure JWT_SECRET is set

### Frontend can't connect to backend
- Verify backend is running on port 8081
- Check CORS settings in `SecurityConfig.java`
- Verify API URL in `src/utils/api.js`

### Authentication fails
- Clear browser localStorage and try again
- Check if JWT_SECRET matches between restarts
- Verify token expiration hasn't passed

### Maven build fails
- The `<n>` tag in pom.xml should be `<name>` (this has been fixed)
- Run `mvn clean` before building

## Future Enhancements

* Email notifications for maintenance requests
* Payment gateway integration
* Mobile responsive design improvements
* File preview modal
* Export reports (PDF/Excel)
* Multi-language support
* Password reset functionality
* Two-factor authentication

## License

This project is licensed under the MIT License.

## Author

Veniyan - [GitHub Profile](https://github.com/Veniyan)

## Acknowledgments

* Spring Boot Documentation
* React Documentation  
* Vite Documentation
* JWT.io
