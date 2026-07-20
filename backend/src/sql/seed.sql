-- ============================================================
-- ComHub MVP Seed Data — Products (7 categories × 5 = 35+ items)
-- Idempotent when combined with schema.sql (schema drops tables first)
-- ============================================================

-- Note: admin user is inserted by scripts/migrate.ts (needs bcrypt hash)

-- ------------------------------------------------------------
-- CPU (5 items) — socket, tdp, supported_ram, cores
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('Intel Core i5-14600K',        'CPU', 12500.00, 25, '/images/products/cpu-i5-14600k.webp',
  '{"socket":"LGA1700","tdp":125,"supported_ram":["DDR4","DDR5"],"cores":14,"threads":20,"boost_clock_ghz":5.3}'),
('Intel Core i7-14700K',        'CPU', 15900.00, 20, '/images/products/cpu-i7-14700k.webp',
  '{"socket":"LGA1700","tdp":125,"supported_ram":["DDR4","DDR5"],"cores":20,"threads":28,"boost_clock_ghz":5.6}'),
('Intel Core i9-14900K',        'CPU', 22900.00, 12, '/images/products/cpu-i9-14900k.webp',
  '{"socket":"LGA1700","tdp":125,"supported_ram":["DDR4","DDR5"],"cores":24,"threads":32,"boost_clock_ghz":6.0}'),
('AMD Ryzen 5 7600X',           'CPU',  9900.00, 30, '/images/products/cpu-r5-7600x.webp',
  '{"socket":"AM5","tdp":105,"supported_ram":["DDR5"],"cores":6,"threads":12,"boost_clock_ghz":5.3}'),
('AMD Ryzen 7 7800X3D',         'CPU', 16500.00, 15, '/images/products/cpu-r7-7800x3d.webp',
  '{"socket":"AM5","tdp":120,"supported_ram":["DDR5"],"cores":8,"threads":16,"boost_clock_ghz":5.0}');

-- ------------------------------------------------------------
-- Mainboard (5 items) — socket, ram_type, form_factor
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('ASUS ROG STRIX Z790-E',       'Mainboard', 14500.00, 12, '/images/products/mb-z790e.webp',
  '{"socket":"LGA1700","ram_type":"DDR5","supported_ram":"DDR5","form_factor":"ATX","tdp":25,"max_ram_gb":128}'),
('MSI PRO Z790-A WIFI',         'Mainboard',  9900.00, 18, '/images/products/mb-z790a.webp',
  '{"socket":"LGA1700","ram_type":"DDR5","supported_ram":"DDR5","form_factor":"ATX","tdp":20,"max_ram_gb":128}'),
('GIGABYTE B760M DS3H DDR4',    'Mainboard',  4290.00, 25, '/images/products/mb-b760m.webp',
  '{"socket":"LGA1700","ram_type":"DDR4","supported_ram":"DDR4","form_factor":"mATX","tdp":15,"max_ram_gb":64}'),
('ASUS ROG STRIX X670E-F',      'Mainboard', 16900.00, 10, '/images/products/mb-x670e.webp',
  '{"socket":"AM5","ram_type":"DDR5","supported_ram":"DDR5","form_factor":"ATX","tdp":25,"max_ram_gb":128}'),
('MSI MPG B650 EDGE WIFI',      'Mainboard',  9500.00, 15, '/images/products/mb-b650.webp',
  '{"socket":"AM5","ram_type":"DDR5","supported_ram":"DDR5","form_factor":"ATX","tdp":20,"max_ram_gb":128}');

-- ------------------------------------------------------------
-- GPU (5 items) — tdp, gpu_length_mm
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('NVIDIA RTX 4060 Ti 8GB',      'GPU', 14900.00, 20, '/images/products/gpu-4060ti.webp',
  '{"tdp":160,"gpu_length_mm":244,"vram_gb":8,"chipset":"NVIDIA"}'),
('NVIDIA RTX 4070 SUPER',       'GPU', 25900.00, 15, '/images/products/gpu-4070s.webp',
  '{"tdp":220,"gpu_length_mm":304,"vram_gb":12,"chipset":"NVIDIA"}'),
('NVIDIA RTX 4080 SUPER',       'GPU', 39900.00, 8,  '/images/products/gpu-4080s.webp',
  '{"tdp":320,"gpu_length_mm":336,"vram_gb":16,"chipset":"NVIDIA"}'),
('AMD Radeon RX 7600 XT',       'GPU', 12900.00, 18, '/images/products/gpu-7600xt.webp',
  '{"tdp":190,"gpu_length_mm":268,"vram_gb":16,"chipset":"AMD"}'),
('AMD Radeon RX 7800 XT',       'GPU', 20900.00, 12, '/images/products/gpu-7800xt.webp',
  '{"tdp":263,"gpu_length_mm":287,"vram_gb":16,"chipset":"AMD"}');

-- ------------------------------------------------------------
-- RAM (5 items) — ram_type, capacity_gb, tdp
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('Kingston Fury Beast DDR4 16GB (2x8) 3200MHz',   'RAM', 1590.00, 40, '/images/products/ram-ddr4-16.webp',
  '{"ram_type":"DDR4","capacity_gb":16,"speed_mhz":3200,"tdp":5,"modules":2}'),
