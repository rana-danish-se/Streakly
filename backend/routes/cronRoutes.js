import express from 'express';
import { triggerJourneyCheck, triggerStreakReminder, triggerDailyRun } from '../controllers/cronController.js';

const router = express.Router();

// Single daily route for Vercel Hobby Plan
router.get('/daily-run', triggerDailyRun);

// Individual routes (keep for manual triggering if needed)
router.get('/journey-check', triggerJourneyCheck);
router.get('/streak-reminder', triggerStreakReminder);

export default router;
