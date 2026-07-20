import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login',    asyncHandler(login));
router.get('/me',        authMiddleware, asyncHandler(me));

export default router;
