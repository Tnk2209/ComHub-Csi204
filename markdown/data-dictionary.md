# พจนานุกรมข้อมูลของโครงการ ComHub (Project Data Dictionary)

เอกสารนี้แสดงรายละเอียดของพจนานุกรมข้อมูล (**Data Dictionary**) สำหรับระบบฐานข้อมูล **ComHub** (พัฒนาบนระบบ PostgreSQL / Supabase Cloud) ครอบคลุมโครงสร้างตารางข้อมูล ฟิลด์ คีย์ และข้อจำกัด (Constraints) ทั้ง 11 ตารางตามขอบเขตและหลัก SDLC ของวิชา **csi 204**

---

## 🗺️ รายชื่อตารางในระบบฐานข้อมูล (Database Tables List)

| ลำดับที่ | ชื่อตาราง (Table Name) | ประเภทตาราง (Table Type) | คำอธิบายสั้น (Description) |
| :---: | :--- | :---: | :--- |
| 1 | **`users`** | Master | จัดเก็บข้อมูลผู้ใช้งานและรหัสผ่านแบ่งสิทธิ์ (RBAC) |
| 2 | **`products`** | Master | จัดเก็บข้อมูลแค็ตตาล็อกสินค้าและสเปคเทคนิคแบบ JSONB |
| 3 | **`orders`** | Transaction | จัดเก็บรายละเอียดคำสั่งซื้อ สถานะการเงิน และสถานะประกอบเครื่อง |
| 4 | **`order_items`** | Detail | จัดเก็บรายการชิ้นส่วนสินค้าในแต่ละออเดอร์ (สินค้าที่สั่งชิ้นใด จำนวนเท่าใด) |
| 5 | **`reviews`** | Transaction | จัดเก็บข้อมูลการประเมิน คะแนน 1-5 ดาว ข้อความ และภาพถ่ายของสินค้า |
| 6 | **`prebuilt_templates`** | Master | จัดเก็บหัวข้อและงบประมาณของชุดจัดสเปคคอมแนะนำของร้าน |
| 7 | **`template_items`** | Detail (Junction) | เชื่อม Many-to-Many ระหว่างชุดคอมแนะนำกับอุปกรณ์ไอที |
| 8 | **`wishlist_items`** | Detail | จัดเก็บสินค้าโปรดของลูกค้า และตั้งธงแจ้งเตือนการเติมสต็อก |
| 9 | **`assembly_records`** | Detail | บันทึกผลการทดสอบ Burn-in Test (อุณหภูมิความร้อน) หลังประกอบเครื่อง |
| 10 | **`order_logs`** | Log (Audit Trail) | จัดเก็บประวัติบันทึกการเปลี่ยนสถานะการชำระเงิน/ประกอบเครื่องย้อนหลัง |
| 11 | **`gallery_posts`** | Transaction | จัดเก็บโพสต์แกลเลอรี่คอมมูนิตี้ที่ลูกค้าแชร์สเปคประกอบเสร็จ พร้อมสถานะตรวจสอบโดย Manager |

---

## 🗃️ รายละเอียดโครงสร้างตารางฐานข้อมูล (Data Dictionary Table Schemas)

### 1. ตาราง `users` (ตารางข้อมูลผู้ใช้งานและสิทธิ์)
เก็บข้อมูลส่วนตัวของบัญชีทุกลำดับสิทธิ์ในระบบ แยกความรับผิดชอบผ่านคอลัมน์ `role`

* **คีย์หลัก (PK):** `id`
* **ดัชนีพิเศษ (Unique):** `email`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL, Auto Increments | รหัสอ้างอิงผู้ใช้งาน (ระบบรันให้อัตโนมัติ) |
| `email` | VARCHAR(255) | - | NOT NULL, UNIQUE | ที่อยู่อีเมลของผู้ใช้งาน (ใช้ในการล็อกอินเข้าสู่ระบบ) |
| `password_hash` | VARCHAR(255) | - | NULL | รหัสผ่านที่เข้ารหัสด้วย bcrypt — `NULL` สำหรับ OAuth users ที่ login ด้วย Google |
| `oauth_provider` | VARCHAR(50) | - | NULL, DEFAULT NULL | ผู้ให้บริการ OAuth (`'google'` หรือ `NULL` สำหรับ native users) |
| `oauth_id` | VARCHAR(255) | - | NULL, UNIQUE when not null | รหัส unique ที่ได้รับจาก OAuth provider (เช่น Google User ID) |
| `first_name` | VARCHAR(100) | - | NOT NULL | ชื่อจริงของผู้ใช้งาน |
| `last_name` | VARCHAR(100) | - | NOT NULL | นามสกุลของผู้ใช้งาน |
| `role` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Customer' | บทบาทสิทธิ์การใช้ระบบ (`'Customer'`, `'Staff'`, `'Manager'`, `'Admin'`) |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่ลงทะเบียนสมาชิกเข้าสู่ระบบ |

