
import DailyTask from '../models/DailyTask.js';

// Helper to get date string in UTC
const getDateInTimezone = () => {
  return new Date().toISOString().split('T')[0]; // Returns YYYY-MM-DD in UTC
};

export const createDailyTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = new DailyTask({
      user: req.user._id,
      title,
      description
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyTasks = async (req, res) => {
  try {
    const tasks = await DailyTask.find({ user: req.user._id, isActive: true }).lean();
    
    // Add "completedToday" flag for frontend convenience
    const today = getDateInTimezone();
    const tasksWithStatus = tasks.map(task => ({
        ...task,
        completedToday: task.completedDates.includes(today)
    }));

    res.json(tasksWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDailyTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await DailyTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDailyTask = async (req, res) => {
  try {
    const task = await DailyTask.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await DailyTask.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const today = getDateInTimezone();
    const isCompletedToday = task.completedDates.includes(today);

    if (isCompletedToday) {
      // Undo completion
      task.completedDates = task.completedDates.filter(date => date !== today);
      
      // Re-calculate streak (simplified: just decrement if it was incremented today, 
      // but accurate recalc requires checking previous day. 
      // For now, let's just recalc from completedDates)
      // Actually, simple logic: if undoing today, just decrement streak if > 0
      if (task.currentStreak > 0) task.currentStreak -= 1;
      
    } else {
      // Mark as complete
      task.completedDates.push(today);
      
      // Check if yesterday was completed to increment streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (task.completedDates.includes(yesterdayStr)) {
        task.currentStreak += 1;
      } else {
        task.currentStreak = 1; // Start new streak
      }
      
      if (task.currentStreak > task.longestStreak) {
        task.longestStreak = task.currentStreak;
      }
    }
    
    // Sort dates just in case
    task.completedDates.sort();

    await task.save();
    
    res.json({ 
        ...task.toObject(), 
        completedToday: !isCompletedToday 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
