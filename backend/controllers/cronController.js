import journeyNotificationJobs from '../jobs/journeyNotification.js';
import runStreakReminder from '../jobs/streakReminder.js';
import runDailyTaskReminder from '../jobs/dailyTaskReminder.js';
import deleteUnverifiedUsers from '../jobs/cleanupUsers.js';
import cleanupTodayTasks from '../jobs/cleanupTodayTasks.js';
import convertScheduledTasks from '../jobs/convertScheduledTasks.js';
import runMissedTasksNotification from '../jobs/missedTasksNotification.js';

export const triggerDailyRun = async (req, res) => {
  try {
    const [journeyResults, streakResults, cleanupResults, todayTaskCleanupResults, scheduledTaskConversionResults] = await Promise.allSettled([
      (async () => {
        const starts = await journeyNotificationJobs.checkJourneyStarts();
        const reminders24h = await journeyNotificationJobs.check24HourReminders();
        const reminders1h = await journeyNotificationJobs.check1HourReminders();
        return { starts, reminders24h, reminders1h };
      })(),
      runStreakReminder(),
      deleteUnverifiedUsers(),
      cleanupTodayTasks(),
      convertScheduledTasks()
    ]);

    res.status(200).json({
      success: true,
      results: {
        journeyChecks: journeyResults.status === 'fulfilled' ? journeyResults.value : journeyResults.reason,
        streakReminders: streakResults.status === 'fulfilled' ? streakResults.value : streakResults.reason,
        userCleanup: cleanupResults.status === 'fulfilled' ? cleanupResults.value : cleanupResults.reason,
        todayTaskCleanup: todayTaskCleanupResults.status === 'fulfilled' ? todayTaskCleanupResults.value : todayTaskCleanupResults.reason,
        scheduledTaskConversion: scheduledTaskConversionResults.status === 'fulfilled' ? scheduledTaskConversionResults.value : scheduledTaskConversionResults.reason
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

export const triggerDailyTaskReminder = async (req, res) => {
  try {
    const result = await runDailyTaskReminder();
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

export const triggerTodayTaskCleanup = async (req, res) => {
  try {
    const result = await cleanupTodayTasks();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerScheduledTaskConversion = async (req, res) => {
  try {
    const result = await convertScheduledTasks();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerMissedTasksNotification = async (req, res) => {
  try {
    const result = await runMissedTasksNotification();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
