import express from 'express';
import {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  completeJourney,
  reactivateJourney,
  addResource,
  deleteResource,
  startJourney,
  getJourneyStats
} from '../controllers/journeyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getJourneyStats); 

router.route('/')
  .get(getJourneys)      
  .post(createJourney);  

router.route('/:id')
  .get(getJourney)       
  .put(updateJourney)    
  .delete(deleteJourney); 

router.post('/:id/complete', completeJourney);     
router.post('/:id/reactivate', reactivateJourney); 
router.post('/:id/start', startJourney);           

router.route('/:id/resources')
  .post(uploadFile.single('file'), addResource); 

router.delete('/:id/resources/:resourceId', deleteResource);

export default router;
