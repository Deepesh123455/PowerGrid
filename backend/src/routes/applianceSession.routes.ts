import { Router } from 'express';
import { getApplianceSessions, getApplianceSessionsByType } from '../controllers/applianceSession.controller.js';
import { cache } from '../middlewares/cacheMiddleware.js';

const router = Router();

// Get all appliance sessions for a location
router.get('/locations/:locationId/appliance-sessions', cache(300), getApplianceSessions);

// Get appliance sessions by type (EV, AC, etc.) for a location
router.get('/locations/:locationId/appliance-sessions/:applianceType', cache(300), getApplianceSessionsByType);

export default router;
