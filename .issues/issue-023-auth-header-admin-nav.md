# Issue 023: Auth-aware Header + Admin Navigation + DashboardLayout

## What to build

Header component ปัจจุบันไม่รู้จัก auth state — แสดงปุ่ม "Login" ตลอดไม่ว่าจะ login แล้วหรือยัง
ไม่มี navigation path ไปหน้า Admin เลย (ต้อง manual พิมพ์ URL)
DashboardLayout sidebar คาดหวัง props ที่ไม่มีใครส่งให้

แก้โดย wire auth state เข้า UI layer:
- Header.jsx ใช้ `useAuth()` → conditional render: logged-in แสดงชื่อ+dropdown (Logout, Admin Panel ถ้า role=Admin) / ไม่ login แสดงปุ่ม Login
- AuthContext เพิ่ม `isAuthenticated: !!user` ใน Provider value (components อื่นต้องใช้)
- DashboardLayout.jsx ใช้ `useAuth()` โดยตรง แทนพึ่ง props ที่ไม่มีใครส่ง

## Acceptance criteria

- [X] Login แล้ว Header แสดงชื่อ user (first_name) + ปุ่ม Logout
- [X] Admin login → Header แสดง link "Admin Panel" ที่นำไป admin-dashboard
- [X] DashboardLayout sidebar แสดง role ถูกต้อง + logout ทำงานจริง
- [X] AuthContext expose `isAuthenticated` field
- [X] Logout แล้ว Header กลับเป็นปุ่ม Login
- [X] Mobile menu ก็แสดง conditional auth state เช่นกัน

## Blocked by

None - can start immediately
