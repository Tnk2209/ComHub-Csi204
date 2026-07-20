import jwt, { type SignOptions } from 'jsonwebtoken';
import type { JwtPayload, Role } from '../models/types';

const SECRET: jwt.Secret = process.env.JWT_SECRET ?? 'dev-only-fallback-do-not-use-in-prod';
const EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

export function signToken(sub: number, role: Role): string {
  const payload: JwtPayload = { sub, role };
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN, algorithm: 'HS256' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as unknown as JwtPayload;
}
