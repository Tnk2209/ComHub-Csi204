# Issue 010: SDLC Phase 4 (Development) - User Authentication & Role-Based Access Control (RBAC)

## What to build
พัฒนาระบบสมัครสมาชิก (Register) และเข้าสู่ระบบ (Login) ฝั่งหลังบ้านด้วย JWT Token และสร้างระบบตรวจสอบสิทธิ์บทบาท (Role Authentication Middleware) เพื่อรักษาความปลอดภัยให้กับ Endpoints หลังบ้านและหน้าบ้าน

## Acceptance criteria
- [ ] พัฒนา Endpoint `/api/auth/register` และ `/api/auth/login` ในฝั่ง Node.js Serverless API โดยรหัสผ่านผู้ใช้ต้องถูกเข้ารหัสด้วย bcrypt
- [ ] เมื่อล็อกอินสำเร็จ ระบบจะส่ง JWT Token ที่เข้ารหัสข้อมูล `id`, `email`, และ `role` กลับไปให้ Client
- [ ] พัฒนาระบบ Auth Middleware ในฝั่งหลังบ้าน เพื่อกั้นสิทธิ์การยิง Request แยกตาม Role (Customer, Staff, Manager, Admin)
- [ ] พัฒนาหน้าจอเข้าสู่ระบบฟอร์มล็อกอินฝั่งหน้าบ้าน (Frontend Form Interface) และบันทึก Token เก็บไว้ใช้อ้างอิงการยิง Request

## Blocked by
- [Issue 009: Supabase PostgreSQL DDL Setup & Seed Data](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-009-database-implementation.md)
