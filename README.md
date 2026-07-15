<p align="center">
  <img src="https://img.shields.io/badge/Domain-e--Commerce-blue?style=for-the-badge" alt="Domain: e-Commerce"/>
  <img src="https://img.shields.io/badge/CSI204-Software_Engineering-green?style=for-the-badge" alt="CSI204"/>
  <img src="https://img.shields.io/badge/SDLC-Waterfall_7_Phases-orange?style=for-the-badge" alt="SDLC"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL_(Supabase)-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
</p>

---

## 📌 1. ข้อมูลกลุ่ม (Group Information)

|                                  | รายละเอียด                                                |
| :------------------------------- | :------------------------------------------------------------------ |
| **ชื่อกลุ่ม**     | ComHub (คอมฮับ)                                               |
| **รายวิชา**         | CSI204 — วิศวกรรมซอฟต์แวร์ (Software Engineering) |
| **จำนวนสมาชิก** | 2 คน                                                              |

| ลำดับ | รหัสนักศึกษา | ชื่อ-สกุล                   | หน้าที่รับผิดชอบ |
| :--------: | :----------------------- | :---------------------------------- | :------------------------------- |
|     1     | 65007905                 | นายธนกร สิงห์ก้อม   | Full-Stack Developer             |
|     2     | 65057638                 | นายหาญณรงค์ บุญยืน | Full-Stack Developer             |

---

## 📌 2. ชื่อโครงงาน (Project Title)

|                                                         | รายละเอียด                                                                                                                                     |
| :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**                                        | e-Commerce                                                                                                                                               |
| **ชื่อโครงงาน (ภาษาไทย)**       | คอมฮับ — แพลตฟอร์มอีคอมเมิร์ซสำหรับจัดสเปคและจำหน่ายอุปกรณ์คอมพิวเตอร์ครบวงจร |
| **ชื่อโครงงาน (ภาษาอังกฤษ)** | ComHub — E-Commerce Platform for Custom PC Building and IT Accessories                                                                                  |

### 🔗 ลิงก์โครงการ (Project Links)

| รายการ                                                | ลิงก์                               |
| :---------------------------------------------------------- | :--------------------------------------- |
| 📂 Repository URL                                           | https://github.com/Tnk2209/ComHub-Csi204 |
| 🌐 GitHub Pages (Live Document)                             | https://tnk2209.github.io/ComHub-Csi204/ |
| 📄 เอกสารข้อกำหนดระบบเชิงลึก (SRS) | [SRS.md](./SRS.md)                        |

---

## 📌 3. หลักการและเหตุผล (Rationale)

ในปัจจุบันความต้องการใช้งานคอมพิวเตอร์ประสิทธิภาพสูง ทั้งสำหรับกลุ่มเกมเมอร์ (Gaming) และคนทำงานเฉพาะทาง (Creators / Office) มีการเติบโตอย่างก้าวกระโดด อย่างไรก็ตาม ผู้ซื้อส่วนใหญ่ยังคงประสบปัญหาดังนี้:

- **ปัญหาจากมุมมองลูกค้า:** ลูกค้าไม่ทราบความเข้ากันได้ทางเทคนิคของฮาร์ดแวร์ (เช่น Socket CPU ไม่ตรงกับ Mainboard, กำลังวัตต์ PSU ไม่เพียงพอ, การ์ดจอยาวเกินเคส) ส่งผลให้ซื้อของผิดพลาด ใช้งานร่วมกันไม่ได้ และไม่สามารถเปรียบเทียบสเปคเชิงลึกและราคาได้สะดวก
- **ปัญหาจากมุมมองพนักงาน/ผู้จัดการ:** ไม่มีระบบจัดคิวงานประกอบ, ระบบทดสอบ Burn-in Test ขาดความเป็นระบบ ไม่มีบันทึกอุณหภูมิที่ชัดเจน และผู้จัดการร้านไม่สามารถวัดสถิติยอดขายหรือสร้างโปรโมชั่นเซ็ตคอมแนะนำได้สะดวก

โครงการ **ComHub** จึงพัฒนาขึ้นเพื่อสร้างเว็บแอปพลิเคชันอีคอมเมิร์ซที่รวมอุปกรณ์คอมพิวเตอร์ครบวงจร พร้อมระบบจัดสเปคอัจฉริยะ (Advanced PC Builder) ที่ตรวจจับความเข้ากันได้ของชิ้นส่วนและคำนวณกำลังไฟอัตโนมัติ ระบบบริหารคิวงานประกอบหลังบ้าน และแกลเลอรี่คอมมูนิตี้สำหรับแชร์สเปคอ้างอิง

---

## 📌 4. วัตถุประสงค์ของโครงงาน (Objectives)

