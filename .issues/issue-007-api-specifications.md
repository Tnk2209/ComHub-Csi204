# Issue 007: SDLC Phase 3 (Design) - REST API Contract & JSON Schema Design

## What to build
จัดทำและเขียนรายละเอียดการเชื่อมต่อข้อมูลผ่านเครือข่ายอินเทอร์เน็ต (API Specifications Contract) สำหรับเป็นแนวทางเชื่อมต่อระหว่างหน้าบ้าน (React SPA) และหลังบ้าน (Express Server)

## Acceptance criteria
- [ ] มีเอกสารกำหนดรายการ Endpoints ของ API ทั้งหมดครบตาม Use Case หลัก (เช่น Authentication, Product Catalog, Compatibility checks, Checkout, Staff queue, Gallery)
- [ ] ระบุข้อมูลรูปแบบ Request Body และ Response ในรูปแบบ JSON Schema อย่างละเอียดของแต่ละเส้น API
- [ ] ออกแบบกลไกการแนบ JWT Token ในส่วนหัว HTTP Header (Authorization Bearer Token) ในการสกัดกั้นสิทธิ์ (RBAC Guards)
- [ ] ออกแบบ HTTP Status codes และ Error Handling JSON formats สำหรับกรณีระบบขัดข้องหรือกรอกข้อมูลผิดพลาด

## Blocked by
None - can start immediately
