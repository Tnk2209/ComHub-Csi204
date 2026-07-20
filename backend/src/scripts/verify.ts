import 'dotenv/config';
import { pool } from '../config/db';

async function main(): Promise<void> {
  try {
    console.log('\n=== Products by category ===');
    const byCat = await pool.query<{ category: string; count: string }>(
      `SELECT category, COUNT(*)::text AS count
       FROM products
       GROUP BY category
       ORDER BY category`
    );
    console.table(byCat.rows);

    console.log('\n=== Sample CPU product (JSONB specs) ===');
    const cpu = await pool.query(
      `SELECT id, name, price, stock_quantity, specifications
       FROM products WHERE category = 'CPU' LIMIT 1`
    );
    console.log(JSON.stringify(cpu.rows[0], null, 2));

    console.log('\n=== Users ===');
    const users = await pool.query(
      `SELECT id, email, first_name, last_name, role, auth_provider FROM users`
    );
    console.table(users.rows);

    console.log('\n=== Full-text search test ("Intel") ===');
    const search = await pool.query(
      `SELECT id, name, category, price FROM products
       WHERE to_tsvector('simple', name) @@ plainto_tsquery('simple', 'Intel')
       ORDER BY id`
    );
    console.table(search.rows);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