1. เพื่อพัฒนาระบบอีคอมเมิร์ซสำหรับซื้อขายและเปรียบเทียบสเปคอุปกรณ์คอมพิวเตอร์ที่ตอบโจทย์กลุ่มผู้ใช้ทั้ง 4 บทบาท (Customer, Staff, Manager, Admin)
2. เพื่อสร้างระบบจัดสเปคคอมพิวเตอร์ (PC Builder) ที่มี Compatibility Checker ตรวจสอบ Socket, ขนาดเคส/การ์ดจอ, ชนิด RAM และระบบ Wattage Calculator คำนวณกำลังไฟ TDP อัตโนมัติพร้อมเผื่อ 20%
3. เพื่อพัฒนาระบบหลังบ้านครบวงจร ได้แก่ ระบบจัดคิวประกอบเครื่อง, บันทึกผลทดสอบ Burn-in Test, แดชบอร์ดวิเคราะห์ยอดขาย และระบบจัดการสิทธิ์ผู้ใช้ (RBAC)

---

## 📌 5. ขอบเขตของระบบ (System Scope)

### 5.1 ผู้ใช้งานและสิทธิ์การเข้าถึง (Actors & Role-Based Access Control)

#### 👤 ลูกค้า (Customer)

- **สมัครสมาชิก (Register)**
  - สร้างบัญชีใหม่ : ลงทะเบียนด้วยอีเมลและรหัสผ่านเพื่อเปิดใช้งานฟีเจอร์บันทึกประวัติ
- **ล็อกอินเข้าสู่ระบบ (Login)**
  - เข้าสู่ระบบ : ตรวจสอบสิทธิ์ด้วย JWT Token เพื่อดึงสเปคบันทึกส่วนตัวและประวัติการสั่งซื้อ
- **จัดสเปคคอมพิวเตอร์ (PC Builder)**
  - เลือกชิ้นส่วน : เลือกอุปกรณ์ทีละชิ้นจาก 7 หมวดหมู่หลัก (CPU, Mainboard, GPU, RAM, SSD, Case, PSU) ผ่านกล่อง Bento Grid
  - เปลี่ยนชิ้นส่วน : สลับเปลี่ยนอุปกรณ์ที่เลือกไว้ในแต่ละหมวดหมู่ได้ตลอดเวลา
  - ลบชิ้นส่วน : ถอดอุปกรณ์ที่ไม่ต้องการออกจากสเปคปัจจุบัน
  - ดูสรุปสเปค : แสดงรายการชิ้นส่วนทั้งหมดที่เลือกพร้อมราคารวม
- **ตรวจสอบความเข้ากันได้ (Compatibility Checker)**
  - ตรวจสอบ Socket : ระบบแจ้งเตือนทันทีหาก CPU และ Mainboard มี Socket ไม่ตรงกัน
  - ตรวจสอบขนาดเคส : ระบบเตือนหากขนาด Mainboard ใหญ่เกินเคส
  - ตรวจสอบขนาดการ์ดจอ : ระบบเตือนหากความยาว GPU เกินขีดจำกัดที่เคสรองรับ
  - ตรวจสอบชนิด RAM : ระบบบล็อกการเลือก RAM ที่ชนิดไม่ตรงกับ Mainboard (เช่น DDR4 กับ DDR5)
- **คำนวณกำลังไฟ (Wattage Calculator)**
  - ดูผลคำนวณ TDP : แสดงกำลังไฟรวม (Watts) ของอุปกรณ์ที่เลือกทั้งหมด
  - แนะนำ PSU : กรองและแนะนำเฉพาะ PSU ที่มีกำลังวัตต์มากกว่าผลรวม TDP × 1.2 (เผื่อ 20%)
- **เซ็ตสเปคแนะนำ (Pre-built Templates)**
  - ดูเซ็ตแนะนำ : เรียกดูรายชื่อเซ็ตคอมสำเร็จรูปของร้านแยกตามช่วงงบประมาณ
  - สั่งซื้อเซ็ตทันที : กดหยิบสเปคทั้งชุดใส่ตะกร้าเพื่อสั่งซื้อ
  - ดึงเซ็ตไปปรับแต่ง : โหลดสเปคเข้า PC Builder เพื่อสลับเปลี่ยนชิ้นส่วนที่ต้องการ
- **เปรียบเทียบสินค้า (Product Comparison)**
  - เพิ่มสินค้าเข้าเปรียบเทียบ : เลือกสินค้าประเภทเดียวกันได้สูงสุด 3 ชิ้น
  - ดูตารางเปรียบเทียบ : แสดงสเปคเชิงเทคนิคและราคาเทียบกันแบบตาราง
  - ลบสินค้าจากการเปรียบเทียบ : ถอดสินค้าที่ไม่ต้องการออกจากรายการเปรียบเทียบ
- **บันทึกสินค้าโปรด (Wishlist & Stock Alert)**
  - เพิ่มสินค้าเข้า Wishlist : กดหัวใจเพื่อบันทึกชิ้นส่วนที่สนใจไว้ในรายการโปรด
  - ลบสินค้าจาก Wishlist : ยกเลิกการบันทึกสินค้าที่ไม่สนใจแล้ว
  - เปิดแจ้งเตือนสต็อก : ตั้งค่ารับการแจ้งเตือนเมื่อสินค้าที่หมดกลับเข้าสต็อก
  - ปิดแจ้งเตือนสต็อก : ยกเลิกการรับแจ้งเตือนสินค้านั้นๆ
