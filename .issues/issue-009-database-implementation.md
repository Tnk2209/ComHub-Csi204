# Issue 009: SDLC Phase 4 (Development) - PostgreSQL DDL Setup & Sample Seed Data (MVP - 7 Tables)

## What to build
ติดตั้งและรันสคริปต์ SQL DDL เพื่อสร้างตารางข้อมูลบนฐานข้อมูล PostgreSQL ตาม MVP scope (**7 ตาราง** ตัด `prebuilt_templates`, `template_items`, `assembly_records`, `gallery_posts` ออก) พร้อม seed data สินค้าเริ่มต้นครบ 7 หมวดหมู่หลักเพื่อรองรับการทดสอบ PC Builder + Compatibility Checker

**สภาพแวดล้อม:** Postgres local (Docker หรือ native install) ระหว่าง dev, ย้ายไป Supabase Cloud ก่อน deploy Week 4

## Acceptance criteria
- [ ] เขียน `backend/src/sql/schema.sql` copy ตรงจาก [`markdown/database-schema.md`](../markdown/database-schema.md) §Tables Schema — 7 ตาราง MVP: `users`, `products`, `orders`, `order_items`, `reviews`, `wishlist_items`, `order_logs`
- [ ] Constraints ครบตามเอกสาร: CHECK constraints (`role` IN 2 ค่า, `category` IN 7 ค่า, `order_status` IN 6 ค่า, `payment_status` IN 3 ค่า, `rating` BETWEEN 1-5), FK behaviors (RESTRICT/CASCADE ตาม data-dictionary), UNIQUE constraints (`users.email`, `users.google_id`, `wishlist_items(user_id, product_id)`)
- [ ] Indexes ครบตามเอกสาร: B-tree indexes ทุก FK, GIN index บน `products.specifications` (JSONB), full-text search index บน `products.name`, composite indexes สำหรับ dashboard queries
- [ ] `products.specifications` (JSONB) และ `products.is_active` (Boolean, DEFAULT TRUE) รองรับ Soft Delete
- [ ] เขียน `backend/src/sql/seed.sql` insert products **≥ 5 รายการต่อหมวด** ครบทั้ง 7 categories (CPU, Mainboard, GPU, RAM, SSD, Case, PSU) พร้อม `specifications` JSONB ที่มีฟิลด์เทคนิคครบ (socket, tdp, form_factor, ram_type, supported_ram, gpu_length_mm, max_gpu_length_mm, wattage) ตามตัวอย่างใน `database-schema.md` §Seed Data
- [ ] Seed admin user เริ่มต้น 1 บัญชี (bcrypt hash password ล่วงหน้า) สำหรับทดสอบ RBAC
- [ ] `backend/src/scripts/migrate.ts` ใช้ `pg` Pool รัน `schema.sql` แล้วตามด้วย `seed.sql`
- [ ] รัน `npm run migrate` สำเร็จ ตรวจด้วย `\dt` เห็น 7 ตาราง และ `SELECT COUNT(*) FROM products` ≥ 35

## Blocked by
- [Issue 007: REST API Contract & JSON Schema Design](./issue-007-api-specifications.md)

## Related
- Umbrella: [Issue 022: Backend Sprint 1 Kickoff](./issue-022-backend-sprint1-phase.md) (Sub-phase 2)
