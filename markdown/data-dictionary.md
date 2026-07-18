# พจนานุกรมข้อมูลของโครงการ ComHub (Project Data Dictionary) - MVP Version

เอกสารนี้แสดงรายละเอียดของพจนานุกรมข้อมูล (**Data Dictionary**) สำหรับระบบฐานข้อมูล **ComHub** (พัฒนาบนระบบ PostgreSQL) ครอบคลุมโครงสร้างตารางข้อมูล ฟิลด์ คีย์ และข้อจำกัด (Constraints) ทั้ง 7 ตารางตามขอบเขต MVP และหลัก SDLC ของวิชา **csi 204**

> **📝 หมายเหตุ MVP Scope:** เอกสารนี้ได้ปรับลดจำนวนตารางเพื่อให้เหมาะสมกับกรอบเวลา โดยตัดตาราง `prebuilt_templates`, `template_items`, `assembly_records`, `gallery_posts` ออก และปรับ role ให้เหลือเพียง Customer และ Admin

---

## 🗺️ รายชื่อตารางในระบบฐานข้อมูล (Database Tables List)

| ลำดับที่ | ชื่อตาราง (Table Name) | ประเภทตาราง (Table Type) | คำอธิบายสั้น (Description) |
| :---: | :--- | :---: | :--- |
| 1 | **`users`** | Master | จัดเก็บข้อมูลผู้ใช้งาน (Customer/Admin) และรหัสผ่าน รองรับ Google OAuth |
| 2 | **`products`** | Master | จัดเก็บข้อมูลแค็ตตาล็อกสินค้าและสเปคเทคนิคแบบ JSONB |
| 3 | **`orders`** | Transaction | จัดเก็บรายละเอียดคำสั่งซื้อและสถานะการชำระเงิน |
| 4 | **`order_items`** | Detail | จัดเก็บรายการชิ้นส่วนสินค้าในแต่ละออเดอร์ |
| 5 | **`reviews`** | Transaction | จัดเก็บการประเมิน 1-5 ดาว และข้อความ (ไม่มีรูปภาพ) |
| 6 | **`wishlist_items`** | Detail | จัดเก็บสินค้าโปรดของลูกค้า (ตัด Stock Alert ออก) |
| 7 | **`order_logs`** | Log (Audit Trail) | จัดเก็บประวัติการเปลี่ยนสถานะออเดอร์ |

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
| `first_name` | VARCHAR(100) | - | NOT NULL | ชื่อจริงของผู้ใช้งาน |
| `last_name` | VARCHAR(100) | - | NOT NULL | นามสกุลของผู้ใช้งาน |
| `role` | VARCHAR(50) | - | NOT NULL, DEFAULT 'Customer' | บทบาทสิทธิ์การใช้ระบบ (`'Customer'`, `'Admin'`) |
| `auth_provider` | VARCHAR(20) | - | NOT NULL, DEFAULT 'native' | ประเภทการยืนยันตัวตน (`'native'`, `'google'`) |
| `google_id` | VARCHAR(255) | - | UNIQUE, NULL | Google User ID สำหรับ OAuth (NULL ถ้าใช้ Native Auth) |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่ลงทะเบียนสมาชิกเข้าสู่ระบบ |

---

### 2. ตาราง `products` (ตารางข้อมูลสินค้าไอทีและเงื่อนไขเทคนิค)
เก็บข้อมูลอุปกรณ์ไอที ฟิลด์ `specifications` จัดเก็บข้อมูลสเปคเฉพาะเจาะจงในรูปแบบ JSONB เพื่อความยืดหยุ่นสูงสุด

* **คีย์หลัก (PK):** `id`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL, Auto Increments | รหัสอ้างอิงสินค้าไอที |
| `name` | VARCHAR(255) | - | NOT NULL | ชื่อยี่ห้อและรุ่นของอุปกรณ์ไอที |
| `category` | VARCHAR(50) | - | NOT NULL | หมวดหมู่สินค้า (`'CPU'`, `'Mainboard'`, `'GPU'`, `'RAM'`, `'SSD'`, `'Case'`, `'PSU'`) |
| `price` | DECIMAL(10,2) | - | NOT NULL, CHECK (price >= 0) | ราคาสินค้าต่อหน่วย (สกุลเงินบาท) |
| `stock_quantity` | INTEGER | - | NOT NULL, DEFAULT 0 | จำนวนสินค้าคงเหลือในคลังสินค้าปัจจุบัน |
| `image_url` | VARCHAR(500) | - | NULL | ลิงก์ URL รูปภาพสินค้า ชี้ไปที่ Vercel Frontend หรือ คลาวด์ |
| `specifications` | JSONB | - | NOT NULL, DEFAULT '{}' | ข้อมูลสเปคเฉพาะทาง (เช่น socket, form_factor, tdp, wattage, supported_ram) |
| `is_active` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | สถานะการเปิดขายสินค้า: `true` = ขายปกติ, `false` = เลิกจำหน่าย/ปิดขาย |

