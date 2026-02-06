import mongoose from 'mongoose';

const todayTaskSchema = new mongoose.Schema({
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
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  createdDate: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
todayTaskSchema.index({ user: 1, createdDate: 1 });

export default mongoose.model('TodayTask', todayTaskSchema);
