# Issue 006: SDLC Phase 3 (Design) - UI/UX Wireframe & Figma Mockups

## What to build
ออกแบบโครงร่างส่วนติดต่อผู้ใช้งาน (UI/UX Mockups & Wireframes) ของระบบ ComHub ทั้งหมดในฝั่ง Customer, Staff, Manager และ Admin เพื่อรองรับการทำงานในแบบ Fullscreen Responsive และเป็นแนวทางในการเขียนสไตล์ด้วย CSS ใน Phase ถัดไป

## Acceptance criteria
- [x] มีเอกสารหรือลิงก์รูปภาพโครงร่างการแสดงผล (Figma/Wireframes) ของหน้าจอหลักครบถ้วน:
  - หน้าแสดงรายการสินค้าและเปรียบเทียบสเปค (Catalog Page)
  - หน้าจัดสเปคคอมพิวเตอร์อัจฉริยะ (PC Builder Workspace)
  - หน้าประวัติและติดตามสถานะออเดอร์ของลูกค้า (Customer Order Tracking & UAT Results)
  - หน้าจัดการคิวประกอบและกรอกผลทดสอบของช่าง (Staff Assembly Queue)
  - หน้าต่างแกลเลอรี่และปุ่มกดโคลนสเปค (PC Build Gallery & Cloning Interface)
- [ ] การเลือกชุดสี (Theme Colors) ต้องสอดคล้องกับข้อกำหนดระบบ: ไม่มีสีม่วง/สีไวโอเล็ตโดยเด็ดขาด เน้นดีไซน์ระดับพรีเมียมสีเข้ม/คลาสสิก (Sleek Dark/Harmonious colors)
- [ ] โครงสร้างปุ่มกดและระยะห่างเป็นไปตามกฎ UX Laws (Hick's Law สำหรับคัดเลือกหมวดหมู่ชิ้นส่วน, Fitts's Law สำหรับตำแหน่งปุ่ม Add to Cart/Checkout)