---

### 2. ตาราง `products` (ตารางข้อมูลสินค้าไอทีและเงื่อนไขเทคนิค)
เก็บข้อมูลอุปกรณ์ไอที ฟิลด์ `specifications` จัดเก็บข้อมูลสเปคเฉพาะเจาะจงในรูปแบบ JSONB เพื่อความยืดหยุ่นสูงสุด

* **คีย์หลัก (PK):** `id`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL, Auto Increments | รหัสอ้างอิงสินค้าไอที |
| `name` | VARCHAR(255) | - | NOT NULL | ชื่อยี่ห้อและรุ่นของอุปกรณ์ไอที |
| `category` | VARCHAR(50) | - | NOT NULL | หมวดหมู่สินค้า (`'CPU'`, `'GPU'`, `'RAM'`, `'MB'`, `'CASE'`, `'PSU'`, `'STORAGE'`) |
| `price` | DECIMAL(10,2) | - | NOT NULL, CHECK (price >= 0) | ราคาสินค้าต่อหน่วย (สกุลเงินบาท) |
| `stock_quantity` | INTEGER | - | NOT NULL, DEFAULT 0 | จำนวนสินค้าคงเหลือในคลังสินค้าปัจจุบัน |
| `image_url` | VARCHAR(500) | - | NULL | ลิงก์ URL รูปภาพสินค้า ชี้ไปที่ Vercel Frontend หรือ คลาวด์ |
| `specifications` | JSONB | - | NOT NULL, DEFAULT '{}' | ข้อมูลสเปคเฉพาะทาง (เช่น socket, form_factor, tdp, wattage, supported_ram) |
| `is_active` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | สถานะการเปิดขายสินค้า: `true` = ขายปกติ, `false` = เลิกจำหน่าย/ปิดขาย |

---

