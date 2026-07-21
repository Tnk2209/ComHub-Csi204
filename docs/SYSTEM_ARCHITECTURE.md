# 🏗️ ComHub System Architecture Document

## 1. System Overview
ComHub is an E-Commerce platform specialized in Computer Hardware, PC Parts, and Custom PC Assembly. The application is built using a modern decoupled architecture:

- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (7 relational tables)
- **Deployment:** Vercel Serverless / Static + Supabase PostgreSQL

---

## 2. Component Diagram

```mermaid
graph TD
    Client[Browser Frontend - React + Vite] -->|HTTPS / JSON REST API| API[Express API Server]
    API -->|Security Headers| Helmet[Helmet Middleware]
    API -->|Rate Limit| Limiter[Rate Limiter Middleware]
    API -->|JWT Validation| Auth[Auth / RBAC Middleware]
    API -->|SQL Queries| DB[(PostgreSQL Database)]

    subgraph Backend Services
        Auth
        ProductService[Product & Catalog Engine]
        OrderService[Order & Stock Engine]
        AdminService[Admin & Analytics Engine]
    end

    API --> ProductService
    API --> OrderService
    API --> AdminService
    OrderService -->|Atomic Transaction| DB
```

---

## 3. Database Entity Relationship (ER) Diagram

```mermaid
erDiagram
    users ||--o{ orders : "places"
    users ||--o{ reviews : "writes"
    users ||--o{ wishlist_items : "saves"
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "ordered in"
    products ||--o{ reviews : "reviewed in"
    products ||--o{ wishlist_items : "saved in"
    orders ||--o{ order_logs : "audited by"

    users {
        int id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role
        boolean is_active
        string auth_provider
        timestamp created_at
    }

    products {
        int id PK
        string name
        string category
        decimal price
        int stock_quantity
        string image_url
        jsonb specifications
        string brand
        boolean is_active
    }

    orders {
        int id PK
        int user_id FK
        decimal total_price
        string order_status
        text shipping_address
        text payment_slip_mockup
        string payment_status
        string tracking_number
        timestamp created_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price_per_unit
    }

    reviews {
        int id PK
        int user_id FK
        int product_id FK
        int rating
        text comment
        timestamp created_at
    }

    wishlist_items {
        int id PK
        int user_id FK
        int product_id FK
        boolean is_alert_enabled
        timestamp created_at
    }

    order_logs {
        int id PK
        int order_id FK
        string status
        int changed_by_user_id FK
        timestamp created_at
    }
```

---

## 4. Security Architecture

1. **Authentication:** Native JWT authentication (`HS256`, 7-day expiration). Passwords hashed using `bcrypt` (10 rounds). Minimum password length enforced at 8 characters.
2. **Access Control (RBAC):** Role-based authorization (`Customer` vs `Admin`). Admin endpoints protected via `requireRole('Admin')` middleware.
3. **HTTP Security:** `helmet` security headers enabled. Strict CORS policy configuring permitted origins.
4. **Brute Force Protection:** `express-rate-limit` restricting sensitive authentication routes (`/api/auth/login`, `/api/auth/register`) to 5 requests per 15 minutes.
5. **Data Protection:** Parameterized SQL queries preventing SQL injection vulnerabilities.

---

## 5. Performance Optimizations

1. **Gzip / Brotli Compression:** `compression` middleware compressing API responses.
2. **Database Indexing:** B-Tree and GIN indexes on query fields (`category`, `is_active`, `specifications` JSONB, full-text vector on `name`).
3. **Client-side Optimization:** Client-side WebP image compression reducing uploaded slip sizes to $<100\text{ KB}$ before transmission.
4. **Vite Bundle Optimization:** Manual chunking separating vendor modules (`react`, `lucide-react`) for optimal HTTP caching.
