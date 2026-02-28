import ArchivedTask from '../models/ArchivedTask.js';
import TodayTask from '../models/TodayTask.js';
import ScheduledTask from '../models/ScheduledTask.js';
import moment from 'moment-timezone';

// Helper to get date string in YYYY-MM-DD format based on Pakistan timezone
const getDateString = () => {
  return moment().tz('Asia/Karachi').format('YYYY-MM-DD');
};

export const getArchivedTasks = async (req, res) => {
  try {
    const tasks = await ArchivedTask.find({ 
      user: req.user._id 
    }).sort({ originalDate: -1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const moveToToday = async (req, res) => {
  try {
    const archivedTask = await ArchivedTask.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!archivedTask) {
      return res.status(404).json({ message: 'Archived task not found' });
    }

    const todayTask = new TodayTask({
      user: req.user._id,
      title: archivedTask.title,
      priority: archivedTask.priority,
      createdDate: getDateString(),
      completed: false
    });

    await todayTask.save();
    await ArchivedTask.findByIdAndDelete(archivedTask._id);

    res.json({ message: 'Task moved to today', task: todayTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scheduleTask = async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    
    if (!scheduledDate) {
      return res.status(400).json({ message: 'Scheduled date is required' });
    }

    const archivedTask = await ArchivedTask.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!archivedTask) {
      return res.status(404).json({ message: 'Archived task not found' });
    }

    const scheduledTask = new ScheduledTask({
      user: req.user._id,
      title: archivedTask.title,
      priority: archivedTask.priority,
      scheduledDate: scheduledDate,
      converted: false
    });

    await scheduledTask.save();
    await ArchivedTask.findByIdAndDelete(archivedTask._id);

    res.json({ message: 'Task scheduled successfully', task: scheduledTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteArchivedTask = async (req, res) => {
  try {
    const task = await ArchivedTask.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Archived task not found' });
    }

    res.json({ message: 'Archived task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
