import journeyNotificationJobs from '../jobs/journeyNotification.js';
import runStreakReminder from '../jobs/streakReminder.js';

export const triggerJourneyCheck = async (req, res) => {
  try {
    // Optional: Add security check (e.g. secret header)
    /*
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    */
    
    console.log('Running journey check cron via API...');
    
    // Run all checks in parallel
    const [starts, reminders24h, reminders1h] = await Promise.all([
      journeyNotificationJobs.checkJourneyStarts(),
      journeyNotificationJobs.check24HourReminders(),
      journeyNotificationJobs.check1HourReminders()
    ]);

    res.status(200).json({
      success: true,
      results: {
        starts,
        reminders24h,
        reminders1h
      }
    });
  } catch (error) {
    console.error('Error in triggerJourneyCheck:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerStreakReminder = async (req, res) => {
  try {
     // Optional: Add security check
    console.log('Running streak reminder cron via API...');
    
    const result = await runStreakReminder();

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error in triggerStreakReminder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
