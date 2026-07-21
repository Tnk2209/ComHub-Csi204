# 🧪 เอกสารเช็กลิสต์การทดสอบระบบด้วยมือระดับกรณีการใช้งาน (Use Case-level UAT Checklist) - MVP Version

เอกสารฉบับนี้ใช้สำหรับเช็กลิสต์ทดสอบระบบแบบ **Manual Testing (UAT)** ของแพลตฟอร์ม **ComHub** โดยแยกหัวข้อเช็กลิสต์แบบละเอียด **1 Use Case (Action) ต่อ 1 แถวการทดสอบ** เพื่อตรวจสอบความถูกต้องของระบบในทุกๆ การกระทำของผู้ใช้งานตามที่กำหนดไว้ใน [Use Case Diagram (usecasediagram.mermaid)](./usecasediagram.mermaid) และ [ขอบเขตระบบ (project-scope.md)](./project-scope.md)

> **📝 หมายเหตุ MVP Scope:** เอกสารนี้ได้ปรับลดเพื่อให้เหมาะสมกับ MVP โดยตัด test cases สำหรับ Pre-built Templates, PC Build Gallery, Stock Alert, Coupon, Staff workflows, Manager workflows, และ Burn-in Testing ออก

---

## 👤 1. ฟังก์ชันฝั่งลูกค้า (Customer Use Cases)

### 1.1 การจัดการบัญชีและข้อมูลทั่วไป
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-01** | **สมัครสมาชิก (C_Register)** | กรอกรายละเอียดสมัครสมาชิกใหม่ในฟอร์ม แล้วกดบันทึก | บัญชีผู้ใช้ถูกสร้างใหม่ในตารางฐานข้อมูลสำเร็จ | `[ ] Pass` / `[ ] Fail` |
| **UC-03** | **ดูรายละเอียดสินค้า (C_ViewProduct)** | คลิกเข้าสู่หน้ารายละเอียดสินค้าของอุปกรณ์ไอทีชิ้นใดชิ้นหนึ่ง | แสดงรายละเอียด ข้อมูลราคา และสเปคเทคนิคจาก JSONB ครบถ้วน | `[ ] Pass` / `[ ] Fail` |

---

### 1.2 การจัดสเปคคอมพิวเตอร์ (PC Builder)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-04** | **เข้าระบบ PC Builder (C_OpenBuilder)** | คลิกเข้าหน้า "PC Builder" หรือ "จัดสเปคเอง" | เปิดหน้าต่างการจัดสเปคให้เลือกอุปกรณ์ 7 หมวดหมู่แยกเรียงแถว | `[ ] Pass` / `[ ] Fail` |
| **UC-05** | **เลือกชิ้นส่วน CPU (C_SelectCPU)** | กดปุ่ม "เลือก CPU" แล้วเลือกรุ่นหนึ่งจากรายการ | CPU ถูกบันทึกลงสเปคพร้อมราคา และแสดงใน summary panel | `[ ] Pass` / `[ ] Fail` |
| **UC-06** | **เลือก Mainboard (C_SelectMB)** | เลือก Mainboard หนึ่งรุ่น | Mainboard ถูกบันทึก พร้อมแสดง socket/chipset ใน summary | `[ ] Pass` / `[ ] Fail` |
| **UC-07** | **ตรวจสอบ Socket CPU-MB (C_CheckSocket)** | เลือก CPU Intel LGA1700 และ Mainboard AMD AM5 | ระบบแสดงข้อความเตือน "Socket ไม่ตรงกัน" ทันที | `[ ] Pass` / `[ ] Fail` |
| **UC-08** | **ตรวจสอบขนาด Mainboard-Case (C_CheckCase)** | เลือก Mainboard ATX และเคส Mini-ITX | ระบบแสดงเตือน "Mainboard ใหญ่เกินเคส" | `[ ] Pass` / `[ ] Fail` |
| **UC-09** | **ตรวจสอบความยาว GPU-Case (C_CheckGPU)** | เลือกการ์ดจอยาว 350mm และเคสรองรับสูงสุด 300mm | ระบบเตือน "การ์ดจอยาวเกินขนาดเคส" | `[ ] Pass` / `[ ] Fail` |
| **UC-10** | **ตรวจสอบชนิด RAM (C_CheckRAM)** | เลือก RAM DDR4 กับ Mainboard รองรับ DDR5 เท่านั้น | ระบบบล็อกหรือแสดงเตือน "ชนิด RAM ไม่รองรับ" | `[ ] Pass` / `[ ] Fail` |
| **UC-14** | **คำนวณกำลังไฟ TDP รวม (C_ViewTDP)** | เพิ่มอุปกรณ์ต่างๆ (CPU, GPU, RAM) และสังเกตกล่อง TDP รวม | ระบบแสดงผลรวมกำลังวัตต์ไฟฟ้าที่อุปกรณ์ทั้งหมดใช้งานสะสมถูกต้อง | `[ ] Pass` / `[ ] Fail` |
| **UC-15** | **แนะนำ PSU ตามเงื่อนไขกำลังไฟ (C_RecommendPSU)**| จัดสเปครวม TDP = 300W แล้วเข้าเปิดดูสินค้าหมวดหมู่ PSU | แนะนำและแสดงเฉพาะ PSU ขนาดกำลังวัตต์ ≥ 360W (300 TDP × 1.2) ขึ้นไป | `[ ] Pass` / `[ ] Fail` |

