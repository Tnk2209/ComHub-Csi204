import { pool } from '../config/db';

export const TEST_EMAIL_PREFIX = 'tdd-test-';

export function uniqueEmail(label: string): string {
  return `${TEST_EMAIL_PREFIX}${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function cleanupTestUsers(): Promise<void> {
  await pool.query(`DELETE FROM users WHERE email LIKE $1`, [`${TEST_EMAIL_PREFIX}%`]);
}

export async function closePool(): Promise<void> {
  await pool.end();
}
