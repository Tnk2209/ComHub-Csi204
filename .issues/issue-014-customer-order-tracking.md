# Issue 014: SDLC Phase 4 (Development) - Customer Order & Assembly Timeline Tracking

## What to build
พัฒนาส่วนติดต่อความเคลื่อนไหวออเดอร์ (Timeline Tracker Widget) หน้าบ้านเพื่อให้ลูกค้าสามารถติดตามกระบวนการจ่ายเงินและงานประกอบ พร้อมเปิดแสดงรายงานตรวจอุณหภูมิความร้อนที่ส่งมาจากช่างเทคนิค

## Acceptance criteria
- [ ] พัฒนาหน้าประวัติการสั่งซื้อ (Customer Order History List) และแถบย่อยรายละเอียดออเดอร์ทีละรายการ
- [ ] มี Widget แสดงความคืบหน้าการทำงาน (Progress Bar 4 ขั้นตอน: Pending ➔ Assembling ➔ Testing ➔ Shipped) โดยคำนวณและดึงประวัติการเปลี่ยนสถานะย้อนหลังจาก `order_logs` มาเรนเดอร์วันที่และระบุเวลาเปลี่ยนสถานะแต่ละขั้น
- [ ] เมื่อออเดอร์ก้าวผ่านขั้นตอนทดสอบ (Testing) หรือส่งมอบพัสดุเรียบร้อย ให้ดึงข้อมูลรายงานความร้อน `cpu_temperature` และ `gpu_temperature` จาก `assembly_records` และเลขขนส่ง Tracking มาเรนเดอร์แสดงบน UI ของลูกค้า
- [ ] ป้องกันความปลอดภัยหน้าบ้านไม่ให้ผู้ใช้แอบอ้างสิทธิ์พยายามแก้ไขคิวข้อมูลของพนักงานและประวัติคนอื่น (ผ่านการเทียบ JWT user_id ในตัวแปร)

## Blocked by
- [Issue 013: Staff Assembly Queue & Burn-in UAT Recording](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-013-staff-order-assembly.md)
