import re

sdlc_report_md = """# 📘 เล่มรายงานโครงงานพัฒนาระบบซอฟต์แวร์ตามกระบวนการ SDLC 7 ขั้นตอน

**ชื่อโครงการ:** ComHub — แพลตฟอร์มอีคอมเมิร์ซสำหรับจัดสเปคและจำหน่ายอุปกรณ์คอมพิวเตอร์ครบวงจร  
**รายวิชา:** CSI204 — วิศวกรรมซอฟต์แวร์ (Software Engineering)  
**สถาบัน:** มหาวิทยาลัยศรีปทุม (Sripatum University)  
**ผู้จัดทำ:** นายธนกร สิงห์ก้อม และ นายหาญณรงค์ บุญยืน  
**ระบบใช้งานจริง (Public URL):** [https://comhub-frontend.vercel.app](https://comhub-frontend.vercel.app)

---

## 📌 สารบัญเล่มรายงาน (Table of Contents)

1. [บทที่ 1: ขั้นตอนที่ 1 - Planning (การวางแผนโครงการ)](#บทที่-1-ขั้นตอนที่-1---planning-การวางแผนโครงการ)
2. [บทที่ 2: ขั้นตอนที่ 2 - Analysis (การวิเคราะห์ระบบ)](#บทที่-2-ขั้นตอนที่-2---analysis-การวิเคราะห์ระบบ)
3. [บทที่ 3: ขั้นตอนที่ 3 - Design (การออกแบบระบบ)](#บทที่-3-ขั้นตอนที่-3---design-การออกแบบระบบ)
4. [บทที่ 4: ขั้นตอนที่ 4 - Development (การพัฒนาระบบ)](#บทที่-4-ขั้นตอนที่-4---development-การพัฒนาระบบ)
5. [บทที่ 5: ขั้นตอนที่ 5 - Testing (การทดสอบระบบและ UAT)](#บทที่-5-ขั้นตอนที่-5---testing-การทดสอบระบบและ-uat)
6. [บทที่ 6: ขั้นตอนที่ 6 - Deployment (การติดตั้งและเผยแพร่)](#บทที่-6-ขั้นตอนที่-6---deployment-การติดตั้งและเผยแพร่)
7. [บทที่ 7: ขั้นตอนที่ 7 - Maintenance (การบำรุงรักษาและพัฒนาต่อยอด)](#บทที่-7-ขั้นตอนที่-7---maintenance-การบำรุงรักษาและพัฒนาต่อยอด)

---

## บทที่ 1: ขั้นตอนที่ 1 - Planning (การวางแผนโครงการ)

### 1.1 ที่มาและความสำคัญของปัญหา (Problem Statement)
ผู้ซื้อคอมพิวเตอร์ประกอบมักประสบปัญหาความซับซ้อนของอุปกรณ์ เช่น อุปกรณ์ไม่รองรับกัน (Compatibility Error เช่น CPU Socket ไม่ตรงกับ Mainboard หรือ RAM Type ไม่ถูกต้อง) และปัญหาการคำนวณกำลังไฟ (Wattage Calculation) ที่ไม่สอดคล้องกับ Power Supply Unit (PSU) ทำให้เกิดความเสี่ยงอุปกรณ์เสียหายหรือทำงานไม่เสถียร

### 1.2 วัตถุประสงค์โครงการ (Project Objectives)
1. เพื่อพัฒนาระบบอีคอมเมิร์ซจัดสเปคคอมพิวเตอร์ที่มีระบบ **Compatibility Checker** ตรวจสอบความเข้ากันได้ของอุปกรณ์อัตโนมัติ
2. เพื่อพัฒนาระบบ **Wattage Calculator** คำนวณกำลังไฟ TDP รวม และแนะนำ PSU ขนาดที่เหมาะสม
3. เพื่อพัฒนาระบบชำระเงิน ตรวจสอบสลิปโอนเงิน อนุมัติออเดอร์ และติดตามสถานะพัสดุผ่าน Stepper 5 ขั้นตอน

### 1.3 ขอบเขตโครงการ (System Scope - MVP Version)
ระบบแบ่งออกเป็น **2 บทบาทหลัก (2 Main Actors)**:
- **Customer (ลูกค้า):** ค้นหา กรอง เปรียบเทียบสินค้า, จัดสเปคคอมพิวเตอร์ (PC Builder 7 หมวด), คำนวณกำลังไฟ, สั่งซื้อสินค้าพร้อมแนบสลิป, และติดตามสถานะพัสดุ
- **Staff / Admin (ผู้ดูแลระบบ):** ล็อกอินแอดมิน (RBAC Guard), จัดการสินค้า (Product CRUD), ตรวจสอบและอนุมัติสลิปโอนเงิน (พร้อมระบบคืนสต็อก), จัดการเลขพัสดุ Tracking และดู Dashboard รายงานยอดขาย

### 1.4 การบริหารจัดการความเสี่ยง (Risk Management)
- **ความเสี่ยงข้อมูลซับซ้อน:** ทำ Caching เงื่อนไขเทคนิคไว้ที่ Client LocalStorage
- **ความเสี่ยงไฟล์อันตราย:** ทำ Mime-type Validation และ Client Compression รูปสลิปเป็น WebP $<100\text{KB}$

---

## บทที่ 2: ขั้นตอนที่ 2 - Analysis (การวิเคราะห์ระบบ)

### 2.1 วิเคราะห์กลุ่มผู้ใช้งานจำลอง (User Persona Analysis)
- **Persona 1 (Customer):** คุณสมชาย — Gamers / PC Builder Enthusiast ต้องการจัดสเปคคอมที่มั่นใจว่าอุปกรณ์รองรับกันและได้รับของชัวร์
- **Persona 2 (Staff / Admin):** คุณสมศักดิ์ — Operations & Store Manager ต้องการตรวจสอบสลิปอย่างรวดเร็ว อนุมัติออเดอร์ และดูรายงานยอดขาย

### 2.2 ข้อกำหนดความต้องการของระบบ (System Requirements)
- **Functional Requirements (FR):** SYS-01..04 (Auth/JWT), C-01..12 (Customer Features), A-01..06 (Admin Features)
- **Non-Functional Requirements (NFR):** Response Time $< 500\text{ms}$, Password Hashing (`bcrypt`), JWT Auth, Responsive Design 320px-4K, Dark Mode Theme

### 2.3 แผนภาพ Use Case Diagram
แสดงสิทธิ์การใช้งานแยกตามสิทธิ์ระหว่าง Customer (สมัครสมาชิก, จัดสเปค, สั่งซื้อ, แนบสลิป, ติดตามพัสดุ) และ Admin (จัดการคลังสินค้า, อนุมัติสลิป, ใส่เลข Tracking, ดู Dashboard)

### 2.4 แผนภาพ Class Diagram
แสดงคลาสหลัก `User`, `Customer`, `Admin`, `Product`, `CartItem`, `Order`, `OrderLog`, `Review` และความสัมพันธ์ระหว่าง Entity

---

## บทที่ 3: ขั้นตอนที่ 3 - Design (การออกแบบระบบ)

### 3.1 สถาปัตยกรรมระบบเชิงเทคนิค (3-Tier Architecture)
- **Client Layer:** React.js SPA, TailwindCSS, LocalStorage Persistence (Vercel Host)
- **Business Logic Layer:** Node.js / Express REST API Server, JWT Middleware, Compatibility Engine (Render Host)
- **Database Layer:** Supabase PostgreSQL Cloud / JSON Schema Data Store

### 3.2 แผนภาพลำดับขั้นตอน (Sequence Diagrams)
- **Sequence Diagram 3.1:** PC Builder & Compatibility Check Sequence Flow
- **Sequence Diagram 3.2:** Checkout, Slip Upload & Admin Verification Sequence Flow

### 3.3 การออกแบบส่วนติดต่อผู้ใช้ (UI Wireframes & Prototype)
โครงสร้าง 5 หน้าจอหลัก: Catalog Page, PC Builder (Bento Grid Layout), Product Compare Table, Checkout with Slip Drag & Drop Area, และ Order Tracking Timeline

### 3.4 การออกแบบฐานข้อมูล (Database Design & Data Dictionary)
ตารางข้อมูลหลัก 7 ตาราง: `users`, `products`, `orders`, `order_items`, `reviews`, `wishlist_items`, `order_logs`

---

## บทที่ 4: ขั้นตอนที่ 4 - Development (การพัฒนาระบบ)

### 4.1 เทคโนโลยีที่ใช้ในการพัฒนา (Tech Stack & Libraries)
- **Frontend:** React + Vite, TailwindCSS, Lucide Icons, LocalStorage
- **Backend:** Node.js, Express.js, TypeScript, JWT, bcrypt
- **Database & Storage:** Supabase PostgreSQL Cloud, Supabase Storage, Client Canvas WebP Compression

### 4.2 อัลกอริทึมหลักของระบบ (Core Engines)
- **Compatibility Engine:** เปรียบเทียบ `CPU.socket === Mainboard.socket`, `Mainboard.size <= Case.max_mb_size`, `Mainboard.ram_type === RAM.type`
- **Wattage Calculator Engine:** คำนวณ TDP รวม $Total TDP = CPU.tdp + GPU.tdp$, แนะนำ PSU ขนาด $PSU \ge Total TDP \times 1.2$

---

## บทที่ 5: ขั้นตอนที่ 5 - Testing (การทดสอบระบบและ UAT)

### 5.1 รายงานผลการทดสอบ User Acceptance Testing (UAT Report)
ดำเนินการทดสอบรวมทั้งสิ้น **35 ชุดการทดสอบ** ( Pass Rate **100%** ) บนสภาพแวดล้อมใช้งานจริง [https://comhub-frontend.vercel.app](https://comhub-frontend.vercel.app)

### 5.2 ตารางสรุปผลการทดสอบแยกตามหมวดหมู่
1. **Customer Persona Functional (12 ชุด):** ผ่าน 100%
2. **Staff / Admin Persona Functional (6 ชุด):** ผ่าน 100%
3. **Security & Vulnerability Tests (8 ชุด):** ผ่าน 100% (ป้องกัน File Upload, DoS Bomb, Price Tampering, Direct Admin Access, XSS, Race Condition, JWT Invalid, Sensitive Data Exposure)
4. **Data Validation & Boundary Edge Cases (5 ชุด):** ผ่าน 100%
5. **UI/UX & Performance Under Load (4 ชุด):** ผ่าน 100%

---

## บทที่ 6: ขั้นตอนที่ 6 - Deployment (การติดตั้งและเผยแพร่)

### 6.1 สภาพแวดล้อมในการติดตั้งระบบ (Deployment Environment)
- **Frontend Hosting:** Vercel Static Web Hosting (Production Deployment)
- **Backend API Hosting:** Render Cloud Platform / Vercel Serverless Functions
- **Database Hosting:** Supabase Cloud Infrastructure (Transaction Pooler Port 6543)

### 6.2 ลิงก์ระบบใช้งานจริง
- **Website URL:** [https://comhub-frontend.vercel.app](https://comhub-frontend.vercel.app)
- **GitHub Repository:** [https://github.com/Tnk2209/ComHub-Csi204](https://github.com/Tnk2209/ComHub-Csi204)

---

## บทที่ 7: ขั้นตอนที่ 7 - Maintenance (การบำรุงรักษาและพัฒนาต่อยอด)

### 7.1 บันทึกการแก้ไขปัญหา (Issue Tracking Log)
- **ISSUE-01:** แก้ไขปัญหาระบบต่อ DB บน Render (เปลี่ยนใช้ Supabase Transaction Pooler Port 6543 + SSL)
- **ISSUE-02:** แก้ไขปัญหา Slash ท้าย URL ใน `apiClient.js`
- **ISSUE-03:** แก้ไขปัญหา Refresh หน้าเว็บแล้วขึ้น 404 บน Vercel (เพิ่ม `vercel.json` rewrite rule)

### 7.2 แนวทางพัฒนาต่อยอดในอนาคต (Future Enhancements)
1. เชื่อมต่อระบบ Payment Gateway อัตโนมัติ (Omise / Stripe)
2. ขยายฐานข้อมูลเป็น PostgreSQL Full Production บน Cloud Cluster
3. เพิ่มระบบแจ้งเตือนผ่าน LINE Notify เมื่อออเดอร์มีการเปลี่ยนสถานะ
"""

with open('docs/SDLC_FULL_REPORT.md', 'w', encoding='utf-8') as f:
    f.write(sdlc_report_md)

print("Generated docs/SDLC_FULL_REPORT.md successfully!")
