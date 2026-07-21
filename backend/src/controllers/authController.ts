import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import type { PublicUser } from '../models/types';

const BCRYPT_ROUNDS = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export async function register(req: Request, res: Response): Promise<void> {
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
    const result = await pool.query<PublicUser>(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
       VALUES ($1, $2, $3, $4, 'Customer', 'native')
       RETURNING id, email, first_name, last_name, role, auth_provider, created_at`,
      [email, password_hash, first_name, last_name]
    );

    const user = result.rows[0]!;
    const token = signToken(user.id, user.role);

    res.status(201).json({ token, user });
  } catch (err: unknown) {
    if (isPgError(err) && err.code === '23505') {
      res.status(409).json({ error: 'email_taken', message: 'Email already registered' });
      return;
    }
    throw err;
  }
}

function isPgError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code: unknown }).code === 'string';
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'validation_error', message: 'email and password required' });
    return;
  }

  const result = await pool.query<{
    id: number;
    email: string;
    password_hash: string | null;
    first_name: string;
    last_name: string;
    role: 'Customer' | 'Admin';
    auth_provider: 'native' | 'google';
    created_at: Date;
  }>(
    `SELECT id, email, password_hash, first_name, last_name, role, auth_provider, created_at
     FROM users WHERE email = $1`,
    [email]
  );

  const row = result.rows[0];
  if (!row || !row.password_hash || !(await bcrypt.compare(password, row.password_hash))) {
    res.status(401).json({ error: 'invalid_credentials', message: 'Invalid email or password' });
    return;
  }

  const token = signToken(row.id, row.role);
  const { password_hash: _pw, ...user } = row;
  void _pw;
  res.status(200).json({ token, user });
}

export async function me(req: Request, res: Response): Promise<void> {
  const uid = req.user?.sub;
  if (!uid) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const result = await pool.query<PublicUser>(
    `SELECT id, email, first_name, last_name, role, auth_provider, created_at
     FROM users WHERE id = $1`,
    [uid]
  );

  const user = result.rows[0];
  if (!user) {
    res.status(401).json({ error: 'unauthorized', message: 'User no longer exists' });
    return;
  }

  res.status(200).json(user);
}
