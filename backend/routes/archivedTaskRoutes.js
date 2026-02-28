import express from 'express';
import {
  getArchivedTasks,
  moveToToday,
  scheduleTask,
  deleteArchivedTask
} from '../controllers/archivedTaskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getArchivedTasks);

router.route('/:id/move-to-today')
  .post(moveToToday);

router.route('/:id/schedule')
  .post(scheduleTask);

router.route('/:id')
  .delete(deleteArchivedTask);

export default router;
