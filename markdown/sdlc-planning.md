# แผนดำเนินงานระบบ ComHub ตามกระบวนการ SDLC (7 ขั้นตอน)

เอกสารแผนดำเนินงานโครงการ **ComHub** (แพลตฟอร์มอีคอมเมิร์ซสำหรับจัดสเปคและจำหน่ายอุปกรณ์คอมพิวเตอร์ครบวงจร) เพื่อให้สอดคล้องกับหลักการ **Systems Development Life Cycle (SDLC)** จำนวน 7 ขั้นตอนหลัก สำหรับรายวิชา **csi 204**

---

## 📅 ตารางการดำเนินงานภาพรวม (Project Timeline by Weeks & Days)

| สัปดาห์ (Week) | ขั้นตอน SDLC (SDLC Phase) | รายละเอียดงานหลัก (Key Activities) | ระยะเวลา (Duration) |
| :---: | :--- | :--- | :---: |
| **สัปดาห์ที่ 1** | **1. Planning (การวางแผน)** | วิเคราะห์ความต้องการทางธุรกิจ ขอบเขตระบบ แผนบริหารความเสี่ยง | 3 วัน |
| **สัปดาห์ที่ 1** | **2. Analysis (การวิเคราะห์)** | จัดทำ System Requirements, โครงสร้างข้อมูล, UML (Use Case & Class Diagram) | 4 วัน |
| **สัปดาห์ที่ 2** | **3. Design (การออกแบบ)** | ออกแบบ Wireframe/Figma UI, API Schema, UML (Sequence & Activity) | 4 วัน |
| **สัปดาห์ที่ 2-3** | **4. Development (การพัฒนา)** | เขียนโค้ดระบบ Frontend, Backend, Database และการจำกัดสิทธิ์ (RBAC) | 10 วัน |
| **สัปดาห์ที่ 4** | **5. Testing (การทดสอบ)** | ทำ UAT Test Cases, Functional Testing, Security & Performance Testing | 3 วัน |
| **สัปดาห์ที่ 4** | **6. Deployment (การติดตั้ง)** | ติดตั้งระบบบนโฮสต์จริง (Vercel Serverless) และทดสอบ URL จริง | 2 วัน |
| **สัปดาห์ที่ 4** | **7. Maintenance (การบำรุงรักษา)** | บันทึกรายงานแก้ไขบั๊กและฟีเจอร์ที่รองรับการพัฒนาต่อยอดในอนาคต | 2 วัน |

### 📅 สรุปการจัดกลุ่ม 7 Phase ลงใน 4 สัปดาห์ (4-Week Grouping)

| สัปดาห์ | Phase ที่รวม | วันรวม |
| :---: | :--- | :---: |
| **1** | Planning (3 วัน) + Analysis (4 วัน) | 7 วัน |
| **2** | Design (4 วัน) + Development-Frontend (3 วันแรก) | 7 วัน |
| **3** | Development-Backend+Integration (7 วันที่เหลือ) | 7 วัน |
| **4** | Testing (3 วัน) + Deployment (2 วัน) + Maintenance (2 วัน) | 7 วัน |

---

## 📋 แผนการดำเนินงานจำแนกตามขั้นตอน SDLC (7 Phases Detail)

### 1. Planning (การวางแผน)
- **วัตถุประสงค์:** ทำความเข้าใจปัญหาและความต้องการทางธุรกิจ กำหนดขอบเขตโครงการ
- **กิจกรรมหลัก:**
  - กำหนดขอบเขตโครงการและเป้าหมายทางธุรกิจ (Business Goals)
  - กำหนดสิทธิ์และบทบาทสมาชิกในทีมพร้อมตารางเวลาดำเนินงาน 4 สัปดาห์
  - วิเคราะห์ความเสี่ยงและมาตรการควบคุมความเสี่ยง (Risk Management)
- **ผลลัพธ์ (Deliverables):** เอกสารแผนงานโครงการ (Project Plan) และแผนบริหารความเสี่ยง
- **ระยะเวลา:** 3 วัน (สัปดาห์ที่ 1)

### 2. Analysis (การวิเคราะห์)
- **วัตถุประสงค์:** วิเคราะห์ข้อกำหนดของระบบ (System Requirements) และพฤติกรรมผู้ใช้
- **กิจกรรมหลัก:**
  - วิเคราะห์และระบุข้อกำหนดความต้องการด้านฟังก์ชันการทำงาน (Functional Requirements - FR)
  - วิเคราะห์และระบุข้อกำหนดความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements - NFR)
  - ออกแบบโครงสร้างข้อมูลหลัก (Data Dictionary) เช่น สินค้า (Products), ลูกค้า (Users/Customers), คำสั่งซื้อ (Orders)
  - เขียน UML Use Case Diagram เพื่อแสดงบทบาทและความสัมพันธ์ของผู้ใช้งานทั้ง 4 บทบาท
  - เขียน UML Class Diagram แสดงความสัมพันธ์โครงสร้างข้อมูล
- **ผลลัพธ์ (Deliverables):** เอกสาร SRS (System Requirement Specification) และรูปภาพแผนภาพ UML
- **ระยะเวลา:** 4 วัน (สัปดาห์ที่ 1)

