import DailyTask from '../models/DailyTask.js';
import pushService from '../services/pushNotificationService.js';

const runDailyTaskReminder = async () => {
    try {
        const now = new Date();
        const currentUTCTime = now.toISOString();

        // Find all active tasks
        // Optimization: In a real large-scale app, we would query based on time match directly.
        // However, since we need to match user's local time, and users have different timezones,
        // we can either:
        // 1. Store nextReminderAt in UTC on the task and query that. (Best for scale)
        // 2. Iterate all active tasks and check their local time. (Easier for now, fewer constraints)
        // 
        // Given the constraints and likely scale, I will implement a slightly optimized version:
        // querying all active tasks is risky if there are millions.
        // 
        // Better approach:
        // We know the current UTC time.
        // We want tasks where (TaskTime) == (CurrentUTC converted to UserTimezone).
        // This is hard to query in Mongo without complex aggregations or storing next run time.
        // 
        // Let's stick to: Fetch all active tasks with a time set.
        // Filter in memory. (Assuming < 10k active tasks for this MVP phase, it's fine. 
        // If > 10k, we should implement a 'nextRunAt' field on the model).
        
        const activeTasks = await DailyTask.find({ isActive: true });
        
        let notificationsSent = 0;
        
        const results = await Promise.allSettled(activeTasks.map(async (task) => {
            if (!task.timezone) return;

            // Get current time in user's timezone
            const userTime = new Date().toLocaleTimeString('en-US', { 
                timeZone: task.timezone, 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            // Compare with task time
            if (userTime === task.time) {
                // Check if already completed for today to avoid annoyance? 
                // Usually reminders are "Do this!", but if done, maybe "Good job"?
                // Standard behavior: Reminder to DO it. If done, silent.
                const today = new Date().toLocaleDateString('en-CA', { timeZone: task.timezone });
                if (task.completedDates.includes(today)) {
                    return;
                }

                try {
                    const payload = {
                        title: '🔔 Daily Task Reminder',
                        body: `Time for your task: "${task.title}"`,
                        icon: '/icons/task.png',
                        data: {
                            url: `${process.env.CLIENT_URL}/dashboard/daily-tasks` // Adjust URL as needed
                        }
                    };

                    await pushService.sendToUser(task.user, payload);
                    notificationsSent++;
                } catch (err) {
                    console.error(`Failed to send reminder for task ${task._id}:`, err.message);
                }
            }
        }));

        return { success: true, count: notificationsSent };

    } catch (error) {
        console.error('❌ Error in Daily Task Reminder Job:', error);
        throw error;
    }
};

export default runDailyTaskReminder;
