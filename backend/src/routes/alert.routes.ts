import { Router } from 'express';
import {
  getAlertsByLocation,
  getUnreadCount,
  markAlertAsRead,
} from '../controllers/alert.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Apply authentication middleware to all routes
// router.use(protect);

router.get('/:locationId', getAlertsByLocation);
router.get('/:locationId/unread-count', getUnreadCount);
router.patch('/:alertId/read', markAlertAsRead);

export default router;
