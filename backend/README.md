# Streakly Backend API

Backend server for Streakly - A learning progress tracking application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/streakly
JWT_SECRET=your_secure_secret_key
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── models/          # Mongoose models
├── routes/          # API routes
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, upload, etc.)
├── utils/           # Utility functions
├── uploads/         # File upload directory
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/streakly |
| `JWT_SECRET` | Secret key for JWT | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CLIENT_URL` | Frontend URL (for CORS) | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | 10485760 (10MB) |

## 📡 API Endpoints

### Health Check
- `GET /` - Welcome message
- `GET /api/health` - Server health status

### Authentication (Coming Soon)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

## 🛠️ Technologies

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests
- **Cookie Parser** - Cookie handling

## 📝 Notes

- All API endpoints will be prefixed with `/api`
- Authentication uses JWT tokens stored in httpOnly cookies
- File uploads support images, PDFs, and documents (max 10MB)
- CORS is configured to allow credentials from frontend
