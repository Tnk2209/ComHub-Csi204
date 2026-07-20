# Issue 010: SDLC Phase 4 (Development) - User Authentication & RBAC (MVP - 2 Roles Native)

## What to build
พัฒนาระบบสมัครสมาชิก (Register) และเข้าสู่ระบบ (Login) ฝั่งหลังบ้านด้วย **Native email/password + JWT Token** และสร้าง Middleware ตรวจสอบสิทธิ์บทบาท (RBAC) รองรับ 2 บทบาทตาม MVP scope: **Customer** และ **Admin**

**หมายเหตุ scope:** Google OAuth (C-10, SYS-01 partial) **เลื่อนไป sprint 3** — sprint นี้ทำ Native เท่านั้น พร้อมออกแบบให้ `users` table รองรับ `auth_provider` และ `google_id` ไว้ก่อน (schema พร้อม แต่ code path ยังไม่ implement)

## Acceptance criteria
- [ ] `POST /api/auth/register` — validate `{email, password, first_name, last_name}`, bcrypt hash (rounds=10), insert `users` (default `role='Customer'`, `auth_provider='native'`), คืน `{token, user}` status 201
- [ ] `POST /api/auth/login` — verify email, `bcrypt.compare`, คืน `{token, user}` status 200; ถ้าไม่ผ่าน คืน 401 `{error: 'Invalid credentials'}`
- [ ] `GET /api/auth/me` — verify JWT, คืน user profile (`id`, `email`, `first_name`, `last_name`, `role`) — ไม่ส่ง `password_hash` กลับ
- [ ] JWT payload: `{sub: user.id, role: user.role, iat, exp}`, algorithm `HS256`, expiry `7d`, secret จาก `process.env.JWT_SECRET`
- [ ] `authMiddleware.ts` — parse `Authorization: Bearer <token>` header, verify signature + expiry, attach `req.user = {id, role}` — 401 ถ้าไม่มี/ไม่ valid
- [ ] `roleMiddleware.ts` — `requireRole(role: 'Customer' | 'Admin')` — 403 Forbidden ถ้า `req.user.role !== role`
- [ ] Frontend `FrontEnd/src/contexts/AuthContext.jsx` — จำ `user`, `token`, persist ใน `localStorage['comhub_token']`, on mount เรียก `/api/auth/me` ถ้ามี token
- [ ] Frontend `pages/Auth/Auth.jsx` refactor — เรียก `authService.login()` / `authService.register()` แทน mockup submit, save token, navigate to `/landing`
- [ ] Smoke test ผ่าน curl: `register` → `login` → `me` สำเร็จ + **RBAC negative test:** Customer token เรียก admin route → 403

## Blocked by
- [Issue 009: PostgreSQL DDL Setup & Seed Data (MVP)](./issue-009-database-implementation.md)

## Related
- Umbrella: [Issue 022: Backend Sprint 1 Kickoff](./issue-022-backend-sprint1-phase.md) (Sub-phase 3 + 5)
- Deferred to sprint 3: Google OAuth (Passport.js + `passport-google-oauth20`) — C-10
