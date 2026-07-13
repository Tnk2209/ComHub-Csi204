# Issue 018: SDLC Phase 4 (Development) - Admin Product Catalog CRUD & Accounts Controls

## What to build
พัฒนาฟังก์ชันส่วนการควบคุมหลักสำหรับผู้ดูแลระบบ (Admin Control Board) เพื่อบริหารจัดการข้อมูลรายชื่อสินค้าหลัก เปิด/ปิด การขาย และการจัดการบัญชีผู้ใช้งานระบบสิทธิ์ต่างๆ

## Acceptance criteria
- [ ] พัฒนาแบบฟอร์มการจัดการฐานข้อมูลสินค้าไอทีขั้นพื้นฐาน (Products CRUD Admin Panel) รองรับการระบุค่าพจนานุกรมเชิงเทคนิคเขียนลงในฟิลด์ specifications (JSONB)
- [ ] มีสวิตช์เปิด/ปิดการจำหน่ายสินค้า เพื่อเซ็ตธง `is_active` เป็น `true` หรือ `false` (Soft Delete) โดยผู้ดูแลระบบ
- [ ] พัฒนาระบบคืนสินค้าคงคลังกรณีสลิปมีปัญหา (Stock Rollback on Rejection): เมื่อแอดมินหรือช่างคัดค้านสลิปของลูกค้าและปรับสถานะเงินเป็น `'Rejected'` ระบบจะทำการปรับจำนวนสินค้าคงคลังในตาราง `products` (`stock_quantity`) บวกคืนตามจำนวนในรายการนั้นโดยอัตโนมัติ
- [ ] พัฒนาตัวควบคุมสมาชิกเพื่อเพิ่มบัญชีผู้ใช้งานระดับ Staff และ Manager

## Blocked by
- [Issue 010: User Authentication & Role-Based Access Control (RBAC)](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-010-backend-auth-jwt.md)
