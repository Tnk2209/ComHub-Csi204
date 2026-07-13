# Issue 011: SDLC Phase 4 (Development) - PC Builder Module & Compatibility Engine

## What to build
พัฒนาโมดูล PC Builder หน้าบ้านและระบบตรวจสอบความเข้ากันได้อัจฉริยะ (Compatibility & TDP Calculator Engines) เพื่อกรองและตรวจสอบชิ้นส่วนฮาร์ดแวร์ที่สอดคล้องกันแบบสดทันทีบนเบราว์เซอร์

## Acceptance criteria
- [ ] พัฒนาหน้าจอจัดสเปคคอมพิวเตอร์ (PC Builder) ฝั่งหน้าบ้าน แยกหมวดหมู่ให้ผู้ใช้งานเลือกสินค้าทีละรายการ (CPU, GPU, RAM, Motherboard, Case, PSU, Storage)
- [ ] ระบบ Compatibility Checker ฝั่งหลังบ้าน/หน้าบ้านตรวจสอบเงื่อนไขดังนี้เมื่อผู้ใช้เลือกชิ้นส่วน:
  - Socket Match: `Motherboard.specifications.socket == CPU.specifications.socket`
  - Form Factor Match: เคสระบุลิสต์ Form factor ที่รองรับเมนบอร์ดนั้นได้
  - GPU Length: `GPU.specifications.gpu_length <= Case.specifications.max_gpu_length`
  - RAM Types Check: บอร์ดและแรมต้องมี `ram_type` ตรงกัน และตัว `supported_ram` (Array) ใน CPU ต้องรองรับแรมชนิดนั้นด้วย
- [ ] ระบบ Wattage Calculator คำนวณค่าไฟ TDP รวมของระบบแบบเรียลไทม์ และล็อคปุ่มหรือแจ้งเตือนแนะนำเฉพาะ Power Supply ที่มีกำลังวัตต์ `PSU.specifications.wattage >= TDP_Total * 1.2` (คิดเผื่อ 20% เพื่อความเสถียร)
- [ ] เขียนชุด Unit Test ครอบคลุมฟังก์ชันการคำนวณและประเมินสเปคไอที (ทั้งชุดทดสอบที่ถูกต้อง และชุดทดสอบที่เลือกคู่ขัดแย้งเชิงตรรกะ)

## Blocked by
- [Issue 010: User Authentication & Role-Based Access Control (RBAC)](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-010-backend-auth-jwt.md)
