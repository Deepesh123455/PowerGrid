import express from 'express';
import { getForecast } from '../controllers/forecast.controller.js';
import { cache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// Apply cache middleware for 5 minutes (300 seconds)
router.get('/:locationId', cache(300), getForecast);

export default router;
