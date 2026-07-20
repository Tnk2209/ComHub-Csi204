import { Router } from 'express';
import { adminListProducts } from '../controllers/productController';
import { adminListOrders, approvePayment, rejectPayment, updateOrderStatus, cancelOrder } from '../controllers/orderController';
import { listUsers, getUser, changeRole, changeStatus, createAdmin } from '../controllers/adminUserController';
import { getDashboard } from '../controllers/dashboardController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware, requireRole('Admin'));

router.get('/dashboard', asyncHandler(getDashboard));
router.get('/products', asyncHandler(adminListProducts));
router.get('/orders', asyncHandler(adminListOrders));
router.patch('/orders/:id/approve-payment', asyncHandler(approvePayment));
router.patch('/orders/:id/reject-payment', asyncHandler(rejectPayment));
router.patch('/orders/:id/status', asyncHandler(updateOrderStatus));
router.patch('/orders/:id/cancel', asyncHandler(cancelOrder));

router.get('/users', asyncHandler(listUsers));
router.post('/users', asyncHandler(createAdmin));
router.get('/users/:id', asyncHandler(getUser));
router.patch('/users/:id/role', asyncHandler(changeRole));
router.patch('/users/:id/status', asyncHandler(changeStatus));

export default router;
