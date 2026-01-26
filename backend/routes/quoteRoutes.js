import express from 'express';
import { getQuote } from '../controllers/quoteController.js';

const router = express.Router();

router.get('/random', getQuote); // GET /api/quotes/random

export default router;
