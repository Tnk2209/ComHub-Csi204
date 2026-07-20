    

# Issue 022: SDLC Phase 4 (Development) - Backend Full Sprint Plan (Sprint 1–4)

## What to build

เริ่ม Week 3 (Backend & Database) ตามแผน SDLC โดยยืนระบบ Backend + Database ให้ทำงาน **End-to-End (E2E)** สำหรับ flow ที่สั้นที่สุด: **Register → Login → List Products → Product Detail** เพื่อพิสูจน์ contract ระหว่าง Frontend และ Backend ก่อนขยายไปยัง Orders, Payment Review, Dashboard ใน sprint ถัดไป

**การตัดสินใจสำคัญ (ตกลงแล้ว):**

- ภาษา: **TypeScript** ตาม `markdown/project-structure.md` (แม้ Frontend เขียน .jsx)
- Auth: **Native เท่านั้น** ใน sprint นี้ (bcrypt + JWT) — Google OAuth (C-10) เลื่อนไป sprint 3
- Database: **Postgres local** ระหว่าง dev, ย้ายไป Supabase Cloud ก่อน deploy (Week 4)
- Deploy: **Express server แยก** localhost:3000, CORS ให้ Vite localhost:5173 — Vercel Serverless adapter ทำ Week 4

**Non-goals ของ sprint นี้ (เลื่อนไป sprint 2+):**

- Orders / Checkout / Order Tracking flow (C-09, SYS-03)
- Wishlist (C-06), Reviews (C-07), Product Comparison logic
- Admin Payment Review (A-02), Order Management (A-03), Dashboard (A-05)
- Compatibility Engine + TDP Calculator (server-side) — sprint 2
- Google OAuth (C-10, SYS-01 partial) — sprint 3
- Vercel Serverless adapter — sprint 4
- Stock Rollback automation (gap feature ตาม `prd.md §7`)

**อ้างอิงแผน:** `C:/Users/thana/.claude/plans/backend-proud-origami.md`

---

## Sub-phases (6 stages — ทำเรียงลำดับ)

### 📦 Sub-phase 1: Backend Skeleton ✅

สร้างโครงโฟลเดอร์ `backend/` ตาม target ใน `markdown/project-structure.md` พร้อมติดตั้ง dependencies และ setup TypeScript