### 3. ตาราง `orders` (ตารางคำสั่งซื้อและสถานะ)
เก็บข้อมูลธุรกรรมการสั่งซื้อ การจัดส่ง และคูปอง โดยมีคอลัมน์แยกตรวจสอบเรื่องเงินและประกอบเครื่องอย่างเป็นอิสระ

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `user_id` อ้างอิงตาราง `users(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงรายการคำสั่งซื้อหลัก |
| `user_id` | INTEGER | FK | NOT NULL, ON DELETE RESTRICT | ชี้รหัสลูกค้าผู้สั่งซื้อสินค้าตัวนี้ |
| `total_price` | DECIMAL(10,2) | - | NOT NULL | ยอดเงินรวมสุทธิของออเดอร์ (หลังหักส่วนลดแล้ว) |
| `coupon_code` | VARCHAR(50) | - | NULL | รหัสคูปองส่วนลดที่นำมาใช้ (ถ้ามี) |
| `discount_amount` | DECIMAL(10,2) | - | NOT NULL, DEFAULT 0.00 | ยอดมูลค่าส่วนลดบาทที่หักออก |
| `payment_status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Pending' | สถานะการเงิน (`'Pending'`, `'Approved'`, `'Rejected'`) |
| `order_status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Pending' | สถานะคิวงานประกอบ (`'Pending'`, `'Assembling'`, `'Testing'`, `'Shipped'`) |
| `shipping_address` | TEXT | - | NOT NULL | ที่อยู่สำหรับประกอบการจัดส่งและเขียนใบนำส่งพัสดุ |
| `payment_slip_url` | VARCHAR(500) | - | NULL | ลิงก์เก็บภาพสลิปโอนเงินอ้างอิง (อัปโหลดขึ้น Supabase Storage) |
| `is_assembled` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | ความต้องการให้ร้านจัดประกอบคอมฯ ให้: `true` = ประกอบให้, `false` = ซื้อแยกชิ้น |
| `tracking_number` | VARCHAR(100) | - | NULL | เลขพัสดุสำหรับติดตามการขนส่งพัสดุของลูกค้า |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่ลูกค้ากดยืนยันออเดอร์เพื่อชำระเงิน |

---

### 4. ตาราง `order_items` (ตารางรายละเอียดชิ้นส่วนในออเดอร์)
เก็บรายการสินค้าและราคาสินค้าย้อนหลังในแต่ละรายการคำสั่งซื้อ

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `order_id` อ้างอิงตาราง `orders(id)`, `product_id` อ้างอิงตาราง `products(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงชิ้นส่วนภายในคำสั่งซื้อ |
| `order_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | ชี้ไปที่ออเดอร์หลักที่สินค้าตัวนี้สังกัดอยู่ |
| `product_id` | INTEGER | FK | NOT NULL, ON DELETE RESTRICT | รหัสสินค้าไอทีชิ้นดังกล่าว |
| `quantity` | INTEGER | - | NOT NULL, DEFAULT 1 | จำนวนชิ้นส่วนที่ซื้อในออเดอร์นี้ |
| `price_per_unit` | DECIMAL(10,2) | - | NOT NULL | บันทึกราคาสินค้าต่อชิ้น ณ ขณะทำการสั่งซื้อจริง (ป้องกันปัญหาราคาสินค้าเปลี่ยนภายหลัง) |

---

### 5. ตาราง `reviews` (ตารางความคิดเห็นและดาวสินค้า)
เก็บบันทึกข้อมูลความคิดเห็นของลูกค้าที่มีต่อชิ้นส่วนฮาร์ดแวร์ไอที

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `order_id` ชี้ `orders(id)`, `product_id` ชี้ `products(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงของการรีวิว |
| `order_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสคำสั่งซื้อที่มีการอ้างอิงรีวิว |
| `product_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสชิ้นส่วนสินค้าไอทีที่ถูกรีวิว |
| `rating` | INTEGER | - | NOT NULL, CHECK (rating BETWEEN 1 AND 5) | คะแนนของสินค้า (1 ถึง 5 ดาว) |
| `comment` | TEXT | - | NULL | ข้อความวิจารณ์สินค้า |
| `review_image_url` | VARCHAR(500) | - | NULL | ลิงก์อ้างอิงภาพถ่ายสินค้าจริงของลูกค้า (อัปโหลดขึ้น Supabase) |
| `status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Pending' | สถานะการตรวจสอบรีวิวโดยร้าน (`'Pending'`, `'Approved'`) |

---

### 6. ตาราง `prebuilt_templates` (ตารางชุดจัดสเปคแนะนำของร้าน)
เก็บหัวเรื่องจำลองงบของเซ็ตประกอบแนะนำโดยผู้จัดการร้าน

* **คีย์หลัก (PK):** `id`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงเซ็ตแนะนำสำเร็จรูป |
| `template_name` | VARCHAR(255) | - | NOT NULL | ชื่อชุดสเปคแนะนำ (เช่น "เซ็ตเล่นเกมยอดฮิต", "เซ็ตคนเรนเดอร์งาน") |
| `price_range_tag` | VARCHAR(100) | - | NOT NULL | แท็กช่วงราคาของเซ็ตคอมแนะนำ (เช่น `'Budget (15K)'`, `'High-end (60K+)'`) |
| `description` | TEXT | - | NULL | คำอธิบายสั้นๆ เกี่ยวกับการนำสเปคนี้ไปใช้งาน |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันที่เซ็ตแนะนำนี้ถูกสร้างขึ้นเข้าระบบ |

---

### 7. ตาราง `template_items` (ตารางเชื่อมโยง Many-to-Many ของเซ็ตแนะนำ)
เชื่อมโยงความสัมพันธ์ของอุปกรณ์หลายชิ้นที่อยู่ใน 1 เซ็ตแนะนำสำเร็จรูป

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `template_id` ชี้ `prebuilt_templates(id)`, `product_id` ชี้ `products(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงชิ้นส่วนภายในเทมเพลต |
| `template_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสของสเปคสำเร็จรูปหลักที่อ้างอิงถึง |
| `product_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสสินค้าอุปกรณ์ไอทีที่ประกอบอยู่ในสเปคนี้ |
| `quantity` | INTEGER | - | NOT NULL, DEFAULT 1 | จำนวนชิ้นส่วนที่ถูกบรรจุลงในสเปค |

---

### 8. ตาราง `wishlist_items` (ตารางรายการของโปรดและแจ้งเตือนสต็อก)
บันทึกประวัติความต้องการของลูกค้าเมื่อถูกใจสินค้า และตั้งค่ารับส่งการแจ้งเตือนเมื่อสินค้ากลับมาเติมคลัง

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `user_id` ชี้ `users(id)`, `product_id` ชี้ `products(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงรายการของโปรด |
| `user_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสอ้างอิงของลูกค้าที่เป็นเจ้าของ Wishlist |
| `product_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสสินค้าที่ลูกค้าสนใจ |
| `is_alert_enabled` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | ธงระบบการรับแจ้งเตือนเมื่อสินค้านั้นมีระดับสต็อกกลับเข้ามาในร้าน (`stock_quantity > 0`) |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันที่แอดสินค้าเข้า Wishlist |

---

### 9. ตาราง `assembly_records` (ตารางรายงาน UAT บันทึกการประกอบของพนักงาน)
จัดเก็บอุณหภูมิและการทดสอบเพื่อตรวจสอบคุณภาพความร้อน (Burn-in Test Logs) สำหรับคอมจัดสเปคประกอบ

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `order_id` ชี้ `orders(id)` (แบบ 1:1), `staff_id` ชี้ `users(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสใบประเมินและทดสอบอุณหภูมิ UAT |
| `order_id` | INTEGER | FK | NOT NULL, UNIQUE, ON DELETE CASCADE | ชี้รหัสออเดอร์ที่ถูกประกอบ (1 ออเดอร์มีได้เพียง 1 บันทึกประกอบ) |
| `staff_id` | INTEGER | FK | NOT NULL, ON DELETE RESTRICT | รหัสบัญชีผู้ใช้งานของช่าง (Staff) ที่เป็นผู้เขียนบันทึกนี้ |
| `cpu_temperature` | DECIMAL(5,2) | - | NULL | อุณหภูมิความร้อนของตัว CPU ขณะเทสความเสถียร (องศาเซลเซียส) |
| `gpu_temperature` | DECIMAL(5,2) | - | NULL | อุณหภูมิความร้อนของการ์ดจอ (GPU) ขณะเทสความเสถียร (องศาเซลเซียส) |
| `burn_in_status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Pass' | ผลทดสอบการค้าง/ความเสถียรของเครื่อง (`'Pass'`, `'Fail'`) |
| `notes` | TEXT | - | NULL | โน้ตรายละเอียดการทดสอบ (เช่น ตรวจพบสายไฟพัดลม หรือปัญหาพัดลมมีเสียงรบกวน) |
| `tested_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันที่และเวลาที่ช่างกดลงนามบันทึกผลการเทส |

---

### 10. ตาราง `order_logs` (ตารางล็อกประวัติการเปลี่ยนสถานะการชำระเงิน/ประกอบเครื่อง)
ตารางบันทึกการทำงานแบบลำดับเวลา (Audit Trail Log) ช่วยบันทึกวันและเวลาจริงที่สถานะถูกสับเปลี่ยนโดยพนักงานเพื่อความโปร่งใส

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `order_id` ชี้ `orders(id)`, `changed_by_user_id` ชี้ `users(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสรายการล็อกบันทึกสถานะ |
| `order_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | ชี้รหัสออเดอร์เป้าหมายที่มีการปรับปรุงสเตตัส |
| `status` | VARCHAR(100) | - | NOT NULL | ข้อความสถานะใหม่ที่ถูกบันทึก (เช่น `'Payment Approved'`, `'Assembling'`) |
| `changed_by_user_id` | INTEGER | FK | NOT NULL, ON DELETE RESTRICT | รหัสผู้ใช้งานของช่างหรือพนักงานที่เป็นคนกดอนุมัติ/สลับสถานะในขั้นตอนนี้ |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาจริงที่มีการกดสับเปลี่ยนในระบบ |

---

### 11. ตาราง `gallery_posts` (ตารางโพสต์แกลเลอรี่คอมมูนิตี้)
จัดเก็บโพสต์แชร์สเปคคอมพิวเตอร์ที่ลูกค้าแชร์หลังประกอบเสร็จ ต้องผ่านการอนุมัติโดย Manager ก่อนแสดงสาธารณะ

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `user_id` ชี้ `users(id)`, `order_id` ชี้ `orders(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสโพสต์แกลเลอรี่ |
| `user_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสลูกค้าเจ้าของโพสต์ |
| `order_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสออเดอร์ที่ผูกกับโพสต์นี้ |
| `title` | VARCHAR(255) | - | NOT NULL | หัวข้อชื่อโพสต์แกลเลอรี่ |
| `description` | TEXT | - | NULL | คำอธิบายรายละเอียดเพิ่มเติมของโพสต์ |
| `image_url` | VARCHAR(500) | - | NULL | URL รูปภาพเคสคอมพิวเตอร์ที่แนบมากับโพสต์ |
| `status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Pending' | สถานะการตรวจสอบ (`'Pending'`, `'Approved'`, `'Rejected'`) |
| `is_pinned` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | ธงปักหมุดโพสต์ขึ้นหน้าแรกโดย Manager |
| `likes_count` | INTEGER | - | NOT NULL, DEFAULT 0 | จำนวนยอดกดถูกใจโพสต์สะสม |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างโพสต์ |
