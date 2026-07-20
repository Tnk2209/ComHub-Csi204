import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';

const SQL_DIR = resolve(__dirname, '..', 'sql');
const ADMIN_EMAIL = 'admin@comhub.local';
const ADMIN_PASSWORD = 'admin123';

async function runFile(label: string, filename: string): Promise<void> {
  const sql = readFileSync(resolve(SQL_DIR, filename), 'utf8');
  console.log(`[migrate] running ${label} (${filename})...`);
  await pool.query(sql);
  console.log(`[migrate] ${label} done`);
}

async function seedAdmin(): Promise<void> {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, $2, $3, $4, 'Admin', 'native')
     ON CONFLICT (email) DO NOTHING`,
    [ADMIN_EMAIL, hash, 'System', 'Admin']
  );
  console.log(`[migrate] admin seeded: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

async function verify(): Promise<void> {
  const tables = await pool.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' ORDER BY table_name`
  );
  const productCount = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM products');
  const userCount = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');

  console.log('\n[migrate] verification:');
  console.log(`  tables (${tables.rowCount}):`, tables.rows.map((r) => r.table_name).join(', '));
  console.log(`  products: ${productCount.rows[0]?.count}`);
  console.log(`  users:    ${userCount.rows[0]?.count}`);
}

async function main(): Promise<void> {
  try {
    await runFile('schema', 'schema.sql');
    await runFile('seed',   'seed.sql');
    await seedAdmin();
    await verify();
    console.log('\n✅ migration complete');
  } catch (err) {
    console.error('\n❌ migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
