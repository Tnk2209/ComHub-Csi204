import 'dotenv/config';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import adminRoutes from './routes/adminRoutes';
import orderRoutes from './routes/orderRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import { requireRole } from './middlewares/roleMiddleware';

const app: Application = express();

app.use(helmet());
app.use(compression());

const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate Limiters (disabled in test environment)
const isTest = process.env.NODE_ENV === 'test' || process.argv.some((arg) => arg.includes('test'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 10000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests', message: 'Too many auth attempts from this IP, please try again after 15 minutes' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests', message: 'Too many requests from this IP, please try again later' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'comhub-backend', ts: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/_test/admin-only', authMiddleware, requireRole('Admin'), (_req, res) => {
  res.json({ ok: true, seenBy: 'Admin' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found', message: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'internal_server_error', message: err.message });
});

export default app;
