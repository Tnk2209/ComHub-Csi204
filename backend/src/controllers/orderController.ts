import type { Request, Response } from 'express';
import { pool } from '../config/db';

interface OrderItem {
  product_id: number;
  quantity: number;
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const { items, shipping_address } = req.body ?? {};

  // validation
  const errors: string[] = [];
  if (!Array.isArray(items) || items.length === 0) {
    errors.push('items must be a non-empty array');
  }
  if (typeof shipping_address !== 'string' || !shipping_address.trim()) {
    errors.push('shipping_address is required');
  }
  if (errors.length) {
    res.status(400).json({ error: 'validation_error', message: errors.join('; ') });
    return;
  }

  // validate item structure
  for (const item of items as OrderItem[]) {
    if (!item.product_id || typeof item.product_id !== 'number') {
      errors.push('each item must have a numeric product_id');
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      errors.push('each item must have a positive integer quantity');
    }
  }
  if (errors.length) {
    res.status(400).json({ error: 'validation_error', message: errors.join('; ') });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // lock and verify products + stock
    const productIds = (items as OrderItem[]).map((i) => i.product_id);
    const products = await client.query<{ id: number; price: string; stock_quantity: number; is_active: boolean }>(
      `SELECT id, price, stock_quantity, is_active FROM products WHERE id = ANY($1::int[]) FOR UPDATE`,
      [productIds]
    );

    const productMap = new Map(products.rows.map((p) => [p.id, p]));

    // check all products exist and are active
    for (const item of items as OrderItem[]) {
      const product = productMap.get(item.product_id);
      if (!product) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'validation_error', message: `Product ${item.product_id} not found` });
        return;
      }
      if (!product.is_active) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'validation_error', message: `Product ${item.product_id} is not available` });
        return;
      }
      if (product.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        res.status(400).json({
          error: 'insufficient_stock',
          message: `Insufficient stock for product ${item.product_id} (available: ${product.stock_quantity}, requested: ${item.quantity})`,
        });
        return;
      }
    }

    // calculate total
    let totalPrice = 0;
    for (const item of items as OrderItem[]) {
      const product = productMap.get(item.product_id)!;
      totalPrice += parseFloat(product.price) * item.quantity;
    }

    // insert order
    const orderRes = await client.query<{ id: number; user_id: number; total_price: string; order_status: string; payment_status: string; shipping_address: string; created_at: string }>(
      `INSERT INTO orders (user_id, total_price, shipping_address)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total_price, order_status, payment_status, shipping_address, created_at`,
      [userId, totalPrice, shipping_address.trim()]
    );
    const order = orderRes.rows[0]!;

    // insert order_items and deduct stock
    const orderItems: Array<{ id: number; product_id: number; quantity: number; price_per_unit: string }> = [];
    for (const item of items as OrderItem[]) {
      const product = productMap.get(item.product_id)!;
      const itemRes = await client.query<{ id: number; product_id: number; quantity: number; price_per_unit: string }>(
        `INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
         VALUES ($1, $2, $3, $4)
         RETURNING id, product_id, quantity, price_per_unit`,
        [order.id, item.product_id, item.quantity, product.price]
      );
      orderItems.push(itemRes.rows[0]!);

      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // insert order_log
    await client.query(
      `INSERT INTO order_logs (order_id, status, changed_by_user_id) VALUES ($1, $2, $3)`,
      [order.id, 'Order Created', userId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      ...order,
      items: orderItems,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listOrders(req: Request, res: Response): Promise<void> {
  const userId = req.user!.sub;

  const result = await pool.query(
    `SELECT id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at,
       (SELECT created_at FROM order_logs WHERE order_id = orders.id AND (status ILIKE '%cancel%' OR status ILIKE '%reject%') ORDER BY created_at DESC LIMIT 1) AS cancelled_at
     FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  const orders = result.rows;

  if (orders.length > 0) {
    const orderIds = orders.map((o: any) => o.id);
    const itemsRes = await pool.query(
      `SELECT oi.order_id, oi.id, oi.product_id, oi.quantity, oi.price_per_unit, p.name AS product_name
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ANY($1)`,
      [orderIds]
    );

    const itemsByOrder: Record<number, any[]> = {};
    for (const item of itemsRes.rows) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    for (const order of orders) {
      (order as any).items = itemsByOrder[(order as any).id] || [];
    }
  }

  res.status(200).json(orders);
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const orderRes = await pool.query(
    `SELECT id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at
     FROM orders WHERE id = $1`,
    [numId]
  );

  const order = orderRes.rows[0];
  if (!order) {
    res.status(404).json({ error: 'not_found', message: `Order ${id} not found` });
    return;
  }

  if ((order as any).user_id !== userId) {
    res.status(403).json({ error: 'forbidden', message: 'You can only view your own orders' });
    return;
  }

  const itemsRes = await pool.query(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.price_per_unit, p.name AS product_name
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [numId]
  );

  const logsRes = await pool.query(
    `SELECT id, status, changed_by_user_id, created_at FROM order_logs WHERE order_id = $1 ORDER BY created_at`,
    [numId]
  );

  res.status(200).json({
    ...order,
    items: itemsRes.rows,
    logs: logsRes.rows,
  });
}

export async function adminListOrders(req: Request, res: Response): Promise<void> {
  const filters: string[] = [];
  const params: unknown[] = [];

  const { order_status, payment_status } = req.query;
  if (typeof order_status === 'string' && order_status) {
    params.push(order_status);
    filters.push(`order_status = $${params.length}`);
  }
  if (typeof payment_status === 'string' && payment_status) {
    params.push(payment_status);
    filters.push(`payment_status = $${params.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at
     FROM orders ${where} ORDER BY created_at DESC`,
    params
  );

  res.status(200).json(result.rows);
}

export async function uploadPaymentSlip(req: Request, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const { payment_slip } = req.body ?? {};
  if (typeof payment_slip !== 'string' || !payment_slip.trim()) {
    res.status(400).json({ error: 'validation_error', message: 'payment_slip is required (Base64 string)' });
    return;
  }

  const orderRes = await pool.query<{ id: number; user_id: number; order_status: string }>(
    'SELECT id, user_id, order_status FROM orders WHERE id = $1',
    [numId]
  );
  const order = orderRes.rows[0];
  if (!order) {
    res.status(404).json({ error: 'not_found', message: `Order ${id} not found` });
    return;
  }
  if (order.user_id !== userId) {
    res.status(403).json({ error: 'forbidden', message: 'You can only upload slip for your own orders' });
    return;
  }

  const result = await pool.query(
    `UPDATE orders SET payment_slip_mockup = $1 WHERE id = $2
     RETURNING id, user_id, total_price, order_status, payment_status, shipping_address, payment_slip_mockup, created_at`,
    [payment_slip.trim(), numId]
  );

  await pool.query(
    `INSERT INTO order_logs (order_id, status, changed_by_user_id) VALUES ($1, $2, $3)`,
    [numId, 'Slip Uploaded', userId]
  );

  res.status(200).json(result.rows[0]);
}

export async function approvePayment(req: Request, res: Response): Promise<void> {
  const adminId = req.user!.sub;
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const result = await pool.query(
    `UPDATE orders SET payment_status = 'approved', order_status = 'paid' WHERE id = $1
     RETURNING id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at`,
    [numId]
  );
  if (!result.rows[0]) {
    res.status(404).json({ error: 'not_found', message: `Order ${id} not found` });
    return;
  }

  await pool.query(
    `INSERT INTO order_logs (order_id, status, changed_by_user_id) VALUES ($1, $2, $3)`,
    [numId, 'Payment Approved', adminId]
  );

  res.status(200).json(result.rows[0]);
}

export async function rejectPayment(req: Request, res: Response): Promise<void> {
  const adminId = req.user!.sub;
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query<{ id: number }>(
      `UPDATE orders SET payment_status = 'rejected', order_status = 'cancelled' WHERE id = $1
       RETURNING id`,
      [numId]
    );
    if (!orderRes.rows[0]) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'not_found', message: `Order ${id} not found` });
      return;
    }

    // stock rollback
    const items = await client.query<{ product_id: number; quantity: number }>(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [numId]
    );
    for (const item of items.rows) {
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    const logStatus = reason ? `Payment Rejected: ${reason}` : 'Payment Rejected';
    await client.query(
      `INSERT INTO order_logs (order_id, status, changed_by_user_id) VALUES ($1, $2, $3)`,
      [numId, logStatus, adminId]
    );

    await client.query('COMMIT');

    const updated = await pool.query(
      `SELECT id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at
       FROM orders WHERE id = $1`,
      [numId]
    );
    res.status(200).json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

const CANCELLABLE_STATUSES = ['pending_payment', 'paid', 'processing'];

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  const adminId = req.user!.sub;
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query<{ id: number; order_status: string }>(
      'SELECT id, order_status FROM orders WHERE id = $1 FOR UPDATE',
      [numId]
    );
    const order = orderRes.rows[0];
    if (!order) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'not_found', message: `Order ${id} not found` });
      return;
    }

    if (!CANCELLABLE_STATUSES.includes(order.order_status)) {
      await client.query('ROLLBACK');
      res.status(400).json({
        error: 'invalid_transition',
        message: `Cannot cancel order with status '${order.order_status}'`,
      });
      return;
    }

    // rollback stock
    const items = await client.query<{ product_id: number; quantity: number }>(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [numId]
    );
    for (const item of items.rows) {
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    const updated = await client.query(
      `UPDATE orders SET order_status = 'cancelled' WHERE id = $1
       RETURNING id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at`,
      [numId]
    );

    await client.query(
      'INSERT INTO order_logs (order_id, status, changed_by_user_id) VALUES ($1, $2, $3)',
      [numId, 'Order Cancelled', adminId]
    );

    await client.query('COMMIT');
    res.status(200).json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

const STATUS_ORDER = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered'] as const;
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  paid: ['processing'],
  processing: ['shipped'],
  shipped: ['delivered'],
};

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  const adminId = req.user!.sub;
  const { id } = req.params;
  if (!/^\d+$/.test(id ?? '')) {
    res.status(400).json({ error: 'validation_error', message: 'id must be a positive integer' });
    return;
  }
  const numId = parseInt(id!, 10);

  const { order_status, tracking_number } = req.body ?? {};
  if (typeof order_status !== 'string') {
    res.status(400).json({ error: 'validation_error', message: 'order_status is required' });
    return;
  }

  if (order_status === 'shipped' && (typeof tracking_number !== 'string' || !tracking_number.trim())) {
    res.status(400).json({ error: 'validation_error', message: 'tracking_number is required when shipping' });
    return;
  }

  const current = await pool.query<{ order_status: string }>(
    'SELECT order_status FROM orders WHERE id = $1',
    [numId]
  );
  if (!current.rows[0]) {
    res.status(404).json({ error: 'not_found', message: `Order ${id} not found` });
    return;
  }

  const currentStatus = current.rows[0].order_status;
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(order_status)) {
    res.status(400).json({
      error: 'invalid_transition',
      message: `Cannot transition from '${currentStatus}' to '${order_status}'`,
    });
    return;
  }

  const updates = order_status === 'shipped'
    ? `order_status = $1, tracking_number = $2`
    : `order_status = $1`;
  const params = order_status === 'shipped'
    ? [order_status, tracking_number!.trim(), numId]
    : [order_status, numId];
  const whereIdx = params.length;

  const result = await pool.query(
    `UPDATE orders SET ${updates} WHERE id = $${whereIdx}
     RETURNING id, user_id, total_price, order_status, payment_status, shipping_address, tracking_number, created_at`,
    params
  );

  await pool.query(
    `INSERT INTO order_logs (order_id, status, changed_by_user_id) VALUES ($1, $2, $3)`,
    [numId, `Status: ${order_status}`, adminId]
  );

  res.status(200).json(result.rows[0]);
}
