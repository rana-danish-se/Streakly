import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createTopic, 
  getJourneyTopics, 
  updateTopic, 
  deleteTopic 
} from '../controllers/topicController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .post(createTopic)
  .get(getJourneyTopics);

router.route('/:id')
  .put(updateTopic)
  .delete(deleteTopic);

export default router;
