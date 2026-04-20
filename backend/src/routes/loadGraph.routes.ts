import express from 'express';
import { getLoadGraphs, getAllLoadGraphs } from '../controllers/loadGraph.controller.js';
import { cache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// Apply cache middleware for 5 minutes (300 seconds)
router.get('/:locationId/:intervalType', cache(300), getLoadGraphs);
router.get('/:locationId', cache(300), getAllLoadGraphs);

export default router;
