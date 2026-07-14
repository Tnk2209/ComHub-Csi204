# เอกสารข้อกำหนดความต้องการของระบบ (System Requirement Specification - SRS)

## โครงการ: ComHub - แพลตฟอร์มอีคอมเมิร์ซสำหรับจัดสเปคและจำหน่ายอุปกรณ์คอมพิวเตอร์ครบวงจร
**เวอร์ชัน:** 1.0  
**ผู้จัดทำ:** นายธนกร สิงห์ก้อม และ นายหาญณรงค์ บุญยืน

---

## สารบัญ

<div class="srs-toc-container">

*   [1. ภาพรวมโครงการ (Project Overview)](#1-ภาพรวมโครงการ-project-overview)
*   [2. เป้าหมายทางธุรกิจและขอบเขตระบบ (Business Goals & Scope)](#2-เป้าหมายทางธุรกิจและขอบเขตระบบ-business-goals--scope)
    *   [เป้าหมายทางธุรกิจ (Business Goals)](#เป้าหมายทางธุรกิจ-business-goals)
    *   [ขอบเขตระบบแยกตามสิทธิ์ผู้ใช้งาน (System Scope by Actors)](#ขอบเขตระบบแยกตามสิทธิ์ผู้ใช้งาน-system-scope-by-actors)
*   [3. ความต้องการด้านฟังก์ชันการทำงาน (Functional Requirements)](#3-ความต้องการด้านฟังก์ชันการทำงาน-functional-requirements)
    *   [3.1 ระบบสำหรับลูกค้า (Customer Frontend)](#31-ระบบสำหรับลูกค้า-customer-frontend)
    *   [3.2 ระบบสำหรับพนักงาน (Staff Back-office)](#32-ระบบสำหรับพนักงาน-staff-back-office)
    *   [3.3 ระบบสำหรับผู้จัดการ (Manager Back-office)](#33-ระบบสำหรับผู้จัดการ-manager-back-office)
    *   [3.4 ระบบสำหรับผู้ดูแลระบบ (Administrator System)](#34-ระบบสำหรับผู้ดูแลระบบ-administrator-system)
*   [4. ความต้องการด้านที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)](#4-ความต้องการด้านที่ไม่ใช่ฟังก์ชัน-non-functional-requirements)
*   [5. สถาปัตยกรรมระบบ (System Architecture)](#5-สถาปัตยกรรมระบบ-system-architecture)
    *   [5.1 โครงสร้างสถาปัตยกรรมเชิงเทคนิคแบบ 3-Tier](#51-โครงสร้างสถาปัตยกรรมเชิงเทคนิคแบบ-3-tier-3-tier-technical-architecture)
    *   [5.2 แผนผังเส้นทางการใช้งานจำแนกตามบทบาทผู้ใช้ (Role-Based Access & Feature Flow)](#52-แผนผังเส้นทางการใช้งานจำแนกตามบทบาทผู้ใช้-role-based-access--feature-flow)
*   [6. แผนการดำเนินงาน 4 สัปดาห์ (Project Timeline)](#6-แผนการดำเนินงาน-4-สัปดาห์-project-timeline)
*   [7. เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Technologies)](#7-เครื่องมือและเทคโนโลยีที่ใช้-tools--technologies)
*   [8. ความเสี่ยงและการจัดการความเสี่ยง (Risk Management)](#8-ความเสี�### ขอบเขตระบบแยกตามสิทธิ์ผู้ใช้งาน (System Scope by Actors)
ระบบ ComHub แบ่งการใช้งานออกเป็น 4 บทบาทหลัก ดังนี้:

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
- **ตั้งค่ากฎความเข้ากันได้ (Rules Configuration)**
  - เพิ่มกฎ Socket Matching : กำหนดจับคู่ Socket ของ CPU กับ Mainboard (เช่น AM5, LGA1700)
  - แก้ไขกฎ Socket : อัปเดตเงื่อนไขการจับคู่ Socket
  - เพิ่มกฎ Size Limitation : กำหนดขีดจำกัดขนาด/ความยาวการ์ดจอกับเคส
  - แก้ไขกฎ Size : อัปเดตเงื่อนไขการตรวจสอบขนาด
- **ตั้งค่ากำลังไฟ (Power Allocation)**
  - กำหนด TDP Watts : ระบุอัตรากำลังไฟฟ้า (Watts) ให้กับอุปกรณ์แต่ละชิ้นในระบบ
  - แก้ไข TDP Watts : อัปเดตค่า TDP ของอุปกรณ์ที่มีอยู่
- **จัดการสิทธิ์ผู้ใช้ (Role & Access Control)**
  - สร้างบัญชี Staff/Manager : เพิ่มบัญชีพนักงานหรือผู้จัดการใหม่เข้าระบบ
  - แก้ไขสิทธิ์ : เปลี่ยนบทบาท (Role) ของผู้ใช้ระหว่าง Staff/Manager
  - ลบบัญชี : ยกเลิกบัญชีพนักงานที่ไม่ใช้งานแล้ว
- **อนุมัติสลิปโอนเงิน (Payment Review)**
  - ดูสลิปรอตรวจ : แสดงรายการออเดอร์ที่อัปโหลดสลิปแล้วรอการตรวจสอบ
  - อนุมัติการชำระเงิน (Approved) : ยืนยันสลิปถูกต้อง ส่งคิวต่อให้ช่างประกอบ
  - ปฏิเสธการชำระเงิน (Rejected) : ปฏิเสธสลิปปลอม ระบบจะทำ Stock Rollback คืนสินค้ากลับคลังอัตโนมัติ

## 3. ความต้องการด้านฟังก์ชันการทำงาน (Functional Requirements)

| รหัส | ฟังก์ชันระบบ | รายละเอียด | สิทธิ์ผู้ใช้ |
|:---:|:---|:---|:---:|
| **SYS-01** | Authentication & Auth | สมัครสมาชิก, ล็อกอิน, JWT Token Verification | ทุกบทบาท |
| **SYS-02** | Cart & Checkout Flow | จัดการตะกร้า (LocalStorage), กรอกที่อยู่, อัปโหลดสลิป | C, S |
| **SYS-03** | Client-side WebP Compression | บีบอัดรูปภาพสลิป/รีวิวเป็น WebP 80% ผ่าน Canvas API | C, M, A |
| **C-01** | PC Builder Page | เลือกชิ้นส่วน 7 หมวดหมู่ พร้อม Bento Grid UI | C |
| **C-02** | Compatibility Checker | กรอง Socket, ขนาดเคส/GPU, ชนิด RAM (DDR4/DDR5) | C, A |
| **C-03** | Wattage Calculator | คำนวณ TDP รวม, แนะนำ PSU ที่จ่ายไฟ ≥ 1.2x | C |
| **C-04** | Pre-built Templates | เซ็ตคอมสำเร็จรูปตามงบ กดสั่งซื้อทันทีหรือปรับแต่งต่อ | C |
| **C-05** | Product Comparison | เปรียบเทียบสเปคเชิงเทคนิค สูงสุด 3 ชิ้น | C |
| **C-06** | Wishlist & Stock Alert | บันทึกของโปรด, แจ้งเตือนเมื่อสต็อกกลับมา | C |
| **C-07** | Review with Photos | รีวิว 1-5 ดาว, ข้อความ, อัปโหลดรูปถ่ายจริง | C |
| **C-08** | PC Build Gallery | แกลเลอรี่คอมมูนิตี้ พร้อมปุ่มโคลนสเปค | C, M |
| **C-09** | Assembly Tracking UI | ติดตาม 4 ขั้นตอน + ดูผลอุณหภูมิ Burn-in | C, S |
| **S-01** | Build Assembly Management | คิวงานประกอบ, อัปเดตสถานะ Real-time | S |
| **S-02** | Burn-in Test Record | บันทึกอุณหภูมิ CPU/GPU, ผลประเมิน Pass/Fail | S |
| **S-03** | Logistics | พิมพ์ใบจัดส่ง, บันทึก Tracking Number | S |
| **M-01** | Pre-built Management | CRUD เทมเพลตสเปคแนะนำ + แท็กงบประมาณ | M |
| **M-02** | Gallery Moderation | อนุมัติรีวิว/ภาพ, ปักหมุดโพสต์ | M |
| **M-03** | Sales Dashboard | กราฟยอดขาย, สินค้ายอดนิยม, เตือนสต็อกต่ำ | M |
| **A-01** | Database Management CRUD | เพิ่ม/ลบ/แก้ไข/Soft Delete (is_active) สินค้า | A |
| **A-02** | Rules Configuration | ตั้งค่า Socket Matching, Size Limitation | A |
| **A-03** | Power Allocation Settings | กำหนด TDP Watts ให้อุปกรณ์ทุกชิ้น | A |
| **A-04** | Role & Access Control | สร้างบัญชี Staff/Manager, กำหนดสิทธิ์ RBAC | A |

> **หมายเหตุ:** C = Customer, S = Staff, M = Manager, A = Admin

## 4. ความต้องการด้านที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)

| ด้าน | ข้อกำหนด |
|:---|:---|
| **Performance** | Compatibility Checker และ Wattage Calculator ต้องตอบสนองภายใน **500ms** (Sub-second) |
| **Security & RBAC** | Password Hashing (bcrypt), JWT Verification, แยกสิทธิ์ API Endpoint ตาม Role |
| **Reliability** | ข้อมูลตะกร้าและสเปคค้างจัดบันทึกใน **LocalStorage** ป้องกันเน็ตหลุด, ระบบป้องกัน Overselling |
| **UI/UX Standards** | Fullscreen Responsive (100% width), ฟอนต์คู่ `IBM Plex Sans Thai` + `Inter`, ธีม Dark Mode |
| **Cloud Optimization** | รูปภาพอัปโหลดถูกบีบอัดเป็น **WebP 80%** ผ่าน Canvas API ก่อนส่งขึ้น Supabase Storage (1 GB) |

---

## 5. สถาปัตยกรรมระบบ (System Architecture)

ระบบจัดโครงสร้างสถาปัตยกรรม โดยแบ่งแยกส่วนแสดงผล ส่วนประมวลผลคำสั่ง และส่วนฐานข้อมูลออกจากกันผ่าน REST APIs เพื่อให้สามารถรองรับการปรับขยาย (Scalability) ในอนาคต


### 5.1 โครงสร้างสถาปัตยกรรมเชิงเทคนิคแบบ 3-Tier (3-Tier Technical Architecture)

*(ดูไฟล์โค้ด Mermaid แยกต่างหากได้ที่ [architecture.mermaid](./architecture.mermaid))*

```mermaid
graph TD
    %% Styling Configuration    
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef logic fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef storage fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#fff;
    
    subgraph Client_Layer ["Client & Frontend Layer (Vercel Host)"]
        A["React SPA Frontend"]:::client
        B["Tailwind CSS UI Component"]:::client
        C["LocalStorage Cache (Cart & Temp Build)"]:::client
    end
    
    subgraph Gateway_Layer ["API Gateway & Middleware Layer"]
        D["API Gateway / Routing"]:::logic
        E["JWT Auth & Role-Based Middleware"]:::logic
    end
    
    subgraph Service_Layer ["Business Logic & Application Layer (Render Host)"]
        F["Node.js & Express API Server"]:::logic
        G["Compatibility Engine (Socket/Size Checks)"]:::logic
        H["TDP Calculator Engine"]:::logic
        I["Order & Assembly Processor"]:::logic
    end
    
    subgraph Database_Storage_Layer ["Data Storage Layer (Cloud)"]
        J[(Supabase / PostgreSQL DB)]:::storage
    end

    %% Flow Relationships
    A <-->|User Interaction| B
    A <-->|Local Read/Write| C
    A ==>|HTTP Request / JSON| D
    D -->|Intercept & Validate| E
    E -->|Valid Request| F
    
    F -->|Run Checks| G
    F -->|Sum TDP Power| H
    F -->|Update Status| I
    F <-->|Queries / Transactions| J
    
    %% Direction Legend
    linkStyle default stroke:#64748b,stroke-width:1.5px;
    linkStyle 2 stroke:#38bdf8,stroke-width:2.5px;
    linkStyle 8 stroke:#38bdf8,stroke-width:2.5px;
```

### 5.2 แผนผังเส้นทางการใช้งานจำแนกตามบทบาทผู้ใช้ (Role-Based Access & Feature Flow)

แผนภาพนี้แสดงความเกี่ยวข้องระหว่างบทบาทของผู้ใช้งาน (Customer, Staff, Manager, Admin) อินเตอร์เฟสการเข้าใช้งาน (Interfaces) และฟังก์ชันการเข้าใช้งานเฉพาะเจาะจงที่แบ่งสิทธิ์ไว้ชัดเจน

*(ดูไฟล์โค้ด Mermaid แยกต่างหากได้ที่ [roles_flow.mermaid](./roles_flow.mermaid))*

```mermaid
graph LR
    %% Styling Configuration
    classDef customer fill:#0284c7,stroke:#bae6fd,stroke-width:2px,color:#fff;
    classDef staff fill:#059669,stroke:#a7f3d0,stroke-width:2px,color:#fff;
    classDef manager fill:#d97706,stroke:#fde68a,stroke-width:2px,color:#fff;
    classDef admin fill:#dc2626,stroke:#fecaca,stroke-width:2px,color:#fff;
    classDef system fill:#0f172a,stroke:#334155,stroke-width:1px,color:#fff;

    subgraph Roles ["ผู้ใช้งาน (User Roles)"]
        U1["ลูกค้า (Customer)"]:::customer
        U2["พนักงาน (Staff)"]:::staff
        U3["ผู้จัดการ (Manager)"]:::manager
        U4["ผู้ดูแลระบบ (Admin)"]:::admin
    end

    subgraph Interface ["อินเตอร์เฟส (User Interfaces)"]
        I1["Customer Web Portal"]:::system
        I2["Back-Office Dashboard UI"]:::system
    end

    subgraph Operations ["ฟังก์ชันการทำงาน (Main Operations)"]
        %% Customer features
        F1["จัดสเปคคอมฯ & เช็คการกินไฟ (Advanced PC Builder)"]:::system
        F2["ค้นหาสินค้า & เปรียบเทียบสเปค"]:::system
        F3["สั่งซื้อสินค้า & ติดตามสถานะประกอบ"]:::system
        
        %% Staff features
        F4["จัดการการประกอบเครื่อง & บันทึก Burn-in Test"]:::system
        F5["จัดการขนส่ง & บันทึก Tracking"]:::system
        
        %% Manager features
        F6["จัดการสเปคแนะนำ & อนุมัติแกลลอรี่"]:::system
        F7["ดูแดชบอร์ดยอดขาย & สต็อก"]:::system
        
        %% Admin features
        F8["จัดการฐานข้อมูล & ตั้งค่าเงื่อนไขเทคนิค (Socket/TDP)"]:::system
        F9["จัดการสิทธิ์และบัญชีผู้ใช้งาน (RBAC)"]:::system
    end

    subgraph Data ["ระบบข้อมูล (Database)"]
        DB[("Supabase / PostgreSQL DB")]:::system
    end

    %% Customer Flow
    U1 ==> I1
    I1 --> F1
    I1 --> F2
    I1 --> F3
    
    %% Staff Flow
    U2 ==> I2
    I2 --> F4
    I2 --> F5
    
    %% Manager Flow
    U3 ==> I2
    I2 --> F6
    I2 --> F7
    
    %% Admin Flow
    U4 ==> I2
    I2 --> F8
    I2 --> F9

    %% Database connections
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 ===> DB

    %% Direction Styling
    linkStyle default stroke:#64748b,stroke-width:1.5px;
    linkStyle 0,4,6,8 stroke:#10b981,stroke-width:2.5px;
```

---

## 6. แผนการดำเนินงาน 4 สัปดาห์ (Project Timeline)

| สัปดาห์ | ขั้นตอน SDLC | กิจกรรม (Activities) | รายละเอียดโดยย่อ (Brief Description) | ระยะเวลา |
|:---:|:---|:---|:---|:---:|
| **1** | Planning + Analysis | วิเคราะห์และออกแบบระบบ | สรุป Requirement (FR/NFR), จัดทำ UI Mockup บน Figma, ออกแบบโครงสร้างข้อมูล Data Dictionary 10 ตาราง, เขียน UML Use Case & Class Diagram, วิเคราะห์ User Persona, แผนบริหารความเสี่ยง | 7 วัน |
| **2** | Design + Development | พัฒนาส่วนหน้าบ้าน (Frontend) | ออกแบบ API JSON Schema, สร้าง Component ต่างๆ ด้วย React SPA, จัดโครงร่างหน้าเว็บด้วย Tailwind CSS, พัฒนาหน้า Home/Builder/Cart/Checkout/Tracking/Gallery/Community | 7 วัน |
| **3** | Development | พัฒนาส่วนหลังบ้าน (Backend & Database) | ติดตั้ง PostgreSQL (Supabase), สร้าง REST API Server ด้วย Node.js/Express + TypeScript, ระบบ JWT Auth + RBAC Middleware, เชื่อมต่อ Compatibility Logic & TDP Calculator, ระบบอัปโหลดรูปภาพ Supabase Storage | 7 วัน |
| **4** | Testing + Deployment + Maintenance | ทดสอบและนำเสนอ | ทำการทดสอบ UAT ตาม Flow จริงทุก Actor, ทดสอบ Security (RBAC/JWT), ทดสอบ Performance (< 500ms), แก้บั๊ก, Deploy ขึ้น Vercel, เตรียมสไลด์นำเสนอผลงาน | 7 วัน |

---

## 7. เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Technologies)

### 💻 Frontend

| เทคโนโลยี | หน้าที่ |
|:---|:---|
| React + Vite | สร้าง SPA, Hot Module Replacement, คอมไพล์เร็ว |
| Tailwind CSS | จัดแต่ง UI, Responsive Design, Dark Mode Theme |
| LocalStorage | เก็บข้อมูลตะกร้าสินค้าและสเปคจัดค้างชั่วคราวฝั่ง Client |
| HTML5 Canvas API | บีบอัดรูปภาพเป็น WebP ก่อนอัปโหลด |

### ⚙️ Backend

| เทคโนโลยี | หน้าที่ |
|:---|:---|
| Node.js + Express | เขียน REST API Server |
| TypeScript | เพิ่ม Type Safety ให้ API |
| JWT (JSON Web Token) | ระบบยืนยันตัวตนและจัดการ Session |
| bcrypt | เข้ารหัสรหัสผ่านผู้ใช้ (Password Hashing) |

### 🗄️ Database

| เทคโนโลยี | หน้าที่ |
|:---|:---|
| PostgreSQL (Supabase Cloud) | ฐานข้อมูลหลัก 10 ตาราง (users, products, orders, order_items, reviews, prebuilt_templates, template_items, wishlist_items, assembly_records, order_logs) |
| Supabase Storage | จัดเก็บไฟล์รูปภาพสลิปและรีวิวบนคลาวด์ |
| JSONB Column | เก็บสเปคเทคนิคของสินค้าแบบยืดหยุ่น (socket, form_factor, tdp, supported_ram) |

### 🎨 Design Tool

| เครื่องมือ | หน้าที่ |
|:---|:---|
| Figma | ออกแบบ UI Mockup และ Wireframe |
| Lucidchart | วาด System Diagram |
| Draw.io | วาด Flowchart และ Activity Diagram |
| StarUML | วาด UML Diagram (Use Case, Class, Sequence) |

### 🔀 Version Control

| เครื่องมือ | หน้าที่ |
|:---|:---|
| Git | ระบบควบคุมเวอร์ชัน |
| GitHub | โฮสต์โค้ด, Collaboration, Pull Request |

### ☁️ Hosting & Deployment

| เครื่องมือ | หน้าที่ |
|:---|:---|
| Vercel (Frontend) | Static Web Hosting สำหรับ React SPA |
| Vercel (Backend) | Serverless Functions สำหรับ Express API |

---

## 8. ความเสี่ยงและการจัดการความเสี่ยง (Risk Management)

| รหัสความเสี่ยง | คำอธิบายความเสี่ยง (Risk Description) | แนวทางการแก้ไขและจัดการ (Mitigation Strategy) |
| :--- | :--- | :--- |
| **R-01** | ข้อมูลการจับคู่ Compatibility ซับซ้อน ทำให้ระบบโหลดช้า | ทำการ Caching ข้อมูลเงื่อนไขเทคนิคไว้ที่ฝั่ง Client (LocalStorage) เพื่อทำการวิเคราะห์ก่อนส่งคำขอไป Backend |
| **R-02** | แอดมินกรอกสเปคพลังงาน (TDP) ของอุปกรณ์ผิดพลาด | ทำระบบกรอกฟอร์ม Validation ฝั่งแอดมิน เพื่อบังคับให้กรอกเป็นตัวเลขบวก และมีระบบแจ้งเตือนกรณีข้อมูล TDP ผิดปกติ |
| **R-03** | สมาชิกในทีมทำการ Push โค้ดทับกันใน GitHub | กำหนดนโยบาย Git Workflow อย่างชัดเจน (เช่น ห้ามแก้ไขสาขา main โดยตรง, แยกใช้สาขา `feature/[task-slug]` และทำการรีวิวผ่าน Pull Request) |
