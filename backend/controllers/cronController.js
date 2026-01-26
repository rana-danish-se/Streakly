import journeyNotificationJobs from '../jobs/journeyNotification.js';
import runStreakReminder from '../jobs/streakReminder.js';

// Trigger all jobs at once (for Vercel Hobby Plan compatibility)
export const triggerDailyRun = async (req, res) => {
  try {
    console.log('Running daily system check...');
    
    // Run all checks in parallel
    const [journeyResults, streakResults] = await Promise.allSettled([
      // Journey checks
      (async () => {
        const starts = await journeyNotificationJobs.checkJourneyStarts();
        const reminders24h = await journeyNotificationJobs.check24HourReminders();
        const reminders1h = await journeyNotificationJobs.check1HourReminders();
        return { starts, reminders24h, reminders1h };
      })(),
      // Streak reminders
      runStreakReminder()
    ]);

    res.status(200).json({
      success: true,
      results: {
        journeyChecks: journeyResults.status === 'fulfilled' ? journeyResults.value : journeyResults.reason,
        streakReminders: streakResults.status === 'fulfilled' ? streakResults.value : streakResults.reason
      }
    });
  } catch (error) {
    console.error('Error in triggerDailyRun:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerJourneyCheck = async (req, res) => {
  try {
    console.log('Running journey check cron via API...');
    const [starts, reminders24h, reminders1h] = await Promise.all([
      journeyNotificationJobs.checkJourneyStarts(),
      journeyNotificationJobs.check24HourReminders(),
      journeyNotificationJobs.check1HourReminders()
    ]);
    res.status(200).json({ success: true, results: { starts, reminders24h, reminders1h } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerStreakReminder = async (req, res) => {
  try {
    console.log('Running streak reminder cron via API...');
    const result = await runStreakReminder();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
