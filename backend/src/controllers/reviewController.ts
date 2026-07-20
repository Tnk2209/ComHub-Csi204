import type { Request, Response } from 'express';
import { pool } from '../config/db';

export async function createReview(req: Request, res: Response) {
  const userId = req.user!.sub;
  const productId = parseInt(req.params.id, 10);
  const { rating, comment } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }

  // Validate comment length
  if (comment && comment.length > 1000) {
    return res.status(400).json({ error: 'comment must be 1000 characters or less' });
  }

  // Check product exists
  const prodCheck = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (prodCheck.rows.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check duplicate
  const dupCheck = await pool.query(
    'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
  if (dupCheck.rows.length > 0) {
    return res.status(409).json({ error: 'You have already reviewed this product' });
  }

  const result = await pool.query(
    `INSERT INTO reviews (user_id, product_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, product_id, rating, comment, created_at`,
    [userId, productId, rating, comment || null]
  );

  res.status(201).json(result.rows[0]);
}

export async function listReviews(req: Request, res: Response) {
  const productId = parseInt(req.params.id, 10);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;

  const countResult = await pool.query(
    'SELECT COUNT(*)::int AS total FROM reviews WHERE product_id = $1',
    [productId]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT r.id, r.user_id, r.rating, r.comment, r.created_at,
            u.first_name || ' ' || u.last_name AS user_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [productId, limit, offset]
  );

  res.json({ reviews: result.rows, total, limit, offset });
}

export async function deleteReview(req: Request, res: Response) {
  const userId = req.user!.sub;
  const role = req.user!.role;
  const reviewId = parseInt(req.params.id, 10);

  const review = await pool.query('SELECT id, user_id FROM reviews WHERE id = $1', [reviewId]);
  if (review.rows.length === 0) {
    return res.status(404).json({ error: 'Review not found' });
  }

  // Owner or Admin can delete
  if (review.rows[0].user_id !== userId && role !== 'Admin') {
    return res.status(403).json({ error: 'Not authorized to delete this review' });
  }

  await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
  res.status(204).send();
}
