import Task from '../models/Task.js';
import Journey from '../models/Journey.js';
import { updateJourneyStats } from '../utils/streakCalculator.js';

/**
 * @desc    Create/log a task for a journey
 * @route   POST /api/journeys/:journeyId/tasks
 * @access  Private
 */
export const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    const journeyId = req.params.journeyId;

    // Check if journey exists and user owns it
    const journey = await Journey.findById(journeyId);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this journey'
      });
    }

    // Create task
    const task = await Task.create({
      journey: journeyId,
      user: req.user._id,
      name,
      completed: true,
      completedAt: new Date()
    });

    // Update journey stats
    const allTasks = await Task.find({ journey: journeyId }).sort({ createdAt: -1 });
    const stats = updateJourneyStats(allTasks);

    journey.currentStreak = stats.currentStreak;
    journey.longestStreak = stats.longestStreak;
    journey.totalDays = stats.totalDays;
    journey.progress = stats.progress;
    await journey.save();

    res.status(201).json({
      success: true,
      message: 'Task logged successfully',
      data: {
        task,
        journeyStats: {
          currentStreak: journey.currentStreak,
          longestStreak: journey.longestStreak,
          totalDays: journey.totalDays,
          progress: journey.progress
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error creating task'
    });
  }
// ... existing code ...
};

/**
 * @desc    Create multiple tasks for a journey
 * @route   POST /api/journeys/:journeyId/tasks/bulk
 * @access  Private
 */
export const createBulkTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of task names
    const journeyId = req.params.journeyId;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of tasks'
      });
    }

    // Check if journey exists and user owns it
    const journey = await Journey.findById(journeyId);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this journey'
      });
    }

    // Create tasks
    const taskObjects = tasks.map(name => ({
      journey: journeyId,
      user: req.user._id,
      name,
      completed: false, // Explicitly set to false for new tasks
    }));

    const createdTasks = await Task.insertMany(taskObjects);

    // Update journey stats
    const allTasks = await Task.find({ journey: journeyId }).sort({ createdAt: -1 });
    const stats = updateJourneyStats(allTasks);

    journey.currentStreak = stats.currentStreak;
    journey.longestStreak = stats.longestStreak;
    journey.totalDays = stats.totalDays;
    journey.progress = stats.progress;
    await journey.save();

    res.status(201).json({
      success: true,
      message: `${createdTasks.length} tasks created successfully`,
      data: {
        tasks: createdTasks,
        journeyStats: {
          currentStreak: journey.currentStreak,
          longestStreak: journey.longestStreak,
          totalDays: journey.totalDays,
          progress: journey.progress
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error creating bulk tasks'
    });
  }
};


/**
 * @desc    Get all tasks for a journey
 * @route   GET /api/journeys/:journeyId/tasks
 * @access  Private
 */
export const getJourneyTasks = async (req, res) => {
  try {
    const journeyId = req.params.journeyId;
    const { limit = 50 } = req.query;

    // Check if journey exists and user owns it
    const journey = await Journey.findById(journeyId);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this journey'
      });
    }

    const tasks = await Task.find({ journey: journeyId })
      .sort({ completed: 1, completedAt: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error fetching tasks'
    });
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('journey', 'title');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error fetching task'
    });
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
      message: 'Not authorized to update this task'
      });
    }

    const { name, completed } = req.body;
    
    // Check journey status BEFORE updating task
    const journey = await Journey.findById(task.journey);
    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: `Journey hasn't started yet. Starts on ${new Date(journey.startDate).toLocaleDateString()}`
      });
    }

    if (journey.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Journey is completed. Reactivate it to make changes.'
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    
    // Handle completion status change
    if (completed !== undefined) {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date() : null;
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // If completion status changed, recalculate journey stats
    // If completion status changed, recalculate journey stats
    if (completed !== undefined) {
      const allTasks = await Task.find({ journey: task.journey }).sort({ createdAt: -1 });
      const stats = updateJourneyStats(allTasks);

      journey.currentStreak = stats.currentStreak;
      journey.longestStreak = stats.longestStreak;
      journey.totalDays = stats.totalDays;
      journey.progress = stats.progress;
      await journey.save();
      
      // Return stats with response to update UI immediately
      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: {
          task,
          journeyStats: {
            currentStreak: journey.currentStreak,
            longestStreak: journey.longestStreak,
            totalDays: journey.totalDays,
            progress: journey.progress
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    const journeyId = task.journey;

    // Delete task
    await Task.findByIdAndDelete(req.params.id);

    // Recalculate journey stats
    const journey = await Journey.findById(journeyId);
    if (journey) {
      const allTasks = await Task.find({ journey: journeyId }).sort({ createdAt: -1 });
      const stats = updateJourneyStats(allTasks);

      journey.currentStreak = stats.currentStreak;
      journey.longestStreak = stats.longestStreak;
      journey.totalDays = stats.totalDays;
      journey.progress = stats.progress;
      await journey.save();
      
      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: {
             journeyStats: {
                currentStreak: journey.currentStreak,
                longestStreak: journey.longestStreak,
                totalDays: journey.totalDays,
                progress: journey.progress
            }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
