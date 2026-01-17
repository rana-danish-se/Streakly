import mongoose from 'mongoose';
import journeyNotificationJobs from '../jobs/journeyNotification.js';
// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    journeyNotificationJobs.startJobs();
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;