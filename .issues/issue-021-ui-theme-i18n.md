# Issue 021: SDLC Phase 4 (Development) - UI Theme Customization (DarkMode/LightMode) & Internationalization (i18n)

## What to build
พัฒนาฟังก์ชันเสริมความต้องการด้านการใช้งาน (UI Customization) โดยสร้างสวิตช์สำหรับสลับโหมดการแสดงผลสว่าง/มืด (DarkMode & LightMode Switcher) และระบบเปลี่ยนสลับภาษาไทย/ภาษาอังกฤษ (Internationalization - i18n) เพื่อรองรับผู้ใช้ต่างชาติในส่วนหัว (Header Navigation) ของเว็บไซต์

## Acceptance criteria
- [ ] พัฒนาปุ่มไอคอนรูปดวงอาทิตย์/ดวงจันทร์ (Sun/Moon Toggle) บน Header เพื่อเปิดสลับหน้าต่างแสดงผลระหว่างโหมดสีเข้มและโหมดสีสว่าง
- [ ] ใช้ระบบ Dark Mode ของ Tailwind CSS โดยสลับผ่านคลาส `.dark` หรือการสับเปลี่ยนตัวแปร CSS Variables ภายในบล็อก `@theme` เพื่อปรับโทนสีพื้นหลัง สีขอบกล่อง และสีข้อความอย่างราบรื่น
- [ ] พัฒนาปุ่มสลับภาษาไทย/อังกฤษ (TH / EN Button Indicator) บน Header ช่วยปรับคำอธิบายและป้ายระบุสินค้า
- [ ] สร้างชุดคำแปลส่วนกลาง (Locale Translations JSON) สำหรับภาษาไทยและภาษาอังกฤษ ครอบคลุมคำหลักสำคัญ:
  - เมนูหลัก (Catalog, PC Builder, Support, Community)
  - ป้ายตารางอุปกรณ์และปุ่มประมวลผล (TDP power bar, Compatibility status, checkout button)
  - รายละเอียดแบบจำลองใบประเมิน UAT และสถานะการชำระเงิน
- [ ] ระบบบันทึกสถานะการสลับภาษาและโหมดการแสดงผลที่เลือกครั้งล่าสุดลงใน `localStorage` เพื่อดึงกลับมาใช้ซ้ำเมื่อลูกค้าเปิดใช้เว็บครั้งต่อไป

## Blocked by
- [Issue 011: PC Builder Module & Compatibility Engine](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-011-pc-builder-logic.md)
