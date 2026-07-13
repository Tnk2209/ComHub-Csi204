# Issue 017: SDLC Phase 4 (Development) - Manager Pre-built Templates & Moderation Dashboard

## What to build
พัฒนาฟังก์ชันส่วนหลังบ้านสำหรับผู้จัดการร้าน (Manager Dashboard Control) เพื่อสร้างชุดจัดสเปคแนะนำของร้าน ตรวจสอบและคัดกรองสื่อรูปภาพจากลูกค้า และรายงานสรุปยอดขายภาพรวม

## Acceptance criteria
- [ ] พัฒนาฟังก์ชันการสร้างเซ็ตแนะนำสำเร็จรูป (Pre-built Templates CRUD) โดยผู้จัดการสามารถสร้างหัวข้อสเปค แบรนด์งบประมาณ ดึงข้อมูลชิ้นส่วนอุปกรณ์ไอทีในคลังมาผูกกับเทมเพลต และจัดเรียงความสัมพันธ์ในตาราง `template_items`
- [ ] พัฒนาระบบตรวจสอบภาพรีวิวและโพสต์แกลเลอรี่ (Moderation Panel) โดยแสดงสไลด์ภาพที่ลูกค้าอัปโหลดเข้ามา และปุ่มเลือก "อนุมัติเปิดเผยสาธารณะ (Approve)" หรือ "ปฏิเสธ/ซ่อนรูปภาพ (Reject)" ซึ่งจะไปอัปเดตสเตตัสในตาราง `reviews` และ `gallery_posts`
- [ ] พัฒนาหน้าจอสรุปภาพรวม (Manager Dashboard):
  - แดชบอร์ดตัวเลขสรุปผลยอดขายรวม (ดึงยอดสั่งซื้อสำเร็จ)
  - รายการสินค้าไอทีขายดีที่สุดเรียงตามสถิติจำนวนชิ้น
  - รายการเตือนสินค้าในคลังใกล้หมดสต็อก (สินค้าที่ `stock_quantity <= 3`)

## Blocked by
- [Issue 012: E-Commerce Checkout with Coupon & slip Upload](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-012-checkout-slip-storage.md)