- **เขียนรีวิว (Review with Photos)**
  - เขียนรีวิวใหม่ : ให้คะแนน 1-5 ดาว พร้อมเขียนข้อความวิจารณ์สินค้า
  - แนบรูปภาพ : อัปโหลดรูปถ่ายสินค้าจริงประกอบรีวิว (บีบอัดเป็น WebP อัตโนมัติ)
  - ดูรีวิวสินค้า : อ่านรีวิวและดูรูปถ่ายจากลูกค้าท่านอื่น
- **แกลเลอรี่คอมมูนิตี้ (PC Build Gallery)**
  - แชร์สเปคสู่แกลเลอรี่ : โพสต์สเปคคอมประกอบเสร็จของตนเองพร้อมรูปถ่ายเคส
  - ดูโพสต์คนอื่น : ส่องดูเคสจัดสเปคและงบประมาณของลูกค้าท่านอื่น
  - โคลนสเปค : กดคัดลอกสเปคจากโพสต์คนอื่นเข้า PC Builder เพื่อสั่งซื้อหรือปรับแต่งต่อ
  - กดถูกใจ : กด Like โพสต์ที่ชื่นชอบ
- **ตะกร้าสินค้าและสั่งซื้อ (Cart & Checkout)**
  - เพิ่มสินค้าลงตะกร้า : หยิบชิ้นส่วนเข้าตะกร้า (บันทึกลง LocalStorage)
  - แก้ไขจำนวน : ปรับจำนวนสินค้าในตะกร้า
  - ลบสินค้าจากตะกร้า : ถอดสินค้าที่ไม่ต้องการออก
  - กรอกที่อยู่จัดส่ง : ระบุที่อยู่สำหรับจัดส่งสินค้า
  - เลือกบริการประกอบ : สลับเปิด/ปิดตัวเลือก "ให้ร้านประกอบและเทสเครื่องให้"
  - ใส่คูปองส่วนลด : กรอกรหัสคูปองเพื่อรับส่วนลด
  - อัปโหลดสลิปโอนเงิน : แนบภาพสลิปหลักฐาน (ระบบบีบอัดเป็น WebP อัตโนมัติก่อนส่งขึ้น Supabase)
- **ติดตามสถานะประกอบ (Assembly Tracking)**
  - ดูสถานะออเดอร์ : ติดตาม 4 ขั้นตอน [รับออเดอร์] → [กำลังประกอบ] → [เทสระบบ] → [จัดส่งแล้ว]
  - ดูประวัติล็อก : เปิดดูไทม์ไลน์วันเวลาเปลี่ยนสถานะแต่ละขั้นตอน
  - ดูผลทดสอบ Burn-in : ดูอุณหภูมิ CPU/GPU และโน้ตจากช่างที่บันทึกผลทดสอบ
  - ดูเลข Tracking : ดูหมายเลขพัสดุเพื่อติดตามกับบริษัทขนส่ง

#### 👷 พนักงาน (Staff)

- **ล็อกอินเข้าสู่ระบบพนักงาน (Login)**
  - เข้าสู่ระบบ : ตรวจสอบสิทธิ์เข้าใช้ระบบหลังบ้านด้วย JWT Token
- **จัดการคิวงานประกอบ (Build Management)**
  - ดูรายการคิวประกอบ : แสดงออเดอร์ที่ลูกค้าชำระเงินแล้วและเลือกบริการประกอบ เรียงตามลำดับเวลา
  - ดูรายการอุปกรณ์ (BOM) : แสดงใบรายการชิ้นส่วนทั้งหมดที่ต้องหยิบมาประกอบ
  - อัปเดตสถานะเป็น "กำลังประกอบ" : เปลี่ยนสถานะออเดอร์เมื่อเริ่มงาน
  - อัปเดตสถานะเป็น "กำลังเทสระบบ" : เปลี่ยนสถานะเมื่อเริ่มทำ Burn-in Test
- **บันทึกผล Burn-in Test**
  - กรอกอุณหภูมิ CPU : บันทึกค่าความร้อนขณะเทสความเสถียร (°C)
  - กรอกอุณหภูมิ GPU : บันทึกค่าความร้อนการ์ดจอขณะเทส (°C)
  - ประเมินผล Pass/Fail : เลือกสถานะผ่าน/ไม่ผ่านการทดสอบ
  - เขียนโน้ตหมายเหตุ : บันทึกรายละเอียดเพิ่มเติม เช่น พัดลมมีเสียงรบกวน
  - 
