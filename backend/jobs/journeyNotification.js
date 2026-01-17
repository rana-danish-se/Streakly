import cron from "node-cron";
import Journey from "../models/Journey";
import pushService from "../services/pushNotificationService";

class JourneyNotificationJobs {
  
  // Run every 15 minutes to check for journey events
  startJobs() {
    // Check for journeys starting now
    cron.schedule('*/15 * * * *', async () => {
      console.log('Running journey start check...');
      await this.checkJourneyStarts();
    });

    // Check for 24-hour reminders (runs every hour)
    cron.schedule('0 * * * *', async () => {
      console.log('Running 24-hour reminder check...');
      await this.check24HourReminders();
    });

    // Check for 1-hour reminders (runs every 15 minutes)
    cron.schedule('*/15 * * * *', async () => {
      console.log('Running 1-hour reminder check...');
      await this.check1HourReminders();
    });

    console.log('Journey notification cron jobs started');
  }

  // Check for journeys that should start now
  async checkJourneyStarts() {
    try {
      const now = new Date();
      
      // Find journeys that:
      // - Start time has passed
      // - Haven't sent notification yet
      // - Are still pending
      const journeys = await Journey.find({
        startDate: { $lte: now },
        notificationSent: false,
        status: 'pending'
      }).populate('user', 'name email');

      console.log(`Found ${journeys.length} journeys to start`);

      for (const journey of journeys) {
        try {
          // Send push notification
          const payload = pushService.createJourneyStartPayload(journey);
          await pushService.sendToUser(journey.user._id, payload);

          // Update journey status
          journey.status = 'active';
          journey.notificationSent = true;
          await journey.save();

          console.log(`Journey started: ${journey.title} for user ${journey.user.email}`);
        } catch (error) {
          console.error(`Failed to process journey ${journey._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in checkJourneyStarts:', error);
    }
  }

  // Check for journeys starting in ~24 hours
  async check24HourReminders() {
    try {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000);

      // Find journeys starting between 23-24 hours from now
      const journeys = await Journey.find({
        startDate: { $gte: in23Hours, $lte: in24Hours },
        reminderSent24h: false,
        status: 'pending'
      }).populate('user', 'name email');

      console.log(`Found ${journeys.length} journeys for 24h reminders`);

      for (const journey of journeys) {
        try {
          const payload = pushService.createJourneyReminderPayload(journey, 24);
          await pushService.sendToUser(journey.user._id, payload);

          journey.reminderSent24h = true;
          await journey.save();

          console.log(`24h reminder sent for journey: ${journey.title}`);
        } catch (error) {
          console.error(`Failed to send 24h reminder for journey ${journey._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in check24HourReminders:', error);
    }
  }

  // Check for journeys starting in ~1 hour
  async check1HourReminders() {
    try {
      const now = new Date();
      const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
      const in45Minutes = new Date(now.getTime() + 45 * 60 * 1000);

      // Find journeys starting between 45min-1hour from now
      const journeys = await Journey.find({
        startDate: { $gte: in45Minutes, $lte: in1Hour },
        reminderSent1h: false,
        status: 'pending'
      }).populate('user', 'name email');

      console.log(`Found ${journeys.length} journeys for 1h reminders`);

      for (const journey of journeys) {
        try {
          const payload = pushService.createJourneyReminderPayload(journey, 1);
          await pushService.sendToUser(journey.user._id, payload);

          journey.reminderSent1h = true;
          await journey.save();

          console.log(`1h reminder sent for journey: ${journey.title}`);
        } catch (error) {
          console.error(`Failed to send 1h reminder for journey ${journey._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in check1HourReminders:', error);
    }
  }
}

export default new JourneyNotificationJobs();

// WHY THESE CRON SCHEDULES?
// - */15 * * * * = Every 15 minutes (checks journey starts and 1h reminders)
// - 0 * * * * = Every hour on the hour (24h reminders, less frequent)
// - Time windows: Use ranges (23-24h) to catch journeys even if cron misses exact time
// - Error handling per journey: One failure doesn't stop processing others
// - Separate flags: Prevents duplicate notifications if cron runs multiple times