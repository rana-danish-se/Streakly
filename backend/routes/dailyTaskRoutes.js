
import express from 'express';
import { 
  createDailyTask, 
  getDailyTasks, 
  updateDailyTask, 
  deleteDailyTask, 
  toggleTaskCompletion 
} from '../controllers/dailyTaskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .post(createDailyTask)
  .get(getDailyTasks);

router.route('/:id')
  .put(updateDailyTask)
  .delete(deleteDailyTask);

router.patch('/:id/toggle', toggleTaskCompletion);

export default router;
