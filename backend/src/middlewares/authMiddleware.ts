import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';
import type { JwtPayload } from '../models/types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('Authorization') ?? '';
  const match = /^Bearer\s+(.+)$/.exec(header);
  if (!match) {
    res.status(401).json({ error: 'unauthorized', message: 'Missing Authorization header' });
    return;
  }

  try {
    req.user = verifyToken(match[1]!);
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized', message: 'Invalid or expired token' });
  }
}