---

### 1.3 การเปรียบเทียบสินค้า (Product Comparison)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-19** | **เพิ่มสินค้าเข้าเปรียบเทียบ (C_AddCompare)** | กดปุ่ม "เพิ่มเข้าเปรียบเทียบ" ในหน้าสินค้า | สินค้าถูกเพิ่มเข้า Compare Panel สูงสุด 3 ชิ้น | `[ ] Pass` / `[ ] Fail` |
| **UC-20** | **ดูตารางเปรียบเทียบ (C_ViewCompare)** | เข้าชมหน้าเปรียบเทียบเมื่อมีสินค้า 2-3 ชิ้น | แสดงตารางสเปคและราคาเคียงข้างกันชัดเจน | `[ ] Pass` / `[ ] Fail` |

---

### 1.4 รายการสินค้าโปรด (Wishlist)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-23** | **เพิ่มสินค้าเข้า Wishlist (C_AddWish)** | กดปุ่มหัวใจในหน้ารายละเอียดสินค้า | สินค้าถูกบันทึกเข้า wishlist_items | `[ ] Pass` / `[ ] Fail` |
| **UC-24** | **ลบสินค้าจาก Wishlist (C_RemoveWish)** | กดปุ่มหัวใจอีกครั้งหรือกดลบในหน้า Wishlist | สินค้าถูกลบออกจาก wishlist_items | `[ ] Pass` / `[ ] Fail` |

---

### 1.5 รีวิวสินค้า (Reviews)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-25** | **เขียนรีวิวสินค้า (C_WriteReview)** | กรอกคะแนน 1-5 ดาว และข้อความรีวิว แล้วกดส่ง | บันทึกรีวิวลง reviews table โดยไม่มีรูปภาพ (MVP) | `[ ] Pass` / `[ ] Fail` |

---

### 1.6 การสั่งซื้อและชำระเงิน (Cart & Checkout)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-30** | **เพิ่มสินค้าลงตะกร้า (C_AddCart)** | กดปุ่ม "Add to Cart" ในหน้าสินค้า | สินค้าถูกบันทึกลง LocalStorage และแสดงในตะกร้า | `[ ] Pass` / `[ ] Fail` |
| **UC-31** | **แก้ไขจำนวนสินค้าในตะกร้า (C_EditCart)** | ปรับจำนวนสินค้าในตะกร้าเป็น 2 ชิ้น | ยอดรวมคำนวณใหม่ตามจำนวนที่ปรับ | `[ ] Pass` / `[ ] Fail` |
| **UC-32** | **ลบสินค้าจากตะกร้า (C_RemoveCart)** | กดปุ่มลบสินค้าในตะกร้า | สินค้าถูกลบออกจาก LocalStorage | `[ ] Pass` / `[ ] Fail` |
| **UC-33** | **กรอกที่อยู่จัดส่ง (C_EnterAddress)** | กรอกที่อยู่ในหน้า Checkout | ที่อยู่ถูกบันทึกลง orders.shipping_address | `[ ] Pass` / `[ ] Fail` |
| **UC-34** | **อัปโหลดสลิปโอนเงิน Mockup (C_UploadSlip)** | เลือกรูปสลิป แล้วกดยืนยันออเดอร์ | รูปถูกบีบอัดเป็น WebP แปลง Base64 บันทึกลง orders.payment_slip_mockup | `[ ] Pass` / `[ ] Fail` |

