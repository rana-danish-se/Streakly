import TodayTask from '../models/TodayTask.js';

// Helper to get date string in YYYY-MM-DD format
const getDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const createTodayTask = async (req, res) => {
  try {
    const { title, priority } = req.body;
    
    const newTask = new TodayTask({
      user: req.user._id,
      title,
      priority: priority || 'medium',
      createdDate: getDateString()
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayTasks = async (req, res) => {
  try {
    const today = getDateString();
    const tasks = await TodayTask.find({ 
      user: req.user._id, 
      createdDate: today 
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTodayTask = async (req, res) => {
  try {
    const { title, priority } = req.body;
    const task = await TodayTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, priority },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodayTask = async (req, res) => {
  try {
    const task = await TodayTask.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleTodayTaskCompletion = async (req, res) => {
  try {
    const task = await TodayTask.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
