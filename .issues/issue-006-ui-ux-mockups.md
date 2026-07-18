# Issue 006: SDLC Phase 3 (Design) - UI/UX Wireframe & Figma Mockups

## What to build
ออกแบบโครงร่างส่วนติดต่อผู้ใช้งาน (UI/UX Mockups & Wireframes) ของระบบ ComHub ทั้งหมดในฝั่ง Customer, Staff, Manager และ Admin เพื่อรองรับการทำงานในแบบ Fullscreen Responsive และเป็นแนวทางในการเขียนสไตล์ด้วย CSS ใน Phase ถัดไป

## Design Rules Reference
**🎨 ทุกหน้า Frontend ต้องปฏิบัติตาม:** [Design Rules — iOS-Inspired Style Guide](./design-rules-ios-style.md)

### Key Requirements Summary (จาก Design Rules):
- ✅ **Style:** iOS-inspired — friendly yet professional, layered depth, shadow-based cards
- ✅ **Responsive:** รองรับ Mobile (sm), Tablet (md-lg), Desktop (xl+) ทุกหน้า
- ✅ **i18n:** รองรับภาษาไทย (th) และอังกฤษ (en) ผ่าน `t()` ทุกข้อความ
- ✅ **Theme:** รองรับ Light Mode และ Dark Mode ผ่าน CSS variables ทุกหน้า
- ✅ **Typography:** Plus Jakarta Sans (headings), Noto Sans Thai + SF-fallback (body)
- ✅ **Color System:** iOS Semantic Colors (ห้ามใช้สีม่วง/ไวโอเล็ตเด็ดขาด)
- ✅ **Accessibility:** Contrast ratio 4.5:1+, touch targets 44x44px minimum, keyboard navigation
- ✅ **Component Pattern:** Grouped list style, glassmorphism nav, rounded-xl corners

**📖 อ่านเอกสารฉบับเต็ม:** [design-rules-ios-style.md](./design-rules-ios-style.md)

## Acceptance criteria
- [x] มีเอกสารหรือลิงก์รูปภาพโครงร่างการแสดงผล (Figma/Wireframes) ของหน้าจอหลักครบถ้วน:
  - หน้าแสดงรายการสินค้าและเปรียบเทียบสเปค (Catalog Page)
  - หน้าจัดสเปคคอมพิวเตอร์อัจฉริยะ (PC Builder Workspace)
  - หน้าประวัติและติดตามสถานะออเดอร์ของลูกค้า (Customer Order Tracking & UAT Results)
  - หน้าจัดการคิวประกอบและกรอกผลทดสอบของช่าง (Staff Assembly Queue)
  - หน้าต่างแกลเลอรี่และปุ่มกดโคลนสเปค (PC Build Gallery & Cloning Interface)
- [x] การเลือกชุดสี (Theme Colors) ต้องสอดคล้องกับข้อกำหนดระบบ: iOS Semantic Colors พร้อม Purple Ban (ห้ามใช้สีม่วง/ไวโอเล็ตเด็ดขาด)
- [x] โครงสร้างปุ่มกดและระยะห่างเป็นไปตามกฎ UX Laws (Hick's Law สำหรับคัดเลือกหมวดหมู่ชิ้นส่วน, Fitts's Law สำหรับตำแหน่งปุ่ม Add to Cart/Checkout)
- [x] มีเอกสาร Design Rules ครบถ้วน กำหนดสไตล์, responsive, i18n, theme support อย่างชัดเจน