- [X] สร้าง folder tree: `backend/src/{config,controllers,middlewares,models,routes,services,sql,scripts}`, `backend/src/{app.ts,server.ts}`
- [X] `package.json` ติดตั้ง: `express`, `pg`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv` + `@types/*` และ dev deps `typescript`, `tsx`
- [X] `tsconfig.json` เปิด `strict: true`, `esModuleInterop: true`, target ES2022
- [X] `.env.example` มีตัวแปรครบ: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`
- [X] `.gitignore` exclude `node_modules/`, `dist/`, `.env`
- [X] scripts พร้อมใช้: `dev` (tsx watch), `build` (tsc), `start` (node dist), `migrate`
- [X] รัน `npx tsc --noEmit` ไม่มี error

### 🗄️ Sub-phase 2: Database SQL & Migration ✅

เขียน DDL schema สำหรับ 7 ตาราง MVP + seed data + migration script

- [X] `src/sql/schema.sql` copy ตรงจาก `markdown/database-schema.md` §Tables Schema — ครบทั้ง 7 ตาราง (`users`, `products`, `orders`, `order_items`, `reviews`, `wishlist_items`, `order_logs`) + indexes ตามที่เอกสารระบุ
- [X] `src/sql/seed.sql` insert products ≥ **5 รายการต่อหมวด** ครบทั้ง 7 categories (CPU/Mainboard/GPU/RAM/SSD/Case/PSU) พร้อม `specifications` JSONB (socket, tdp, form_factor, ram_type, supported_ram, gpu_length_mm, max_gpu_length_mm, wattage) ตามตัวอย่างใน `database-schema.md` §Seed Data
- [X] `src/sql/seed.sql` insert admin user เริ่มต้น 1 บัญชี (bcrypt hash รหัสผ่านล่วงหน้า)
- [X] `src/scripts/migrate.ts` ใช้ `pg` Pool รัน `schema.sql` ก่อน แล้ว `seed.sql`
- [X] รัน `npm run migrate` สำเร็จ, `psql -c "\dt"` เห็น 7 ตาราง, `SELECT COUNT(*) FROM products` ≥ 35

### 🔐 Sub-phase 3: Auth Vertical Slice (SYS-01 partial, SYS-02) ✅

ระบบสมัคร/ล็อกอิน Native + JWT + Middleware ตรวจสิทธิ์ตาม RBAC (Customer, Admin)

- [X] `POST /api/auth/register` — validate input, bcrypt hash (rounds=10), insert users, คืน `{token, user}` (201)
- [X] `POST /api/auth/login` — verify email + bcrypt.compare, คืน `{token, user}` (200), 401 ถ้าไม่ผ่าน
- [X] `GET /api/auth/me` — verify JWT, คืน user profile (`id`, `email`, `first_name`, `last_name`, `role`)
- [X] JWT payload: `{sub, role, iat, exp}`, HS256, expiry 7 วัน, secret จาก `JWT_SECRET` env
- [X] `authMiddleware.ts` — verify JWT จาก `Authorization: Bearer` header → attach `req.user`
- [X] `roleMiddleware.ts` — `requireRole('Admin')` return 403 ถ้า `req.user.role !== 'Admin'`
- [X] Smoke test ผ่าน curl: register → login → me สำเร็จ

### 📚 Sub-phase 4: Products Endpoints (A-01 read-only + create stub) ✅

API สำหรับดึงข้อมูลสินค้าเข้าสู่หน้า Catalog + PC Builder ของ Frontend

- [X] `GET /api/products?category=&q=&limit=&offset=` — filter by category, full-text search ใน `name`, pagination — ตาม sample query ใน `database-schema.md` §Sample Queries 2
- [X] `GET /api/products/:id` — คืน product + `specifications` JSONB ครบ (จำเป็นสำหรับ Compatibility Checker sprint 2)
- [X] `POST /api/products` — Admin only (ผ่าน `authMiddleware` + `roleMiddleware('Admin')`) — validate body, insert products, คืน 201
- [X] Filter เฉพาะ `is_active = TRUE` ในหน้า customer-facing (list) แต่ `GET /:id` ให้ดึงได้แม้ inactive (สำหรับ historical order detail)
- [X] Response time smoke test: list 20 products < 500ms (NFR)

### 🔗 Sub-phase 5: Frontend Integration Layer ✅

เชื่อม Frontend ที่ hardcoded อยู่ตอนนี้ให้เรียก Backend จริง — **แค่ Auth + Catalog** ใน sprint นี้

- [X] `FrontEnd/.env` + `.env.example` — `VITE_API_BASE_URL=http://localhost:3000`
- [X] `FrontEnd/src/services/apiClient.js` — fetch wrapper อ่าน token จาก `localStorage['comhub_token']` แล้วใส่ `Authorization: Bearer` header อัตโนมัติ + parse JSON + throw error สำหรับ status >= 400
- [X] `FrontEnd/src/services/authService.js` — `register()`, `login()`, `me()`
- [X] `FrontEnd/src/services/productService.js` — `list(params)`, `get(id)`
- [X] `FrontEnd/src/contexts/AuthContext.jsx` — เก็บ `user`, `token`, expose `login()`, `logout()`, `register()`, `isAuthenticated`; on mount เรียก `/api/auth/me` ถ้ามี token ใน localStorage
- [X] Refactor `pages/Auth/Auth.jsx` — เรียก `authService.login()` / `authService.register()` แทน mock submit, save token + navigate to `/landing`
- [X] Refactor `pages/Catalog/Catalog.jsx` — เรียก `productService.list()` แทน hardcoded array (คง mock ไว้เป็น fallback ตอน API ล่ม dev)
- [X] หน้าอื่น (PCBuilder, CartCheckout, OrderTracking, Wishlist, Admin*) **ยังใช้ mock ต่อไป** — refactor ทีหลัง sprint 2

### ✅ Sub-phase 6: CORS + E2E Manual Test + README ✅

ทดสอบ integration ครบวงจร + อัปเดตเอกสารวิธีรัน

- [X] `app.ts` mount `cors({origin: process.env.CORS_ORIGIN})` — allow `http://localhost:5173`
- [X] `app.ts` mount `/api/auth`, `/api/products`, `GET /health` (return `{ok: true}`)
- [X] Global error handler ที่ตอบ JSON `{error, message}` แทน HTML stack trace
- [X] Smoke test ผ่านทุก endpoint ตาม verification section ใน plan file
- [X] **RBAC negative test:** Customer token เรียก `POST /api/products` → 403 Forbidden
- [X] **Browser E2E:** เปิด 2 dev servers → `/register` กรอกฟอร์ม → เห็น POST 201 ใน Network → refresh หน้ายัง login → `/catalog` แสดง products จริงจาก DB
- [X] `README.md` (หรือ `backend/README.md`) อัปเดตวิธีรัน: (1) Postgres local, (2) `npm install`, (3) `npm run migrate`, (4) `npm run dev`, (5) เปิด Frontend ที่ `FrontEnd/`

---

## ✅ Definition of Done (Sprint 1)

- [X] 6 sub-phases ด้านบนติ๊กครบ
- [X] `npx tsc --noEmit` ไม่มี error ทั้ง backend
- [X] Backend + Frontend รันคู่กันได้ ไม่มี CORS/JWT error ใน console
- [X] Register → Login → Refresh → เห็น Catalog products จริง — flow เดียวทำงาน E2E

---

---

# ✅ Sprint 2: Product CRUD เต็ม + Orders & Checkout

**เป้าหมาย:** ทำให้ลูกค้าสามารถเลือกสินค้า → สั่งซื้อ → อัปโหลดสลิป → Admin ตรวจสอบได้ E2E

**Scope:** 2 Roles (Customer, Admin) | ไม่มี Staff/Manager

---

### 📦 Sub-phase 7: Product Update & Delete API (Issue 018 completion)

- [X] `PUT /api/products/:id` — Admin only, validate body ครบเหมือน create, อัปเดตทุก field
- [X] `PATCH /api/products/:id/status` — Admin only, toggle `is_active` (soft delete/restore)
- [X] `DELETE /api/products/:id` — Admin only, hard delete (เฉพาะสินค้าที่ไม่เคยมี order_items อ้างอิง)
- [X] `GET /api/admin/products?include_inactive=true` — Admin only, ดึงสินค้าทั้งหมดรวม inactive
- [X] Validation: `category` ต้องอยู่ใน 7 ค่า (CPU, Mainboard, GPU, RAM, SSD, Case, PSU)
- [X] Validation: `specifications` JSONB ต้องมี key ตาม category (เช่น CPU ต้องมี socket, tdp)
- [X] Unit tests ครบทุก endpoint + negative cases (non-admin → 403, invalid body → 400)

### 🛒 Sub-phase 8: Cart & Order Creation API (Issue 012 partial)

- [X] `POST /api/orders` — Customer only, สร้าง order จาก cart items array:
  ```json
  { "items": [{"product_id": 1, "quantity": 2}], "shipping_address": "..." }
  ```
- [X] Validate: ตรวจ `stock_quantity >= quantity` ทุกรายการก่อนสร้าง order
- [X] Deduct stock: ลด `stock_quantity` ของแต่ละ product ที่สั่ง (atomic transaction)
- [X] Insert `orders` + `order_items` ใน single transaction (rollback ถ้า stock ไม่พอ)
- [X] ค่าเริ่มต้น: `status = 'Pending'`, `payment_status = 'Pending'`
- [X] คำนวณ `total_price` จาก `products.price * quantity` รวมทุก item
- [X] Insert `order_logs` entry: `{ action: 'Order Created' }`
- [X] Response: คืน order object พร้อม items (status 201)
- [X] `GET /api/orders` — Customer: ดูเฉพาะ orders ของตัวเอง (filter by `user_id` จาก JWT)
- [X] `GET /api/orders/:id` — Customer: ดู order detail + items + logs (ต้องเป็นเจ้าของ order)
- [X] Admin: `GET /api/admin/orders?status=&payment_status=` — ดูทุก order, filter by status

### 💳 Sub-phase 9: Payment Slip Upload & Admin Review (Issue 012 + 018)

- [X] `PATCH /api/orders/:id/payment` — Customer only, อัปโหลด payment slip:
  - รับ `slip_url` (URL string จาก frontend upload ไป Supabase Storage หรือ static path)
  - อัปเดต `payment_status = 'Uploaded'`
  - Insert `order_logs`: `{ action: 'Slip Uploaded' }`
- [X] `PATCH /api/admin/orders/:id/approve-payment` — Admin only:
  - อัปเดต `payment_status = 'Confirmed'`, `status = 'Processing'`
  - Insert `order_logs`: `{ action: 'Payment Approved' }`
- [X] `PATCH /api/admin/orders/:id/reject-payment` — Admin only:
  - รับ `reason` string
  - อัปเดต `payment_status = 'Rejected'`
  - Insert `order_logs`: `{ action: 'Payment Rejected', details: reason }`
  - **Stock rollback:** คืน `stock_quantity` กลับทุก item ใน order
- [X] `PATCH /api/admin/orders/:id/status` — Admin only, เปลี่ยน order status:
  - Allowed transitions: `Processing → Shipped → Delivered`
  - ถ้า `Shipped`: ต้องส่ง `tracking_number` มาด้วย
  - Insert `order_logs` ทุกครั้งที่เปลี่ยน status
- [X] ป้องกัน: Customer เปลี่ยน order ของคนอื่น → 403
- [X] ป้องกัน: เปลี่ยน status ย้อนกลับ (Shipped → Processing) → 400

### 🔗 Sub-phase 10: Frontend Integration — Orders & Admin (Sprint 2) ✅

- [X] `FrontEnd/src/services/orderService.js` — `create()`, `list()`, `get(id)`, `uploadSlip(id, url)`
- [X] `FrontEnd/src/services/adminService.js` — `listOrders()`, `approvePayment()`, `rejectPayment()`, `updateStatus()`, `listProducts(includeInactive)`, `updateProduct()`, `toggleProductStatus()`
- [X] Refactor `pages/CartCheckout/CartCheckout.jsx` — เรียก `orderService.create()` จริง
- [X] Refactor `pages/OrderTracking/OrderTracking.jsx` — เรียก `orderService.list()` + `get(id)` จริง
- [X] Refactor `pages/AdminProducts/AdminProducts.jsx` — เรียก adminService CRUD จริง
- [X] Refactor `pages/AdminPayment/AdminPaymentReview.jsx` — เรียก approve/reject จริง
- [X] เพิ่ม `CartContext.jsx` — global cart state (add/remove/clear), persist ใน localStorage
- [X] เพิ่ม Route Guard: `/admin-*` routes ต้อง login + role === 'Admin' ถึงเข้าได้

---

## ✅ Definition of Done (Sprint 2)

- [X] Product CRUD ครบ (Create/Read/Update/Soft-delete) + tests
- [X] Order flow E2E: สร้าง order → upload slip → admin approve → status Shipped
- [X] Stock ลดจริงเมื่อสั่ง, คืนจริงเมื่อ reject
- [X] Frontend CartCheckout + OrderTracking + AdminProducts + AdminPayment เชื่อม API จริง
- [X] Route Guard ป้องกัน unauthorized access

---

---

# 🚀 Sprint 3: Wishlist + Reviews + Admin Accounts + PC Builder API

**เป้าหมาย:** เพิ่ม feature เสริมที่ทำให้ระบบสมบูรณ์ — Wishlist, Reviews, Admin จัดการ user, PC Builder ดึงข้อมูลจาก API

---

### ❤️ Sub-phase 11: Wishlist API (Issue 015) ✅

- [X] `POST /api/wishlist` — Customer only, เพิ่ม product เข้า wishlist (`product_id` + `is_alert_enabled`)
- [X] `GET /api/wishlist` — Customer only, ดึง wishlist ของตัวเอง พร้อม product info (JOIN)
- [X] `DELETE /api/wishlist/:product_id` — Customer only, ลบออกจาก wishlist
- [X] `PATCH /api/wishlist/:product_id/alert` — toggle `is_alert_enabled` (true/false)
- [X] Prevent duplicate: ถ้ามี product_id เดิมอยู่แล้ว → 409 Conflict
- [X] Unit tests: add, list, remove, duplicate prevention, alert toggle

### ⭐ Sub-phase 12: Reviews API (Issue 015 related) ✅

- [X] `POST /api/products/:id/reviews` — Customer only, สร้าง review (`rating` 1-5, `comment`)
- [X] `GET /api/products/:id/reviews` — Public, ดึง reviews ของ product (pagination)
- [X] `DELETE /api/reviews/:id` — Owner only (customer ลบ review ตัวเอง) หรือ Admin
- [X] Validation: `rating` ต้อง 1-5, `comment` max 1000 chars
- [X] ป้องกัน: 1 user = 1 review ต่อ product (UNIQUE constraint)
- [X] เพิ่ม average rating ใน `GET /api/products/:id` response
- [X] Unit tests ครบ

### 👥 Sub-phase 13: Admin Accounts Management (Issue 018) ✅

- [X] `GET /api/admin/users` — Admin only, list ทุก user (pagination, search by email/name)
- [X] `GET /api/admin/users/:id` — Admin only, ดู user detail
- [X] `PATCH /api/admin/users/:id/role` — Admin only, เปลี่ยน role (Customer ↔ Admin)
- [X] `PATCH /api/admin/users/:id/status` — Admin only, disable/enable account (เพิ่ม `is_active` column ใน users table ถ้ายังไม่มี)
- [X] ป้องกัน: Admin ลบตัวเอง → 400
- [X] Unit tests + RBAC negative tests

### 🖥️ Sub-phase 14: PC Builder — Products by Category API ✅

- [X] `GET /api/products/by-category/:category` — Public, ดึง products ตาม category พร้อม `specifications` JSONB เต็ม (สำหรับ compatibility check ฝั่ง Frontend)
- [X] Response include: `id`, `name`, `price`, `image_url`, `stock_quantity`, `specifications`
- [X] Filter เฉพาะ `is_active = true`, sort by `name`
- [X] ใช้ endpoint นี้แทน hardcoded `COMPONENT_DATABASE` ใน PCBuilder page

### 🔗 Sub-phase 15: Frontend Integration — Sprint 3 ✅

- [X] `FrontEnd/src/services/wishlistService.js` — `list()`, `add(productId)`, `remove(productId)`, `toggleAlert(productId)`
- [X] `FrontEnd/src/services/reviewService.js` — `list(productId, params)`, `create(productId, data)`, `delete(reviewId)`
- [X] Refactor `pages/Wishlist/Wishlist.jsx` — เรียก wishlistService จริง
- [X] Refactor `pages/ProductDetail/ProductDetail.jsx` — เรียก `productService.get(id)` + `reviewService.list()` จริง
- [X] Refactor `pages/PCBuilder/PCBuilder.jsx` — ดึง products per category จาก API แทน hardcoded
- [X] Refactor `pages/AdminAccounts/AdminAccounts.jsx` — เรียก adminService จริง
- [X] เพิ่ม WishlistContext หรือใช้ service ตรง (ขึ้นกับ UX ที่ต้องการ)

---

## ✅ Definition of Done (Sprint 3)

- [X] Wishlist: เพิ่ม/ลบ/ดู + stock alert toggle ทำงานจริง
- [X] Reviews: สร้าง/ดู/ลบ review ได้, average rating แสดงใน product detail
- [X] Admin จัดการ users ได้ (ดู/เปลี่ยน role/disable)
- [X] PCBuilder ดึง products จาก DB จริง (ไม่ใช่ hardcoded)
- [X] Frontend ทุกหน้าที่เหลือเชื่อม API จริงหมด

---

---

# 🔧 Sprint 3.5: Feature Gap Closure (ปิดฟีเจอร์ที่ตกหล่น)

**เป้าหมาย:** ปิด feature ที่ยังขาดตาม project-scope.md ก่อนเข้า Sprint 4 (Security + Deploy)

**ที่มา:** Audit เทียบ `markdown/project-scope.md` + `markdown/usecasediagram.mermaid` พบ 7 ช่องว่าง

---

### 🖥️ Sub-phase 20: Product Comparison Page (C-05) ✅

**เหตุผลจัดลำดับ:** เป็น Functional Requirement หลักใน scope matrix — ไม่มีจะขาด feature หนึ่ง Use Case ทั้งอัน

- [X] สร้าง `FrontEnd/src/pages/ProductComparison/ProductComparison.jsx`
- [X] UI: เลือกสินค้าประเภทเดียวกันได้สูงสุด 3 ชิ้น
- [X] ดึงข้อมูล product + specifications ผ่าน `productService.get(id)`
- [X] แสดงตารางเปรียบเทียบ: ชื่อ, ราคา, specifications (key-by-key side-by-side)
- [X] ปุ่ม "Add to Compare" ในหน้า Catalog + ProductDetail
- [X] CompareContext หรือ localStorage เก็บ compare list (max 3)
- [X] ลบสินค้าออกจาก compare ได้
- [X] Register route ใน `main.jsx` / App navigation

### 📊 Sub-phase 21: Admin Dashboard & Reports (A-05) ✅

**เหตุผลจัดลำดับ:** เป็น Admin feature หลักใน scope — Dashboard ยังไม่มี page เลย

- [X] Backend: `GET /api/admin/dashboard` — return aggregated data:
  - `total_revenue` (SUM of delivered orders)
  - `total_orders` (count by status)
  - `top_products` (top 5 by quantity sold)
  - `low_stock_products` (stock_quantity ≤ 3, is_active = true)
- [X] สร้าง `FrontEnd/src/pages/AdminDashboard/AdminDashboard.jsx`
- [X] UI cards: ยอดขายรวม, จำนวนออเดอร์แยกตาม status
- [X] ตาราง: สินค้ายอดนิยม Top 5
- [X] ตาราง: เตือนสต็อกต่ำ (≤ 3 ชิ้น) พร้อม highlight
- [X] Register route + เพิ่มเมนูใน Admin navigation
- [X] Unit tests สำหรับ dashboard endpoint

### ⭐ Sub-phase 22: Review Submission Form (C-07 completion) ✅

**เหตุผลจัดลำดับ:** Backend + service layer พร้อมแล้ว แค่ขาด UI form — ปิดได้เร็ว

- [X] เพิ่ม review form ใน `ProductDetail.jsx`: rating selector (1-5 stars) + comment textarea
- [X] Validate: ต้อง login, rating required, comment max 1000 chars
- [X] เรียก `reviewService.create(productId, {rating, comment})`
- [X] แสดง error ถ้า duplicate (409) — "คุณรีวิวสินค้านี้แล้ว"
- [X] Refresh review list หลัง submit สำเร็จ
- [X] ปุ่ม delete review สำหรับ owner (แสดงเฉพาะ review ของ current user)

### 🔌 Sub-phase 23: Compatibility Checker — RAM Type + Form Factor (C-02 completion) ✅

**เหตุผลจัดลำดับ:** Logic ง่าย data มีอยู่แล้วใน specifications JSONB — แค่เพิ่ม check rules

- [X] เพิ่ม RAM type check ใน PCBuilder `buildCompatibility`:
  - ถ้า Motherboard มี `ramType` (DDR4/DDR5) และ RAM มี `ramType` → ต้องตรงกัน
  - Mismatch → status: 'error', message บอก DDR ไม่ตรง
- [X] เพิ่ม form_factor check:
  - ถ้า seed data มี `form_factor` ใน motherboard specs + case specs → ตรวจ ATX/mATX/ITX compatibility
- [X] เพิ่ม UI row ใหม่ใน Compatibility Health panel (RAM Type, Form Factor)
- [X] ตรวจสอบ seed data — `ram_type` มีทั้งใน Mainboard และ RAM, `form_factor` เป็น string ใน Mainboard และ array ใน Case
- [X] Extracted `buildCompatibility` เป็น pure function (`buildCompatibility.js`) + unit tests 12 cases ผ่านครบ

### 📋 Sub-phase 24: Admin Order Management Page (A-03 completion) ✅ DONE

**เหตุผลจัดลำดับ:** Backend endpoints ครบแล้ว — ต้องทำ dedicated frontend page

- [X] สร้าง `FrontEnd/src/pages/AdminOrders/AdminOrders.jsx`
- [X] ดูรายการออเดอร์ทั้งหมด (filter by status, payment_status)
- [X] UI: อัปเดตสถานะ Processing → Shipped → Delivered (dropdown/button)
- [X] UI: กรอก tracking number เมื่อ ship
- [X] UI: Cancel order + backend endpoint `PATCH /api/admin/orders/:id/cancel` (stock rollback via transaction)
- [X] Register route `/admin-orders` + เพิ่มเมนู "Order Management" ใน Sidebar
- [X] แยกออกจาก AdminPaymentReview ให้เป็นหน้าเฉพาะ
- [X] TDD: `orderStatusUtils.js` pure functions + 15 unit tests, backend cancel endpoint 6 integration tests

### 💾 Sub-phase 25: PCBuilder State Persistence + UX Polish 🟢 LOW

**เหตุผลจัดลำดับ:** NFR ระบุไว้ว่า builder state ต้อง persist — แต่ไม่กระทบ core functionality

- [X] เพิ่ม `useEffect` save `selectedParts` → localStorage (key: `comhub_builder`)
- [X] เพิ่ม `useState` initializer อ่านจาก localStorage on mount
- [X] ปุ่ม Reset ลบ localStorage ด้วย
- [ ] (Optional) แสดง toast/notification เมื่อ restore สำเร็จ
- [X] TDD: `builderStorage.spec.js` 6 unit tests + `PCBuilder.spec.jsx` 3 integration tests

### 🖼️ Sub-phase 26: Client-side WebP Compression (SYS-04) 🟢 LOW

**เหตุผลจัดลำดับ:** NFR ด้าน Cloud Optimization — เป็น nice-to-have สำหรับ academic project

- [X] สร้าง utility `FrontEnd/src/utils/imageCompressor.js`:
  - รับ File object → Canvas → `canvas.toBlob('image/webp', 0.8)` → Base64 string
  - Resize ถ้าเกิน 1200px width
- [X] Integrate ใน CartCheckout slip upload: เรียก compressor ก่อนส่ง
- [X] แสดง preview รูปที่บีบอัดแล้ว + file size comparison
- [X] TDD: `imageCompressor.spec.js` 3 unit tests (resize, no-resize, error)

---

## Definition of Done (Sprint 3.5)

- [ ] Product Comparison: เปรียบเทียบสินค้า 3 ชิ้นได้ พร้อมตาราง specs
- [ ] Admin Dashboard: แสดงยอดขาย, top products, low stock alerts
- [ ] Review: ลูกค้าเขียนรีวิวจาก UI ได้จริง
- [ ] Compatibility: ตรวจ RAM type (DDR4/DDR5) + form factor
- [ ] Admin Orders: หน้าจัดการออเดอร์แยกจาก Payment Review
- [ ] PCBuilder persist state ลง localStorage
- [ ] Slip upload บีบอัด WebP client-side

---

---

# 🚀 Sprint 4: Security, Performance & Production Deployment

**เป้าหมาย:** ปิดงาน — ทดสอบความปลอดภัย, optimize performance, deploy ขึ้น production

---

### 🔒 Sub-phase 27: Security Hardening (Issue 019 partial)

- [ ] Rate limiting: ใส่ `express-rate-limit` บน auth endpoints (max 5 attempts / 15 min)
- [ ] Input sanitization: ป้องกัน XSS ใน user input (review comments, shipping address)
- [ ] SQL injection: ตรวจสอบว่าทุก query ใช้ parameterized queries (ไม่มี string concatenation)
- [ ] JWT: ตรวจสอบ token expiry ถูกต้อง, reject expired tokens
- [ ] Password policy: minimum 8 chars, ตรวจใน register endpoint
- [ ] CORS: restrict origin เฉพาะ production domain + localhost dev
- [ ] Helmet.js: เพิ่ม security headers

### ⚡ Sub-phase 28: Performance & Database Optimization (Issue 019 partial)

- [ ] Database indexes: ตรวจสอบ indexes ครบตาม query patterns ที่ใช้จริง
- [ ] Query optimization: ตรวจ N+1 queries, ใช้ JOIN แทน multiple queries
- [ ] Pagination: ตรวจสอบทุก list endpoint มี limit/offset + max cap
- [ ] Response compression: เพิ่ม `compression` middleware
- [ ] Frontend: Lighthouse audit score ≥ 80 (Performance, Accessibility)
- [ ] Bundle size check: ตรวจ Vite build output ไม่เกิน 500KB gzipped

### 🌐 Sub-phase 29: Production Deployment (Issue 020)

- [ ] Backend: Deploy Express → Vercel Serverless Functions (หรือ Railway/Render)
- [ ] Database: Migrate local Postgres → Supabase Cloud
- [ ] Frontend: Deploy Vite build → Vercel Static
- [ ] Environment variables: ตั้ง `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` บน production
- [ ] HTTPS: ตรวจสอบ SSL certificate ทำงานถูกต้อง
- [ ] E2E smoke test บน production URL: Register → Login → Browse → Order → Admin Review
- [ ] `README.md` อัปเดต: production URL, architecture diagram, วิธี deploy

### 📝 Sub-phase 30: Documentation & Known Issues (Issue 020)

- [ ] API Documentation: สรุป endpoints ทั้งหมดพร้อม request/response examples
- [ ] Known Issues document: bugs ที่รู้แต่ยังไม่แก้, limitations
- [ ] Future Development: features ที่ตัดออก (Staff, Manager, OAuth, Gallery) + แผนต่อ
- [ ] User Manual: วิธีใช้งานระบบสำหรับ Customer และ Admin (สั้นๆ)

---

## Definition of Done (Sprint 4)

- [ ] ไม่มี critical security vulnerabilities
- [ ] Lighthouse Performance ≥ 80
- [ ] Production URL ใช้งานได้จริง ครบทุก flow
- [ ] เอกสารพร้อมส่งอาจารย์

---

---

# 📊 Sprint Progress Overview

| Sprint     | ขอบเขต                                                                       | สถานะ                |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------- |
| Sprint 1   | Backend skeleton + Auth + Products read + Frontend integration                     | ✅ เสร็จแล้ว     |
| Sprint 2   | Product CRUD + Orders + Checkout + Payment Review                                  | ✅ เสร็จแล้ว     |
| Sprint 3   | Wishlist + Reviews + Admin Accounts + PC Builder API                               | ✅ เสร็จแล้ว     |
| Sprint 3.5 | Feature Gap: Comparison + Dashboard + Review UI + Compat + Orders UI + Persistence | ⬜ ยังไม่เริ่ม |
| Sprint 4   | Security + Performance + Deploy + Docs                                             | ⬜ ยังไม่เริ่ม |

**Features ที่ตัดออก (ไม่อยู่ใน scope 2 roles):**

- ❌ Staff Assembly Queue & Burn-in (Issue 013) — ต้องการ role Staff
- ❌ Manager Templates & Moderation (Issue 017) — ต้องการ role Manager
- ❌ PC Build Gallery & Cloning (Issue 016) — ต้องการ gallery_posts table + moderation
- ❌ Google OAuth (Issue 010 partial) — deferred, Native auth เพียงพอ
- ❌ Coupon/Discount system (Issue 012 partial) — ตัดเพื่อลด scope

---

## Blocked by

- **None** — สามารถเริ่ม Sprint 2 ได้ทันที (Sprint 1 เสร็จแล้ว)

## Supersedes / Aligns with

- Rewrites [Issue 009](./issue-009-database-implementation.md) — จาก 10-11 ตาราง เป็น 7 ตาราง MVP
- Rewrites [Issue 010](./issue-010-backend-auth-jwt.md) — จาก 4 roles เป็น 2 roles (Customer/Admin), Native only
- Covers [Issue 018](./issue-018-admin-product-crud.md) — Full CRUD ใน Sprint 2
- Covers [Issue 012](./issue-012-checkout-slip-storage.md) — Orders + Slip (ไม่มี coupon)
- Covers [Issue 014](./issue-014-customer-order-tracking.md) — Order tracking via order_logs
- Covers [Issue 015](./issue-015-wishlist-stock-alert.md) — Wishlist + alert toggle
- Covers [Issue 019](./issue-019-security-performance-checks.md) — Security + Performance
- Covers [Issue 020](./issue-020-production-deployment.md) — Deploy + Docs

## References

- Plan: `C:/Users/thana/.claude/plans/backend-proud-origami.md`
- Scope: [project-scope.md](../markdown/project-scope.md)
- Schema: [database-schema.md](../markdown/database-schema.md)
- Structure: [project-structure.md](../markdown/project-structure.md)