### 3. Design (การออกแบบ)
- **วัตถุประสงค์:** ออกแบบระบบให้พร้อมก่อนลงมือเขียนโค้ดจริง
- **กิจกรรมหลัก:**
  - ออกแบบส่วนติดต่อผู้ใช้งาน (UI/UX) ด้วย Wireframe หรือ Figma ให้สอดคล้องกับ UX Laws (Hick's Law, Fitts's Law)
  - ออกแบบโครงสร้างข้อมูล API JSON Schema สำหรับการติดต่อระหว่าง Frontend และ Backend
  - เขียน UML Sequence Diagram แสดงขั้นตอนการจัดสเปคคอมฯ และการสั่งซื้อสินค้า
  - เขียน UML Activity Diagram แสดงกระบวนการอัปเดตสถานะจัดส่งสินค้าและการบันทึกผล Burn-in Test
- **ผลลัพธ์ (Deliverables):** ลิงก์หรือรูปภาพ Wireframe UI, API Specifications และ UML Diagrams
- **ระยะเวลา:** 4 วัน (สัปดาห์ที่ 2)

### 4. Development (การพัฒนา)
- **วัตถุประสงค์:** เขียนโปรแกรมคอมพิวเตอร์ตามแบบที่ได้ออกแบบไว้
- **กิจกรรมหลัก:**
  - **Database setup:** ติดตั้งฐานข้อมูล PostgreSQL บน Supabase Cloud และรัน SQL DDL
  - **Backend Development:** เขียน API Server ด้วย Node.js + Express (TypeScript) และระบบ JWT Authentication / Authorization
  - **Frontend Development:** พัฒนาหน้าจอการแสดงผลด้วย React (Vite) + Tailwind CSS (ไม่มีสีม่วง, Fullscreen Responsive)
  - **Core Integration:** เชื่อมต่อ API ตัวจับคู่ Compatibility Logic และ Wattage Calculator
- **ผลลัพธ์ (Deliverables):** Source code บน GitHub และระบบจำลองที่ทำงานเชื่อมต่อกันได้จริง
- **ระยะเวลา:** 10 วัน (สัปดาห์ที่ 2-3)

### 5. Testing (การทดสอบ)
- **วัตถุประสงค์:** ตรวจสอบความถูกต้องและประสิทธิภาพของระบบ
- **กิจกรรมหลัก:**
  - **Functional Testing:** เขียน Test Case และจำลองการใช้ระบบแบบแมนนวล (Manual) ตาม UAT Flow ทุก Actor
  - **Security Testing:** ตรวจสอบความปลอดภัยในการแยกสิทธิ์ใช้งาน (RBAC) และการป้องกัน JWT Token รั่วไหล
  - **Performance Testing:** ทดสอบความเร็วในการตอบสนองของหน้าจอ PC Builder (น้อยกว่า 500ms)
- **ผลลัพธ์ (Deliverables):** เอกสารผลทดสอบ (UAT Test Report & Bug List)
- **ระยะเวลา:** 3 วัน (สัปดาห์ที่ 4)

### 6. Deployment (การติดตั้ง)
- **วัตถุประสงค์:** ติดตั้งระบบบนโฮสต์เพื่อให้ใช้งานได้จริง
- **กิจกรรมหลัก:**
  - พลอยระบบ Frontend ไปยัง Vercel (Static Web hosting)
  - พลอยระบบ Backend ไปยัง Vercel (Serverless Functions)
  - ตั้งค่า Environment Variables เพื่อเชื่อมโยง Frontend, Backend และ Database
  - ทดสอบการเข้าถึง URL จริงและการทำธุรกรรมอัปโหลดภาพจำลอง
- **ผลลัพธ์ (Deliverables):** URL เว็บไซต์จริงที่พร้อมใช้งานสำหรับการนำเสนอ
- **ระยะเวลา:** 2 วัน (สัปดาห์ที่ 4)

### 7. Maintenance (การบำรุงรักษา)
- **วัตถุประสงค์:** ปรับปรุงระบบและเตรียมพร้อมรับข้อเสนอแนะหลังนำเสนองาน
- **กิจกรรมหลัก:**
  - จัดทำบันทึกสรุปข้อจำกัดของระบบที่พร้อมแก้ไข (Known Bugs / Issues)
  - วางแผนฟีเจอร์เพิ่มเติมสำหรับความสามารถในอนาคต (Future Roadmap)
  - ปรับแต่งและแก้ไขโค้ดที่เกิดความล่าช้าหรือทำงานผิดพลาด
- **ผลลัพธ์ (Deliverables):** เอกสารสรุปการบำรุงรักษาและการพัฒนาต่อยอด
- **ระยะเวลา:** 2 วัน (สัปดาห์ที่ 4)

---

## 🏁 Phase X: การตรวจสอบขั้นสุดท้าย (Verification Plan)

เพื่อยืนยันความถูกต้องตามเกณฑ์ของ AG Kit และ csi 204:
1. **การตรวจสอบสิทธิ์ความปลอดภัย:** รันสแกนความปลอดภัยระบบและ JWT Verification:
   ```bash
   python .agents/skills/vulnerability-scanner/scripts/security_scan.py .
   ```
2. **การประเมิน UI/UX:** ตรวจสอบตามเกณฑ์ความลื่นไหลและ Accessibility:
   ```bash
   python .agents/skills/frontend-design/scripts/ux_audit.py .
   ```
3. **การหลีกเลี่ยงข้อห้าม:** 
   - [ ] ห้ามมีรหัสสีโทนสีม่วง/ไวโอเลตเด็ดขาด (Purple Ban)
   - [ ] หน้าเว็บต้องแสดงผลแบบ Fullscreen Responsive ไม่มีขอบตัดขวางด้านข้าง
4. **ความสมบูรณ์ในการสร้าง Build:**
   ```bash
   npm run build (ในแต่ละโฟลเดอร์)
   ```
