import ScheduledTask from '../models/ScheduledTask.js';
import moment from 'moment-timezone';

// @desc    Create a new scheduled task
// @route   POST /api/scheduled-tasks
// @access  Private
export const createScheduledTask = async (req, res) => {
  try {
    const { title, priority, scheduledDate } = req.body;

    if (!title || !scheduledDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title and scheduled date' 
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(scheduledDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Validate date is in the future (or today)
    const today = moment().tz('Asia/Karachi').format('YYYY-MM-DD');
    if (scheduledDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule tasks for past dates'
      });
    }

    const scheduledTask = await ScheduledTask.create({
      user: req.user._id,
      title,
      priority: priority || 'medium',
      scheduledDate
    });

    res.status(201).json(scheduledTask);
  } catch (error) {
    console.error('Error creating scheduled task:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get all scheduled tasks for the logged-in user (non-converted only)
// @route   GET /api/scheduled-tasks
// @access  Private
export const getScheduledTasks = async (req, res) => {
  try {
    const scheduledTasks = await ScheduledTask.find({
      user: req.user._id,
      converted: false
    }).sort({ scheduledDate: 1 }); // Sort by date, earliest first

    res.status(200).json(scheduledTasks);
  } catch (error) {
    console.error('Error fetching scheduled tasks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get a single scheduled task by ID
// @route   GET /api/scheduled-tasks/:id
// @access  Private
export const getScheduledTaskById = async (req, res) => {
  try {
    const scheduledTask = await ScheduledTask.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scheduledTask) {
      return res.status(404).json({ 
        success: false, 
        message: 'Scheduled task not found' 
      });
    }

    res.status(200).json(scheduledTask);
  } catch (error) {
    console.error('Error fetching scheduled task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update a scheduled task
// @route   PUT /api/scheduled-tasks/:id
// @access  Private
export const updateScheduledTask = async (req, res) => {
  try {
    const { title, priority, scheduledDate } = req.body;

    const scheduledTask = await ScheduledTask.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scheduledTask) {
      return res.status(404).json({ 
        success: false, 
        message: 'Scheduled task not found' 
      });
    }

    // Don't allow updating converted tasks
    if (scheduledTask.converted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a task that has already been converted'
      });
    }

    // Validate scheduled date if provided
    if (scheduledDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(scheduledDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      const today = moment().tz('Asia/Karachi').format('YYYY-MM-DD');
      if (scheduledDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Cannot schedule tasks for past dates'
        });
      }
    }

    // Update fields
    if (title) scheduledTask.title = title;
    if (priority) scheduledTask.priority = priority;
    if (scheduledDate) scheduledTask.scheduledDate = scheduledDate;

    await scheduledTask.save();

    res.status(200).json(scheduledTask);
  } catch (error) {
    console.error('Error updating scheduled task:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Delete a scheduled task
// @route   DELETE /api/scheduled-tasks/:id
// @access  Private
export const deleteScheduledTask = async (req, res) => {
  try {
    const scheduledTask = await ScheduledTask.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scheduledTask) {
      return res.status(404).json({ 
        success: false, 
        message: 'Scheduled task not found' 
      });
    }

    await scheduledTask.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: 'Scheduled task deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting scheduled task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

