import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createReview, listReviews, deleteReview } from '../controllers/reviewController';

const router = Router();

// Nested under /api/products/:id/reviews
router.post('/products/:id/reviews', authMiddleware, createReview);
router.get('/products/:id/reviews', listReviews);

// Standalone delete
router.delete('/reviews/:id', authMiddleware, deleteReview);

export default router;
