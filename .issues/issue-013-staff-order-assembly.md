# Issue 013: SDLC Phase 4 (Development) - Staff Assembly Queue & Burn-in UAT Recording

## What to build
พัฒนาหน้าจอคิวประกอบเครื่องและบันทึกคุณภาพทางเทคนิคสำหรับพนักงานประกอบคอมพิวเตอร์ (Staff Control Panel) เพื่อจัดการดูแลงานประกอบและทดสอบก่อนเปลี่ยนผ่านส่งสินค้า

## Acceptance criteria
- [ ] พัฒนาหน้าจอแดชบอร์ดงานประกอบ (Assembly Queue) สำหรับ Staff แสดงเฉพาะออเดอร์ที่สั่งประกอบเครื่อง (`is_assembled = true`) และชำระเงินเรียบร้อยแล้ว (`payment_status = 'Approved'`)
- [ ] ช่างจัดประกอบคอมฯ สามารถกดเปลี่ยนสถานะงานประกอบออเดอร์เป็น `'Assembling'` และ `'Testing'`
- [ ] เมื่ออยู่ในขั้นตอน `'Testing'` มีฟอร์มให้ Staff กรอกรายงานผล UAT ลงตาราง `assembly_records` ได้แก่:
  - อุณหภูมิความร้อนสะสม CPU Temperature (decimal)
  - อุณหภูมิความร้อนสะสม GPU Temperature (decimal)
  - ผลประเมินการรันระบบ Burn-in Test (Pass / Fail)
  - โน้ตข้อความระบุหมายเหตุทางฮาร์ดแวร์
- [ ] ช่างสามารถเปลี่ยนสถานะออเดอร์เป็น `'Shipped'` พร้อมป้อนเลขพัสดุ (Tracking Number) โดยทุกสเต็ปสลับเปลี่ยนสถานะจะต้องเขียนประวัติบันทึกอัตโนมัติลงในตาราง `order_logs`

## Blocked by
- [Issue 012: E-Commerce Checkout with Coupon & slip Upload](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-012-checkout-slip-storage.md)
