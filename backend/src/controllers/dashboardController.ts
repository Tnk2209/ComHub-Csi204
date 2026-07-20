import { Request, Response } from 'express';
import { pool } from '../config/db';

export async function getDashboard(_req: Request, res: Response) {
  const revenueResult = await pool.query<{ total: string }>(
    `SELECT COALESCE(SUM(total_price), 0) AS total FROM orders WHERE order_status = 'delivered'`
  );
  const total_revenue = Number(revenueResult.rows[0]!.total);

  const ordersResult = await pool.query<{ order_status: string; count: string }>(
    `SELECT order_status, COUNT(*)::int AS count FROM orders GROUP BY order_status`
  );
  const total_orders: Record<string, number> = { total: 0 };
  for (const row of ordersResult.rows) {
    total_orders[row.order_status] = Number(row.count);
    total_orders.total += Number(row.count);
  }

  const topResult = await pool.query<{ product_id: number; name: string; category: string; total_sold: string }>(
    `SELECT oi.product_id, p.name, p.category, SUM(oi.quantity)::int AS total_sold
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.order_status IN ('processing', 'shipped', 'delivered')
     GROUP BY oi.product_id, p.name, p.category
     ORDER BY total_sold DESC
     LIMIT 5`
  );
  const top_products = topResult.rows.map((r) => ({
    product_id: r.product_id,
    name: r.name,
    category: r.category,
    total_sold: Number(r.total_sold),
  }));

  const lowStockResult = await pool.query<{ id: number; name: string; category: string; stock_quantity: number }>(
    `SELECT id, name, category, stock_quantity FROM products WHERE stock_quantity <= 3 AND is_active = true ORDER BY stock_quantity ASC`
  );
  const low_stock_products = lowStockResult.rows;

  res.json({ total_revenue, total_orders, top_products, low_stock_products });
}
