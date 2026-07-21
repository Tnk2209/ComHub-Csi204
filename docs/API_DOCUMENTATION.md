# 📖 ComHub API Documentation

Welcome to the **ComHub REST API Documentation**. This document describes all available API endpoints, request signatures, authentication requirements, and JSON response schemas for the ComHub E-Commerce & Custom PC Builder platform.

---

## 🔐 Base URL & Headers

- **Base URL:** `http://localhost:3000` (Dev) / `https://api-comhub.vercel.app` (Prod)
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <JWT_TOKEN>`

### 🛡️ Security Headers & Rate Limits
- **Security Headers:** Enforced via `helmet` (CSP, HSTS, X-Content-Type-Options)
- **Compression:** Enabled via `gzip` / `brotli`
- **Auth Endpoint Rate Limit:** 5 requests / 15 mins per IP
- **General API Rate Limit:** 100 requests / 15 mins per IP

---

## 🔑 Authentication Endpoints (`/api/auth`)

### 1. Register Account
- **`POST /api/auth/register`**
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "Somchai",
    "last_name": "Jaidee"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "Somchai",
      "last_name": "Jaidee",
      "role": "Customer",
      "auth_provider": "native",
      "created_at": "2026-07-22T00:00:00.000Z"
    }
  }
  ```

### 2. Login Account
- **`POST /api/auth/login`**
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):** Standard token + user object payload.

### 3. Current User Profile
- **`GET /api/auth/me`**
- **Auth:** Required (Bearer Token)
- **Response (200 OK):** Current `PublicUser` profile.

---

## 📦 Products Endpoints (`/api/products`)

### 1. List Products
- **`GET /api/products?category=CPU&q=Ryzen&limit=20&offset=0`**
- **Auth:** Public
- **Response (200 OK):**
  ```json
  {
    "products": [
      {
        "id": 1,
        "name": "AMD Ryzen 7 7800X3D",
        "category": "CPU",
        "price": 14900.00,
        "stock_quantity": 10,
        "image_url": "https://...",
        "specifications": {
          "socket": "AM5",
          "tdp": 120
        },
        "brand": "AMD",
        "is_active": true
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
  ```

### 2. Get Product Detail
- **`GET /api/products/:id`**
- **Auth:** Public
- **Response (200 OK):** Single product object including JSONB specifications and average rating calculation.

### 3. Create Product (Admin Only)
- **`POST /api/products`**
- **Auth:** Required (`Admin` Role)
- **Request Body:** Product object schema.

---

## 🛒 Orders Endpoints (`/api/orders`)

### 1. Create Order
- **`POST /api/orders`**
- **Auth:** Required (`Customer` Role)
- **Request Body:**
  ```json
  {
    "items": [
      { "product_id": 1, "quantity": 2 }
    ],
    "shipping_address": "123 Rama IX Rd, Bangkok 10310"
  }
  ```
- **Response (201 Created):** Created order object with total price calculation and initialized `order_logs`.

### 2. Upload Payment Slip
- **`PATCH /api/orders/:id/payment`**
- **Auth:** Required (Order Owner)
- **Request Body:** `{ "slip_url": "data:image/webp;base64,..." }`

---

## 👑 Admin Endpoints (`/api/admin`)

- **`GET /api/admin/dashboard`** — Aggregated metric cards (total revenue, status counts, top products, low stock alerts).
- **`GET /api/admin/orders`** — Filter and list all system orders.
- **`PATCH /api/admin/orders/:id/approve-payment`** — Approve payment slip & advance order status.
- **`PATCH /api/admin/orders/:id/reject-payment`** — Reject payment slip & perform atomic stock rollback.
- **`GET /api/admin/users`** — List & search user accounts.
- **`PATCH /api/admin/users/:id/role`** — Change user role (`Customer` $\leftrightarrow$ `Admin`).

---

## ⭐ Reviews & ❤️ Wishlist Endpoints

- **`POST /api/products/:id/reviews`** — Submit rating (1-5 stars) and comment.
- **`GET /api/wishlist`** — Retrieve user wishlist.
- **`POST /api/wishlist`** — Add product to wishlist.
- **`PATCH /api/wishlist/:product_id/alert`** — Toggle stock alert notification.
