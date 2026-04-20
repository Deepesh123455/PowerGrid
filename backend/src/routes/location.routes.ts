import { Router } from 'express';
import { getUserLocations, deleteLocation } from '../controllers/location.controller.js';


const router = Router();

// To be fully protected soon, but for UI mockup integration, it can be bypassed if needed.
// router.use(protect);

router.get('/', getUserLocations);
router.delete('/:id', deleteLocation);

export default router;
