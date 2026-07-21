import { Request, Response } from 'express';
import { pool } from '../config/db';

export async function getDashboard(req: Request, res: Response) {
  const period = req.query.period as string || 'all';

  let dateFilter = '';
  if (period === 'today') {
    dateFilter = "AND created_at >= CURRENT_DATE";
  } else if (period === 'week') {
    dateFilter = "AND created_at >= DATE_TRUNC('week', CURRENT_DATE)";
  } else if (period === 'month') {
    dateFilter = "AND created_at >= DATE_TRUNC('month', CURRENT_DATE)";
  }

  // 1. Total Revenue from delivered orders
  const revenueResult = await pool.query<{ total: string }>(
    `SELECT COALESCE(SUM(total_price), 0) AS total FROM orders WHERE order_status = 'delivered' ${dateFilter}`
  );
  const total_revenue = Number(revenueResult.rows[0]!.total);

  // 2. Total Delivered Orders Count (for AOV calculation)
  const deliveredCountResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM orders WHERE order_status = 'delivered' ${dateFilter}`
  );
  const delivered_count = Number(deliveredCountResult.rows[0]!.count);

  // 3. Average Order Value (AOV)
  const average_order_value = delivered_count > 0 ? Math.round(total_revenue / delivered_count) : 0;

  // 4. Orders count by status
  const ordersResult = await pool.query<{ order_status: string; count: string }>(
    `SELECT order_status, COUNT(*)::int AS count FROM orders WHERE 1=1 ${dateFilter} GROUP BY order_status`
  );
  const total_orders: Record<string, number> = { total: 0 };
  for (const row of ordersResult.rows) {
    total_orders[row.order_status] = Number(row.count);
    total_orders.total += Number(row.count);
  }

  // 5. Success Rate
  const success_rate = total_orders.total > 0 ? Math.round((delivered_count / total_orders.total) * 100) : 0;

  // 6. Top 5 Products
  const topResult = await pool.query<{ product_id: number; name: string; category: string; total_sold: string }>(
    `SELECT oi.product_id, p.name, p.category, SUM(oi.quantity)::int AS total_sold
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.order_status IN ('processing', 'shipped', 'delivered') ${dateFilter.replace('created_at', 'o.created_at')}
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

  // 7. Low Stock products
  const lowStockResult = await pool.query<{ id: number; name: string; category: string; stock_quantity: number }>(
    `SELECT id, name, category, stock_quantity FROM products WHERE stock_quantity <= 3 AND is_active = true ORDER BY stock_quantity ASC`
  );
  const low_stock_products = lowStockResult.rows;

  // 8. Sales Category Distribution
  const categorySalesResult = await pool.query<{ category: string; sales: string }>(
    `SELECT p.category, SUM(oi.quantity * oi.price_per_unit)::int AS sales
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.order_status IN ('processing', 'shipped', 'delivered') ${dateFilter.replace('created_at', 'o.created_at')}
     GROUP BY p.category
     ORDER BY sales DESC`
  );
  const category_sales = categorySalesResult.rows.map((r) => ({
    category: r.category,
    sales: Number(r.sales),
  }));

  res.json({
    total_revenue,
    delivered_count,
    average_order_value,
    total_orders,
    success_rate,
    top_products,
    low_stock_products,
    category_sales,
  });
}
