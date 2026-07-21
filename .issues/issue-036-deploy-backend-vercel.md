# Issue 036: Production Deployment Phase 2 — Backend Express Serverless Setup on Vercel

## Parent
[Issue 020: SDLC Phase 6 & 7 (Deployment & Maintenance)](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-020-production-deployment.md)

## What to build
Deploy REST API Backend (Express + TypeScript) ขึ้นบริการ **Vercel Serverless Functions** โดยเชื่อมต่อกับ Supabase PostgreSQL Cloud Database พร้อมตั้งค่า Environment Variables และ CORS Security

### ขั้นตอนการปฏิบัติแบบละเอียด (Step-by-Step Instructions)
1. **เตรียม Repository บน GitHub:**
   - ตรวจสอบว่าไฟล์ [backend/vercel.json](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/backend/vercel.json) และ [backend/api/index.ts](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/backend/api/index.ts) ถูก push ขึ้น GitHub Repo แล้ว
2. **สร้าง Project บน Vercel:**
   - เข้าสู่ระบบ [https://vercel.com](https://vercel.com) ด้วยบัญชี GitHub
   - กดปุ่ม **"Add New..."** $\rightarrow$ **"Project"**
   - เลือก Repository `ComHub-Csi204` แล้วกด **Import**
3. **ตั้งค่า Project Configuration:**
   - **Project Name:** `comhub-backend-api`
   - **Framework Preset:** `Other` (หรือ Node.js)
   - **Root Directory:** เลือกกด Edit แล้วพิมพ์หรือเลือก `backend`
   - **Build and Output Settings:** คงค่า Default (ไม่ต้องแก้)
4. **ตั้งค่า Environment Variables (ในหน้าก่อน Deploy):**
   - `DATABASE_URL` = `<Connection String จาก Supabase Issue 035>`
   - `JWT_SECRET` = `comhub_prod_jwt_secret_key_64_chars_long_secure_token_2026`
   - `CORS_ORIGIN` = `http://localhost:5173` (จะมาอัปเดตเป็น URL Frontend Vercel หลัง Deploy Frontend)
   - `PORT` = `3000`
5. **สั่ง Deploy และทดสอบ:**
   - กดปุ่ม **"Deploy"** รอระบบคอมไพล์ TypeScript และสร้าง Serverless Functions (ใช้เวลาประมาณ 1-2 นาที)
   - เมื่อ Deploy สำเร็จ คัดลอก Production Domain (เช่น `https://comhub-backend-api.vercel.app`)
   - ทดสอบเปิดเบราว์เซอร์ไปที่ `https://comhub-backend-api.vercel.app/health` ต้องตอบกลับ JSON: `{ "ok": true, "service": "comhub-backend", ... }`

## Acceptance criteria
- [ ] Deploy โปรเจกต์ `backend` ขึ้น Vercel Serverless Functions สำเร็จสมบูรณ์
- [ ] ตั้งค่า Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`) บน Vercel Dashboard
- [ ] Endpoint `/health` ตอบกลับ `{ "ok": true }` บน Production Domain
- [ ] Endpoint `/api/products` ดึงข้อมูลสินค้าจาก Supabase DB จริงบน Production สภาพแวดล้อมได้สำเร็จ

## Blocked by
- [Issue 035: Production Deployment Phase 1 — Supabase PostgreSQL Cloud Setup](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-035-deploy-database-supabase.md)