---

### 3. ตาราง `orders` (ตารางคำสั่งซื้อและสถานะ)
เก็บข้อมูลธุรกรรมการสั่งซื้อและการจัดส่ง (ตัดคูปองและบริการประกอบออก - MVP Simplified)

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `user_id` อ้างอิงตาราง `users(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงรายการคำสั่งซื้อหลัก |
| `user_id` | INTEGER | FK | NOT NULL, ON DELETE RESTRICT | ชี้รหัสลูกค้าผู้สั่งซื้อสินค้าตัวนี้ |
| `total_price` | DECIMAL(10,2) | - | NOT NULL | ยอดเงินรวมสุทธิของออเดอร์ |
| `order_status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'pending_payment' | สถานะออเดอร์ (`'pending_payment'`, `'paid'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`) |
| `shipping_address` | TEXT | - | NOT NULL | ที่อยู่สำหรับการจัดส่งและเขียนใบนำส่งพัสดุ |
| `payment_slip_mockup` | TEXT | - | NULL | Base64 encoded WebP image (Mockup - ไม่ใช่การอัปโหลดจริง) |
| `payment_status` | VARCHAR(50) | - | NOT NULL, DEFAULT 'pending' | สถานะการตรวจสอบสลิป (`'pending'`, `'approved'`, `'rejected'`) |
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
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันที่สร้างรีวิว |

---

### 6. ตาราง `wishlist_items` (ตารางรายการของโปรด)
บันทึกสินค้าที่ลูกค้าสนใจเพื่อสั่งซื้อภายหลัง (MVP: ตัด Stock Alert ออก)

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `user_id` ชี้ `users(id)`, `product_id` ชี้ `products(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสอ้างอิงรายการของโปรด |
| `user_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสอ้างอิงของลูกค้าที่เป็นเจ้าของ Wishlist |
| `product_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | รหัสสินค้าที่ลูกค้าสนใจ |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันที่แอดสินค้าเข้า Wishlist |

---

### 7. ตาราง `order_logs` (ตารางล็อกประวัติการเปลี่ยนสถานะ)
ตารางบันทึกการทำงานแบบลำดับเวลา (Audit Trail Log) ช่วยบันทึกวันและเวลาจริงที่สถานะถูกสับเปลี่ยนโดย Admin เพื่อความโปร่งใส

* **คีย์หลัก (PK):** `id`
* **คีย์นอก (FK):** `order_id` ชี้ `orders(id)`, `changed_by_user_id` ชี้ `users(id)`

| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | คีย์ (Key) | ข้อจำกัด (Constraints) | คำอธิบายฟิลด์ (Description) |
| :--- | :--- | :---: | :--- | :--- |
| `id` | SERIAL / INT | PK | NOT NULL | รหัสรายการล็อกบันทึกสถานะ |
| `order_id` | INTEGER | FK | NOT NULL, ON DELETE CASCADE | ชี้รหัสออเดอร์เป้าหมายที่มีการปรับปรุงสถานะ |
| `status` | VARCHAR(100) | - | NOT NULL | ข้อความสถานะใหม่ที่ถูกบันทึก (เช่น `'Payment Approved'`, `'Processing'`, `'Shipped'`) |
| `changed_by_user_id` | INTEGER | FK | NOT NULL, ON DELETE RESTRICT | รหัสผู้ใช้งาน (Admin) ที่เป็นคนกดอนุมัติ/สลับสถานะในขั้นตอนนี้ |
| `created_at` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาจริงที่มีการกดสับเปลี่ยนในระบบ |

---

## 📝 หมายเหตุสำหรับ MVP

**ตารางที่ถูกตัดออกจาก Scope เดิม:**
- `prebuilt_templates` - เซ็ตคอมแนะนำ (ตัดออก)
- `template_items` - รายการในเซ็ตแนะนำ (ตัดออก)
- `assembly_records` - Burn-in Test (ตัดออก)
- `gallery_posts` - แกลเลอรี่คอมมูนิตี้ (ตัดออก)

**ฟีเจอร์ที่ปรับลด:**
- Reviews: ไม่มีการอัปโหลดรูปภาพ
- Wishlist: ไม่มี Stock Alert
- Orders: ไม่มี Coupon, ไม่มีบริการประกอบ
- Payment: ใช้ Base64 Mockup แทนการอัปโหลดจริง

**Roles ที่เหลือ:** Customer และ Admin เท่านั้น
