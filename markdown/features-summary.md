# เอกสารสรุปข้อกำหนดความต้องการระบบ ComHub (System Requirements Summary) - MVP Version

เอกสารนี้รวบรวมและจำแนกความต้องการด้านฟังก์ชันการทำงาน (**Functional Requirements**) และความต้องการที่ไม่ใช่ฟังก์ชัน (**Non-Functional Requirements**) ของระบบ **ComHub** ตามที่กำหนดไว้ในคู่มือขอบเขตระบบและเอกสารข้อกำหนด (TOR) เพื่อเป็นแนวทางและพิมพ์เขียวในการพัฒนาและตรวจรับระบบตามหลัก SDLC

> **📝 หมายเหตุ MVP Scope:** ระบบได้ปรับลดเป็น 2 บทบาทหลัก (Customer และ Admin) เพื่อให้เหมาะสมกับกรอบเวลาการพัฒนา

---

## 👥 ผู้ใช้งานและสิทธิ์การเข้าถึงระบบ (Actors & Role-Based Access Control)

ระบบแบ่งออกเป็น 2 บทบาทหลัก ซึ่งจะมีสิทธิ์เข้าถึงฟังก์ชันต่างๆ ต่างกันดังนี้:
1. **ลูกค้า (Customer - C):** ผู้ใช้งานทั่วไปที่ต้องการจัดสเปคคอมพิวเตอร์ เลือกซื้ออุปกรณ์ไอที และติดตามสถานะออเดอร์
2. **ผู้ดูแลระบบ (Administrator - A):** ผู้ควบคุมโครงสร้างระบบ จัดการสินค้า อนุมัติการชำระเงิน อัปเดตสถานะออเดอร์ และดู Dashboard

---

## 📋 1. ความต้องการด้านฟังก์ชันการทำงาน (Functional Requirements)

> ดู [FR/NFR Matrix ฉบับสมบูรณ์](./project-scope.md) สำหรับตารางฟังก์ชัน (SYS-XX, C-XX, A-XX) ครบทุก role — **project-scope.md** คือแหล่งข้อมูลหลัก
>
> **ฟีเจอร์ที่ถูกตัดออกจาก MVP:** Pre-built Templates, PC Build Gallery, Stock Alert, Coupon System, Staff Assembly Queue, Manager Moderation, Burn-in Testing

---

## ⚙️ 2. ความต้องการที่ไม่ใช่ฟังก์ชันการทำงาน (Non-Functional Requirements)

> ดู [project-scope.md §3 NFR](./project-scope.md) สรุปสั้น: Performance < 500ms, bcrypt + JWT RBAC (2 roles), LocalStorage Reliability, Dark Mode + IBM Plex/Inter, WebP 80% (Mockup สำหรับ payment slip)
