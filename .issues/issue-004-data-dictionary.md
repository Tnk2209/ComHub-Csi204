# Issue 004: SDLC Phase 2 (Analysis) - Database Schema Design & Data Dictionary Definition

## What to build
ออกแบบโครงสร้างความสัมพันธ์ข้อมูลของระบบ ComHub และจัดทำ Data Dictionary ระบุรายละเอียดฟิลด์ ชนิดข้อมูล (Data Types) และความสัมพันธ์ของแต่ละตารางอย่างเป็นระบบ

## Acceptance criteria
- [x] มีโครงสร้างข้อมูลของตารางหลักและตารางสัมพันธ์ทั้งหมด 10 ตาราง ได้แก่ Users, Products, Orders, OrderItems, Reviews, PrebuiltTemplates, TemplateItems, WishlistItems, AssemblyRecords, OrderLogs, GalleryPosts
- [x] ระบุชนิดข้อมูล, ข้อมูล Primary Key (PK), Foreign Key (FK), Constraints และรายละเอียดของทุกลำดับฟิลด์ในรูปเล่มวิเคราะห์
- [x] ออกแบบข้อมูลคุณสมบัติเฉพาะทางแบบยืดหยุ่นในคอลัมน์ `specifications` (JSONB) ในตารางสินค้า เพื่อใช้ในการทำ Compatibility Check (เช่น socket, form_factor, gpu_length, max_gpu_length, tdp, wattage) และกฎการจับคู่แรมแบบอาเรย์ (supported_ram) รวมไปถึงระบบเปิดปิดสัญญาณเตือนเติมของสต็อก (is_alert_enabled) ในรายการโปรด

## Blocked by
- [Issue 003: Functional & Non-Functional Requirements Definition](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-003-requirements-specification.md)
