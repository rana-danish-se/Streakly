import express from 'express';
import { 
  createTodayTask, 
  getTodayTasks, 
  updateTodayTask, 
  deleteTodayTask, 
  toggleTodayTaskCompletion 
} from '../controllers/todayTaskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .post(createTodayTask)
  .get(getTodayTasks);

router.route('/:id')
  .put(updateTodayTask)
  .delete(deleteTodayTask);

router.patch('/:id/toggle', toggleTodayTaskCompletion);

export default router;
