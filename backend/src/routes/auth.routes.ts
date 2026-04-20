import { Router } from 'express';
import { login, updatePassword, refreshTokens } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema, updatePasswordSchema } from '../validations/auth.validation.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refreshTokens);
router.put('/update-password', protect, validateRequest(updatePasswordSchema), updatePassword);

export default router;
