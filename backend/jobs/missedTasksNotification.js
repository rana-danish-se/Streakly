import DailyTask from '../models/DailyTask.js';
import TodayTask from '../models/TodayTask.js';
import pushService from '../services/pushNotificationService.js';

/**
 * Sends individual notifications for each missed task at 10 PM
 * Notifies users about incomplete daily tasks and today's tasks
 */
const runMissedTasksNotification = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let notificationsSent = 0;
    const errors = [];

    // 1. Find all incomplete Daily Tasks
    const missedDailyTasks = await DailyTask.find({
      isActive: true,
      completedDates: { $ne: today }
    }).populate('user', '_id name');

    console.log(`[Cron] Found ${missedDailyTasks.length} missed daily tasks`);

    // Send individual notification for each missed daily task
    for (const task of missedDailyTasks) {
      try {
        const payload = {
          title: '⚠️ Missed Daily Task',
          body: `You haven't completed: "${task.title}" today`,
          icon: '/icons/task.png',
          badge: '/icons/badge.png',
          tag: `missed-daily-task-${task._id}`,
          data: {
            url: `${process.env.CLIENT_URL}/dashboard/daily-tasks`,
            type: 'missed_daily_task',
            taskId: task._id.toString()
          }
        };

        await pushService.sendToUser(task.user._id, payload);
        notificationsSent++;
        console.log(`[Cron] Sent notification for missed daily task: ${task.title}`);
      } catch (err) {
        console.error(`[Cron] Failed to send notification for daily task ${task._id}:`, err.message);
        errors.push({ taskId: task._id, error: err.message });
      }
    }

    // 2. Find all incomplete Today's Tasks
    const missedTodayTasks = await TodayTask.find({
      createdDate: today,
      completed: false
    }).populate('user', '_id name');

    console.log(`[Cron] Found ${missedTodayTasks.length} missed today's tasks`);

    // Send individual notification for each missed today's task
    for (const task of missedTodayTasks) {
      try {
        const payload = {
          title: '⚠️ Missed Today\'s Task',
          body: `You haven't completed: "${task.title}" today`,
          icon: '/icons/task.png',
          badge: '/icons/badge.png',
          tag: `missed-today-task-${task._id}`,
          data: {
            url: `${process.env.CLIENT_URL}/dashboard/today-tasks`,
            type: 'missed_today_task',
            taskId: task._id.toString()
          }
        };

        await pushService.sendToUser(task.user._id, payload);
        notificationsSent++;
        console.log(`[Cron] Sent notification for missed today's task: ${task.title}`);
      } catch (err) {
        console.error(`[Cron] Failed to send notification for today's task ${task._id}:`, err.message);
        errors.push({ taskId: task._id, error: err.message });
      }
    }

    const result = {
      success: true,
      totalNotificationsSent: notificationsSent,
      missedDailyTasksCount: missedDailyTasks.length,
      missedTodayTasksCount: missedTodayTasks.length,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log(`[Cron] Missed tasks notification complete:`, result);
    return result;

  } catch (error) {
    console.error('❌ Error in Missed Tasks Notification Job:', error);
    throw error;
  }
};

export default runMissedTasksNotification;
