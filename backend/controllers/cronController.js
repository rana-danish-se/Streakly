import journeyNotificationJobs from '../jobs/journeyNotification.js';
import runStreakReminder from '../jobs/streakReminder.js';
import deleteUnverifiedUsers from '../jobs/cleanupUsers.js';

export const triggerDailyRun = async (req, res) => {
  try {
    const [journeyResults, streakResults, cleanupResults] = await Promise.allSettled([
      (async () => {
        const starts = await journeyNotificationJobs.checkJourneyStarts();
        const reminders24h = await journeyNotificationJobs.check24HourReminders();
        const reminders1h = await journeyNotificationJobs.check1HourReminders();
        return { starts, reminders24h, reminders1h };
      })(),
      runStreakReminder(),
      deleteUnverifiedUsers()
    ]);

    res.status(200).json({
      success: true,
      results: {
        journeyChecks: journeyResults.status === 'fulfilled' ? journeyResults.value : journeyResults.reason,
        streakReminders: streakResults.status === 'fulfilled' ? streakResults.value : streakResults.reason,
        userCleanup: cleanupResults.status === 'fulfilled' ? cleanupResults.value : cleanupResults.reason
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerJourneyCheck = async (req, res) => {
  try {
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
    const result = await runStreakReminder();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerUserCleanup = async (req, res) => {
  try {
    const result = await deleteUnverifiedUsers();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
