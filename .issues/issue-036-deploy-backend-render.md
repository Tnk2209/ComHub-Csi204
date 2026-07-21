# Issue 036: Production Deployment Phase 2 — Backend Express Web Service Setup on Render.com

## Parent
[Issue 020: SDLC Phase 6 & 7 (Deployment & Maintenance)](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-020-production-deployment.md)

## What to build
Deploy REST API Backend (Express + TypeScript) ขึ้นบริการ **Render.com (Web Service)** แบบ Dedicated Node.js 24/7 Server โดยเชื่อมต่อกับ Supabase PostgreSQL Cloud Database พร้อมตั้งค่า Environment Variables และ HTTPS SSL Security

### ขั้นตอนการปฏิบัติแบบละเอียด (Step-by-Step Instructions)
1. **สมัครและเชื่อมต่อ บัญชี Render.com:**
   - เข้าสู่ระบบ [https://render.com](https://render.com) ด้วยบัญชี GitHub
2. **สร้าง Web Service ใหม่:**
   - คลิกปุ่ม **"New +"** $\rightarrow$ เลือก **"Web Service"**
   - เลือกวิธียืนยันตัวตนด้วย GitHub Repository: `ComHub-Csi204` แล้วกด **Connect**
3. **ตั้งค่า Web Service Configuration:**
   - **Name:** `comhub-backend-api`
   - **Region:** `Singapore (ap-southeast-1)`
   - **Branch:** `main` (หรือ branch ล่าสุด)
   - **Root Directory:** พิมพ์ `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start` (ซึ่งจะรัน `node dist/server.js`)
   - **Instance Type:** `Free`
4. **ตั้งค่า Environment Variables (ในหมวด Environment):**
   - `DATABASE_URL` = `<Connection String จาก Supabase Issue 035>`
   - `JWT_SECRET` = `comhub_prod_jwt_secret_key_64_chars_long_secure_token_2026`
   - `CORS_ORIGIN` = `http://localhost:5173` (จะมาอัปเดตเป็น URL Frontend Vercel หลัง Deploy Frontend)
   - `NODE_ENV` = `production`
5. **ตั้งค่า Health Check:**
   - ในหมวด **Advanced** $\rightarrow$ **Health Check Path:** พิมพ์ `/health`
6. **สั่ง Create Web Service และทดสอบ:**
   - กดปุ่ม **"Create Web Service"** รอระบบคอมไพล์ TypeScript และเริ่มต้น Node.js Server (ประมาณ 2-3 นาที)
   - คัดลอก Production Domain ที่ Render สุ่มให้ (เช่น `https://comhub-backend-api.onrender.com`)
   - ทดสอบเปิดเบราว์เซอร์ไปที่ `https://comhub-backend-api.onrender.com/health` ต้องตอบกลับ JSON: `{ "ok": true, "service": "comhub-backend", ... }`

## Acceptance criteria
- [X] Deploy โปรเจกต์ `backend` ขึ้น Render.com Web Service สำเร็จสมบูรณ์ (Production URL: `https://comhub-backend-api.onrender.com`)
- [X] ตั้งค่า Build Command (`npm install && npm run build`) และ Start Command (`npm start`) บน Render
- [X] ตั้งค่า Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV`)
- [X] Endpoint `/health` ตอบกลับ `{ "ok": true }` บน Production Domain (`https://comhub-backend-api.onrender.com`)
- [X] Endpoint `/api/products` ดึงข้อมูลสินค้าจาก Supabase DB จริงบน Production สภาพแวดล้อมได้สำเร็จ

## Blocked by
- [Issue 035: Production Deployment Phase 1 — Supabase PostgreSQL Cloud Setup](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-035-deploy-database-supabase.md)
