# Issue 024: Cart + Wishlist — Full API Integration

## What to build

ปัจจุบัน Catalog "Add to Cart" แค่แสดง toast แต่ไม่เรียก CartContext จริง,
ProductDetail ไม่ส่ง quantity ไปใน addItem,
Wishlist ใช้ local state ไม่ persist ไป backend,
และ Wishlist page ไม่ handle กรณีไม่ login

แก้ทั้ง Cart + Wishlist flow ให้ทำงานจริง end-to-end:

**Cart:**
- Catalog.jsx: import `useCart` → "Add to Cart" button เรียก `addItem(product)` จริง (ไม่ใช่แค่ Swal)
- ProductDetail.jsx: ส่ง `quantity` state ที่ user เลือกไปใน `addItem(product, quantity)`

**Wishlist:**
- Catalog.jsx: แทน local `useState([])` → เรียก `wishlistService.add/remove` API (check auth ก่อน, ถ้าไม่ login → แจ้งเตือน)
- ProductDetail.jsx: เพิ่ม `useEffect` เรียก wishlist API ตรวจว่า product นี้ wishlisted หรือยัง on mount (ถ้า logged in)
- Wishlist.jsx: ถ้าไม่ login → แสดง message + link ไป login แทน empty state ที่ swallow error

## Acceptance criteria

- [X] กด "Add to Cart" จาก Catalog → สินค้าปรากฏใน Cart page จริง
- [X] กด "Add to Cart" จาก ProductDetail ด้วย quantity=3 → Cart แสดง 3 ชิ้น
- [X] กด Wishlist จาก Catalog (logged in) → item ถูก persist ใน backend (refresh แล้วยังอยู่)
- [X] กด Wishlist จาก Catalog (not logged in) → แจ้งเตือนให้ login
- [X] เข้า ProductDetail ของ item ที่ wishlisted แล้ว → heart icon เป็น filled ทันที
- [X] Wishlist page แสดงรายการจริง (logged in)
- [X] Wishlist page แสดง "Please login" message (not logged in)
- [X] `npx vitest run` ผ่านไม่มี regression

## Blocked by

- [Issue 023: Auth-aware Header](./issue-023-auth-header-admin-nav.md) — DONE
