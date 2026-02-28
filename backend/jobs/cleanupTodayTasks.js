import TodayTask from '../models/TodayTask.js';
import ArchivedTask from '../models/ArchivedTask.js';
import moment from 'moment-timezone';

const cleanupTodayTasks = async () => {
  try {
    // Get today's date in YYYY-MM-DD format based on PKT
    const today = moment().tz('Asia/Karachi').format('YYYY-MM-DD');
    
    // Find uncompleted tasks from previous days
    const uncompletedOldTasks = await TodayTask.find({
      createdDate: { $lt: today },
      completed: false
    });

    if (uncompletedOldTasks.length > 0) {
      const archivedTasksToInsert = uncompletedOldTasks.map(task => ({
        user: task.user,
        title: task.title,
        priority: task.priority,
        originalDate: task.createdDate
      }));

      await ArchivedTask.insertMany(archivedTasksToInsert);
      console.log(`✅ Archived ${archivedTasksToInsert.length} uncompleted tasks from previous days`);
    }

    // Delete all tasks where createdDate is less than today
    const result = await TodayTask.deleteMany({
      createdDate: { $lt: today }
    });

    console.log(`✅ Cleaned up ${result.deletedCount} old today's tasks`);
    
    return { 
      success: true, 
      deletedCount: result.deletedCount,
      archivedCount: uncompletedOldTasks.length,
      message: `Deleted ${result.deletedCount} tasks, archived ${uncompletedOldTasks.length} tasks from previous days` 
    };
  } catch (error) {
    console.error('❌ Error in Today\'s Task Cleanup Job:', error);
    throw error;
  }
};

export default cleanupTodayTasks;
