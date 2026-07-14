# แผนภาพ UML Diagrams (ระบบ ComHub)

หน้านี้รวมแผนภาพ UML Use Case Diagram และ Class Diagram ของโครงการ ComHub ซึ่งสามารถดูภาพ Render ได้ทันทีผ่านหน้าแสดงผล Markdown Preview ใน VS Code (โดยกดปุ่ม `Ctrl + Shift + V` หรือคลิกไอคอน Preview รูปแว่นขยายที่มุมขวาบน)

---

## 1. Use Case Diagram (แผนภาพแสดงสิทธิ์การเข้าใช้ฟังก์ชัน)

```mermaid
flowchart LR
 subgraph Customer_Flow["1. ลูกค้า (Customer)"]
        C_Register("สมัครสมาชิก<br>(Register)")
        C_Login("ล็อกอินเข้าสู่ระบบ<br>(Login)")
        C_Builder("จัดสเปคคอมพิวเตอร์<br>(PC Builder)")
        C_Compat("ตรวจสอบความเข้ากันได้<br>(Compatibility Checker)")
        C_Wattage("คำนวณกำลังไฟ<br>(Wattage Calculator)")
        C_Prebuilt("เซ็ตสเปคแนะนำ<br>(Pre-built Templates)")
        C_Compare("เปรียบเทียบสินค้า<br>(Product Comparison)")
        C_Wishlist("บันทึกสินค้าโปรด<br>(Wishlist &amp; Stock Alert)")
        C_Review("เขียนรีวิว<br>(Review with Photos)")
        C_Gallery("แกลเลอรี่คอมมูนิตี้<br>(PC Build Gallery)")
        C_Cart("ตะกร้าสินค้าและสั่งซื้อ<br>(Cart &amp; Checkout)")
        C_Track("ติดตามสถานะประกอบ<br>(Assembly Tracking)")
        C_SelectPart("เลือกชิ้นส่วน")
        C_SwapPart("เปลี่ยนชิ้นส่วน")
        C_RemovePart("ลบชิ้นส่วน")
        C_ViewSummary("ดูสรุปสเปค")
        C_CheckSocket("ตรวจสอบ Socket")
        C_CheckCaseSize("ตรวจสอบขนาดเคส")
        C_CheckGpuSize("ตรวจสอบขนาดการ์ดจอ")
        C_CheckRamType("ตรวจสอบชนิด RAM")
        C_ViewTDP("ดูผลคำนวณ TDP")
        C_RecommendPSU("แนะนำ PSU")
        C_ViewPrebuilt("ดูเซ็ตแนะนำ")
        C_OrderPrebuilt("สั่งซื้อเซ็ตทันที")
        C_EditPrebuilt("ดึงเซ็ตไปปรับแต่ง")
        C_AddCompare("เพิ่มสินค้าเข้าเปรียบเทียบ")
        C_ViewCompareTable("ดูตารางเปรียบเทียบ")
        C_RemoveCompare("ลบสินค้าจากการเปรียบเทียบ")
        C_AddWishlist("เพิ่มสินค้าเข้า Wishlist")
        C_RemoveWishlist("ลบสินค้าจาก Wishlist")
        C_EnableAlert("เปิดแจ้งเตือนสต็อก")
        C_DisableAlert("ปิดแจ้งเตือนสต็อก")
        C_WriteReview("เขียนรีวิวใหม่")
        C_AttachImage("แนบรูปภาพ")
        C_ViewReview("ดูรีวิวสินค้า")
        C_ShareGallery("แชร์สเปคสู่แกลเลอรี่")
        C_ViewGallery("ดูโพสต์คนอื่น")
        C_CloneSpec("โคลนสเปค")
        C_LikePost("กดถูกใจ")
        C_AddCart("เพิ่มสินค้าลงตะกร้า")
        C_EditQty("แก้ไขจำนวน")
        C_RemoveCart("ลบสินค้าจากตะกร้า")
        C_FillAddress("กรอกที่อยู่จัดส่ง")
        C_SelectAssembly("เลือกบริการประกอบ")
        C_UseCoupon("ใส่คูปองส่วนลด")
        C_UploadSlip("อัปโหลดสลิปโอนเงิน")
        C_ViewStatus("ดูสถานะออเดอร์")
        C_ViewLogHistory("ดูประวัติล็อก")
        C_ViewBurnIn("ดูผลทดสอบ Burn-in")
        C_ViewTrackingNo("ดูเลข Tracking")
  end
 subgraph Staff_Flow["2. พนักงาน (Staff)"]
        S_Login("ล็อกอินเข้าสู่ระบบพนักงาน<br>(Login)")
        S_Build("จัดการคิวงานประกอบ<br>(Build Management)")
        S_BurnIn("บันทึกผล Burn-in Test")
        S_Logistics("ออกใบจัดส่ง<br>(Logistics)")
        S_ViewQueue("ดูรายการคิวประกอบ")
        S_ViewBOM("ดูรายการอุปกรณ์ (BOM)")
        S_UpdateAssembling("อัปเดตสถานะ \กำลังประกอบ\")
        S_UpdateTesting("อัปเดตสถานะ \กำลังเทสระบบ\")
        S_CpuTemp("กรอกอุณหภูมิ CPU")
        S_GpuTemp("กรอกอุณหภูมิ GPU")
        S_PassFail("ประเมินผล Pass/Fail")
        S_Notes("เขียนโน้ตหมายเหตุ")
        S_PrintBill("พิมพ์ใบนำส่งพัสดุ")
        S_FillTracking("กรอก Tracking Number")
        S_UpdateShipped("อัปเดตสถานะ \จัดส่งแล้ว\")
  end
 subgraph Manager_Flow["3. ผู้จัดการร้าน (Manager)"]
        Mg_Login("ล็อกอินเข้าสู่ระบบผู้จัดการ<br>(Login)")
        Mg_Template("จัดการเทมเพลตแนะนำ<br>(Pre-built Management)")
        Mg_Gallery("ตรวจสอบแกลเลอรี่<br>(Gallery Moderation)")
        Mg_Dashboard("แดชบอร์ดยอดขาย<br>(Sales Dashboard)")
        Mg_CreateTpl("สร้างเทมเพลตใหม่")
        Mg_AddItem("เพิ่มชิ้นส่วนเข้าเทมเพลต")
        Mg_EditTpl("แก้ไขเทมเพลต")
        Mg_DeleteTpl("ลบเทมเพลต")
        Mg_ViewPending("ดูรายการรอตรวจ")
        Mg_Approve("อนุมัติเผยแพร่ (Approve)")
        Mg_Reject("ปฏิเสธ (Reject)")
        Mg_Pin("ปักหมุดโพสต์")
        Mg_Unpin("ยกเลิกปักหมุด")
        Mg_SalesChart("ดูกราฟยอดขาย")
        Mg_TopProduct("ดูสินค้ายอดนิยม")
        Mg_LowStock("ดูเตือนสต็อกต่ำ")
  end
 subgraph Admin_Flow["4. ผู้ดูแลระบบ (Admin)"]
        A_Login("ล็อกอินเข้าสู่ระบบแอดมิน<br>(Login)")
        A_Database("จัดการคลังสินค้า<br>(Database CRUD)")
        A_Rules("ตั้งค่ากฎความเข้ากันได้<br>(Rules Configuration)")
        A_Power("ตั้งค่ากำลังไฟ<br>(Power Allocation)")
        A_Access("จัดการสิทธิ์ผู้ใช้<br>(Role &amp; Access Control)")
        A_Payment("อนุมัติสลิปโอนเงิน<br>(Payment Review)")
        A_AddProduct("เพิ่มสินค้า")
        A_EditProduct("แก้ไขสินค้า")
        A_SoftDelete("ปิดขายสินค้า (Soft Delete)")
        A_ReEnable("เปิดขายสินค้าอีกครั้ง")
        A_ViewAll("ดูรายการสินค้าทั้งหมด")
        A_AddSocket("เพิ่มกฎ Socket Matching")
        A_EditSocket("แก้ไขกฎ Socket")
        A_AddSize("เพิ่มกฎ Size Limitation")
        A_EditSize("แก้ไขกฎ Size")
        A_SetTDP("กำหนด TDP Watts")
        A_EditTDP("แก้ไข TDP Watts")
        A_CreateStaff("สร้างบัญชี Staff/Manager")
        A_EditPermission("แก้ไขสิทธิ์")
        A_DeleteAccount("ลบบัญชี")
        A_ViewPending("ดูสลิปรอตรวจ")
        A_ApprovePay("อนุมัติการชำระเงิน (Approved)")
        A_RejectPay("ปฏิเสธการชำระเงิน (Rejected)")
  end
 subgraph ComHub_System["ระบบ ComHub (System Boundary)"]
        Customer_Flow
        Staff_Flow
        Manager_Flow
        Admin_Flow
  end
    C_Builder -.->|"<<include>>"| C_SelectPart
    C_SwapPart -.->|"<<extend>>"| C_Builder
    C_RemovePart -.->|"<<extend>>"| C_Builder
    C_Builder -.->|"<<include>>"| C_ViewSummary
    C_Builder -.->|"<<include>>"| C_Compat
    C_Builder -.->|"<<include>>"| C_Wattage

    C_Compat -.->|"<<include>>"| C_CheckSocket
    C_Compat -.->|"<<include>>"| C_CheckCaseSize
    C_Compat -.->|"<<include>>"| C_CheckGpuSize
    C_Compat -.->|"<<include>>"| C_CheckRamType

    C_Wattage -.->|"<<include>>"| C_ViewTDP
    C_Wattage -.->|"<<include>>"| C_RecommendPSU

    C_Prebuilt -.->|"<<include>>"| C_ViewPrebuilt
    C_OrderPrebuilt -.->|"<<extend>>"| C_Prebuilt
    C_EditPrebuilt -.->|"<<extend>>"| C_Prebuilt
    C_EditPrebuilt -.->|"<<include>>"| C_Builder
    C_OrderPrebuilt -.->|"<<include>>"| C_Cart

    C_Compare -.->|"<<include>>"| C_ViewCompareTable
    C_AddCompare -.->|"<<extend>>"| C_Compare
    C_RemoveCompare -.->|"<<extend>>"| C_Compare

    C_Wishlist -.->|"<<include>>"| C_AddWishlist
    C_RemoveWishlist -.->|"<<extend>>"| C_Wishlist
    C_EnableAlert -.->|"<<extend>>"| C_Wishlist
    C_DisableAlert -.->|"<<extend>>"| C_Wishlist

    C_Review -.->|"<<include>>"| C_WriteReview
    C_AttachImage -.->|"<<extend>>"| C_Review
    C_Review -.->|"<<include>>"| C_ViewReview

    C_Gallery -.->|"<<include>>"| C_ViewGallery
    C_ShareGallery -.->|"<<extend>>"| C_Gallery
    C_CloneSpec -.->|"<<extend>>"| C_Gallery
    C_LikePost -.->|"<<extend>>"| C_Gallery
    C_CloneSpec -.->|"<<include>>"| C_Builder

    C_Cart -.->|"<<include>>"| C_AddCart
    C_EditQty -.->|"<<extend>>"| C_Cart
    C_RemoveCart -.->|"<<extend>>"| C_Cart
    C_Cart -.->|"<<include>>"| C_FillAddress
    C_SelectAssembly -.->|"<<extend>>"| C_Cart
    C_UseCoupon -.->|"<<extend>>"| C_Cart
    C_Cart -.->|"<<include>>"| C_UploadSlip

    C_Track -.->|"<<include>>"| C_ViewStatus
    C_ViewLogHistory -.->|"<<extend>>"| C_Track
    C_ViewBurnIn -.->|"<<extend>>"| C_Track
    C_ViewTrackingNo -.->|"<<extend>>"| C_Track

    S_Build -.->|"<<include>>"| S_ViewQueue
    S_Build -.->|"<<include>>"| S_ViewBOM
    S_Build -.->|"<<include>>"| S_UpdateAssembling
    S_Build -.->|"<<include>>"| S_UpdateTesting
    S_Build -.->|"<<include>>"| S_BurnIn

    S_BurnIn -.->|"<<include>>"| S_CpuTemp
    S_BurnIn -.->|"<<include>>"| S_GpuTemp
    S_BurnIn -.->|"<<include>>"| S_PassFail
    S_Notes -.->|"<<extend>>"| S_BurnIn

    S_Logistics -.->|"<<include>>"| S_PrintBill
    S_Logistics -.->|"<<include>>"| S_FillTracking
    S_Logistics -.->|"<<include>>"| S_UpdateShipped

    Mg_Template -.->|"<<include>>"| Mg_CreateTpl
    Mg_EditTpl -.->|"<<extend>>"| Mg_Template
    Mg_DeleteTpl -.->|"<<extend>>"| Mg_Template
    Mg_CreateTpl -.->|"<<include>>"| Mg_AddItem

    Mg_Gallery -.->|"<<include>>"| Mg_ViewPending
    Mg_Approve -.->|"<<extend>>"| Mg_Gallery
    Mg_Reject -.->|"<<extend>>"| Mg_Gallery
    Mg_Pin -.->|"<<extend>>"| Mg_Gallery
    Mg_Unpin -.->|"<<extend>>"| Mg_Gallery

    Mg_Dashboard -.->|"<<include>>"| Mg_SalesChart
    Mg_Dashboard -.->|"<<include>>"| Mg_TopProduct
    Mg_Dashboard -.->|"<<include>>"| Mg_LowStock

    A_Database -.->|"<<include>>"| A_ViewAll
    A_AddProduct -.->|"<<extend>>"| A_Database
    A_EditProduct -.->|"<<extend>>"| A_Database
    A_SoftDelete -.->|"<<extend>>"| A_Database
    A_ReEnable -.->|"<<extend>>"| A_Database

    A_Rules -.->|"<<include>>"| A_AddSocket
    A_EditSocket -.->|"<<extend>>"| A_Rules
    A_AddSize -.->|"<<extend>>"| A_Rules
    A_EditSize -.->|"<<extend>>"| A_Rules

    A_Power -.->|"<<include>>"| A_SetTDP
    A_EditTDP -.->|"<<extend>>"| A_Power

    A_Access -.->|"<<include>>"| A_CreateStaff
    A_EditPermission -.->|"<<extend>>"| A_Access
    A_DeleteAccount -.->|"<<extend>>"| A_Access

    A_Payment -.->|"<<include>>"| A_ViewPending
    A_ApprovePay -.->|"<<extend>>"| A_Payment
    A_RejectPay -.->|"<<extend>>"| A_Payment
    Customer["ลูกค้า<br>(Customer)"] ~~~ Staff["พนักงานประกอบเครื่อง<br>(Staff)"]
    Staff ~~~ Manager["ผู้จัดการร้าน<br>(Manager)"]
    Manager ~~~ Admin["ผู้ดูแลระบบ<br>(Admin)"]
    Customer ---> C_Register & C_Login & C_Builder & C_Compat & C_Wattage & C_Prebuilt & C_Compare & C_Wishlist & C_Review & C_Gallery & C_Cart & C_Track
    Staff ---> S_Login & S_Build & S_BurnIn & S_Logistics
    Manager ---> Mg_Login & Mg_Template & Mg_Gallery & Mg_Dashboard
    Admin ---> A_Login & A_Database & A_Rules & A_Power & A_Access & A_Payment

     C_Register:::baseUC
     C_Login:::baseUC
     C_Builder:::baseUC
     C_Compat:::baseUC
     C_Wattage:::baseUC
     C_Prebuilt:::baseUC
     C_Compare:::baseUC
     C_Wishlist:::baseUC
     C_Review:::baseUC
     C_Gallery:::baseUC
     C_Cart:::baseUC
     C_Track:::baseUC
     C_SelectPart:::subUC
     C_SwapPart:::subUC
     C_RemovePart:::subUC
     C_ViewSummary:::subUC
     C_CheckSocket:::subUC
     C_CheckCaseSize:::subUC
     C_CheckGpuSize:::subUC
     C_CheckRamType:::subUC
     C_ViewTDP:::subUC
     C_RecommendPSU:::subUC
     C_ViewPrebuilt:::subUC
     C_OrderPrebuilt:::subUC
     C_EditPrebuilt:::subUC
     C_AddCompare:::subUC
     C_ViewCompareTable:::subUC
     C_RemoveCompare:::subUC
     C_AddWishlist:::subUC
     C_RemoveWishlist:::subUC
     C_EnableAlert:::subUC
     C_DisableAlert:::subUC
     C_WriteReview:::subUC
     C_AttachImage:::subUC
     C_ViewReview:::subUC
     C_ShareGallery:::subUC
     C_ViewGallery:::subUC
     C_CloneSpec:::subUC
     C_LikePost:::subUC
     C_AddCart:::subUC
     C_EditQty:::subUC
     C_RemoveCart:::subUC
     C_FillAddress:::subUC
     C_SelectAssembly:::subUC
     C_UseCoupon:::subUC
     C_UploadSlip:::subUC
     C_ViewStatus:::subUC
     C_ViewLogHistory:::subUC
     C_ViewBurnIn:::subUC
     C_ViewTrackingNo:::subUC
     S_Login:::baseUC
     S_Build:::baseUC
     S_BurnIn:::baseUC
     S_Logistics:::baseUC
     S_ViewQueue:::subUC
     S_ViewBOM:::subUC
     S_UpdateAssembling:::subUC
     S_UpdateTesting:::subUC
     S_CpuTemp:::subUC
     S_GpuTemp:::subUC
     S_PassFail:::subUC
     S_Notes:::subUC
     S_PrintBill:::subUC
     S_FillTracking:::subUC
     S_UpdateShipped:::subUC
     Mg_Login:::baseUC
     Mg_Template:::baseUC
     Mg_Gallery:::baseUC
     Mg_Dashboard:::baseUC
     Mg_CreateTpl:::subUC
     Mg_AddItem:::subUC
     Mg_EditTpl:::subUC
     Mg_DeleteTpl:::subUC
     Mg_ViewPending:::subUC
     Mg_Approve:::subUC
     Mg_Reject:::subUC
     Mg_Pin:::subUC
     Mg_Unpin:::subUC
     Mg_SalesChart:::subUC
     Mg_TopProduct:::subUC
     Mg_LowStock:::subUC
     A_Login:::baseUC
     A_Database:::adminUC
     A_Rules:::adminUC
     A_Power:::adminUC
     A_Access:::adminUC
     A_Payment:::adminUC
     A_AddProduct:::subUC
     A_EditProduct:::subUC
     A_SoftDelete:::subUC
     A_ReEnable:::subUC
     A_ViewAll:::subUC
     A_AddSocket:::subUC
     A_EditSocket:::subUC
     A_AddSize:::subUC
     A_EditSize:::subUC
     A_SetTDP:::subUC
     A_EditTDP:::subUC
     A_CreateStaff:::subUC
     A_EditPermission:::subUC
     A_DeleteAccount:::subUC
     A_ViewPending:::subUC
     A_ApprovePay:::subUC
     A_RejectPay:::subUC
     Customer:::actor
     Staff:::actor
     Manager:::actor
     Admin:::actor
    classDef actor fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
    classDef baseUC fill:#0369a1,stroke:#bae6fd,stroke-width:1.5px,color:#fff
    classDef subUC fill:#0f172a,stroke:#10b981,stroke-width:1.2px,color:#fff
    classDef adminUC fill:#b91c1c,stroke:#fecaca,stroke-width:1.5px,color:#fff
```

