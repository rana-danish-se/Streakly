import Journey from '../models/Journey.js';
import Task from '../models/Task.js';
import pushService from '../services/pushNotificationService.js';

/**
 * Run Streak Reminder Job
 * Checks active journeys and sends reminders if no task completed today
 */
const runStreakReminder = async () => {
    console.log('⏰ Running Streak Reminder Job...');
    
    try {
      // 1. Find all active journeys
      const activeJourneys = await Journey.find({ status: 'active', isActive: true });
      
      console.log(`Found ${activeJourneys.length} active journeys to check.`);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      let notificationsSent = 0;

      for (const journey of activeJourneys) {
        // 2. Check if a task was completed today for this journey
        const completedTaskToday = await Task.findOne({
          journey: journey._id,
          completed: true,
          completedAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

        // 3. If no task completed today, send reminder
        if (!completedTaskToday) {
          try {
            const payload = {
              title: '🔥 Streak Risk!',
              body: `You haven't completed a task for "${journey.title}" today. Complete one by midnight to keep your streak!`,
              icon: '/icons/badge.png', // Ensure this icon exists or use default
              data: {
                url: `/dashboard/journeys/${journey._id}`
              }
            };

            await pushService.sendToUser(journey.user, payload);
            notificationsSent++;
            console.log(`Sent reminder for journey: ${journey.title} (User: ${journey.user})`);
          } catch (err) {
            console.error(`Failed to send reminder for journey ${journey._id}:`, err.message);
          }
        }
      }

      console.log(`✅ Streak Reminder Job Completed. Sent ${notificationsSent} notifications.`);
      return { success: true, count: notificationsSent };

    } catch (error) {
      console.error('❌ Error in Streak Reminder Job:', error);
      throw error;
    }
};

export default runStreakReminder;
