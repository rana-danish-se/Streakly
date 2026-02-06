import mongoose from 'mongoose';

const scheduledTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  scheduledDate: {
    type: String, // YYYY-MM-DD format
    required: [true, 'Scheduled date is required'],
    index: true
  },
  converted: {
    type: Boolean,
    default: false,
    index: true
  },
  convertedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
scheduledTaskSchema.index({ user: 1, scheduledDate: 1 });
scheduledTaskSchema.index({ scheduledDate: 1, converted: 1 });

// Validate that scheduled date is not in the past
scheduledTaskSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('scheduledDate')) {
    const today = new Date().toISOString().split('T')[0];
    if (this.scheduledDate < today) {
      return next(new Error('Cannot schedule tasks for past dates'));
    }
  }
  next();
});

const ScheduledTask = mongoose.model('ScheduledTask', scheduledTaskSchema);

export default ScheduledTask;

