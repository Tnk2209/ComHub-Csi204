import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { addToWishlist, getWishlist, removeFromWishlist, toggleAlert } from '../controllers/wishlistController';

const router = Router();

router.use(authMiddleware);

router.post('/', addToWishlist);
router.get('/', getWishlist);
router.delete('/:product_id', removeFromWishlist);
router.patch('/:product_id/alert', toggleAlert);

export default router;
