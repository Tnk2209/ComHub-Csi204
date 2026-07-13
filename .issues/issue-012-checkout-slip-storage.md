# Issue 012: SDLC Phase 4 (Development) - E-Commerce Checkout with Coupon & Slip Upload

## What to build
พัฒนาระบบขั้นตอนสั่งซื้อสินค้า (Checkout) จากสเปคคอมฯ ที่จัดไว้หรือซื้อแยกชิ้นส่วน โดยรองรับการใช้คูปองส่วนลดและการอัปโหลดหลักฐานสลิปชำระเงินโอนเงิน พร้อมตรรกะการตรวจสอบสต็อกสินค้า

## Acceptance criteria
- [ ] พัฒนาระบบตระกร้าสินค้า (Cart Store) และปุ่มสั่งซื้อแยกตามการชำระเงิน โดยลูกค้าสามารถเลือกตัวเลือก "ให้ร้านประกอบให้ (is_assembled)" ได้
- [ ] มีช่องกรอกคูปองส่วนลด และนำโค้ดไปเช็คส่วนลดที่ดึงข้อมูลราคามาคำนวณหักลบยอดรวม (`total_price` และ `discount_amount`)
- [ ] พัฒนาโมดูลอัปโหลดหลักฐานภาพถ่ายสลิปโอนเงิน (Supabase Storage Bucket) โดยเพิ่มระบบ Frontend image compressor บีบอัดเป็น WebP เพื่อประหยัดพื้นที่จัดเก็บ
- [ ] เมื่อสร้างคำสั่งซื้อ (`createOrder`) สำเร็จ:
  - บันทึกสถานะการเงินเริ่มต้น `payment_status` เป็น `'Pending'`
  - หักสต็อกสินค้าไอทีชิ้นส่วนนั้นๆ ในตาราง `products` ทันที (`stock_quantity`)
  - บันทึกล็อกสถานะเบื้องต้นลงในตาราง `order_logs`

## Blocked by
- [Issue 011: PC Builder Module & Compatibility Engine](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-011-pc-builder-logic.md)
