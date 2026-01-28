import express from 'express';
import { triggerJourneyCheck, triggerStreakReminder, triggerDailyRun, triggerUserCleanup } from '../controllers/cronController.js';

const router = express.Router();

router.get('/daily-run', triggerDailyRun);

router.get('/journey-check', triggerJourneyCheck);
router.get('/streak-reminder', triggerStreakReminder);
router.get('/cleanup-users', triggerUserCleanup);

export default router;