---

### 1.7 ติดตามสถานะออเดอร์ (Order Tracking)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-36** | **ดูสถานะออเดอร์ (C_ViewStatus)** | เข้าหน้า Order Tracking | แสดงสถานะปัจจุบัน: Pending Payment / Paid / Processing / Shipped / Delivered | `[ ] Pass` / `[ ] Fail` |
| **UC-37** | **ดูประวัติการเปลี่ยนสถานะ (C_ViewLogs)** | เปิดดูไทม์ไลน์ประวัติสถานะ | แสดงวันเวลาของแต่ละสถานะจาก order_logs | `[ ] Pass` / `[ ] Fail` |
| **UC-38** | **ดูเลข Tracking (C_ViewTracking)** | ดูหมายเลข Tracking Number ในออเดอร์ | แสดงเลขพัสดุที่ Admin กรอกไว้ | `[ ] Pass` / `[ ] Fail` |

---

## 🔐 2. ฟังก์ชันฝั่งผู้ดูแลระบบ (Admin Use Cases)

### 2.1 การจัดการสินค้า (Product Management)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-65** | **เพิ่มสินค้าใหม่ (A_CreateProduct)** | กรอกชื่อ ราคา สต็อก และสเปค (JSONB) แล้วกดบันทึก | สินค้าใหม่ถูกสร้างใน products table | `[ ] Pass` / `[ ] Fail` |
| **UC-66** | **แก้ไขสินค้า (A_EditProduct)** | เปลี่ยนราคาหรือสเปคของสินค้าที่มีอยู่ | ข้อมูลสินค้าถูกอัปเดตในฐานข้อมูล | `[ ] Pass` / `[ ] Fail` |
| **UC-67** | **ปิดขายสินค้า Soft Delete (A_DisableProduct)** | สลับสถานะ is_active เป็น false | สินค้าหายจากหน้าร้าน แต่ยังเก็บข้อมูลในฐานข้อมูล | `[ ] Pass` / `[ ] Fail` |
| **UC-68** | **เปิดขายสินค้าอีกครั้ง (A_EnableProduct)** | สลับ is_active กลับเป็น true | สินค้ากลับมาแสดงในหน้าร้านอีกครั้ง | `[ ] Pass` / `[ ] Fail` |

---

### 2.2 การอนุมัติการชำระเงิน (Payment Review)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-69** | **ดูสลิปรอตรวจ (A_ViewSlip)** | เข้าหน้า Payment Review | แสดงรายการออเดอร์ที่มีสลิป (payment_status = 'pending') | `[ ] Pass` / `[ ] Fail` |
| **UC-70** | **อนุมัติสลิป (A_ApprovePayment)** | กดปุ่ม "Approve" บนสลิปออเดอร์หนึ่ง | payment_status เปลี่ยนเป็น 'approved', order_status เป็น 'paid' | `[ ] Pass` / `[ ] Fail` |
| **UC-70B** | **ปฏิเสธสลิป (A_RejectPayment)** | กดปุ่ม "Reject" บนสลิปออเดอร์หนึ่ง | payment_status เปลี่ยนเป็น 'rejected' | `[ ] Pass` / `[ ] Fail` |

---

### 2.3 การจัดการออเดอร์ (Order Management)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-71** | **ดูรายการออเดอร์ (A_ViewOrders)** | เข้าหน้า Order Management | แสดงออเดอร์ทั้งหมดพร้อมสถานะปัจจุบัน | `[ ] Pass` / `[ ] Fail` |
| **UC-72** | **อัปเดตสถานะออเดอร์ (A_UpdateStatus)** | เปลี่ยนสถานะจาก 'paid' เป็น 'processing' | order_status อัปเดต และบันทึกลง order_logs | `[ ] Pass` / `[ ] Fail` |
| **UC-73** | **กรอก Tracking Number (A_SetTracking)** | กรอกเลขพัสดุในช่อง tracking_number | เลขพัสดุถูกบันทึกและลูกค้าเห็นในหน้า Order Tracking | `[ ] Pass` / `[ ] Fail` |

---

