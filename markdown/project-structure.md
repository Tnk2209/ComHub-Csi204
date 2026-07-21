# โครงสร้างโฟลเดอร์และไฟล์ของโครงการ ComHub (Project Directory Structure)

เอกสารนี้แสดงการออกแบบโครงสร้างโฟลเดอร์และไฟล์ของระบบ **ComHub** ในรูปแบบ Monorepo ซึ่งแยกออกเป็นสองส่วนหลักคือ `frontend/` (React + Vite + Tailwind) และ `backend/` (Node.js + Express + TypeScript) เพื่อความง่ายในการพัฒนาและสอดคล้องกับข้อกำหนดการ Deploy ขึ้น Vercel

> **⚠️ Target Architecture — ยังไม่ได้ implement ทั้งหมด:** โครงสร้างโฟลเดอร์ด้านล่างคือสถาปัตยกรรมเป้าหมาย (Target Architecture) ที่วางแผนไว้ ยังไม่ได้ implement จริงทั้งหมด สถานะปัจจุบัน: repo มีเฉพาะโฟลเดอร์ `FrontEnd/` (ชื่อต่างจาก `frontend/` ตรงนี้) ที่เขียนด้วย JavaScript (`.jsx`) — ยังไม่มี TypeScript (`.tsx`), ไม่มี `backend/` directory, ไม่มี `tailwind.config.js` (ใช้ Tailwind v4 CSS-first แทน), และไม่มี `vercel.json`
>
> **📝 หมายเหตุ MVP Scope:** เอกสารนี้ปรับให้ตรงกับ 2 บทบาท (Customer + Admin) แล้ว โฟลเดอร์จริงใน `FrontEnd/src/pages/` (เช่น ManagerDashboard/, ManagerModeration/, ManagerTemplates/, StaffQueue/, StaffUAT/, Gallery/) ยังอยู่จากเวอร์ชันก่อน — ต้อง refactor code แยกตามลำดับ ไม่รวมใน scope การอัปเดตเอกสารนี้

---

## 📂 แผนผังโครงสร้างภาพรวม (Directory Tree)

