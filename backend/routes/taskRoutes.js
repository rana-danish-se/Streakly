import express from 'express';
import {
  createTask,
  getJourneyTasks,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams for nested routes

// All routes require authentication
router.use(protect);

// Task routes nested under journeys
router.route('/')
  .get(getJourneyTasks)  // GET /api/journeys/:journeyId/tasks
  .post(createTask);     // POST /api/journeys/:journeyId/tasks

// Individual task routes (top-level)
router.route('/:id')
  .get(getTask)          // GET /api/tasks/:id
  .put(updateTask)       // PUT /api/tasks/:id
  .delete(deleteTask);   // DELETE /api/tasks/:id

export default router;
