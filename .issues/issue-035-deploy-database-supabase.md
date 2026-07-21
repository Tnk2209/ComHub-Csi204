# Issue 035: Production Deployment Phase 1 — Supabase PostgreSQL Cloud Setup

## Parent
[Issue 020: SDLC Phase 6 & 7 (Deployment & Maintenance)](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-020-production-deployment.md)

## What to build
จัดเตรียมและสร้างฐานข้อมูล PostgreSQL Production บน **Supabase Cloud** สำหรับรองรับระบบ ComHub (7 ตาราง MVP) พร้อมนำเข้าข้อมูล DDL Schema และ Seed Data อุปกรณ์คอมพิวเตอร์ 35+ รายการ

### ขั้นตอนการปฏิบัติแบบละเอียด (Step-by-Step Instructions)
1. **สร้างบัญชีและโปรเจกต์บน Supabase:**
   - เข้าสู่เว็บ [https://supabase.com](https://supabase.com) กด Sign In ด้วยบัญชี GitHub
   - กดปุ่ม **"New Project"** เลือกองค์กร (Organization)
   - กรอก **Name:** `comhub-db`
   - กำหนด **Database Password:** (บันทึกรหัสผ่านไว้ใช้งาน) UQH9M0p7HAUCRpGw
   - เลือก **Region:** `Singapore (ap-southeast-1)`
   - เลือก Plan: **Free Tier** แล้วกด **"Create new project"** (รอระบบ provisioning ประมาณ 1-2 นาที)
2. **คัดลอก Connection String:**
   - ในป๊อบอัพที่เปิดขึ้นมา ให้กดเลือกกล่องตัวเลือกที่ 3: **`Direct`** (รูปทรงกระบอก DB / Connection string)
   - เลือกรูปแบบ **URI** หรือ **Transaction Pooler** แล้วคัดลอก Connection String มาใช้งาน
   - รูปแบบจะเป็น: `postgresql://postgres.wnbymeujegfdgrrlzuwo:comhub-db%4099@db.wnbymeujegfdgrrlzuwo.supabase.co:5432/postgres` (หรือ Port 6543)
3. **นำเข้า Schema และ Seed Data:**
   - ไปที่เมนู **SQL Editor** ในแถบซ้ายของ Supabase
   - เปิดไฟล์ [backend/src/sql/schema.sql](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/backend/src/sql/schema.sql) คัดลอกโค้ดทั้งหมดไปวางใน SQL Editor แล้วกด **Run**
   - เปิดไฟล์ [backend/src/sql/seed.sql](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/backend/src/sql/seed.sql) คัดลอกโค้ดทั้งหมดไปวางแล้วกด **Run**
4. **ตรวจสอบความถูกต้อง:**
   - ไปที่เมนู **Table Editor** สังเกตตารางครบทั้ง 7 ตาราง (`users`, `products`, `orders`, `order_items`, `reviews`, `wishlist_items`, `order_logs`)
   - ตรวจสอบตาราง `products` มีข้อมูลสินค้าสะสมอย่างน้อย 35 รายการ ครบทั้ง 7 หมวดหมู่

## Acceptance criteria
- [X] สร้าง Project `comhub-db` บน Supabase Cloud สำเร็จ
- [X] รัน DDL `schema.sql` สร้างตารางครบ 7 ตารางบน Supabase พร้อม Indexes และ Constraints
- [X] รัน `seed.sql` นำเข้าสินค้าเริ่มต้นอย่างน้อย 35 ชิ้น พร้อม JSONB Specifications
- [X] ได้รับ Connection String รูปแบบ SSL พร้อมใช้อ้างอิงใน Backend Environment Variables

## Blocked by
None - Can start immediately
