# 📊 เนื้อหาสไลด์การนำเสนอ Final Project (ComHub - CSI204)

เอกสารสรุปเนื้อหาสไลด์นำเสนอฉบับสมบูรณ์ (8-10 หน้า) สามารถก๊อปปี้ข้อความไปใส่ใน **Canva / PowerPoint** หรือพิมพ์เป็น PDF เพื่อเปิดนำเสนอได้ทันที

---

## 🖼️ Slide 1: หน้าปก (Title Slide)
* **หัวข้อโครงการ:** ComHub — แพลตฟอร์มอีคอมเมิร์ซสำหรับจัดสเปคและจำหน่ายอุปกรณ์คอมพิวเตอร์ครบวงจร
* **วิชา:** CSI204 — Software Engineering (วิศวกรรมซอฟต์แวร์)
* **สมาชิกในทีม:** [ใส่ชื่อ-นามสกุล และรหัสนักศึกษาของสมาชิกกลุ่ม]
* **อาจารย์ผู้สอน:** [ใส่ชื่ออาจารย์ผู้สอน]
* **URL ระบบจริง:** https://comhub-frontend.vercel.app

---

## 🖼️ Slide 2: ที่มา ปัญหา และวัตถุประสงค์ (Problem & Objective)
* **ปัญหาเดิม (Pain Points):**
  1. การจัดสเปคคอมประกอบซับซ้อน อุปกรณ์ไม่รองรับกัน (Incompatible Socket/Size/RAM)
  2. ผู้ซื้อไม่ทราบกำลังไฟ (Wattage) ที่ต้องใช้ เลือก Power Supply (PSU) ไม่ถูกต้อง
  3. ความยุ่งยากในการเปรียบเทียบสเปคเทคนิคของอุปกรณ์แต่ละชิ้น
* **วัตถุประสงค์โครงการ (Objectives):**
  - พัฒนาเว็บแอปพลิเคชันอีคอมเมิร์ซที่มีระบบ **Compatibility Checker** แจ้งเตือนอุปกรณ์ไม่ตรงกันทันที
  - พัฒนาระบบ **Wattage Calculator** ช่วยคำนวณกำลังไฟรวมและกรองแนะนำ PSU ที่เหมาะสม
  - พัฒนาระบบเปรียบเทียบสินค้า (Product Comparison) และระบบจัดการออเดอร์หลังบ้าน

---

## 🖼️ Slide 3: ผู้ใช้งานหลักและขอบเขตระบบ (Persona & Scope)
* **2 บทบาทผู้ใช้งานหลัก (MVP Scope):**
  1. **Customer (ลูกค้าทั่วไป):**
     - ค้นหา กรอง เปรียบเทียบสินค้า จัดการ Wishlist และ Review
     - จัดสเปคคอมพิวเตอร์ 7 หมวด เช็ค Compatibility & TDP คำนวณไฟ
     - สั่งซื้อสินค้า แนบสลิปโอนเงิน และติดตามสถานะพัสดุผ่านไทม์ไลน์
  2. **Staff / Admin (พนักงานและผู้ดูแลระบบ):**
     - จัดการคลังสินค้า (Product CRUD: เพิ่ม แก้ไข ซ่อนสินค้า)
     - ตรวจสอบสลิปโอนเงิน (Approve / Reject คืนสต็อก)
     - อัปเดตสถานะการจัดส่ง กรอกเลข Tracking และดู Dashboard รายงานยอดขาย

---

## 🖼️ Slide 4: สถาปัตยกรรมระบบ (System Architecture)
* **Tech Stack สถาปัตยกรรม 3 ชั้น (3-Tier Architecture):**
  - **Frontend:** React.js, TailwindCSS, Lucide Icons, LocalStorage Store (Deploy บน Vercel)
  - **Backend API:** Node.js, Express.js (RESTful API), JWT Authentication (Deploy บน Render)
  - **Database:** JSON Schema / Transaction Pooler Data Persistence
* **ฟีเจอร์เด่นทางเทคนิค (Technical Highlights):**
  - Client-side Image Compression (บีบอัดสลิปเป็น WebP $<100\text{KB}$)
  - Centralized Builder State Store & Atomic DB Transaction

---

