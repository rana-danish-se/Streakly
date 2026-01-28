import webPush from "../config/webPush.js";
import PushSubscription from "../models/PushSubscription.js";

class PushNotificationService {
  async sendToUser(userId, payload) {
    try {
      const subscriptions = await PushSubscription.find({
        user: userId,
        isActive: true
      });

      if (subscriptions.length === 0) {
        return { sent: 0, failed: 0 };
      }

      const results = await Promise.allSettled(
        subscriptions.map(sub => this.sendNotification(sub, payload))
      );

      const sent = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { sent, failed, total: subscriptions.length };
    } catch (error) {
      throw error;
    }
  }

  async sendNotification(subscription, payload) {
    try {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      };

      await webPush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      );

      return true;
    } catch (error) {
      if (error.statusCode === 410 || error.statusCode === 404) {
        await PushSubscription.findByIdAndUpdate(subscription._id, {
          isActive: false
        });
      }
      throw error;
    }
  }

  createJourneyStartPayload(journey) {
    return {
      title: '🎯 Journey Started!',
      body: `Your journey "${journey.title}" has begun. Let's make it count!`,
      icon: '/icons/journey-start.png',
      badge: '/icons/badge.png',
      tag: `journey-start-${journey._id}`,
      data: {
        url: `${process.env.CLIENT_URL}/journeys/${journey._id}`,
        journeyId: journey._id,
        type: 'journey-start'
      }
    };
  }

  createJourneyReminderPayload(journey, hoursUntilStart) {
    return {
      title: '⏰ Journey Starting Soon',
      body: `"${journey.title}" starts in ${hoursUntilStart} hours. Get ready!`,
      icon: '/icons/journey-reminder.png',
      badge: '/icons/badge.png',
      tag: `journey-reminder-${journey._id}`,
      data: {
        url: `${process.env.CLIENT_URL}/dashboard/journey/${journey._id}`,
        journeyId: journey._id,
        type: 'journey-reminder'
      }
    };
  }

  createJourneyScheduledPayload(journey, startDate) {
    const daysUntilStart = Math.ceil((new Date(startDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    return {
      title: '✅ Journey Scheduled!',
      body: `"${journey.title}" is set to start in ${daysUntilStart} days. We'll remind you 24 hours and 1 hour before it begins.`,
      icon: '/icons/journey-scheduled.png',
      badge: '/icons/badge.png',
      tag: `journey-scheduled-${journey._id}`,
      data: {
        url: `${process.env.CLIENT_URL}/dashboard/journey/${journey._id}`,
        journeyId: journey._id,
        type: 'journey-scheduled'
      }
    };
  }
}

export default new PushNotificationService();