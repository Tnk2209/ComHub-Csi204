import { Router } from 'express';
import { listProducts, getProduct, getProductsByCategory, createProduct, updateProduct, toggleProductStatus, deleteProduct } from '../controllers/productController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/',    asyncHandler(listProducts));
router.get('/by-category/:category', asyncHandler(getProductsByCategory));
router.get('/:id', asyncHandler(getProduct));
router.post('/',   authMiddleware, requireRole('Admin'), asyncHandler(createProduct));
router.put('/:id', authMiddleware, requireRole('Admin'), asyncHandler(updateProduct));
router.patch('/:id/status', authMiddleware, requireRole('Admin'), asyncHandler(toggleProductStatus));
router.delete('/:id', authMiddleware, requireRole('Admin'), asyncHandler(deleteProduct));

export default router;