## 🖼️ Slide 5: แผนภาพวิเคราะห์และออกแบบ (UML Diagrams)
* **Use Case Diagram:** แสดงสิทธิ์การเข้าใช้ฟังก์ชันระหว่าง Customer และ Admin
* **Class Diagram:** โครงสร้าง Object (User, Customer, Admin, Product, CartItem, Order, OrderLog, Review)
* **Sequence Diagram:** 
  - *Flow 1:* PC Builder & Compatibility Checking Sequence
  - *Flow 2:* Order Checkout, Slip Upload & Admin Verification Sequence

---

## 🖼️ Slide 6: การสาธิตการทำงานของระบบ (Live Demonstration Flow)
* **5 ขั้นตอนนำเสนอระบบจริง:**
  1. **Catalog & Filter:** ค้นหา กรองหมวดหมู่ CPU/GPU และเปรียบเทียบสินค้า Side-by-Side
  2. **PC Builder Highlight:** เลือกชิ้นส่วน 7 หมวด โชว์ **Incompatible Alert สีแดง** (Socket mismatch) และป้าย **Compatible สีเขียว** พร้อม Wattage Calculator (TDP x 1.2)
  3. **Checkout & Slip Upload:** สั่งซื้อสินค้า แนบสลิปโอนเงิน (บีบอัด WebP)
  4. **Admin Panel:** สลับเป็น Admin ตรวจสลิป อนุมัติออเดอร์ ใส่เลข Tracking
  5. **Order Tracking Timeline:** ลูกค้าเช็คสถานะพัสดุผ่าน Stepper 5 ขั้นตอน

---

## 🖼️ Slide 7: กระบวนการพัฒนาตาม SDLC 7 ขั้นตอน (SDLC Methodology)
* **1. Planning:** วิเคราะห์ขอบเขตงาน ขอบเขตระบบ MVP 4 สัปดาห์
* **2. Analysis:** จัดทำ User Persona, PRD, SRS และ UML Diagrams
* **3. Design:** ออกแบบ Wireframe/Prototype UI, Architecture และ REST API
* **4. Development:** เขียนโค้ด React Frontend, Express Backend API
* **5. Testing:** ทำ UAT Test Specification & Report รวม 35 ชุดการทดสอบ
* **6. Deployment:** ติดตั้งระบบบนโฮสต์จริง Vercel & Render
* **7. Maintenance:** บันทึกปัญหาระบบและแนวทางพัฒนาต่อยอดในอนาคต

---

## 🖼️ Slide 8: ผลการทดสอบระบบ (UAT Testing Summary)
* **สรุปผลการทดสอบ User Acceptance Testing (Workshop #7):**
  - จำนวนรายการทดสอบทั้งหมด: **35 ชุดการทดสอบ**
  - อัตราการทดสอบผ่าน (Pass Rate): **100% (35/35 Pass)**
* **ครอบคลุม 5 หมวดการทดสอบ:**
  1. Customer Persona Functional (12 ชุด)
  2. Staff / Admin Persona Functional (6 ชุด)
  3. Security & Vulnerability Tests (8 ชุด - ป้องกัน File Upload, XSS, Tampering, Race Condition)
  4. Data Validation & Boundary Edge Cases (5 ชุด)
  5. UI/UX & Performance Under Load (4 ชุด)

---

## 🖼️ Slide 9: สรุปผลงานและอนาคตของระบบ (Conclusion & Future Work)
* **สรุปความสำเร็จ (Key Accomplishments):**
  - พัฒนาระบบ ComHub สำเร็จตามข้อกำหนดของโครงงาน CSI204 ครบถ้วน 100%
  - ช่วยแก้ปัญหาความยุ่งยากในการจัดสเปคคอมพิวเตอร์และป้องกันอุปกรณ์ไม่เข้ากันได้จริง
* **แนวทางพัฒนาต่อยอด (Future Enhancements):**
  - พัฒนาระบบ Payment Gateway อัตโนมัติ (Omise / Stripe Integration)
  - ขยายฐานข้อมูลจาก JSON เป็น PostgreSQL / MongoDB บน Cloud

---

## 🖼️ Slide 10: Q&A (ขอบคุณและรับฟังคำถาม)
* **ขอขอบคุณคณะกรรมการและอาจารย์ผู้ประเมินทุกท่าน**
* **ComHub - PC Building & E-Commerce Platform**
* **Live System URL:** https://comhub-frontend.vercel.app
* *พร้อมรับฟังคำถามและข้อเสนอแนะครับ*
