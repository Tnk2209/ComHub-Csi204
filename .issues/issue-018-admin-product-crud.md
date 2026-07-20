# Issue 018: SDLC Phase 4 (Development) - Admin Product Catalog CRUD & Accounts Controls (MVP - 2 Roles)

## What to build
พัฒนา API และหน้าจอหลังบ้าน (Admin Panel) สำหรับผู้ดูแลระบบ (**Admin เท่านั้น**) เพื่อบริหารจัดการข้อมูลสินค้าหลัก (Product CRUD + Soft Delete via `is_active`) พร้อมระบบจัดการบัญชีผู้ใช้ (Role & Access Control)

**หมายเหตุ scope MVP:**
- 2 บทบาท: `Customer` และ `Admin` (**ตัด Staff/Manager ออก**)
- **Stock Rollback automation ตัดออก** — เป็น gap feature ตาม `prd.md §7`, แอดมินคืน stock manually ผ่าน Product update ได้
- Sub-scope ของ sprint 1 = แค่ `POST /api/products` (stub) — full CRUD (`PUT`, `PATCH is_active`) ทำใน sprint 2

## Acceptance criteria
- [ ] `POST /api/products` (Admin only) — validate body `{name, category, price, stock_quantity, image_url, specifications}`, insert, คืน 201 พร้อม product ที่สร้าง — sprint 1 stub
- [ ] `PUT /api/products/:id` (Admin only) — อัปเดตทุกฟิลด์รวม `specifications` (JSONB) — sprint 2
- [ ] `PATCH /api/products/:id/status` (Admin only) — สลับ `is_active` เพื่อ Soft Delete / เปิดขายใหม่ — sprint 2
- [ ] `GET /api/products` (public) — filter `is_active=TRUE` เท่านั้นในหน้า customer-facing
- [ ] `GET /api/admin/products` (Admin only) — คืนสินค้าทั้งหมดรวม `is_active=false` เพื่อ Admin Panel เห็นสินค้าที่ปิดขาย — sprint 2
- [ ] `category` ต้องอยู่ในชุด 7 ค่า MVP: `CPU`, `Mainboard`, `GPU`, `RAM`, `SSD`, `Case`, `PSU` (validate ระดับ API + DB CHECK constraint)
- [ ] `specifications` JSONB บันทึกฟิลด์เทคนิคครบตาม category (socket, tdp, form_factor, ram_type, supported_ram, gpu_length_mm, max_gpu_length_mm, wattage) — Frontend PC Builder + Compatibility Checker ใช้งานได้จริง
- [ ] Frontend `pages/AdminProducts/AdminProducts.jsx` เชื่อม API จริงแทน mock — sprint 2
- [ ] **Admin Accounts Management** (`POST /api/admin/accounts`, `PUT /api/admin/accounts/:id/role`, `DELETE /api/admin/accounts/:id`) — สร้างบัญชี Admin เพิ่ม, สลับ role ระหว่าง `Customer` ↔ `Admin`, ลบบัญชี — sprint 2
- [ ] ทุก admin endpoint ผ่าน `authMiddleware` + `roleMiddleware('Admin')` — Customer เรียกได้ 403

## Blocked by
- [Issue 010: User Authentication & RBAC (MVP)](./issue-010-backend-auth-jwt.md)

## Related
- Umbrella: [Issue 022: Backend Sprint 1 Kickoff](./issue-022-backend-sprint1-phase.md) (Sub-phase 4 — `POST /api/products` stub)
- Deferred to sprint 3: Payment Review (A-02), Order Management (A-03), Dashboard (A-05)
- Gap feature (deferred): Stock Rollback on payment rejection — `prd.md §7`
