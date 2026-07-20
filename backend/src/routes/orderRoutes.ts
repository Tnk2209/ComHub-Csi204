import { Router } from 'express';
import { createOrder, listOrders, getOrder, uploadPaymentSlip } from '../controllers/orderController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/', authMiddleware, requireRole('Customer'), asyncHandler(createOrder));
router.get('/', authMiddleware, asyncHandler(listOrders));
router.get('/:id', authMiddleware, asyncHandler(getOrder));
router.patch('/:id/payment', authMiddleware, asyncHandler(uploadPaymentSlip));

export default router;
