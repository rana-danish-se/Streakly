import express from 'express';
import { getQuote } from '../controllers/quoteController.js';

const router = express.Router();

router.get('/random', getQuote);

export default router;
