# Issue 015: SDLC Phase 4 (Development) - Wishlist & Back-in-Stock Alert

## What to build
พัฒนาระบบจัดเก็บสินค้าที่ชอบ (Wishlist) ของลูกค้า และตรรกะเปิดรับการส่งสัญญาณแจ้งเตือนการเติมสินค้า (Stock Back Alert) เมื่อสินค้าที่หมดสต็อกถูกเพิ่มเข้ามาในคลังอีกครั้ง

## Acceptance criteria
- [ ] พัฒนาชุดปุ่มและไอคอนรูปหัวใจสำหรับเพิ่มสินค้าเข้าตาราง `wishlist_items` และหน้าประวัติจัดเก็บของโปรด (Wishlist Page) ของลูกค้า
- [ ] หากสินค้ารายการใดใน Wishlist มีจำนวนสต็อกเป็น 0 (`stock_quantity == 0`) ให้เรนเดอร์ปุ่มตัวเลือก "แจ้งเตือนฉันเมื่อมีของ (Enable Stock Alert)" ซึ่งจะสลับค่าธง `is_alert_enabled` ในตารางเป็น `true`
- [ ] พัฒนาตรรกะแจ้งเตือนในระบบหลังบ้าน: เมื่อสินค้าชิ้นใดชิ้นหนึ่งได้รับการกดเพิ่มสต็อกโดยผู้ใช้สิทธิ์ Admin/Manager ส่งผลให้ `stock_quantity > 0` และระบบตรวจพบผู้ใช้ที่ตั้งค่าเตือนไว้ ให้สร้างข้อมูลสัญญาณแจ้งเตือนระบบ
- [ ] แสดงป๊อปอัปแจ้งเตือน (UI toast alert / Notification badge) ที่หน้าต่างการใช้งานของลูกค้าทันทีที่ลงชื่อเข้าใช้ระบบ (Simulated Notification box)

## Blocked by
- [Issue 011: PC Builder Module & Compatibility Engine](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-011-pc-builder-logic.md)
