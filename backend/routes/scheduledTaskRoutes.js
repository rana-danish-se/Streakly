import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createScheduledTask,
  getScheduledTasks,
  getScheduledTaskById,
  updateScheduledTask,
  deleteScheduledTask
} from '../controllers/scheduledTaskController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create and get all scheduled tasks
router.route('/')
  .post(createScheduledTask)
  .get(getScheduledTasks);

// Get, update, and delete specific scheduled task
router.route('/:id')
  .get(getScheduledTaskById)
  .put(updateScheduledTask)
  .delete(deleteScheduledTask);

export default router;