- **ออกใบจัดส่ง (Logistics)**
  - พิมพ์ใบนำส่งพัสดุ : จัดพิมพ์เอกสารปะหน้ากล่องพัสดุ
  - กรอก Tracking Number : บันทึกหมายเลขพัสดุเข้าประวัติเพื่อแจ้งลูกค้า
  - อัปเดตสถานะเป็น "จัดส่งแล้ว" : เปลี่ยนสถานะออเดอร์เมื่อส่งของเรียบร้อย

#### 📊 ผู้จัดการ (Manager)

- **ล็อกอินเข้าสู่ระบบผู้จัดการ (Login)**
  - เข้าสู่ระบบ : ตรวจสอบสิทธิ์เข้าหน้ารายงานทางธุรกิจและจัดการโปรโมชั่น
- **จัดการเทมเพลตแนะนำ (Pre-built Management)**
  - สร้างเทมเพลตใหม่ : สร้างชุดสเปคคอมแนะนำพร้อมตั้งชื่อและแท็กช่วงงบประมาณ
  - เพิ่มชิ้นส่วนเข้าเทมเพลต : ค้นหาและเลือกอุปกรณ์จากคลังสต็อกเพื่อผูกลงเซ็ต
  - แก้ไขเทมเพลต : เปลี่ยนชื่อ คำอธิบาย หรือสลับชิ้นส่วนในเซ็ตที่มีอยู่
  - ลบเทมเพลต : ลบเซ็ตแนะนำที่ไม่ต้องการออกจากระบบ
- **ตรวจสอบแกลเลอรี่ (Gallery Moderation)**
  - ดูรายการรอตรวจ : แสดงรูปถ่ายรีวิว/แกลเลอรี่ที่อยู่ในสถานะ Pending
  - อนุมัติเผยแพร่ (Approve) : กดอนุมัติให้รูปภาพแสดงบนเว็บสาธารณะ
  - ปฏิเสธ (Reject) : กดซ่อนรูปภาพที่ไม่เหมาะสม
  - ปักหมุดโพสต์ : ตั้งค่าปักหมุดโพสต์จัดสเปคที่น่าสนใจขึ้นหน้าแรก
  - ยกเลิกปักหมุด : ถอดโพสต์ที่ปักหมุดไว้ออก
- **แดชบอร์ดยอดขาย (Sales Dashboard)**
  - ดูกราฟยอดขาย : แสดงสถิติยอดขายรวมสะสมจากออเดอร์สำเร็จ
  - ดูสินค้ายอดนิยม : แสดงรายการฮาร์ดแวร์ที่มียอดสั่งซื้อสูงสุด
  - ดูเตือนสต็อกต่ำ : แสดงรายการสินค้าที่มีจำนวนคงเหลือ ≤ 3 ชิ้น

#### 🔐 ผู้ดูแลระบบ (Admin)

- **ล็อกอินเข้าสู่ระบบแอดมิน (Login)**
  - เข้าสู่ระบบ : ตรวจสอบสิทธิ์เพื่อเข้าถึงเมนูตั้งค่าระดับลึกสุดของระบบ
- **จัดการคลังสินค้า (Database CRUD)**
  - เพิ่มสินค้า : สร้างรายการสินค้าใหม่พร้อมกรอกข้อมูลราคา สต็อก และสเปคเทคนิค (JSONB)
  - แก้ไขสินค้า : อัปเดตชื่อ ราคา จำนวนสต็อก หรือคุณสมบัติเทคนิคของสินค้า
  - ปิดขายสินค้า (Soft Delete) : สลับสถานะ is_active เป็น false เพื่อซ่อนจากหน้าร้านแต่ยังเก็บประวัติ
  - เปิดขายสินค้าอีกครั้ง : สลับ is_active กลับเป็น true เพื่อนำกลับมาขายใหม่
  - ดูรายการสินค้าทั้งหมด : แสดงรายการสินค้าพร้อมสถานะ Active/Inactive
- **จัดการสิทธิ์ผู้ใช้ (Role & Access Control)**
  - สร้างบัญชี Staff/Manager : เพิ่มบัญชีพนักงานหรือผู้จัดการใหม่เข้าระบบ
  - แก้ไขสิทธิ์ : เปลี่ยนบทบาท (Role) ของผู้ใช้ระหว่าง Staff/Manager
  - ลบบัญชี : ยกเลิกบัญชีพนักงานที่ไม่ใช้งานแล้ว
- **อนุมัติสลิปโอนเงิน (Payment Review)**
  - ดูสลิปรอตรวจ : แสดงรายการออเดอร์ที่อัปโหลดสลิปแล้วรอการตรวจสอบ
  - อนุมัติการชำระเงิน (Approved) : ยืนยันสลิปถูกต้อง ส่งคิวต่อให้ช่างประกอบ
  - ปฏิเสธการชำระเงิน (Rejected) : ปฏิเสธสลิปปลอม *(Stock Rollback ยังไม่ implement อัตโนมัติ — gap feature, ดู [prd.md §7](./markdown/prd.md))*

### 5.2 ตารางฟังก์ชันระบบทั้งหมด (Functional Requirements Matrix)

