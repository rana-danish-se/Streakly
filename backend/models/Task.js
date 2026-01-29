import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  journey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journey',
    required: [true, 'Task must belong to a journey'],
    index: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Task must belong to a topic'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must have a user'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a task name'],
    trim: true,
    minlength: [3, 'Task name must be at least 3 characters long'],
    maxlength: [200, 'Task name cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Date,
  }
}, {
  timestamps: true
});

taskSchema.index({ journey: 1, createdAt: -1 });
taskSchema.index({ user: 1, createdAt: -1 });

taskSchema.virtual('taskDate').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
