import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';

const USER_FIELDS = 'id, email, first_name, last_name, role, is_active, auth_provider, created_at';

export async function listUsers(req: Request, res: Response) {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;
  const search = (req.query.search as string) || '';

  let whereClause = '';
  const params: any[] = [];

  if (search) {
    params.push(`%${search}%`);
    whereClause = `WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM users ${whereClause}`,
    params
  );
  const total = countResult.rows[0].total;

  const dataParams = [...params, limit, offset];
  const result = await pool.query(
    `SELECT ${USER_FIELDS} FROM users ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams
  );

  res.json({ users: result.rows, total, limit, offset });
}

export async function getUser(req: Request, res: Response) {
  const userId = parseInt(req.params.id, 10);

  const result = await pool.query(
    `SELECT ${USER_FIELDS} FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
}

export async function changeRole(req: Request, res: Response) {
  const adminId = req.user!.sub;
  const targetId = parseInt(req.params.id, 10);
  const { role } = req.body;

  if (!['Customer', 'Admin'].includes(role)) {
    return res.status(400).json({ error: 'role must be Customer or Admin' });
  }

  if (adminId === targetId) {
    return res.status(400).json({ error: 'Cannot change your own role' });
  }

  const result = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2 RETURNING ${USER_FIELDS}`,
    [role, targetId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
}

export async function changeStatus(req: Request, res: Response) {
  const adminId = req.user!.sub;
  const targetId = parseInt(req.params.id, 10);
  const { is_active } = req.body;

  if (typeof is_active !== 'boolean') {
    return res.status(400).json({ error: 'is_active must be a boolean' });
  }

  if (adminId === targetId) {
    return res.status(400).json({ error: 'Cannot change your own status' });
  }

  const result = await pool.query(
    `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING ${USER_FIELDS}`,
    [is_active, targetId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
}

const BCRYPT_ROUNDS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

function isPgError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code: unknown }).code === 'string';
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const { email, password, first_name, last_name } = req.body ?? {};

  const errors: string[] = [];
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) errors.push('email must be a valid email');
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) errors.push(`password must be a string of at least ${MIN_PASSWORD} chars`);
  if (typeof first_name !== 'string' || !first_name.trim()) errors.push('first_name is required');
  if (typeof last_name !== 'string' || !last_name.trim()) errors.push('last_name is required');
  if (errors.length) {
    res.status(400).json({ error: 'validation_error', message: errors.join('; ') });
    return;
  }

  const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
       VALUES ($1, $2, $3, $4, 'Admin', 'native')
       RETURNING ${USER_FIELDS}`,
      [email, password_hash, first_name, last_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (isPgError(err) && err.code === '23505') {
      res.status(409).json({ error: 'email_taken', message: 'Email already registered' });
      return;
    }
    throw err;
  }
}
