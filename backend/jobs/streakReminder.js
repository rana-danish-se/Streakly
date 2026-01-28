import Journey from '../models/Journey.js';
import Task from '../models/Task.js';
import pushService from '../services/pushNotificationService.js';

const runStreakReminder = async () => {
    try {
      const activeJourneys = await Journey.find({ status: 'active', isActive: true });
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      let notificationsSent = 0;

      for (const journey of activeJourneys) {
        const completedTaskToday = await Task.findOne({
          journey: journey._id,
          completed: true,
          completedAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        });

        if (!completedTaskToday) {
          try {
            const payload = {
              title: '🔥 Streak Risk!',
              body: `You haven't completed a task for "${journey.title}" today. Complete one by midnight to keep your streak!`,
              icon: '/icons/badge.png', // Ensure this icon exists or use default
              data: {
                url: `${process.env.CLIENT_URL}/dashboard/journeys/${journey._id}`
              }
            };

            await pushService.sendToUser(journey.user, payload);
            notificationsSent++;
          } catch (err) {
            console.error(`Failed to send reminder for journey ${journey._id}:`, err.message);
          }
        }
      }

      return { success: true, count: notificationsSent };

    } catch (error) {
      console.error('❌ Error in Streak Reminder Job:', error);
      throw error;
    }
};

export default runStreakReminder;
