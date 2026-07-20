import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Role } from '../models/types';

export function requireRole(role: Role): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: 'forbidden', message: `Requires role ${role}` });
      return;
    }
    next();
  };
}
