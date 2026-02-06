import ScheduledTask from '../models/ScheduledTask.js';
import TodayTask from '../models/TodayTask.js';
import User from '../models/User.js';
import pushNotificationService from '../services/pushNotificationService.js';

/**
 * Convert scheduled tasks to today's tasks
 * Runs daily at midnight to check for tasks scheduled for today
 */
const convertScheduledTasks = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`[Cron] Converting scheduled tasks for ${today}...`);

    // Find all non-converted tasks scheduled for today
    const tasksToConvert = await ScheduledTask.find({
      scheduledDate: today,
      converted: false
    }).populate('user');

    if (tasksToConvert.length === 0) {
      console.log('[Cron] No scheduled tasks to convert today');
      return {
        success: true,
        converted: 0,
        message: 'No tasks to convert'
      };
    }

    let convertedCount = 0;
    let notificationsSent = 0;

    for (const scheduledTask of tasksToConvert) {
      try {
        // Create corresponding TodayTask
        const todayTask = await TodayTask.create({
          user: scheduledTask.user._id,
          title: scheduledTask.title,
          priority: scheduledTask.priority,
          createdDate: today,
          completed: false
        });

        console.log(`[Cron] Created TodayTask: ${todayTask.title}`);

        // Send push notification to user
        try {
          const payload = {
            title: '📅 Scheduled Task Due',
            body: `Your scheduled task "${scheduledTask.title}" is due today!`,
            icon: '/icons/task.png',
            badge: '/icons/badge.png',
            tag: `scheduled-task-${scheduledTask._id}`,
            data: {
              url: `${process.env.CLIENT_URL}/dashboard/today-tasks`,
              type: 'scheduled_task',
              taskId: todayTask._id.toString(),
              scheduledTaskId: scheduledTask._id.toString()
            }
          };
          
          await pushNotificationService.sendToUser(scheduledTask.user._id, payload);
          notificationsSent++;
          console.log(`[Cron] Notification sent for: ${scheduledTask.title}`);
        } catch (notifError) {
          console.error('[Cron] Failed to send notification:', notifError.message);
          // Continue even if notification fails
        }

        // Mark scheduled task as converted
        scheduledTask.converted = true;
        scheduledTask.convertedAt = new Date();
        await scheduledTask.save();

        convertedCount++;
      } catch (error) {
        console.error(`[Cron] Error converting task ${scheduledTask._id}:`, error.message);
        // Continue with other tasks even if one fails
      }
    }

    const result = {
      success: true,
      converted: convertedCount,
      notificationsSent,
      message: `Converted ${convertedCount} tasks, sent ${notificationsSent} notifications`
    };

    console.log(`[Cron] Conversion complete:`, result);
    return result;
  } catch (error) {
    console.error('[Cron] Error in convertScheduledTasks:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to convert scheduled tasks'
    };
  }
};

export default convertScheduledTasks;

