import express from 'express';
import {
  createTask,
  createBulkTasks,
  getJourneyTasks,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); 

router.use(protect);

router.route('/')
  .get(getJourneyTasks)  
  .post(createTask);     

router.route('/bulk')
  .post(createBulkTasks); 

router.route('/:id')
  .get(getTask)          
  .put(updateTask)       
  .delete(deleteTask);

export default router;
