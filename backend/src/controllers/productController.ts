import type { Request, Response } from 'express';
import { pool } from '../config/db';

const VALID_CATEGORIES = ['CPU', 'Mainboard', 'GPU', 'RAM', 'SSD', 'Case', 'PSU'] as const;
type ValidCategory = typeof VALID_CATEGORIES[number];

function isValidCategory(v: unknown): v is ValidCategory {
  return typeof v === 'string' && (VALID_CATEGORIES as readonly string[]).includes(v);
}

const REQUIRED_SPEC_KEYS: Record<ValidCategory, string[]> = {
  CPU: ['socket', 'tdp'],
  Mainboard: ['socket', 'form_factor', 'supported_ram'],
  GPU: ['tdp'],
  RAM: ['ram_type'],
  SSD: ['form_factor'],
  Case: ['form_factor', 'max_gpu_length_mm'],
  PSU: ['wattage'],
};

function validateSpecifications(category: ValidCategory, specs: Record<string, unknown>): string[] {
  const required = REQUIRED_SPEC_KEYS[category];
  const missing = required.filter((key) => !(key in specs));
  if (missing.length) {
    return [`specifications for ${category} requires: ${missing.join(', ')}`];
  }
  return [];
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  const rawCategory = req.query.category;
  const filters: string[] = ['is_active = TRUE'];
  const params: unknown[] = [];

  if (rawCategory !== undefined) {
    if (!isValidCategory(rawCategory)) {
      res.status(400).json({
        error: 'validation_error',
        message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }
    params.push(rawCategory);
    filters.push(`category = $${params.length}`);
  }

  const rawQ = req.query.q;
  if (typeof rawQ === 'string' && rawQ.trim().length > 0) {
    params.push(rawQ.trim());
    filters.push(`to_tsvector('simple', name) @@ plainto_tsquery('simple', $${params.length})`);
  }

  const limit = parsePositiveInt(req.query.limit, 20);
  const offset = parsePositiveInt(req.query.offset, 0);
  if (limit === null || offset === null) {
    res.status(400).json({ error: 'validation_error', message: 'limit and offset must be non-negative integers' });
    return;
  }
  const cappedLimit = Math.min(limit, 100);

  params.push(cappedLimit, offset);
  const limitParam = params.length - 1;
  const offsetParam = params.length;

  const result = await pool.query(
    `SELECT id, name, category, price, stock_quantity, image_url, specifications, is_active
     FROM products
     WHERE ${filters.join(' AND ')}
     ORDER BY id
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    params
  );
  res.status(200).json(result.rows);
}

export async function adminListProducts(req: Request, res: Response): Promise<void> {
  const rawCategory = req.query.category;
  const filters: string[] = [];
  const params: unknown[] = [];

  if (rawCategory !== undefined) {
    if (!isValidCategory(rawCategory)) {
      res.status(400).json({
        error: 'validation_error',
        message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }
    params.push(rawCategory);
    filters.push(`category = $${params.length}`);
  }

  const limit = parsePositiveInt(req.query.limit, 50);
  const offset = parsePositiveInt(req.query.offset, 0);
  if (limit === null || offset === null) {
    res.status(400).json({ error: 'validation_error', message: 'limit and offset must be non-negative integers' });
    return;
  }
  const cappedLimit = Math.min(limit, 100);

  params.push(cappedLimit, offset);
  const limitParam = params.length - 1;
  const offsetParam = params.length;

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT id, name, category, price, stock_quantity, image_url, specifications, is_active
     FROM products ${where}
     ORDER BY id
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    params
  );
  res.status(200).json(result.rows);
}

function parsePositiveInt(raw: unknown, fallback: number): number | null {
  if (raw === undefined) return fallback;
  if (typeof raw !== 'string') return null;
  if (!/^\d+$/.test(raw)) return null;
  return parseInt(raw, 10);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const { name, category, price, stock_quantity, image_url, specifications } = req.body ?? {};

  const errors: string[] = [];
  if (typeof name !== 'string' || !name.trim()) errors.push('name is required');
  if (!isValidCategory(category)) errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) errors.push('price must be a non-negative number');
  if (stock_quantity !== undefined && (typeof stock_quantity !== 'number' || stock_quantity < 0 || !Number.isInteger(stock_quantity))) {
    errors.push('stock_quantity must be a non-negative integer');
  }
  if (specifications !== undefined && (typeof specifications !== 'object' || specifications === null || Array.isArray(specifications))) {
    errors.push('specifications must be a JSON object');
  }
  if (!errors.length && isValidCategory(category) && specifications && typeof specifications === 'object' && !Array.isArray(specifications)) {
    errors.push(...validateSpecifications(category, specifications as Record<string, unknown>));
  }
  if (errors.length) {
    res.status(400).json({ error: 'validation_error', message: errors.join('; ') });
    return;
  }

  const result = await pool.query(
    `INSERT INTO products (name, category, price, stock_quantity, image_url, specifications, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     RETURNING id, name, category, price, stock_quantity, image_url, specifications, is_active`,
    [name, category, price, stock_quantity ?? 0, image_url ?? null, specifications ?? {}]
  );

  res.status(201).json(result.rows[0]);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }

  const productId = parseInt(id!, 10);

  const result = await pool.query(
    `SELECT p.id, p.name, p.category, p.price, p.stock_quantity, p.image_url, p.specifications, p.is_active,
            COALESCE(AVG(r.rating), 0) AS average_rating,
            COUNT(r.id)::int AS review_count
     FROM products p
     LEFT JOIN reviews r ON r.product_id = p.id
     WHERE p.id = $1
     GROUP BY p.id`,
    [productId]
  );

  const product = result.rows[0];
  if (!product) {
    res.status(404).json({ error: 'not_found', message: `Product ${id} not found` });
    return;
  }

  product.average_rating = Number(product.average_rating);
  res.status(200).json(product);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }

  const { name, category, price, stock_quantity, image_url, specifications } = req.body ?? {};

  const errors: string[] = [];
  if (typeof name !== 'string' || !name.trim()) errors.push('name is required');
  if (!isValidCategory(category)) errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) errors.push('price must be a non-negative number');
  if (stock_quantity !== undefined && (typeof stock_quantity !== 'number' || stock_quantity < 0 || !Number.isInteger(stock_quantity))) {
    errors.push('stock_quantity must be a non-negative integer');
  }
  if (specifications !== undefined && (typeof specifications !== 'object' || specifications === null || Array.isArray(specifications))) {
    errors.push('specifications must be a JSON object');
  }
  if (!errors.length && isValidCategory(category) && specifications && typeof specifications === 'object' && !Array.isArray(specifications)) {
    errors.push(...validateSpecifications(category, specifications as Record<string, unknown>));
  }
  if (errors.length) {
    res.status(400).json({ error: 'validation_error', message: errors.join('; ') });
    return;
  }

  const result = await pool.query(
    `UPDATE products SET name=$1, category=$2, price=$3, stock_quantity=$4, image_url=$5, specifications=$6
     WHERE id=$7
     RETURNING id, name, category, price, stock_quantity, image_url, specifications, is_active`,
    [name, category, price, stock_quantity ?? 0, image_url ?? null, specifications ?? {}, parseInt(id!, 10)]
  );

  if (!result.rows[0]) {
    res.status(404).json({ error: 'not_found', message: `Product ${id} not found` });
    return;
  }

  res.status(200).json(result.rows[0]);
}

export async function toggleProductStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }

  const { is_active } = req.body ?? {};
  if (typeof is_active !== 'boolean') {
    res.status(400).json({ error: 'validation_error', message: 'is_active must be a boolean' });
    return;
  }

  const result = await pool.query(
    `UPDATE products SET is_active=$1 WHERE id=$2
     RETURNING id, name, category, price, stock_quantity, image_url, specifications, is_active`,
    [is_active, parseInt(id!, 10)]
  );

  if (!result.rows[0]) {
    res.status(404).json({ error: 'not_found', message: `Product ${id} not found` });
    return;
  }

  res.status(200).json(result.rows[0]);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const exists = await pool.query('SELECT id FROM products WHERE id = $1', [numId]);
  if (!exists.rows[0]) {
    res.status(404).json({ error: 'not_found', message: `Product ${id} not found` });
    return;
  }

  const refs = await pool.query('SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1', [numId]);
  if (refs.rows.length > 0) {
    res.status(409).json({ error: 'conflict', message: 'Cannot delete product referenced by existing orders' });
    return;
  }

  await pool.query('DELETE FROM products WHERE id = $1', [numId]);
  res.status(204).end();
}

export async function getProductsByCategory(req: Request, res: Response): Promise<void> {
  const { category } = req.params;

  const result = await pool.query(
    `SELECT id, name, category, price, stock_quantity, image_url, specifications
     FROM products
     WHERE category = $1 AND is_active = true
     ORDER BY name`,
    [category]
  );

  res.json(result.rows);
}
