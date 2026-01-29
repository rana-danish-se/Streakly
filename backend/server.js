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
import topicRoutes from './routes/topicRoutes.js';

import cronRoutes from './routes/cronRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://streakly-main.vercel.app',
  'https://streakly-fawn.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return allowedOrigin === origin || allowedOrigin.replace(/\/$/, '') === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Accept-Version', 
    'Content-Length', 
    'Content-MD5', 
    'Date', 
    'X-Api-Version'
  ],
  maxAge: 86400, 
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

verifyCloudinaryConfig();

app.use('/api/auth', authRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/journeys/:journeyId/tasks', taskRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/push', pushSubscriptionRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/journeys/:journeyId/topics', topicRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Streakly API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
