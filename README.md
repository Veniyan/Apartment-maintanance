# Apartment Maintenance Management System

A full-stack web application for managing apartment maintenance requests, payments, and communication between administrators and residents.

## Features

### Admin Dashboard
- **User Management** - View and manage resident accounts
- **Maintenance Requests** - Track and update maintenance issues
- **Payment Management** - Create and manage monthly maintenance payments
- **Expense Tracker** - Track building income and expenses with real-time balance
- **Messaging** - Chat with residents with file sharing support

### User Dashboard
- **Submit Requests** - Create maintenance requests with priority levels
- **Track Requests** - View status of submitted requests
- **Payment History** - View maintenance payment records by month
- **Messaging** - Chat with admin with file sharing support

### Key Capabilities
- 📁 **File Sharing** - Share images, PDFs, and documents in messages
- 💰 **Expense Tracking** - Monitor building finances with income vs expense tracking
- 🔐 **Role-Based Access** - Separate admin and user interfaces
- 💬 **Real-Time Chat** - Communication between admin and residents

## Tech Stack

### Backend
- **Java 24** with Spring Boot 3.2.3
- **Spring Data JPA** for database operations
- **PostgreSQL** for persistent storage
- **Spring Security** with BCrypt password encoding
- **Maven** for dependency management

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Vanilla CSS** for styling
- **Fetch API** for HTTP requests

## Prerequisites

- Java 24 or higher
- Maven 3.9+
- Node.js 18+ and npm
- Git

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/apartmentmaintanance.git
cd apartmentmaintanance
```

### 2. Backend Setup
```bash
cp .env.example .env
# fill in your PostgreSQL / Aiven credentials in .env
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will start on `http://localhost:8081`

By default the backend now uses PostgreSQL via the values in `.env`.
If you want the old in-memory database for local-only work, set `SPRING_PROFILES_ACTIVE=h2`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

## Default Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### User Account
- Username: `user1`
- Password: `pass123`

## Project Structure

```
apartmentmaintanance/
├── backend/
│   ├── src/main/java/com/example/apartment/
│   │   ├── config/          # Security and CORS configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   └── dto/             # Data transfer objects
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   └── App.css          # Global styles
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Maintenance Requests
- `GET /api/maintenance` - Get all requests (admin)
- `GET /api/maintenance/user/{username}` - Get user's requests
- `POST /api/maintenance` - Create new request
- `PUT /api/maintenance/{id}` - Update request status

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/user/{username}` - Get user's payments
- `GET /api/payments/user/{username}/month/{month}` - Get payments by month
- `POST /api/payments` - Create payment record
- `PUT /api/payments/{id}/status` - Update payment status
- `DELETE /api/payments/{id}` - Delete payment

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/month/{year}/{month}` - Get expenses by month
- `POST /api/expenses` - Create expense record

### Messages
- `GET /api/chat/history/{user1}/{user2}` - Get chat history
- `POST /api/chat/send` - Send message

### Files
- `POST /api/files/upload` - Upload file (max 10MB)
- `GET /api/files/{filename}` - Download file

## Features in Detail

### Expense Tracker
- Track all maintenance payments as income
- Record building expenses (repairs, utilities, etc.)
- View monthly breakdown with summary cards
- Lifetime balance calculation (Total Income - Total Expenses)

### File Sharing
- Support for images (JPG, PNG, GIF)
- Support for documents (PDF, DOC, DOCX)
- 10MB file size limit
- Inline image preview in chat
- Download links for documents

### Payment Management
- Month-wise payment tracking
- Toggle payment status (Paid/Unpaid)
- Filter payments by month
- Summary view with totals

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

# Frontend
cd frontend
npm run build
```

## Future Enhancements
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Mobile responsive design improvements
- [ ] File preview modal
- [ ] Export reports (PDF/Excel)
- [ ] Multi-language support

## License

This project is licensed under the MIT License.

## Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## Acknowledgments

- Spring Boot Documentation
- React Documentation
- Vite Documentation