> ดู [FR/NFR Matrix ฉบับสมบูรณ์](./markdown/project-scope.md) สำหรับตารางฟังก์ชัน (SYS-XX, C-XX, S-XX, M-XX, A-XX) ครบทุก role — **project-scope.md** คือแหล่งข้อมูลหลัก

### 5.3 ความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)

> ดู [project-scope.md §2 NFR](./markdown/project-scope.md) สรุปสั้น: Performance < 500ms, bcrypt + JWT RBAC, LocalStorage Reliability, Dark Mode + IBM Plex/Inter, WebP 80% Cloud

### 5.4 แผนภาพสิทธิ์การเข้าใช้งานฟังก์ชัน (Use Case Diagram)

See [usecasediagram.mermaid](markdown/usecasediagram.mermaid) for the full use case diagram.

---

## 📌 6. แนวทางการพัฒนาตาม SDLC (System Development Life Cycle)

### 6.1 ตาราง SDLC 7 ขั้นตอน

| ลำดับ | ขั้นตอน (Phase) | รายละเอียดโดยย่อ (Brief Description)                                                                          | ผลลัพธ์ (Deliverables)                                                                  | ระยะเวลา |
| :--------: | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- | :--------------: |
|     1     | **Planning**     | กำหนดขอบเขตโครงการ เป้าหมายทางธุรกิจ แผนบริหารความเสี่ยง                | เอกสารแผนงานโครงการ, แผนความเสี่ยง                             |     3 วัน     |
|     2     | **Analysis**     | วิเคราะห์ FR/NFR, จัดทำ Data Dictionary, เขียน UML Use Case & Class Diagram                                | เอกสาร SRS, แผนภาพ UML                                                             |     4 วัน     |
|     3     | **Design**       | ออกแบบ UI/UX (Figma Wireframe), API JSON Schema, UML Sequence & Activity Diagram                                        | Wireframe, API Specs, UML                                                                      |     4 วัน     |
|     4     | **Development**  | ติดตั้ง PostgreSQL (Supabase), พัฒนา Backend (Node.js/Express + JWT), พัฒนา Frontend (React/Vite + Tailwind) | เผยแพร่ฌแรเจ็คสู่สาธารณะ และ สามารถใช้งานได้จริง |    10 วัน    |
|     5     | **Testing**      | Functional Testing ตาม UAT Flow ทุก Actor, Security Testing (RBAC + JWT), Performance Testing (< 500ms)                 | เอกสารผลทดสอบ, Bug List                                                           |     3 วัน     |
|     6     | **Deployment**   | Deploy Frontend/Backend ขึ้น Vercel, ตั้งค่า Environment Variables                                                 | URL เว็บจริงพร้อมนำเสนอ                                                     |     2 วัน     |
|     7     | **Maintenance**  | บันทึก Known Bugs/Issues, วางแผน Future Roadmap, แก้ไขโค้ดที่ผิดพลาด                           | เอกสารบำรุงรักษา                                                               |     2 วัน     |

### 6.2 รายละเอียดขั้นตอน Development

| งาน                         | รายละเอียด                                                                           |
| :----------------------------- | :--------------------------------------------------------------------------------------------- |
| **Database Setup**       | ติดตั้ง PostgreSQL บน Supabase Cloud, รัน SQL DDL สร้าง 10 ตาราง         |
| **Backend Development**  | เขียน API Server ด้วย Node.js + Express (TypeScript), ระบบ JWT Auth/Authorization |
| **Frontend Development** | พัฒนาหน้าจอด้วย React (Vite) + Tailwind CSS, Fullscreen Responsive              |

---

## 📌 7. เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Technologies)

### 💻 Frontend

| เทคโนโลยี | หน้าที่                                                                                          |
| :----------------- | :------------------------------------------------------------------------------------------------------ |
| React + Vite       | สร้าง SPA, Hot Module Replacement, คอมไพล์เร็ว                                          |
| Tailwind CSS       | จัดแต่ง UI, Responsive Design, Dark Mode Theme                                                   |
| LocalStorage       | เก็บข้อมูลตะกร้าสินค้าและสเปคจัดค้างชั่วคราวฝั่ง Client |
| HTML5 Canvas API   | บีบอัดรูปภาพเป็น WebP ก่อนอัปโหลด                                            |

### ⚙️ Backend

| เทคโนโลยี   | หน้าที่                                                  |
| :------------------- | :-------------------------------------------------------------- |
| Node.js + Express    | เขียน REST API Server                                      |
| TypeScript           | เพิ่ม Type Safety ให้ API                               |
| JWT (JSON Web Token) | ระบบยืนยันตัวตนและจัดการ Session        |
| bcrypt               | เข้ารหัสรหัสผ่านผู้ใช้ (Password Hashing) |

### 🗄️ Database

