import type { Request, Response } from 'express';
import { pool } from '../config/db';

export async function addToWishlist(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: 'product_id is required' });
  }

  // Check product exists
  const prodCheck = await pool.query('SELECT id FROM products WHERE id = $1', [product_id]);
  if (prodCheck.rows.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check duplicate
  const dupCheck = await pool.query(
    'SELECT id FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
    [userId, product_id]
  );
  if (dupCheck.rows.length > 0) {
    return res.status(409).json({ error: 'Product already in wishlist' });
  }

  const result = await pool.query(
    `INSERT INTO wishlist_items (user_id, product_id)
     VALUES ($1, $2)
     RETURNING id, user_id, product_id, is_alert_enabled, created_at`,
    [userId, product_id]
  );

  res.status(201).json(result.rows[0]);
}

export async function getWishlist(req: Request, res: Response) {
  const userId = req.user!.sub;

  const result = await pool.query(
    `SELECT wi.id, wi.product_id, wi.is_alert_enabled, wi.created_at,
            p.name AS product_name, p.price AS product_price, p.image_url AS product_image_url,
            p.category AS product_category, p.stock_quantity AS product_stock
     FROM wishlist_items wi
     JOIN products p ON p.id = wi.product_id
     WHERE wi.user_id = $1
     ORDER BY wi.created_at DESC`,
    [userId]
  );

  res.json(result.rows);
}

export async function removeFromWishlist(req: Request, res: Response) {
  const userId = req.user!.sub;
  const productId = parseInt(req.params.product_id, 10);

  const result = await pool.query(
    'DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2 RETURNING id',
    [userId, productId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Item not in wishlist' });
  }

  res.status(204).send();
}

export async function toggleAlert(req: Request, res: Response) {
  const userId = req.user!.sub;
  const productId = parseInt(req.params.product_id, 10);
  const { is_alert_enabled } = req.body;

  if (typeof is_alert_enabled !== 'boolean') {
    return res.status(400).json({ error: 'is_alert_enabled must be a boolean' });
  }

  const result = await pool.query(
    `UPDATE wishlist_items SET is_alert_enabled = $1
     WHERE user_id = $2 AND product_id = $3
     RETURNING id, user_id, product_id, is_alert_enabled, created_at`,
    [is_alert_enabled, userId, productId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Item not in wishlist' });
  }

  res.json(result.rows[0]);
}