```text
ComHub-Csi204/
├── .issues/                        # ข้อมูลและขั้นตอนประเด็นงานทั้งหมด (Planning)
├── markdown/                       # เอกสารการวิเคราะห์และนำเสนอโครงงานวิชา csi 204
│   ├── sdlc-planning.md
│   ├── CODEBASE.md
│   ├── features-summary.md
│   ├── UML-Diagrams.md
│   └── project-structure.md        # เอกสารฉบับนี้
│
├── frontend/                       # === 💻 CLIENT & FRONTEND LAYER ===
│   ├── public/                     # ไฟล์สแตติกคงที่ (เช่น โลโก้ร้าน, ไอคอน)
│   │   └── images/
│   │       └── products/           # รูปสินค้าตั้งต้น 30-50 ชิ้นแรก (Seed Product Images)
│   ├── src/
│   │   ├── assets/                 # รูปภาพ/วิดีโอตกแต่งหน้าเว็บอื่นๆ
│   │   ├── components/             # ส่วนประกอบของเว็บที่นำกลับมาใช้ใหม่ได้ (Reusable Components)
│   │   │   ├── common/             # UI พื้นฐาน (Navbar.tsx, Footer.tsx, Button.tsx, Input.tsx)
│   │   │   ├── builder/            # ส่วนประกอบระบบจัดสเปค (PartSelector.tsx, CompatibilityAlert.tsx, WattageBar.tsx)
│   │   │   └── admin/              # ส่วนแสดงผลหลังบ้าน Admin (StatCard.tsx, StockAlertTable.tsx, OrderQueueTable.tsx)
│   │   ├── contexts/               # ระบบบริหารสถานะส่วนกลาง (State Management Contexts)
│   │   │   ├── AuthContext.tsx     # จัดการการล็อกอิน และเก็บข้อมูล Role ปัจจุบัน
│   │   │   └── CartContext.tsx     # จัดการสินค้าในตะกร้าชั่วคราว (Sync ลง LocalStorage)
│   │   ├── hooks/                  # Custom Hooks สรุป Logic ฝั่ง UI
│   │   │   ├── useAuth.ts          # ดึงสิทธิ์ผู้ใช้งานและขัดขวางการเข้าถึงหน้านอกเหนือสิทธิ์
│   │   │   └── usePCBuilder.ts     # คำนวณความเข้ากันได้/TDP ฝั่ง Client ขณะลูกค้าเลือกชิ้นส่วน
│   │   ├── layouts/                # หน้ากากเลย์เอาต์หลักของแต่ละสิทธิ์
│   │   │   ├── MainLayout.tsx      # เลย์เอาต์สำหรับลูกค้าทั่วไป (มี Navbar + Footer)
│   │   │   └── AdminLayout.tsx     # เลย์เอาต์สำหรับหลังบ้าน Admin (มี Sidebar + Admin Panel)
│   │   ├── pages/                  # หน้าจอหลักของระบบ (Pages)
│   │   │   ├── Home.tsx            # หน้าแรกของเว็บ (แสดงรายการสินค้ายอดนิยม)
│   │   │   ├── Builder.tsx         # หน้าจอจัดสเปคคอมพิวเตอร์ (PC Builder Page - 7 หมวด)
│   │   │   ├── ProductDetail.tsx   # หน้าดูรายละเอียดสินค้าเป้าหมาย
│   │   │   ├── Compare.tsx         # หน้าเปรียบเทียบสินค้าสูงสุด 3 ชิ้น (C-05)
│   │   │   ├── Wishlist.tsx        # หน้ารายการสินค้าโปรด (C-06 - ไม่มี Stock Alert)
│   │   │   ├── Cart.tsx            # หน้าตะกร้าสินค้า (LocalStorage) และการคำนวณราคารวม
│   │   │   ├── Checkout.tsx        # หน้าตรวจสอบสินค้า, กรอกที่อยู่ และอัปโหลดสลิป WebP+Base64
│   │   │   ├── OrderTracking.tsx   # หน้าติดตามสถานะออเดอร์ 5 ขั้น (Pending Payment → Delivered)
│   │   │   ├── Login.tsx           # หน้าจอเข้าสู่ระบบ (Native Auth)
│   │   │   ├── Register.tsx        # หน้าจอลงทะเบียนสมาชิกใหม่
│   │   │   └── Admin/              # โฟลเดอร์หน้าจอควบคุมหลังบ้าน (Admin เท่านั้น)
│   │   │       ├── AdminDashboard.tsx  # A-05: Dashboard (ยอดขาย/สินค้ายอดนิยม/สต็อกต่ำ)
│   │   │       ├── AdminProducts.tsx   # A-01: Product CRUD + Soft Delete
│   │   │       ├── AdminPayment.tsx    # A-02: Payment Review (Approve/Reject สลิป)
│   │   │       ├── AdminOrders.tsx     # A-03: Order Management + Tracking Number
│   │   │       └── AdminAccounts.tsx   # A-04: Role & Access Control (Customer/Admin)
│   │   ├── services/               # ส่วนการเชื่อมต่อคุยกับ Backend API
│   │   │   ├── apiClient.ts        # Axios client ตั้งค่า Base URL และแทรก JWT Token อัตโนมัติ
│   │   │   ├── authService.ts      # API ล็อกอิน/ลงทะเบียน
│   │   │   └── productService.ts   # API ดึงข้อมูลสินค้า/สเปค
│   │   ├── utils/                  # ฟังก์ชันผู้ช่วยทั่วไป
│   │   │   └── imageCompressor.ts  # แปลงไฟล์รูปภาพเป็น WebP คุณภาพ 80% ผ่าน HTML5 Canvas
│   │   ├── App.tsx                 # ตัวตั้งค่า React Router (โครงข่ายเส้นทางการเปิดหน้าเว็บ)
│   │   ├── index.css               # สไตล์หลักของโครงการ (ตั้งค่า Font Inter/IBM Plex, ธีมสี Dark Mode)
│   │   └── main.tsx                # ไฟล์เริ่มต้นระบบการเรนเดอร์ของ React SPA
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js          # ตั้งค่าการจัดกลุ่มสี (ไม่ใช้สีม่วง) และรูปแบบตัวอักษร
│   └── vite.config.ts
│
└── backend/                        # === ⚙️ APPLICATION & API LAYER (Node.js + Express) ===
    ├── src/
    │   ├── config/                 # ตั้งค่าการเชื่อมต่อแวดล้อมต่างๆ
    │   │   ├── db.ts               # เชื่อมต่อกับ Supabase PostgreSQL
    │   │   └── supabase.ts         # เชื่อมต่อกับ Supabase Storage (สำหรับบันทึกอัปโหลดรูปภาพ)
    │   ├── controllers/            # ตัวควบคุมการรับ-ส่งข้อมูล API (Controllers แยกตามโดเมน)
    │   │   ├── authController.ts   # ประมวลผลรหัสผ่าน bcrypt, สร้าง JWT Token
    │   │   ├── productController.ts # A-01: จัดการ CRUD สินค้าและสเปค JSONB
    │   │   ├── orderController.ts   # SYS-03 / C-09 / A-02 / A-03: สร้างออเดอร์, อนุมัติสลิป, อัปเดตสถานะ 5 ขั้น
    │   │   ├── reviewController.ts  # C-07: บันทึกคะแนนรีวิว 1-5 ดาว + ข้อความ (ไม่มีรูป)
    │   │   ├── wishlistController.ts # C-06: เพิ่ม/ลบสินค้าจาก wishlist_items
    │   │   └── dashboardController.ts # A-05: aggregate ยอดขาย/สินค้ายอดนิยม/สต็อกต่ำ
    │   ├── middlewares/            # ส่วนขัดขวางและประเมินสิทธิ์คำขอ (Middlewares)
    │   │   ├── authMiddleware.ts   # ตรวจและถอดรหัสความปลอดภัย JWT Token ใน Header คำขอ
    │   │   └── roleMiddleware.ts   # A-04: ตรวจบทบาทผู้ใช้ 2 role (Customer, Admin) ก่อนยอมให้เรียก API
    │   ├── models/                 # ตัวกำหนดโมเดลข้อมูลหรือ Types ความสอดคล้องข้อมูล (TypeScript Interfaces)
    │   │   └── types.ts            # กำหนด Type โครงสร้างตาราง User, Product, Order ฯลฯ
    │   ├── routes/                 # เส้นทาง API Endpoint
    │   │   ├── authRoutes.ts       # เส้นทาง `/api/auth` (register, login, me)
    │   │   ├── productRoutes.ts    # เส้นทาง `/api/products` (CRUD + fetch specs)
    │   │   ├── orderRoutes.ts      # เส้นทาง `/api/orders` (checkout, tracking)
    │   │   └── reviewRoutes.ts     # เส้นทาง `/api/reviews` (post review, moderate)
    │   ├── services/               # โฟลเดอร์เก็บ Logic ประมวลผลแกนกลาง (Business Logic Services)
    │   │   └── compatibility.ts    # คำนวณจับคู่ Socket, Form Factor และ Wattage เผื่อนำเสนอบน Server-side
    │   ├── sql/                    # โฟลเดอร์เก็บสคริปต์ควบคุมฐานข้อมูล
    │   │   ├── schema.sql          # ไฟล์ DDL สำหรับสร้างตาราง (Tables, Constraints, Indexes)
    │   │   └── seed.sql            # ไฟล์ป้อนข้อมูลสินค้าตัวอย่างตั้งต้นสำหรับการทดสอบ
    │   ├── app.ts                  # ตัวเชื่อมโยง Express App, Cors, Middlewares ทั่วไป
    │   └── server.ts               # ตัวเปิดการรับคำสั่งพอร์ต (Local development runner)
    ├── api/                        # โฟลเดอร์พิเศษสำหรับ Deploy ขึ้น Vercel Serverless
    │   └── index.ts                # ไฟล์ Entrypoint ในการรับ Request และส่งต่อให้ Express App ประมวลผล
    ├── package.json
    ├── tsconfig.json
    └── vercel.json                 # ตั้งค่า Routing บน Vercel ให้ส่งลิงก์ `/api/*` มาลง Serverless
```

---

## 🛠️ รายละเอียดกลไกการ Deploy บน Vercel (Monorepo Settings)

เพื่อให้การทำงานแบบ Monorepo ใน Repository นี้ใช้งานได้บนคลาวด์ Vercel เราจะตั้งค่าการ Deploy ออกเป็น 2 โครงการบนหน้า Vercel Dashboard ของคุณ:

1. **Vercel Project 1: `comhub-frontend`**
   - **Root Directory:** ตั้งค่าเป็นโฟลเดอร์ `frontend`
   - **Framework Preset:** เลือกเป็น `Vite`
   - **Build Command:** `npm run build`
2. **Vercel Project 2: `comhub-backend`**
   - **Root Directory:** ตั้งค่าเป็นโฟลเดอร์ `backend`
   - **Framework Preset:** เลือกเป็น `Other` หรือ `Node.js` (ใช้การตั้งค่าใน `backend/vercel.json` ควบคุมการทำงาน Serverless อัตโนมัติ)
