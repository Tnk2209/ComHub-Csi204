import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

const isRemoteDb =
  process.env.NODE_ENV === 'production' ||
  process.env.DATABASE_URL?.includes('supabase') ||
  process.env.DATABASE_URL?.includes('render') ||
  process.env.DATABASE_URL?.includes('sslmode=require');

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  console.error('[pg] unexpected idle client error', err);
});