## Figma Design Details (รายละเอียดหน้าตาเว็บตามดีไซน์ Figma)
- **ลิงก์โครงการ:** [Figma - ComHub Design](https://www.figma.com/design/zf5S2YxamVRHNaeoE1J54j/Untitled?node-id=0-1&p=f&t=KRCm3kU3n9biGjB1-0)

> **⚠️ IMPORTANT:** รายละเอียดสไตล์ทั้งหมดถูกย้ายไปยัง [Design Rules](./design-rules-ios-style.md)  
> เอกสารนี้เก็บเฉพาะโครงสร้างหน้าจอ — สำหรับสี, ฟอนต์, component patterns ดูที่ Design Rules

- **ชุดสีและสไตล์การตกแต่ง:** ดู [§2. Color System](./design-rules-ios-style.md#2-color-system--ios-semantic-colors) ใน Design Rules
- **ระบบภาษา (i18n):** ดู [§9. Internationalization](./design-rules-ios-style.md#9-internationalization-i18n) ใน Design Rules
- **ฟอนต์หลัก (Typography):** ดู [§3. Typography System](./design-rules-ios-style.md#3-typography-system) ใน Design Rules
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

### Phase 1: Customer Pages (หน้าระบบฝั่งลูกค้า - 7 หน้าย่อย)

> **📋 Design Rules Checklist สำหรับทุกหน้า:**  
> ก่อนเริ่มพัฒนาหน้าใดๆ ต้องตรวจสอบ [Design Rules §13. Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ทุกข้อ

- [x] **Page 1.1: Home & Product Catalog Page (หน้าแรกและหน้ารายการสินค้าแค็ตตาล็อก)**
  - **วัตถุประสงค์:** หน้าแรกในการนำเสนอแบรนด์ ค้นหาข้อมูลชิ้นส่วนไอที และปูทางเข้าสู่ระบบ PC Builder
  - **องค์ประกอบหลักบน UI:**
    - แบนเนอร์โปรโมชั่น ป้ายสไลด์เซ็ตแนะนำเด่นของร้าน
    - กล่องค้นหา (Search Box) และตัวเลือกสับประเภทสินค้า (CPU, GPU, RAM, Motherboard, Case, PSU, Storage)
    - ปุ่มหยิบใส่ตะกร้าทันที (Add to Cart) และปุ่มรายการของโปรดรูปหัวใจ (Wishlist)
    - แผงเปรียบเทียบคุณสมบัติ (Product Compare Panel) รองรับการดึงข้อมูล 3 อุปกรณ์มาเทียบกันด้านราคากลางและประสิทธิภาพ
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [ ] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [ ] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [ ] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [ ] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [ ] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [ ] จัดวางองค์ประกอบสอดคล้องตามกฎ Fitts's Law (ตีนขอบและจุดสนใจสำหรับ Add to Cart)
- [ ] **Page 1.2: Product Detail Page (หน้ารายละเอียดสินค้าชิ้นเดี่ยว)**
  - **วัตถุประสงค์:** แสดงข้อมูลเชิงเทคนิคเชิงลึกและเกณฑ์คะแนนความพึงพอใจของสินค้าชิ้นเดียว
  - **องค์ประกอบหลักบน UI:**
    - รูปภาพและข้อมูลราคา คีย์ Specifications (เช่น ชนิด RAM, ขั้วซ็อกเก็ต)
    - กล่องแสดงรีวิว ความคิดเห็น และรูปถ่ายสินค้าจริงจากบ้าน
    - ปุ่มกดแอดสินค้าเข้า Wishlist และเปิดธงขอสัญญาณเตือนเมื่อสต็อกสินค้ากลับมาใหม่
    - การ์ดสรุปโครงสร้างความร้อนและทิศทางลมระบาย (Advanced Cooling Architecture)
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Grouped Card Pattern ตาม [§4](./design-rules-ios-style.md#4-component-patterns--ios-grouped-list-style)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [x] รองรับ i18n (TH/EN) และ Light/Dark Theme
    - [x] แสดงรายละเอียดข้อมูลเทคนิคเป็น Grid ชัดเจนและอ่านง่าย
- [x] **Page 1.3: Advanced PC Builder Workspace (หน้าจอจัดสเปคคอมพิวเตอร์อัจฉริยะ)**
  - **วัตถุประสงค์:** เครื่องมือหลักในการจัดชุดคอมพิวเตอร์ด้วยการตรวจสเปคและกำลังไฟแบบกึ่งเรียลไทม์
  - **องค์ประกอบหลักบน UI:**
    - ตารางรายหมวดหมู่ทั้ง 7 อุปกรณ์หลัก พร้อมปุ่มกด "เลือกอุปกรณ์" ที่จะเปิดป๊อปอัปให้เลือกจากหมวดหมู่นั้นๆ
    - ตัวคำนวณกำลังไฟสะสม (TDP Calculator Progress Bar) แสดงระดับวัตต์ที่กินไฟ และแนะนำเฉพาะ PSU ที่จ่ายไฟเพียงพอพร้อมตัวคูณความปลอดภัย 20%
    - กล่องตรรกะ Compatibility Checker คอยเตือนสเปคที่เสียบใช้งานร่วมกันไม่ได้ (เช่น Socket ไม่ตรงกัน หรือแรมกับบอร์ดต่างประเภท)
    - ปุ่ม "สั่งซื้อชุดนี้ (Checkout System)" หรือ "จัดเซ็ตแชร์สู่คอมมูนิตี้ (Share to Gallery)"
    - กล่องวิเคราะห์ประสิทธิภาพ (Performance Badges) เช่น "4K GAMING: 144 FPS" และฉลาก "Gold" ประหยัดพลังงาน
  - **เกณฑ์การตรวจสอบดีไซน์:** *(Code-first approach — implement แล้วใน [PCBuilder.jsx](../FrontEnd/src/pages/PCBuilder/PCBuilder.jsx))*
    - [x] ออกแบบและ implement เสร็จสมบูรณ์ด้วย code (3-column hybrid layout ตาม commit `adac720`)
    - [x] ✅ เปลี่ยนจาก border-based cards → shadow-based iOS grouped cards ตาม [§4](./design-rules-ios-style.md#4-component-patterns--ios-grouped-list-style)
    - [x] ✅ อัพเดทสีเป็น iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors) — ใช้ `bg-blue`, `text-blue` แทน `brand-blue`
    - [x] รองรับ i18n (TH/EN) — มีอยู่แล้ว
    - [x] รองรับ Light/Dark Theme — มีอยู่แล้ว
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) — มีอยู่แล้ว
    - [x] จัดวางแบบซ้าย-ขวาอย่างชัดเจน (ซ้าย: รายการของ 7 ชิ้น, ขวา: แผง TDP และ Compatibility Analyzer)
    - [x] ปฏิบัติตามกฎ Hick's Law ในการจัดเรียงประเภทชิ้นส่วนเพื่อให้ผู้ใช้เลือกง่ายที่สุด
- [x] **Page 1.4: Cart & Checkout Page (หน้าตะกร้าสินค้าและการดำเนินการสั่งซื้อ)**
  - **วัตถุประสงค์:** หน้าตรวจสอบชิ้นส่วน ยอดราคารวม และแนบสลิปโอนเงินชำระสินค้า
  - **องค์ประกอบหลักบน UI:**
    - ตารางสรุปราคา ชิ้นส่วน ค่าจัดส่ง
    - สวิตช์เลือก "ให้ร้านประกอบและเทสเครื่องให้ (+0 บาท)" หรือ "แยกชิ้นส่งธรรมดา"
    - ช่องกรอกคูปองส่วนลดเพื่อคำนวณยอดเงินใหม่
    - ภาพ QR Code บัญชีการโอน และช่องอัปโหลดรูปถ่ายหลักฐานสลิปเงินพร้อมระบบบีบอัดภาพเป็น WebP ทันที
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Grouped Card Pattern ตาม [§4](./design-rules-ios-style.md#4-component-patterns--ios-grouped-list-style)
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [x] แบบฟอร์มกรอกข้อมูลและการอัปโหลดไฟล์หลักฐานใช้งานง่าย มี Visual Feedback ชัดเจน
- [x] **Page 1.5: Order Tracking & UAT Page (หน้าประวัติสั่งซื้อและติดตามสถานะประกอบ)**
  - **วัตถุประสงค์:** แดชบอร์ดของลูกค้าในการเช็คความเคลื่อนไหวออเดอร์และการเทสอุณหภูมิเครื่องประกอบ
  - **องค์ประกอบหลักบน UI:**
    - แถบไทม์ไลน์ภาพ 4 ขั้นตอน: `[รับออเดอร์] -> [กำลังประกอบ] -> [กำลังเทสระบบ] -> [จัดส่งแล้ว]` ดึงวันเวลาบันทึกจริงมาจากล็อกประวัติ
    - หน้าจอแสดงผล UAT: เมื่ออยู่ในขั้นเทสระบบ จะเปิดเผยเลขอุณหภูมิ CPU/GPU และโน้ตบันทึกสุขภาพเครื่องจากช่าง
    - เลข Tracking นำส่งพัสดุ
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [x] แถบไทม์ไลน์ 4 ขั้นตอน แสดงการเปลี่ยนสถานะตามสีและไอคอนอย่างสวยงามชัดเจน
- [x] **Page 1.6: Wishlist & Alerts Page (หน้ารวมของโปรดและการตั้งเตือนของเติมสต็อก)**
  - **วัตถุประสงค์:** จัดเก็บชิ้นส่วนที่กดใจไว้ และดูป๊อปอัปพุชแจ้งเตือนคลังสินค้า
  - **องค์ประกอบหลักบน UI:**
    - รายการของเล่นไอทีที่บันทึกไว้
    - ป้าย Badges สัญญาเตือนสินค้าใกล้หมด/หมดชั่วคราว
    - สวิตช์เปิดรับสัญญาณแจ้งเตือนสต็อก (Stock Alert) ซึ่งระบบจะยิงป๊อปอัปพุชบอร์ดแจ้งเตือนเมื่อสต็อกสินค้ากลับมามากกว่า 0
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
- [x] **Page 1.7: PC Build Gallery Board (หน้าแกลเลอรี่คอมมูนิตี้)**
  - **วัตถุประสงค์:** แหล่งรวมคอมพิวเตอร์ประกอบเสร็จของสมาชิกและระบบก๊อปปี้สเปค
  - **องค์ประกอบหลักบน UI:**
    - บอร์ดรวมโพสต์ แสดงชื่อคอม หัวเรื่อง และยอดจำนวนถูกใจ (Like)
    - ปุ่มกด "โคลนสเปคไปจัดแต่งต่อ (Edit with this Build)" เพื่อนำชิ้นส่วนทั้งหมดเข้า PC Builder อัตโนมัติ
    - มีระบบติดป้าย Badge สีส้ม `[เลิกจำหน่าย]` ข้างชื่อสินค้าที่ปิดการขายไปแล้ว เพื่อแจ้งให้เลือกตัวอื่นทดแทน
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Grouped Card Pattern ตาม [§4](./design-rules-ios-style.md#4-component-patterns--ios-grouped-list-style)
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [x] การ์ดรายการประกอบคอมพิวเตอร์มีความสวยงาม ดูน่าใช้งาน มีระบุป้าย Badge ครบถ้วน

### Phase 2: Staff Pages (หน้าระบบฝั่งช่างประกอบ - 2 หน้าย่อย)
- [x] **Page 2.1: Staff Assembly Queue Page (หน้าจอคิวงานจัดประกอบคอมพิวเตอร์)**
  - **วัตถุประสงค์:** คัดเลือกใบสั่งประกอบตามคิวออเดอร์ลูกค้าที่ชำระเงินเรียบร้อยแล้ว
  - **องค์ประกอบหลักบน UI:**
    - รายการคำสั่งซื้อเรียงลำดับเวลาที่ต้องการประกอบ (`is_assembled = true` และ `payment_status = 'Approved'`)
    - ปุ่มกดยอมรับเพื่อเริ่มจัดทำ (เปลี่ยนสเตตัสเป็น Assembling และ Testing)
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
- [x] **Page 2.2: UAT & Shipping Logs Form (หน้าฟอร์มบันทึกคุณภาพ UAT และเลขนำส่งพัสดุ)**
  - **วัตถุประสงค์:** รายงานข้อมูลผลเทสอุณหภูมิความร้อนและเลขขนส่งพัสดุ
  - **องค์ประกอบหลักบน UI:**
    - ช่องกรอกตัวเลขค่าความร้อนสะสม CPU Temperature และ GPU Temperature
    - วิทยุสเตตัสให้เลือกติ๊กผลประเมิน Burn-in Test: Pass หรือ Fail และกล่องข้อความโน้ตหมายเหตุ
    - ช่องกรอกเลข Tracking ขนส่งเพื่อเปลี่ยนสถานะเสร็จสิ้นเป็น Shipped
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [x] รูปแบบฟอร์มบันทึกข้อมูลออกแบบปุ่มตัวเลือกและหน้ากากป้อนข้อมูลที่สะดวกสำหรับทำงานหน้างาน

### Phase 3: Manager Pages (หน้าระบบฝั่งผู้จัดการ - 3 หน้าย่อย)
- [x] **Page 3.1: Manager Business Dashboard (หน้าสรุปสถิติวิเคราะห์ระบบภาพรวม)**
  - **วัตถุประสงค์:** แผงควบคุมติดตามสถานะสินค้า ยอดขาย และจุดสต็อกเตือนภัย
  - **องค์ประกอบหลักบน UI:**
    - กราฟ/ตัวเลขสรุปผลยอดขายรวมสะสมดึงจากใบสั่งซื้อสำเร็จ
    - รายการสินค้าไอทีที่มียอดความต้องการชิ้นส่วนสะสมยอดนิยมมากที่สุด
    - รายการแจ้งเตือนคลังใกล้ขาดแคลนสินค้า (เตือนสินค้าที่คงเหลือ `stock_quantity <= 3` ชิ้น)
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
    - [x] แสดงแผงควบคุมสถิติในแบบ Bento Grid มีการเปรียบเทียบข้อมูลที่อ่านง่าย
- [x] **Page 3.2: Pre-built Templates CRUD Panel (หน้าต่างควบคุมและสร้างสเปคคอมแนะนำของร้าน)**
  - **วัตถุประสงค์:** เมนูสร้างโปรโมชั่นเซ็ตคอมพิวเตอร์ประกอบสำเร็จรูปตามงบเพื่อกระตุ้นยอดขาย
  - **องค์ประกอบหลักบน UI:**
    - ฟอร์มใส่ชื่อเซ็ตคอม คีย์กลุ่มแท็กงบประมาณ และป้อนคำอธิบายประสิทธิภาพ
    - หน้าต่างค้นหาชิ้นส่วนฮาร์ดแวร์ไอทีในคลังสต็อกเพื่อจัดเซ็ตและผูกลงตารางสัมพันธ์
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
- [x] **Page 3.3: Moderation Board (หน้าต่างคัดกรองรูปถ่ายรีวิวและแกลเลอรี่คอมมูนิตี้)**
  - **วัตถุประสงค์:** กลั่นกรองความสุภาพของภาพถ่ายที่อัปโหลดโดยผู้ใช้ทั่วไป
  - **องค์ประกอบหลักบน UI:**
    - ตารางรวมสื่อภาพถ่ายรีวิวเดี่ยวและแกลเลอรี่คอมฯ ที่ลูกค้าแชร์ในสถานะ Pending
    - ปุ่มกดเลือกระหว่าง "อนุมัติเผยแพร่ (Approve)" หรือ "ซ่อน/ปฏิเสธสื่อ (Reject)"
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)

### Phase 4: Admin Pages (หน้าระบบฝั่งผู้ดูแลระบบ - 3 หน้าย่อย)
- [x] **Page 4.1: Admin Products CRUD Panel (หน้าต่างจัดการแค็ตตาล็อกและปิดตัวสินค้าไอที)**
  - **วัตถุประสงค์:** บริหารจัดการรายการสินค้าหลักของร้านค้า
  - **องค์ประกอบหลักบน UI:**
    - ฟอร์มเพิ่ม/แก้ไข/ลบรายการสินค้า และระบุค่าข้อมูลเทคนิคเขียนลง specifications JSONB
    - สวิตช์เปิด/ปิด การวางจำหน่ายสินค้าเดี่ยว (`is_active` Soft Delete)
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
- [x] **Page 4.2: Accounts Controls Panel (หน้าต่างจัดการสิทธิ์ผู้ใช้งาน)**
  - **วัตถุประสงค์:** สร้างไอดีและควบคุมสิทธิ์ใช้งานหลังบ้านของพนักงาน
  - **องค์ประกอบหลักบน UI:** แบบฟอร์มกรอกชื่อ รหัสผ่าน และการเลือกกำหนดสิทธิ์พนักงานประกอบเครื่อง (Staff) หรือผู้จัดการ (Manager)
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)
- [x] **Page 4.3: Payment Review & Stock Controller (หน้าต่างอนุมัติยอดโอนเงินและการโรลแบ็กสินค้า)**
  - **วัตถุประสงค์:** ตรวจทานความถูกต้องธุรกรรมทางการเงินของลูกค้า
  - **องค์ประกอบหลักบน UI:**
    - สไลด์เปิดภาพสลิปโอนเงินประกอบกับยอดรวมสั่งซื้อของลูกค้า
    - ปุ่มกดตรวจสอบและยอมรับทางการเงินเพื่อส่งคิวต่อช่าง (`Approved`)
    - ปุ่มกดสั่งยกเลิกสลิปการเงินปลอม (`Rejected`) *(Stock Rollback ยังไม่ implement อัตโนมัติ — gap feature, ดู prd.md §7)*
  - **เกณฑ์การตรวจสอบดีไซน์:**
    - [x] ออกแบบ Wireframe/Mockup เสร็จสมบูรณ์
    - [x] ✅ ปฏิบัติตาม [Design Rules Implementation Checklist](./design-rules-ios-style.md#13-implementation-checklist) ครบทุกข้อ
    - [x] ใช้ iOS Semantic Colors ตาม [§2](./design-rules-ios-style.md#2-color-system--ios-semantic-colors)
    - [x] รองรับ i18n (TH/EN) ตาม [§9](./design-rules-ios-style.md#9-internationalization-i18n)
    - [x] รองรับ Light/Dark Theme ตาม [§8](./design-rules-ios-style.md#8-theme-system)
    - [x] รองรับ Responsive (Mobile/Tablet/Desktop) ตาม [§7](./design-rules-ios-style.md#7-responsive-behavior)


## Blocked by
None - can start immediately