## Figma Design Details (รายละเอียดหน้าตาเว็บตามดีไซน์ Figma)
- **ลิงก์โครงการ:** [Figma - ComHub Design](https://www.figma.com/design/zf5S2YxamVRHNaeoE1J54j/Untitled?node-id=0-1&p=f&t=KRCm3kU3n9biGjB1-0)
- **ชุดสีและสไตล์การตกแต่ง (Theme & Palette):** 
  - ใช้ **Sleek Dark Mode** เป็นสีพื้นหลังหลัก (ดาร์กช็อกโกแลต/เทาดำเกือบสนิท) 
  - ใช้ **Carbon/Turquoise Blue (#138X/00C2FF)** เป็นสีเน้นเด่น (Accent Color) ในการติดสถานะ Active, ขอบกล่องข้อความ และปุ่มสำคัญ เพื่อให้หลีกเลี่ยงสีม่วงตามกฎ Purple Ban
  - เลือกใช้ฟอนต์ตัวอักษรแนวเทคโนโลยีที่มีความลื่นไหล สะอาดตา อ่านง่าย
- **หน้าจอจัดสเปคคอมพิวเตอร์ (PC Builder Layout):**
  - **ฝั่งซ้าย (System Configuration):** ตารางไอเทมแนวตั้ง 7 ชนิดอุปกรณ์หลัก แสดงภาพสินค้า รายละเอียดชื่อ ปุ่มตัวเลือก `+ Select` หรือปุ่มถังขยะสำหรับเคลียร์สินค้าออก
  - **ฝั่งขวา (Analysis Board):** 
    - *Health Check:* แสดงข้อความรับรองสเปค (เช่น Socket Match ผ่าน, เตือนเวอร์ชัน BIOS, เช็คความยาวเคสกับ GPU)
    - *Power Analysis:* แถบวัดกำลังวัตต์ TDP มีแถบความก้าวหน้า (Progress Bar) คำนวณไฟสะสม และเตือนระดับความปลอดภัย 80%
    - *Performance Badges:* กล่องแสดงผลคาดการณ์ความแรงในระดับความละเอียด เช่น "4K GAMING: 144 FPS" และฉลากความประหยัดไฟระดับ "Gold"
- **หน้ารายละเอียดอุปกรณ์ (Product Detail Layout):**
  - แสดงภาพสินค้าขนาดใหญ่ด้านซ้าย พร้อมสเปคทางเทคนิคหลักที่เป็นกล่อง Grid สี่เหลี่ยมเรียงแยกคีย์ชัดเจน (Chipset, Memory type, Clock Speed)
  - แนบการ์ดสรุปโครงสร้างความร้อนและทิศทางลมระบาย (Advanced Cooling Architecture) โชว์ความพรีเมียมของระบบ
- **หน้าติดตามออเดอร์ (Order Timeline Tracking Layout):**
  - แถบความคืบหน้านำส่งสินค้า 4 ขั้นตอน แสดงไอคอนและสีเปลี่ยนตามขั้นที่ทำเสร็จ
  - ด้านล่างมีแผง UAT Report แสดงตัวเลขอุณหภูมิ CPU/GPU ที่ช่างบันทึกความร้อนจริงจากการเทสระบบหลังบ้าน

## 🚀 แผนขั้นตอนการพัฒนา MockUp หน้าจอ (Frontend MockUp Development Phases)
- **Phase 1: Customer Shopping Experience (รายการสินค้าและรายละเอียดชิ้นส่วนเดี่ยว)**
  - [ ] Page 1.1: Home & Product Catalog (เปรียบเทียบ 3 อุปกรณ์, กรองประเภท)
  - [ ] Page 1.2: Product Detail (รายละเอียดการระบายความร้อน, สเปคเทคนิค)
- **Phase 2: PC Builder & Checkout (ตรรกะจัดสเปคและการชำระเงินแนบสลิป)**
  - [ ] Page 1.3: Advanced PC Builder Workspace (เลือกอุปกรณ์ 7 ชิ้น, แถบ TDP Calculator, กฎ Compatibility)
  - [ ] Page 1.4: Cart & Checkout (คูปอง, แนบสลิปโอนเงิน WebP, ตัวเลือกให้ร้านประกอบ)
- **Phase 3: Order Tracking & Wishlist (ไทม์ไลน์ติดตาม UAT และรายการของโปรด)**
  - [ ] Page 1.5: Order Tracking & UAT (ไทม์ไลน์ประกอบ 4 สเต็ป, เลขความร้อนช่าง CPU/GPU)
  - [ ] Page 1.6: Wishlist & Alerts (ของโปรด, ปุ่มขอเปิดสัญญาณเตือนสต็อกเติมของ)
- **Phase 4: Community Gallery (แกลเลอรี่บอร์ดแชร์และระบบโคลนสเปค)**
  - [ ] Page 1.7: PC Build Gallery (บอร์ดอวดคอมฯ, โคลนสเปค, Badge สินค้าปิดขาย)
- **Phase 5: Staff Control Center (การจัดการคิวประกอบและทดสอบของช่าง)**
  - [ ] Page 2.1: Staff Assembly Queue (คิวเตรียมจัดประกอบเครื่องเฉพาะบิล Approved)
  - [ ] Page 2.2: UAT & Shipping Logs Form (กรอกอุณหภูมิ CPU/GPU Temp, ผล Pass/Fail, เลข Tracking)
- **Phase 6: Manager Back-office (แผงควบคุมสถิติ แนะนำสเปค และกรองข้อความ)**
  - [ ] Page 3.1: Manager Business Dashboard (สรุปผลยอดขาย, สถิติสินค้าขายดี, สต็อกต่ำเตือนใกล้หมด <= 3)
  - [ ] Page 3.2: Pre-built Templates CRUD Panel (สร้างเซ็ตแนะนำสำเร็จรูปตามงบ)
  - [ ] Page 3.3: Moderation Board (คัดกรองรูปและรีวิวจากผู้ใช้ทั่วไป)
- **Phase 7: Admin Systems & Controls (การจัดการสินค้า บัญชีพนักงาน และการโรลแบ็กสต็อก)**
  - [ ] Page 4.1: Admin Products CRUD Panel (เพิ่มลบสินค้า, สเปคเทคนิค JSONB, สวิตช์ปิด/เปิดขาย Soft Delete)
  - [ ] Page 4.2: Accounts Controls Panel (สร้างและคุมสิทธิ์ไอดี Staff/Manager)
  - [ ] Page 4.3: Payment Review & Stock Controller (ตรวจสลิป Approved, Reject บิลปลอมพร้อมระบบคืนสต็อกอัตโนมัติ)

## Blocked by
None - can start immediately