| เทคโนโลยี          | หน้าที่                                                                                                                                                             |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL (Supabase Cloud) | ฐานข้อมูลหลัก 10 ตาราง (users, products, orders, order_items, reviews, prebuilt_templates, template_items, wishlist_items, assembly_records, order_logs) |
| Supabase Storage            | จัดเก็บไฟล์รูปภาพสลิปและรีวิวบนคลาวด์                                                                                                 |
| JSONB Column                | เก็บสเปคเทคนิคของสินค้าแบบยืดหยุ่น (socket, form_factor, tdp, supported_ram)                                                             |

### 🎨 Design Tool

| เครื่องมือ | หน้าที่                                                                     |
| :------------------- | :--------------------------------------------------------------------------------- |
| Google Stitch        | ใช้ออกแบบหน้า UI / Wireframe                                          |
| Figma                | ใช้สำหรับการ Customize Wireframe ที่ import มาจาก Google Stich |
| mermaid              | ใช้ออกแบบ Diagram ต่างๆ                                              |

### 🔀 Version Control

| เครื่องมือ | หน้าที่                                  |
| :------------------- | :---------------------------------------------- |
| Git                  | ระบบควบคุมเวอร์ชัน            |
| GitHub               | โฮสต์โค้ด, Collaboration, Pull Request |

### ☁️ Hosting & Deployment

| เครื่องมือ | หน้าที่                                |
| :------------------- | :-------------------------------------------- |
| Vercel (Frontend)    | Static Web Hosting สำหรับ React SPA     |
| Vercel (Backend)     | Serverless Functions สำหรับ Express API |

---

## 📌 8. แนวทางการทดสอบระบบ (Testing Approach)

### 8.1 หัวข้อการทดสอบแบบ User Acceptance Testing (UAT)

ระบบทั้งหมดจะทำการทดสอบในรูปแบบ **Manual Testing (การทดสอบด้วยผู้ใช้)** เพื่อตรวจสอบความถูกต้องของระบบตาม Use Case และ User Story ของแต่ละบทบาท (Actor) โดยจำลองสถานการณ์การใช้งานจริงดังนี้:

| หัวข้อการทดสอบ (UAT Scenario)               | วิธีการทดสอบ | ขอบเขตการทดสอบ                                                                                                                                          |
| :-------------------------------------------------------- | :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UAT-01: Compatibility Checker**                   | Manual Testing           | ตรวจสอบการบล็อกและแจ้งเตือนอุปกรณ์ที่ไม่เข้ากัน (Socket CPU, ขนาดเคส/การ์ดจอ, ชนิด RAM)              |
| **UAT-02: Wattage Calculator & PSU Recommendation** | Manual Testing           | ตรวจสอบการคำนวณกำลังไฟรวมสะสมของสเปค และระบบแนะนำ PSU ที่มีกำลังวัตต์เหมาะสม (TDP × 1.2)       |
| **UAT-03: Role-Based Access Control (RBAC)**        | Manual Testing           | ทดสอบสิทธิ์การเข้าถึงข้อมูลและการเข้าใช้ API ในแต่ละ Role (Customer, Staff, Manager, Admin)                            |
| **UAT-04: End-to-End Cart & Checkout Flow**         | Manual Testing           | ทดสอบการทำงานครบวงจรตั้งแต่ ลูกค้าจัดสเปค → สั่งซื้อ → อัปโหลดสลิป → แอดมินตรวจสอบสลิป |
| **UAT-05: Assembly & Burn-in Queue Flow**           | Manual Testing           | ทดสอบการเปลี่ยนสถานะคิวประกอบและการบันทึกอุณหภูมิ CPU/GPU ของช่างประกอบ (Staff)                         |
| **UAT-06: Shop Management & Sales Analytics**       | Manual Testing           | ทดสอบการสร้างสเปคแนะนำของ Manager และแดชบอร์ดสรุปยอดขายหลังบ้าน                                                 |

### 8.2 รายละเอียดขอบเขตการทดสอบ (Testing Details)

การทดสอบจะเน้นการตรวจสอบความสอดคล้องระหว่างผลลัพธ์การทำงานจริงบนเว็บเบราว์เซอร์เปรียบเทียบกับข้อกำหนดความต้องการของระบบ โดยมีเช็กลิสต์แบบละเอียดแยกตามบทบาทผู้ใช้ในเอกสาร [Testing (UAT)](./markdown/testing-uat.md)

---

## 📌 9. ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes)

- ได้เว็บแอปพลิเคชันอีคอมเมิร์ซ **ComHub** ที่สามารถใช้จัดสเปคคอมพิวเตอร์ได้อย่างสมบูรณ์ พร้อมระบบตรวจสอบความเข้ากันได้ของอุปกรณ์แบบเรียลไทม์
- ลดปัญหาการสั่งซื้อชิ้นส่วนที่เข้ากันไม่ได้ ลดอัตราการคืนสินค้า ด้วย Compatibility Checker และ Wattage Calculator อัตโนมัติ
- มีระบบหลังบ้านครบวงจร ตั้งแต่คิวประกอบเครื่อง บันทึกผลทดสอบ Burn-in Test แดชบอร์ดยอดขาย จนถึงระบบจัดการสิทธิ์ RBAC
- สามารถเรียนรู้และพัฒนาทักษะการใช้เทคโนโลยี Full-stack ได้ (React + Node.js + PostgreSQL) ตามกระบวนการ SDLC
- มีระบบ Hybrid Storage (LocalStorage + PostgreSQL Cloud) ที่ประหยัดทรัพยากรฝั่งเซิร์ฟเวอร์และรักษาประสบการณ์ผู้ใช้

