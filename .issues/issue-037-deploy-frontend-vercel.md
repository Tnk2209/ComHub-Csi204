# Issue 037: Production Deployment Phase 3 — Frontend Web Hosting on Vercel & E2E Verification

## Parent
[Issue 020: SDLC Phase 6 & 7 (Deployment & Maintenance)](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-020-production-deployment.md)

## What to build
Deploy Client Web App (React + Vite + Tailwind CSS) ขึ้นบริการ **Vercel Static Hosting** เชื่อมโยง API กับ Vercel Backend และทำ End-to-End Production Verification

### ขั้นตอนการปฏิบัติแบบละเอียด (Step-by-Step Instructions)
1. **สร้าง Project สำหรับ Frontend บน Vercel:**
   - เข้าสู่ระบบ [https://vercel.com](https://vercel.com)
   - กดปุ่ม **"Add New..."** $\rightarrow$ **"Project"**
   - เลือก Repository `ComHub-Csi204` เดียวกัน แล้วกด **Import**
2. **ตั้งค่า Project Configuration:**
   - **Project Name:** `comhub-frontend`
   - **Framework Preset:** `Vite`
   - **Root Directory:** เลือกกด Edit แล้วเลือก `FrontEnd`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **ตั้งค่า Environment Variables:**
   - `VITE_API_BASE_URL` = `<URL ของ Backend ที่ Deploy ใน Issue 036 เช่น https://comhub-backend-api.vercel.app>`
4. **สั่ง Deploy Frontend:**
   - กดปุ่ม **"Deploy"** รอระบบคอมไพล์ Vite Build Asset (ใช้เวลาประมาณ 1 นาที)
   - เมื่อเสร็จแล้ว คัดลอก URL ของ Frontend (เช่น `https://comhub-frontend.vercel.app`)
5. **อัปเดต CORS บน Backend (จุดสำคัญมาก):**
   - กลับไปที่ Vercel Dashboard ของ **`comhub-backend-api`** (จาก Issue 036)
   - ไปที่ **Settings** $\rightarrow$ **Environment Variables**
   - แก้ไข `CORS_ORIGIN` เปลี่ยนเป็น URL ของ Frontend: `https://comhub-frontend.vercel.app`
   - กด **Redeploy** ฝั่ง Backend เพื่อให้สิทธิ์ CORS Origin อัปเดตทำงาน
6. **ทำ E2E Production Smoke Test:**
   - เปิดเบราว์เซอร์ไปที่ `https://comhub-frontend.vercel.app`
   - **สมัครสมาชิกใหม่** $\rightarrow$ **เข้าสู่ระบบ**
   - เข้าหน้า **PC Builder** จัดสเปค 7 หมวด $\rightarrow$ **ดู Compatibility Checker**
   - เข้าหน้า **Checkout** กรอกที่อยู่ $\rightarrow$ อัปโหลดสลิปโอนเงิน $\rightarrow$ กดสั่งซื้อ
   - ล็อกอินด้วยบัญชี **Admin** $\rightarrow$ เข้าหน้า **Payment Review** กด **Approve** $\rightarrow$ เข้าหน้า **Admin Orders** อัปเดตสถานะเป็น `Shipped` กรอก Tracking No.
   - กลับมาดูหน้า **Order Tracking** ฝั่งลูกค้า ตรวจสอบสถานะและเลข Tracking แสดงผลถูกต้อง

## Acceptance criteria
- [ ] Deploy โปรเจกต์ `FrontEnd` ขึ้น Vercel Static Hosting สำเร็จสมบูรณ์
- [ ] ตั้งค่า `VITE_API_BASE_URL` เชื่อมโยงกับ Backend Production API บน Vercel
- [ ] อัปเดต `CORS_ORIGIN` บน Backend เป็น Production Domain ของ Frontend
- [ ] ทดสอบ E2E Flow ครบวงจรบน URL Production จริงสำเร็จ 100% โดยไม่มี CORS Error หรือ API Crash

## Blocked by
- [Issue 036: Production Deployment Phase 2 — Backend Express Serverless Setup on Vercel](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-036-deploy-backend-vercel.md)
