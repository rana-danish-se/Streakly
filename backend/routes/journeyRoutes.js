import express from 'express';
import {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  completeJourney,
  addResource,
  deleteResource
} from '../controllers/journeyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Journey CRUD routes
router.route('/')
  .get(getJourneys)      // GET /api/journeys
  .post(createJourney);  // POST /api/journeys

router.route('/:id')
  .get(getJourney)       // GET /api/journeys/:id
  .put(updateJourney)    // PUT /api/journeys/:id
  .delete(deleteJourney); // DELETE /api/journeys/:id

// Journey completion
router.post('/:id/complete', completeJourney); // POST /api/journeys/:id/complete

// Resource management
router.route('/:id/resources')
  .post(uploadFile.single('file'), addResource); // POST /api/journeys/:id/resources

router.delete('/:id/resources/:resourceId', deleteResource); // DELETE /api/journeys/:id/resources/:resourceId

export default router;
