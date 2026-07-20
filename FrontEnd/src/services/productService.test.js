import { test } from 'node:test';
import assert from 'node:assert/strict';
import { list, get } from './productService.js';

test('productService.list — returns array of seeded products', async () => {
  const products = await list();
  assert.ok(Array.isArray(products));
  assert.ok(products.length > 0);

  const p = products[0];
  assert.equal(typeof p.id, 'number');
  assert.equal(typeof p.name, 'string');
  assert.ok(p.specifications);
});

test('productService.list({category:"CPU"}) — filters to CPUs only', async () => {
  const products = await list({ category: 'CPU' });
  assert.ok(products.length >= 5);
  for (const p of products) {
    assert.equal(p.category, 'CPU');
  }
});

test('productService.list({q, limit}) — search + pagination', async () => {
  const products = await list({ q: 'Intel', limit: 2 });
  assert.ok(products.length <= 2);
  for (const p of products) {
    assert.ok(p.name.toLowerCase().includes('intel'));
  }
});

test('productService.get(1) — returns product with JSONB specs', async () => {
  const product = await get(1);
  assert.equal(product.id, 1);
  assert.equal(product.category, 'CPU');
  assert.equal(typeof product.specifications.socket, 'string');
  assert.equal(typeof product.specifications.tdp, 'number');
});
