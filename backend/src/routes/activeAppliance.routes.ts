import express from 'express';
import { getActiveAppliances } from '../controllers/activeAppliance.controller.js';
import { cache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// Supports:
// GET /api/v1/active-appliances
// GET /api/v1/active-appliances?locationId=DL-BDP-100234567
router.get('/', cache(300), getActiveAppliances);

export default router;
