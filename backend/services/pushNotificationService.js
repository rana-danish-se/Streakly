import webPush from "../config/webPush";
import PushSubscription from "../models/PushSubscription";

class PushNotificationService {
  // Send notification to a specific user
  async sendToUser(userId, payload) {
    try {
      // Get all active subscriptions for this user
      const subscriptions = await PushSubscription.find({
        user: userId,
        isActive: true
      });

      if (subscriptions.length === 0) {
        console.log(`No active subscriptions for user ${userId}`);
        return { sent: 0, failed: 0 };
      }

      const results = await Promise.allSettled(
        subscriptions.map(sub => this.sendNotification(sub, payload))
      );

      // Count successes and failures
      const sent = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { sent, failed, total: subscriptions.length };
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  // Send notification to a single subscription
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
      // Handle errors (expired subscription, invalid endpoint, etc.)
      if (error.statusCode === 410 || error.statusCode === 404) {
        // Subscription expired or not found - mark as inactive
        await PushSubscription.findByIdAndUpdate(subscription._id, {
          isActive: false
        });
        console.log(`Subscription ${subscription._id} marked as inactive`);
      }
      throw error;
    }
  }

  // Create notification payloads for different journey events
  createJourneyStartPayload(journey) {
    return {
      title: '🎯 Journey Started!',
      body: `Your journey "${journey.title}" has begun. Let's make it count!`,
      icon: '/icons/journey-start.png',
      badge: '/icons/badge.png',
      tag: `journey-start-${journey._id}`,
      data: {
        url: `/journeys/${journey._id}`,
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
        url: `/journeys/${journey._id}`,
        journeyId: journey._id,
        type: 'journey-reminder'
      }
    };
  }
}

export default new PushNotificationService();

// WHY THIS SERVICE?
// - sendToUser: Handles sending to all user's devices (phone, tablet, desktop)
// - Promise.allSettled: Sends to all devices even if some fail
// - Error handling: Automatically deactivates expired subscriptions
// - Payload creators: Standardized notification formats for different events
// - tag: Prevents duplicate notifications (new one replaces old with same tag)