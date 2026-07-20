import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SQL_DIR = resolve(__dirname, '..', 'sql');

describe('Migration SQL files', () => {
  it('schema-safe.sql does NOT contain DROP TABLE', () => {
    const sql = readFileSync(resolve(SQL_DIR, 'schema-safe.sql'), 'utf8');
    assert.ok(!sql.includes('DROP TABLE'), 'schema-safe.sql must not DROP tables');
  });

  it('schema-safe.sql uses CREATE TABLE IF NOT EXISTS for all 7 tables', () => {
    const sql = readFileSync(resolve(SQL_DIR, 'schema-safe.sql'), 'utf8');
    const tables = ['users', 'products', 'orders', 'order_items', 'reviews', 'wishlist_items', 'order_logs'];
    for (const table of tables) {
      assert.ok(
        sql.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
        `Missing CREATE TABLE IF NOT EXISTS for ${table}`
      );
    }
  });

  it('schema.sql (fresh) contains DROP TABLE for destructive reset', () => {
    const sql = readFileSync(resolve(SQL_DIR, 'schema.sql'), 'utf8');
    assert.ok(sql.includes('DROP TABLE'), 'schema.sql should DROP tables for fresh reset');
  });

  it('migrate-safe.ts exists and references schema-safe.sql', () => {
    const code = readFileSync(resolve(__dirname, '..', 'scripts', 'migrate-safe.ts'), 'utf8');
    assert.ok(code.includes('schema-safe.sql'), 'migrate-safe.ts must use schema-safe.sql');
    assert.ok(!code.includes("'schema.sql'"), 'migrate-safe.ts must NOT use destructive schema.sql');
  });
});
