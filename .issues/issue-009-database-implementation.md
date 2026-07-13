# Issue 009: SDLC Phase 4 (Development) - Supabase PostgreSQL DDL Setup & Sample Seed Data

## What to build
สร้างและติดตั้งตารางข้อมูลจริงบน Supabase Cloud โดยใช้คำสั่งภาษา SQL DDL รันสร้างตาราง (DDL Script) ทั้ง 10 ตารางตามที่ระบุใน Data Dictionary พร้อมทำการกรอกข้อมูลสินค้าและผู้ใช้เริ่มต้น (Seed Data) เพื่อรองรับการทำระบบ PC Builder ทดลองรัน

## Acceptance criteria
- [ ] รันสคริปต์ SQL DDL สร้างตารางในส่วนเครื่องมือของ Supabase Database Manager ผ่านครบทั้งหมด 10 ตาราง ไร้ข้อผิดพลาด Foreign Key / Constraints
- [ ] มีตารางข้อมูล: `users`, `products`, `orders`, `order_items`, `reviews`, `prebuilt_templates`, `template_items`, `wishlist_items`, `assembly_records`, `order_logs`, `gallery_posts` ครบถ้วนถูกต้อง
- [ ] โครงสร้างตาราง `products` ต้องใช้รูปแบบคอลัมน์ `specifications` (JSONB) และ `is_active` (Boolean) เพื่อความยืดหยุ่นและการทำ Soft Delete
- [ ] รันเขียน Seed Data สินค้าไอทีลงฐานข้อมูลจำแนกประเภทละอย่างน้อย 3-5 รายการ (CPU, GPU, RAM, Mainboard, Case, PSU, Storage) โดยในคอลัมน์ JSONB specifications ต้องมีการบันทึกฟิลด์เทคนิคอย่างครบถ้วน (เช่น socket, form_factor, gpu_length, max_gpu_length, tdp, wattage, supported_ram)

## Blocked by
- [Issue 007: REST API Contract & JSON Schema Design](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-007-api-specifications.md)
