# ComHub Backend

Express + TypeScript + PostgreSQL API server for the ComHub PC Builder e-commerce platform.

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ running locally on port 5432
- Database `comhub` created
- Role `comhub_app` with password (see `.env`)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env from example
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET as needed

# 3. Run database migration (creates tables + seeds 35 products + admin user)
npm run migrate

# 4. Start dev server (hot-reload)
npm run dev
```

Server starts at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with tsx watch (hot-reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled JS from `dist/` |
| `npm run migrate` | Run schema.sql + seed.sql |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run all tests (node:test + supertest) |

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | - | Create account → `{token, user}` |
| POST | `/api/auth/login` | - | Login → `{token, user}` |
| GET | `/api/auth/me` | Bearer | Current user profile |

### Products
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | - | List active products (filter: `category`, `q`, `limit`, `offset`) |
| GET | `/api/products/:id` | - | Product detail with JSONB specs |
| POST | `/api/products` | Admin | Create product |

### Utility
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `{ok: true}` |

## Running with Frontend

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd FrontEnd && npm run dev
```

Frontend at `http://localhost:5173` connects to backend via `VITE_API_BASE_URL`.

## Test Accounts (after migrate)

| Email | Password | Role |
|-------|----------|------|
| admin@comhub.local | admin123 | Admin |

## Architecture

```
src/
├── app.ts              # Express app (CORS, routes, error handler)
├── server.ts           # Bootstrap (dotenv, listen)
├── config/db.ts        # pg Pool
├── controllers/        # Route handlers
├── middlewares/        # auth, role, asyncHandler
├── models/types.ts     # TypeScript interfaces
├── routes/             # Route definitions
├── scripts/            # migrate, test-connection
├── sql/                # schema.sql, seed.sql
└── tests/              # Integration tests (node:test)
```
