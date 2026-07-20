import 'dotenv/config';
import { Client } from 'pg';

const DB_NAME = 'comhub';

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');

  // Connect to the default `postgres` database to issue CREATE DATABASE.
  const parsed = new URL(url);
  parsed.pathname = '/postgres';

  const client = new Client({ connectionString: parsed.toString() });
  await client.connect();

  const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
  if (exists.rowCount) {
    console.log(`[create-db] "${DB_NAME}" already exists`);
  } else {
    await client.query(`CREATE DATABASE ${DB_NAME}`);
    console.log(`[create-db] "${DB_NAME}" created`);
  }
  await client.end();
}

main().catch((err) => {
  console.error('[create-db] failed:', err);
  process.exitCode = 1;
});
