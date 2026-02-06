import express from 'express';
import { triggerJourneyCheck, triggerStreakReminder, triggerDailyRun, triggerUserCleanup, triggerDailyTaskReminder, triggerTodayTaskCleanup } from '../controllers/cronController.js';

const router = express.Router();

router.get('/daily-run', triggerDailyRun);

router.get('/journey-check', triggerJourneyCheck);
router.get('/streak-reminder', triggerStreakReminder);
router.get('/daily-task-reminder', triggerDailyTaskReminder);
router.get('/cleanup-users', triggerUserCleanup);
router.get('/cleanup-today-tasks', triggerTodayTaskCleanup);

export default router;
