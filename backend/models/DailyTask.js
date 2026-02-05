import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  time: {
    type: String,
    required: [true, 'Please provide a reminder time'],
    match: [/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in HH:mm format']
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  completedDates: [{
    type: String, // Format: YYYY-MM-DD
    index: true
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for efficient querying of today's completion status
dailyTaskSchema.index({ user: 1, isActive: 1 });

export default mongoose.model('DailyTask', dailyTaskSchema);