('Corsair Vengeance LPX DDR4 32GB (2x16) 3600MHz','RAM', 2890.00, 30, '/images/products/ram-ddr4-32.webp',
  '{"ram_type":"DDR4","capacity_gb":32,"speed_mhz":3600,"tdp":6,"modules":2}'),
('G.SKILL Trident Z5 DDR5 32GB (2x16) 6000MHz',   'RAM', 4990.00, 25, '/images/products/ram-ddr5-32.webp',
  '{"ram_type":"DDR5","capacity_gb":32,"speed_mhz":6000,"tdp":8,"modules":2}'),
('Corsair Dominator Titanium DDR5 64GB (2x32)',   'RAM', 9900.00, 12, '/images/products/ram-ddr5-64.webp',
  '{"ram_type":"DDR5","capacity_gb":64,"speed_mhz":6400,"tdp":10,"modules":2}'),
('Kingston Fury Renegade DDR5 32GB (2x16) 7200MHz','RAM', 5490.00, 18, '/images/products/ram-ddr5-32r.webp',
  '{"ram_type":"DDR5","capacity_gb":32,"speed_mhz":7200,"tdp":9,"modules":2}');

-- ------------------------------------------------------------
-- SSD (5 items) — interface, capacity_gb, tdp
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('Kingston NV2 500GB NVMe PCIe 4.0',   'SSD',  1290.00, 50, '/images/products/ssd-nv2-500.webp',
  '{"interface":"PCIe 4.0","capacity_gb":500,"tdp":5,"read_mb_s":3500,"write_mb_s":2100}'),
('WD Blue SN580 1TB NVMe PCIe 4.0',    'SSD',  2490.00, 40, '/images/products/ssd-sn580-1t.webp',
  '{"interface":"PCIe 4.0","capacity_gb":1000,"tdp":6,"read_mb_s":4150,"write_mb_s":4150}'),
('Samsung 990 Pro 1TB NVMe PCIe 4.0',  'SSD',  4290.00, 35, '/images/products/ssd-990pro-1t.webp',
  '{"interface":"PCIe 4.0","capacity_gb":1000,"tdp":7,"read_mb_s":7450,"write_mb_s":6900}'),
('Crucial T705 2TB NVMe PCIe 5.0',     'SSD',  9990.00, 15, '/images/products/ssd-t705-2t.webp',
  '{"interface":"PCIe 5.0","capacity_gb":2000,"tdp":12,"read_mb_s":14500,"write_mb_s":12700}'),
('Samsung 870 EVO 1TB SATA',           'SSD',  2790.00, 30, '/images/products/ssd-870evo-1t.webp',
  '{"interface":"SATA","capacity_gb":1000,"tdp":3,"read_mb_s":560,"write_mb_s":530}');

-- ------------------------------------------------------------
-- Case (5 items) — max_gpu_length_mm, supported form_factor list
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('NZXT H5 Flow',                'Case', 3290.00, 20, '/images/products/case-h5flow.webp',
  '{"max_gpu_length_mm":365,"form_factor":["ATX","mATX","ITX"],"color":"black"}'),
('Fractal Design North',        'Case', 6890.00, 10, '/images/products/case-north.webp',
  '{"max_gpu_length_mm":355,"form_factor":["ATX","mATX","ITX"],"color":"walnut"}'),
('Corsair 4000D Airflow',       'Case', 3890.00, 25, '/images/products/case-4000d.webp',
  '{"max_gpu_length_mm":360,"form_factor":["ATX","mATX","ITX","E-ATX"],"color":"black"}'),
('Lian Li O11 Dynamic EVO',     'Case', 6490.00, 15, '/images/products/case-o11evo.webp',
  '{"max_gpu_length_mm":426,"form_factor":["ATX","mATX","ITX","E-ATX"],"color":"white"}'),
('Cooler Master NR200P',        'Case', 3490.00, 18, '/images/products/case-nr200p.webp',
  '{"max_gpu_length_mm":330,"form_factor":["ITX"],"color":"black"}');

-- ------------------------------------------------------------
-- PSU (5 items) — wattage, efficiency
-- ------------------------------------------------------------
INSERT INTO products (name, category, price, stock_quantity, image_url, specifications) VALUES
('Corsair CV650 650W 80+ Bronze',   'PSU', 1890.00, 30, '/images/products/psu-cv650.webp',
  '{"wattage":650,"efficiency":"80+ Bronze","modular":"non-modular"}'),
('Corsair RM750x 750W 80+ Gold',    'PSU', 3890.00, 25, '/images/products/psu-rm750x.webp',
  '{"wattage":750,"efficiency":"80+ Gold","modular":"fully-modular"}'),
('Corsair RM850x 850W 80+ Gold',    'PSU', 4890.00, 18, '/images/products/psu-rm850x.webp',
  '{"wattage":850,"efficiency":"80+ Gold","modular":"fully-modular"}'),
('Seasonic Focus GX-1000 1000W',    'PSU', 6490.00, 12, '/images/products/psu-gx1000.webp',
  '{"wattage":1000,"efficiency":"80+ Gold","modular":"fully-modular"}'),
('be quiet! Dark Power 13 1000W',   'PSU', 8990.00, 8,  '/images/products/psu-dp13.webp',
  '{"wattage":1000,"efficiency":"80+ Titanium","modular":"fully-modular"}');
