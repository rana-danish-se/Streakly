import TodayTask from '../models/TodayTask.js';

const cleanupTodayTasks = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Delete all tasks where createdDate is less than today
    const result = await TodayTask.deleteMany({
      createdDate: { $lt: today }
    });

    console.log(`✅ Cleaned up ${result.deletedCount} old today's tasks`);
    
    return { 
      success: true, 
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} tasks from previous days` 
    };
  } catch (error) {
    console.error('❌ Error in Today\'s Task Cleanup Job:', error);
    throw error;
  }
};

export default cleanupTodayTasks;
