-- ============================================================
-- ComHub MVP Database Schema (7 tables)
-- Source: markdown/database-schema.md v1.1
-- Idempotent: safe to re-run (drops then creates)
-- ============================================================

DROP TABLE IF EXISTS order_logs CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),                       -- NULL for Google OAuth users
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Customer'
        CHECK (role IN ('Customer', 'Admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    auth_provider VARCHAR(20) NOT NULL DEFAULT 'native'
        CHECK (auth_provider IN ('native', 'google')),
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role ON users(role);

-- ------------------------------------------------------------
-- 2. products
-- ------------------------------------------------------------
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('CPU', 'Mainboard', 'GPU', 'RAM', 'SSD', 'Case', 'PSU')),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url VARCHAR(500),
    specifications JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_specs ON products USING GIN (specifications);
CREATE INDEX idx_products_name ON products USING GIN (to_tsvector('simple', name));

-- ------------------------------------------------------------
-- 3. orders
-- ------------------------------------------------------------
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending_payment'
        CHECK (order_status IN (
            'pending_payment',
            'paid',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        )),
    shipping_address TEXT NOT NULL,
    payment_slip_mockup TEXT,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'approved', 'rejected')),
    tracking_number VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_status_date ON orders(order_status, created_at DESC);

-- ------------------------------------------------------------
-- 4. order_items
-- ------------------------------------------------------------
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_per_unit DECIMAL(10, 2) NOT NULL CHECK (price_per_unit >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ------------------------------------------------------------
-- 5. reviews
-- ------------------------------------------------------------
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- ------------------------------------------------------------
-- 6. wishlist_items
-- ------------------------------------------------------------
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    is_alert_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_product ON wishlist_items(product_id);
CREATE INDEX idx_wishlist_created ON wishlist_items(created_at DESC);

-- ------------------------------------------------------------
-- 7. order_logs (Audit Trail)
-- ------------------------------------------------------------
CREATE TABLE order_logs (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    changed_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_logs_order ON order_logs(order_id);
CREATE INDEX idx_order_logs_created ON order_logs(created_at DESC);
