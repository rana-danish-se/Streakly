import Journey from "../models/Journey.js";
import pushService from "../services/pushNotificationService.js";

class JourneyNotificationJobs {
  
  // Check for journeys that should start now
  async checkJourneyStarts() {
    try {
      const now = new Date();
      
      // Find journeys that:
      // - Start time has passed
      // - Haven't sent notification yet
      // - Are still pending or active
      const journeys = await Journey.find({
        startDate: { $lte: now },
        notificationSent: false,
        status: { $in: ['pending', 'active'] }
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
      return { success: true, count: journeys.length };
    } catch (error) {
      console.error('Error in checkJourneyStarts:', error);
      throw error;
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
      return { success: true, count: journeys.length };
    } catch (error) {
      console.error('Error in check24HourReminders:', error);
      throw error;
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
      return { success: true, count: journeys.length };
    } catch (error) {
      console.error('Error in check1HourReminders:', error);
      throw error;
    }
  }
}

export default new JourneyNotificationJobs();
