# Issue 019: SDLC Phase 5 (Testing) - Integrated Security Scans & Performance Profiling

## What to build
รันการทดสอบภาพรวมด้านประสิทธิภาพการใช้งาน (Lighthouse / Core Web Vitals Audit) และการสแกนความมั่นคงปลอดภัยไซเบอร์ (Vulnerability Security Scanning) ทั่วทั้งโปรเจ็คก่อนดำเนินการติดตั้งโปรดักชั่น

## Acceptance criteria
- [ ] รันสคริปต์สแกนตรวจสอบความปลอดภัยของ JWT Authentication, สิทธิ์ RBAC ป้องกัน ID แอบอ้าง และรหัสผ่านที่เข้ารหัสผ่านสคริปต์:
  ```bash
  python .agents/skills/vulnerability-scanner/scripts/security_scan.py .
  ```
- [ ] รันเครื่องมือตรวจสอบ UI/UX ประสิทธิภาพและการเข้าถึงหน้า PC Builder (Accessibility) ให้รองรับความเสถียรผ่านสคริปต์:
  ```bash
  python .agents/skills/frontend-design/scripts/ux_audit.py .
  ```
- [ ] รันการตรวจสอบหน้าเว็บสปีดและดัชนีประสิทธิภาพ Core Web Vitals ได้ผลลัพธ์ผ่านความกังวล
- [ ] จัดทำตารางรายการแก้ไขจุดบกพร่อง (Bug Tracker List) และบันทึก UAT Test Case ผลลัพธ์การรันแบบจำลองการใช้งานเสมือนจริงของลูกค้า (Customer UAT Flows) ครบถ้วนลงโฟลเดอร์สำหรับทำเล่มรายงาน

## Blocked by
- [Issue 013: Staff Assembly Queue & Burn-in UAT Recording](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-013-staff-order-assembly.md)
- [Issue 014: Customer Order & Assembly Timeline Tracking](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-014-customer-order-tracking.md)
- [Issue 015: Wishlist & Back-in-Stock Alert](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-015-wishlist-stock-alert.md)
- [Issue 016: PC Build Gallery & Spec Cloning](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-016-pc-build-gallery.md)
- [Issue 017: Manager Pre-built Templates & Moderation Dashboard](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-017-manager-templates-dashboard.md)
- [Issue 018: Admin Product Catalog CRUD & Accounts Controls](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-018-admin-product-crud.md)
