import express from 'express';
import { triggerJourneyCheck, triggerStreakReminder } from '../controllers/cronController.js';

const router = express.Router();

// Route for checking journey starts and reminders (15-min interval recommended)
router.get('/journey-check', triggerJourneyCheck);

// Route for daily streak reminders (Daily at 10pm recommended)
router.get('/streak-reminder', triggerStreakReminder);

export default router;