---

## 📌 10. แผนการดำเนินงาน 4 สัปดาห์ (Work Plan: 4 Weeks)

| สัปดาห์ | ขั้นตอน SDLC                | กิจกรรม (Activities)                             | รายละเอียดโดยย่อ (Brief Description)                                                                                                                                                                                                       | ระยะเวลา |
| :------------: | :--------------------------------- | :------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------: |
|  **1**  | Planning + Analysis                | วิเคราะห์และออกแบบระบบ            | สรุป Requirement (FR/NFR), จัดทำ UI Mockup บน Figma, ออกแบบโครงสร้างข้อมูล Data Dictionary 10 ตาราง, เขียน UML Use Case & Class Diagram, วิเคราะห์ User Persona, แผนบริหารความเสี่ยง |     7 วัน     |
|  **2**  | Design + Development               | พัฒนาส่วนหน้าบ้าน (Frontend)           | ออกแบบ API JSON Schema, สร้าง Component ต่างๆ ด้วย React SPA, จัดโครงร่างหน้าเว็บด้วย Tailwind CSS, พัฒนาหน้า Home/Builder/Cart/Checkout/Tracking/Gallery/Community                                    |     7 วัน     |
|  **3**  | Development                        | พัฒนาส่วนหลังบ้าน (Backend & Database) | ติดตั้ง PostgreSQL (Supabase), สร้าง REST API Server ด้วย Node.js/Express + TypeScript, ระบบ JWT Auth + RBAC Middleware, เชื่อมต่อ Compatibility Logic & TDP Calculator, ระบบอัปโหลดรูปภาพ Supabase Storage  |     7 วัน     |
|  **4**  | Testing + Deployment + Maintenance | ทดสอบและนำเสนอ                            | ทำการทดสอบ UAT ตาม Flow จริงทุก Actor, ทดสอบ Security (RBAC/JWT), ทดสอบ Performance (< 500ms), แก้บั๊ก, Deploy ขึ้น Vercel, เตรียมสไลด์นำเสนอผลงาน                                          |     7 วัน     |

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
ComHub-Csi204/
├── markdown/                        # เอกสารวิเคราะห์โครงงานวิชา CSI204
│   ├── sdlc-planning.md             # แผนดำเนินงาน SDLC 7 ขั้นตอน
│   ├── features-summary.md          # สรุปฟังก์ชัน FR/NFR ทั้งหมด
│   ├── data-dictionary.md           # พจนานุกรมข้อมูล 10 ตาราง
│   ├── project-structure.md         # โครงสร้างโฟลเดอร์ Monorepo
│   ├── frontend-pages.md            # สรุปหน้าจอ Frontend ทุกบทบาท
│   ├── user-persona.md              # วิเคราะห์กลุ่มผู้ใช้จำลอง 3 Personas
│   ├── prd.md                       # Product Requirement Document
│   ├── UML-Diagrams.md              # แผนภาพ UML
│   ├── testing-uat.md               # แผนและเช็กลิสต์การทดสอบระบบด้วยมือ (UAT Checklist)
│   └── CODEBASE.md                  # สรุปโครงสร้างโค้ด
│
├── frontend/                        # 💻 React + Vite + Tailwind CSS
│   └── src/
│       ├── components/              # Reusable UI Components (common, builder, dashboard)
│       ├── contexts/                # AuthContext, CartContext (State Management)
│       ├── hooks/                   # useAuth, usePCBuilder (Custom Hooks)
│       ├── layouts/                 # MainLayout, DashboardLayout
│       ├── pages/                   # Home, Builder, Cart, Checkout, Tracking, Community, Dashboard/
│       ├── services/                # apiClient, authService, productService
│       └── utils/                   # imageCompressor (WebP Conversion)
│
├── backend/                         # ⚙️ Node.js + Express + TypeScript
│   └── src/
│       ├── config/                  # db.ts (Supabase PG), supabase.ts (Storage)
│       ├── controllers/             # auth, product, order, record, review Controllers
│       ├── middlewares/             # JWT Auth Middleware, Role-based Middleware
│       ├── models/                  # TypeScript Interfaces (User, Product, Order)
│       ├── routes/                  # API Routes (/api/auth, /api/products, /api/orders, /api/reviews)
│       ├── services/                # Compatibility Logic & TDP Calculator
│       └── sql/                     # schema.sql (DDL), seed.sql (Sample Data)
│
├── README.md                        # ไฟล์นี้
├── SRS.md                           # เอกสาร System Requirement Specification ฉบับเต็ม
├── architecture.mermaid             # Mermaid Diagram โครงสร้างระบบ 3-Tier
└── roles_flow.mermaid               # Mermaid Diagram Role-Based Access Flow
```

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema Overview)

ระบบ ComHub ใช้ PostgreSQL (Supabase Cloud) จำนวน **10 ตาราง** ดังนี้:

| ลำดับ | ชื่อตาราง     | ประเภท | คำอธิบาย                                                                  |
| :--------: | :--------------------- | :----------: | :-------------------------------------------------------------------------------- |
|     1     | `users`              |    Master    | ข้อมูลผู้ใช้ + สิทธิ์ RBAC (Customer/Staff/Manager/Admin)       |
|     2     | `products`           |    Master    | แค็ตตาล็อกสินค้า + สเปคเทคนิค JSONB                     |
|     3     | `orders`             | Transaction | คำสั่งซื้อ, payment_status, order_status, สลิป, คูปอง          |
|     4     | `order_items`        |    Detail    | รายการสินค้าในแต่ละออเดอร์ + ราคา ณ ขณะสั่ง |
|     5     | `reviews`            | Transaction | รีวิว 1-5 ดาว, ข้อความ, รูปภาพ, สถานะอนุมัติ     |
|     6     | `prebuilt_templates` |    Master    | ชุดสเปคแนะนำ + แท็กงบประมาณ                               |
|     7     | `template_items`     |   Junction   | เชื่อม Many-to-Many เทมเพลต ↔ สินค้า                          |
|     8     | `wishlist_items`     |    Detail    | ของโปรด + ธงแจ้งเตือนสต็อก                                 |
|     9     | `assembly_records`   |    Detail    | บันทึก Burn-in Test (อุณหภูมิ CPU/GPU, Pass/Fail)                   |
|     10     | `order_logs`         | Audit Trail | ล็อกการเปลี่ยนสถานะ + ผู้กระทำ + เวลา              |

> 📄 รายละเอียดฟิลด์ทั้งหมดดูได้ที่ [data-dictionary.md](./markdown/data-dictionary.md)

### โครงสร้างความสัมพันธ์ของข้อมูล (Class Diagram / ERD)

See [classdiagram.mermaid](markdown/classdiagram.mermaid) for the full class diagram.

---

## 📄 เอกสารประกอบโครงการ (Project Documentation)

| เอกสาร                     | รายละเอียด                                                                            | ลิงก์                                             |
| :------------------------------- | :---------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| System Requirement Specification | ข้อกำหนดความต้องการระบบฉบับเต็ม                                  | [SRS.md](./SRS.md)                                      |
| SDLC Planning                    | แผนดำเนินงาน 7 ขั้นตอน SDLC                                                  | [sdlc-planning.md](./markdown/sdlc-planning.md)         |
| Features Summary                 | สรุปฟังก์ชันระบบ FR/NFR + Role Access Matrix                                    | [features-summary.md](./markdown/features-summary.md)   |
| Data Dictionary                  | พจนานุกรมข้อมูล 10 ตารางฐานข้อมูล                                  | [data-dictionary.md](./markdown/data-dictionary.md)     |
| Project Structure                | โครงสร้างโฟลเดอร์ Monorepo (Frontend + Backend)                                | [project-structure.md](./markdown/project-structure.md) |
| Frontend Pages                   | สรุปหน้าจอ Frontend แยกตามบทบาท                                            | [frontend-pages.md](./markdown/frontend-pages.md)       |
| User Persona                     | วิเคราะห์กลุ่มผู้ใช้จำลอง 3 Personas                                   | [user-persona.md](./markdown/user-persona.md)           |
| Project Scope                    | ขอบเขตระบบเชิงลึก (Actors CRUD, FR, NFR)                                       | [project-scope.md](./markdown/project-scope.md)         |
| UML Diagrams                     | แผนภาพ UML (Use Case, Class, Sequence, Activity)                                          | [UML-Diagrams.md](./markdown/UML-Diagrams.md)           |
| Testing (UAT)                    | แผนและเช็กลิสต์การทดสอบระบบด้วยมือ (Manual Testing Checklist) | [testing-uat.md](./markdown/testing-uat.md)             |
| Summary & Issue Tracker          | สรุปสถานะงานแบบ Kanban พร้อมลิงก์ Issue ทั้งหมด                 | [summary-issue.md](./markdown/summary-issue.md)         |
| Tracker Issue                    | ตารางติดตามสถานะ Issue รายข้อ                                             | [tracker-issue.md](./markdown/tracker-issue.md)         |

---

<p align="center">
  <sub>📄 เอกสารข้อกำหนดระบบฉบับเต็ม: <a href="./SRS.md">SRS.md</a> | 🔗 <a href="https://tnk2209.github.io/ComHub-Csi204/">GitHub Pages</a></sub>
</p>
