import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { intentRouterMiddleware } from '../middlewares/intentRouter.middleware.js';

const router = Router();

router.post('/', intentRouterMiddleware, handleChat);

export default router;
