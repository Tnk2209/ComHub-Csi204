# Issue 025: i18n — Missing Translation Keys

## What to build

Landing page feature card ที่ 3 reference keys `landing.features.uat_title` และ `landing.features.uat_desc` ที่ไม่มีในทั้ง EN และ TH translation files ทำให้แสดง raw key string บนหน้าเว็บ

แก้โดยเพิ่ม translations ที่หายไป และตรวจสอบว่าไม่มี key อื่นที่ reference แล้วขาดอีก

## Acceptance criteria

- [X] `landing.features.uat_title` + `landing.features.uat_desc` มีค่าใน `en/translation.json`
- [X] `landing.features.uat_title` + `landing.features.uat_desc` มีค่าใน `th/translation.json`
- [X] Landing page feature cards แสดงข้อความถูกต้องทั้ง EN และ TH (ไม่แสดง raw key)
- [X] Grep ตรวจว่าไม่มี i18n key อื่นที่ขาดอยู่
- [X] `npx vitest run` ผ่านไม่มี regression

## Additional keys added

นอกจาก `uat_title`/`uat_desc` ยังเพิ่ม keys ที่หายไปอีก 20+ ตัว:
- `wishlist.login_required`, `wishlist.login_required_desc`, `wishlist.alert_*`
- `cart.compressing`, `cart.compressed_size`, `cart.original_size`, `cart.compression_failed`, `cart.processing`
- `compare.title`, `compare.empty`, `compare.go_to_catalog`, `compare.clear_all`, `compare.spec`
- `order_tracking.no_orders`, `product_detail.no_reviews`
- `admin_accounts.search_btn`, `admin_accounts.search_placeholder`
- `admin_payment.reject_reason`

## Blocked by

None - can start immediately
