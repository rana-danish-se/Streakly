import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { verifyCloudinaryConfig } from './config/cloudinary.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import pushSubscriptionRoutes from './routes/pushSubscription.js';
import quoteRoutes from './routes/quoteRoutes.js';

import cronRoutes from './routes/cronRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Connect to database
connectDB();

// Verify Cloudinary configuration
verifyCloudinaryConfig();




// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/journeys/:journeyId/tasks', taskRoutes); // Nested task routes
app.use('/api/tasks', taskRoutes); // Top-level task routes
app.use('/api/push', pushSubscriptionRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/quotes', quoteRoutes);



// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Streakly API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