## 2. Class Diagram (แผนภาพโครงสร้างข้อมูลและความสัมพันธ์)

```mermaid
%% ============================================================
%% ComHub - Class Diagram
%% แหล่งข้อมูล: markdown/project-scope.md
%% CSI204 - Software Engineering
%% ============================================================
classDiagram
    direction TB

    %% ---------------- User Hierarchy (SYS-01) ----------------
    class User {
        +int id
        +string email
        +string password_hash
        +string first_name
        +string last_name
        +string role
        +datetime created_at
        +register() bool
        +login() string
        +logout() bool
    }

    class Customer {
        %% C-01 ~ C-09
        +selectPart(productId, category) bool
        +swapPart(productId, category) bool
        +removePart(category) bool
        +viewBuildSummary() json
        +checkCompatibility() list
        +calculateWattage() double
        +recommendPSU() list
        +addToComparison(productId) bool
        +removeFromComparison(productId) bool
        +addWishlist(productId) bool
        +removeWishlist(productId) bool
        +toggleStockAlert(productId, enabled) bool
        +submitReview(orderId, productId, rating, comment) bool
        +uploadReviewImage(reviewId, file) string
        +shareBuildToGallery(orderId) bool
        +cloneBuildFromGallery(postId) bool
        +likeGalleryPost(postId) bool
        +addToCart(productId, quantity) bool
        +updateCartQuantity(productId, quantity) bool
        +removeFromCart(productId) bool
        +applyCoupon(code) bool
        +uploadPaymentSlip(orderId, file) string
        +checkout() Order
        +viewAssemblyStatus(orderId) json
    }

    class Staff {
        %% S-01 ~ S-03
        +viewAssemblyQueue() list
        +viewBOM(orderId) list
        +updateAssemblyStatus(orderId, status) bool
        +submitBurnInRecord(orderId, cpuTemp, gpuTemp, status, notes) bool
        +printLogisticsBill(orderId) bool
        +fillTrackingNumber(orderId, trackingNum) bool
    }

    class Manager {
        %% M-01 ~ M-03
        +createPrebuiltTemplate(name, priceTag) bool
        +addTemplateItem(templateId, productId, qty) bool
        +editPrebuiltTemplate(templateId) bool
        +deletePrebuiltTemplate(templateId) bool
        +reviewGalleryQueue() list
        +approveGalleryPost(postId) bool
        +rejectGalleryPost(postId) bool
        +pinGalleryPost(postId) bool
        +unpinGalleryPost(postId) bool
        +viewSalesDashboard() json
        +viewTopProducts() list
        +viewLowStockAlert() list
    }

    class Admin {
        %% A-01 ~ A-04
        +createProduct(data) bool
        +updateProduct(productId, data) bool
        +setProductActive(productId, isActive) bool
        +listAllProducts() list
        +addCompatibilityRule(cpuSocket, mbSocket) bool
        +editCompatibilityRule(ruleId) bool
        +addSizeLimitRule(caseTag, maxMbSize, maxGpuLength) bool
        +editSizeLimitRule(ruleId) bool
        +setTdpWatts(productId, watts) bool
        +editTdpWatts(productId, watts) bool
        +createStaffAccount(data) bool
        +updateUserRole(userId, role) bool
        +deleteAccount(userId) bool
        +reviewPaymentSlip(orderId) json
        +approvePayment(orderId) bool
        +rejectPayment(orderId) bool
    }

    %% ---------------- Product & Catalog ----------------
    class Product {
        +int id
        +string name
        +string category
        +double price
        +int stock_quantity
        +string image_url
        +json specifications
        +double tdp_watts
        +bool is_active
    }

    class CompatibilityRule {
        %% A-02
        +int id
        +string cpu_socket
        +string mainboard_socket
        +datetime created_at
    }

    class SizeLimitRule {
        %% A-02
        +int id
        +string case_size_tag
        +double max_mainboard_size
        +double max_gpu_length_mm
    }

    %% ---------------- Pre-built Templates (C-04 / M-01) ----------------
    class PrebuiltTemplate {
        +int id
        +string template_name
        +string price_range_tag
        +string description
        +datetime created_at
    }

    class TemplateItem {
        +int id
        +int template_id
        +int product_id
        +int quantity
    }

    %% ---------------- Wishlist (C-06) ----------------
    class WishlistItem {
        +int id
        +int user_id
        +int product_id
        +bool is_alert_enabled
        +datetime created_at
    }

    %% ---------------- Cart & Checkout (SYS-02 / C-01) ----------------
    class CartItem {
        %% Client-side, persisted in LocalStorage
        +int product_id
        +int quantity
        +double price_per_unit
    }

    class Order {
        +int id
        +int user_id
        +double total_price
        +string coupon_code
        +double discount_amount
        +string payment_status
        +string order_status
        +string shipping_address
        +string payment_slip_url
        +bool is_assembled
        +string tracking_number
        +datetime created_at
    }

    class OrderItem {
        +int id
        +int order_id
        +int product_id
        +int quantity
        +double price_per_unit
    }

    class OrderLog {
        %% C-09 Assembly Tracking timeline
        +int id
        +int order_id
        +string status
        +int changed_by_user_id
        +datetime created_at
    }

    %% ---------------- Assembly & Logistics (S-01 / S-02 / S-03) ----------------
    class AssemblyRecord {
        +int id
        +int order_id
        +int staff_id
        +double cpu_temperature
        +double gpu_temperature
        +string burn_in_status
        +string notes
        +datetime tested_at
    }

    %% ---------------- Review & Gallery (C-07 / C-08 / M-02) ----------------
    class Review {
        +int id
        +int order_id
        +int product_id
        +int rating
        +string comment
        +string review_image_url
        +string status
    }

    class GalleryPost {
        +int id
        +int user_id
        +int order_id
        +string title
        +string description
        +string image_url
        +string status
        +bool is_pinned
        +int likes_count
        +datetime created_at
    }

    %% ================= Relationships =================

    %% Generalization
    User <|-- Customer
    User <|-- Staff
    User <|-- Manager
    User <|-- Admin

    %% Customer domain
    Customer "1" --> "*" CartItem : holds
    Customer "1" --> "*" Order : places
    Customer "1" --> "*" WishlistItem : maintains
    Customer "1" --> "*" Review : writes
    Customer "1" --> "*" GalleryPost : shares
    Product "1" --> "*" CartItem : referenced_by
    Product "1" --> "*" WishlistItem : added_to
    Product "1" --> "*" Review : reviewed_under

    %% Order composition
    Order "1" *-- "*" OrderItem : contains
    Product "1" --> "*" OrderItem : ordered_in
    Order "1" *-- "*" OrderLog : logs
    User "1" --> "*" OrderLog : changes_status
    Order "1" --> "0..1" AssemblyRecord : tested_by
    Order "1" --> "0..1" GalleryPost : shared_as
    Order "1" --> "0..*" Review : has

    %% Staff domain
    Staff "1" --> "*" AssemblyRecord : records

    %% Manager domain
    Manager "1" --> "*" PrebuiltTemplate : manages
    Manager "1" --> "*" GalleryPost : moderates
    PrebuiltTemplate "1" *-- "*" TemplateItem : contains
    Product "1" --> "*" TemplateItem : itemized_in

    %% Admin domain
    Admin "1" --> "*" Product : manages
    Admin "1" --> "*" CompatibilityRule : configures
    Admin "1" --> "*" SizeLimitRule : configures
    Admin "1" --> "*" Order : reviews_payment
    Admin "1" --> "*" User : manages_rbac

```
