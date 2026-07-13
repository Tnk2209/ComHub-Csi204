# Issue 020: SDLC Phase 6 & 7 (Deployment & Maintenance) - Production Deployment & Known Issues Document

## What to build
ทำการติดตั้งระบบ ComHub ขึ้นสภาพแวดล้อมใช้งานจริงแบบระบบเว็บเซิร์ฟเวอร์คลาวด์สาธารณะ (Production Deployment) และเขียนคู่มือการซ่อมบำรุงพร้อมKnown Issues Log เพื่อสรุปรายงานปิดโปรเจ็ควิชา csi 204

## Acceptance criteria
- [ ] ติดตั้งซอร์สโค้ดหน้าบ้าน (React SPA) และหลังบ้าน (Express server API) ขึ้นบริการระบบคลาวด์ Vercel สำเร็จสมบูรณ์
- [ ] ตั้งค่าคีย์ตัวแปรระบบ (Environment Variables) เชื่อมโยง Supabase Database URL และ JWT Secret Key บนระบบจริงอย่างปลอดภัย
- [ ] ทดสอบยิงทดสอบระบบบน URL จริง และกรอกข้อมูลจัดสเปคคอม/แนบสลิปผ่านทาง URL คลาวด์จริงและสามารถเรียกอ่านข้อมูลสำเร็จ
- [ ] จัดทำเอกสารคู่มือบันทึก Known Issues และแผนงานพัฒนาปรับปรุงระบบต่อยอดในอนาคต (เช่น การต่อยอดระบบรับชำระเงินอัตโนมัติ และระบบคำนวณปริมาณลมระบายอากาศ)

## Blocked by
- [Issue 019: Integrated Security Scans & Performance Profiling](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-019-security-performance-checks.md)
