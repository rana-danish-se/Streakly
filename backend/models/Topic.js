import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  journey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journey',
    required: [true, 'Topic must belong to a journey'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Topic must belong to a user'],
    index: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    default: null,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a topic title'],
    trim: true,
    minlength: [2, 'Topic title must be at least 2 characters'],
    maxlength: [100, 'Topic title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  order: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subtopics
topicSchema.virtual('subtopics', {
  ref: 'Topic',
  localField: '_id',
  foreignField: 'parent',
  options: { sort: { order: 1 } }
});

// Virtual for tasks
topicSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'topic',
  options: { sort: { createdAt: 1 } }
});

topicSchema.index({ journey: 1, parent: 1, order: 1 });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