### 2.4 Dashboard และรายงาน (Dashboard - A-05)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-74** | **ดูยอดขายรวม (A_ViewRevenue)** | เข้าหน้า Admin Dashboard | แสดงยอดขายรวมจาก orders ที่ status = 'delivered' | `[ ] Pass` / `[ ] Fail` |
| **UC-75** | **ดูสินค้ายอดนิยม (A_ViewBestSeller)** | ดูส่วน "Best Sellers" ใน Dashboard | แสดงรายการสินค้าที่มียอดสั่งซื้อสูงสุด | `[ ] Pass` / `[ ] Fail` |
| **UC-76** | **ดูเตือนสต็อกต่ำ (A_ViewLowStock)** | ดูส่วน "Low Stock Alert" | แสดงสินค้าที่ stock_quantity ≤ 3 | `[ ] Pass` / `[ ] Fail` |

---

### 2.5 การจัดการบัญชีและสิทธิ์ (Role & Access Control - A-04)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-81** | **สร้างบัญชี Admin (A_CreateAdmin)** | ในหน้า Admin Accounts กด "Add Admin" กรอกอีเมล/รหัสผ่านและกดบันทึก | บัญชีใหม่ถูกสร้างใน users โดย role = 'Admin' | `[ ] Pass` / `[ ] Fail` |
| **UC-82** | **แก้ไขสิทธิ์บัญชี (A_EditRole)** | เปลี่ยน role ของบัญชีหนึ่งจาก 'Customer' เป็น 'Admin' | ฟิลด์ users.role อัปเดตทันที และผู้ใช้ล็อกอินใหม่แล้วเห็น Admin panel | `[ ] Pass` / `[ ] Fail` |
| **UC-83** | **ลบบัญชี (A_DeleteAccount)** | กดปุ่ม "Delete" บนบัญชีที่ไม่ใช้งาน | บัญชีถูกลบ / เข้าถึงหน้าที่ต้องใช้ token ของบัญชีนี้ไม่ได้อีก | `[ ] Pass` / `[ ] Fail` |

---

### 2.6 ระบบสนับสนุน (System-wide - SYS-04)
| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-84** | **บีบอัดรูปเป็น WebP 80% (SYS_WebPCompress)** | อัปโหลดไฟล์ JPG ขนาด > 1MB ในหน้า Checkout | Client บีบอัดผ่าน Canvas API เป็น WebP คุณภาพ 80% ก่อน encode Base64 (ขนาดใหม่ ≤ 250KB) | `[ ] Pass` / `[ ] Fail` |

---

## ❌ 3. กรณีทดสอบ Error Path (Negative Test Cases)

| รหัส Use Case | หัวข้อการทดสอบ (Use Case Name) | ขั้นตอนการทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Results) | สถานะ (Pass/Fail) |
|:---:|:---|:---|:---|:---:|
| **UC-77** | **ล็อกอินด้วยรหัสผิด (Login – Wrong Password)** | กรอกอีเมลถูกต้องแต่รหัสผ่านผิด | ระบบปฏิเสธและแสดงข้อความ "รหัสผ่านไม่ถูกต้อง" | `[ ] Pass` / `[ ] Fail` |
| **UC-78** | **สมัครสมาชิกด้วยอีเมลซ้ำ (Register – Duplicate Email)** | กรอกอีเมลที่มีในระบบแล้ว | ระบบปฏิเสธและแจ้ง "อีเมลนี้ถูกใช้งานแล้ว" | `[ ] Pass` / `[ ] Fail` |
| **UC-79** | **เพิ่มสินค้าในตะกร้าเกินสต็อก (Cart – Exceed Stock)** | แก้ไขจำนวนสินค้าในตะกร้าให้สูงกว่าจำนวนสต็อกที่มีอยู่จริง | ระบบปฏิเสธค่าที่กรอกและแสดงข้อความแจ้งจำนวนสูงสุดที่สั่งได้ตามสต็อกจริง | `[ ] Pass` / `[ ] Fail` |
| **UC-80** | **อัปโหลดไฟล์ที่ไม่ใช่รูปภาพเป็นสลิป (Slip – Wrong File Type)** | อัปโหลดไฟล์ .pdf หรือ .docx แทนรูปภาพในขั้นตอนแนบสลิปโอนเงิน | ระบบปฏิเสธไฟล์และแสดงข้อความ "กรุณาอัปโหลดเฉพาะรูปภาพ (JPG/PNG/WebP)" | `[ ] Pass` / `[ ] Fail` |
