/**
 * seed-from-opendb.mjs
 * 
 * Seed ComHub product data with curated specs from BuildCores OpenDB + manufacturer sources.
 * Downloads product images → converts to WebP → generates seed.sql
 * 
 * Usage: node src/scripts/seed-from-opendb.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '../../../FrontEnd/public/images/products');
const SEED_SQL_PATH = path.resolve(__dirname, '../sql/seed.sql');

// ============================================================
// Fallback Unsplash categories mapping
// ============================================================

function getUnsplashCategoryUrls(category) {
  const urls = {
    'CPU': [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60'
    ],
    'Mainboard': [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&auto=format&fit=crop&q=60'
    ],
    'GPU': [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=60'
    ],
    'RAM': [
      'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555617766-c94804975db3?w=600&auto=format&fit=crop&q=60'
    ],
    'SSD': [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=60'
    ],
    'Case': [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=60'
    ],
    'PSU': [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60'
    ]
  };
  return urls[category] || [
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=60'
  ];
}

// ============================================================
// Product Data — 120 products in total (7 categories × 15-30 items)
// ============================================================

const PRODUCTS = [
  // ── CPU (15 items) ──────────────────────────────────────────
  {
    name: 'Intel Core i5-14600K',
    category: 'CPU',
    price: 12500.00,
    stock: 25,
    slug: 'cpu-i5-14600k',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 14, threads: 20, base_clock_ghz: 3.5, boost_clock_ghz: 5.3, cache: '24MB' },
    imageUrls: ['https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/i5-702x702.png.rendition.intel.web.480.480.png']
  },
  {
    name: 'Intel Core i7-14700K',
    category: 'CPU',
    price: 15900.00,
    stock: 20,
    slug: 'cpu-i7-14700k',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 20, threads: 28, base_clock_ghz: 3.4, boost_clock_ghz: 5.6, cache: '33MB' },
    imageUrls: ['https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/i7-702x702.png.rendition.intel.web.480.480.png']
  },
  {
    name: 'Intel Core i9-14900K',
    category: 'CPU',
    price: 22900.00,
    stock: 12,
    slug: 'cpu-i9-14900k',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 24, threads: 32, base_clock_ghz: 3.2, boost_clock_ghz: 6.0, cache: '36MB' },
    imageUrls: ['https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/i9-702x702.png.rendition.intel.web.480.480.png']
  },
  {
    name: 'AMD Ryzen 5 7600X',
    category: 'CPU',
    price: 9900.00,
    stock: 30,
    slug: 'cpu-r5-7600x',
    brand: 'AMD',
    specs: { socket: 'AM5', tdp: 105, supported_ram: ['DDR5'], cores: 6, threads: 12, base_clock_ghz: 4.7, boost_clock_ghz: 5.3, cache: '38MB' },
    imageUrls: ['https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-5-702x702.png']
  },
  {
    name: 'AMD Ryzen 7 7800X3D',
    category: 'CPU',
    price: 16500.00,
    stock: 15,
    slug: 'cpu-r7-7800x3d',
    brand: 'AMD',
    specs: { socket: 'AM5', tdp: 120, supported_ram: ['DDR5'], cores: 8, threads: 16, base_clock_ghz: 4.2, boost_clock_ghz: 5.0, cache: '104MB' },
    imageUrls: ['https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-702x702.png']
  },
  {
    name: 'Intel Core i3-14100',
    category: 'CPU',
    price: 4690.00,
    stock: 40,
    slug: 'cpu-intel-i3-14100',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 60, supported_ram: ['DDR4', 'DDR5'], cores: 4, threads: 8, base_clock_ghz: 3.5, boost_clock_ghz: 4.7, cache: '12MB' },
    imageUrls: []
  },
  {
    name: 'Intel Core i5-12400F',
    category: 'CPU',
    price: 4590.00,
    stock: 50,
    slug: 'cpu-intel-i5-12400f',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 65, supported_ram: ['DDR4', 'DDR5'], cores: 6, threads: 12, base_clock_ghz: 2.5, boost_clock_ghz: 4.4, cache: '18MB' },
    imageUrls: []
  },
  {
    name: 'Intel Core i5-13400F',
    category: 'CPU',
    price: 7290.00,
    stock: 35,
    slug: 'cpu-intel-i5-13400f',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 65, supported_ram: ['DDR4', 'DDR5'], cores: 10, threads: 16, base_clock_ghz: 2.5, boost_clock_ghz: 4.6, cache: '20MB' },
    imageUrls: []
  },
  {
    name: 'Intel Core i7-13700K',
    category: 'CPU',
    price: 13900.00,
    stock: 18,
    slug: 'cpu-intel-i7-13700k',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 16, threads: 24, base_clock_ghz: 3.4, boost_clock_ghz: 5.4, cache: '30MB' },
    imageUrls: []
  },
  {
    name: 'Intel Core i9-13900K',
    category: 'CPU',
    price: 19900.00,
    stock: 10,
    slug: 'cpu-intel-i9-13900k',
    brand: 'Intel',
    specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 24, threads: 32, base_clock_ghz: 3.0, boost_clock_ghz: 5.8, cache: '36MB' },
    imageUrls: []
  },
  {
    name: 'AMD Ryzen 5 5600X',
    category: 'CPU',
    price: 5190.00,
    stock: 45,
    slug: 'cpu-amd-r5-5600x',
    brand: 'AMD',
    specs: { socket: 'AM4', tdp: 65, supported_ram: ['DDR4'], cores: 6, threads: 12, base_clock_ghz: 3.7, boost_clock_ghz: 4.6, cache: '35MB' },
    imageUrls: []
  },
  {
    name: 'AMD Ryzen 7 5700X',
    category: 'CPU',
    price: 6890.00,
    stock: 30,
    slug: 'cpu-amd-r7-5700x',
    brand: 'AMD',
    specs: { socket: 'AM4', tdp: 65, supported_ram: ['DDR4'], cores: 8, threads: 16, base_clock_ghz: 3.4, boost_clock_ghz: 4.6, cache: '36MB' },
    imageUrls: []
  },
  {
    name: 'AMD Ryzen 7 7700X',
    category: 'CPU',
    price: 11900.00,
    stock: 25,
    slug: 'cpu-amd-r7-7700x',
    brand: 'AMD',
    specs: { socket: 'AM5', tdp: 105, supported_ram: ['DDR5'], cores: 8, threads: 16, base_clock_ghz: 4.5, boost_clock_ghz: 5.4, cache: '40MB' },
    imageUrls: []
  },
  {
    name: 'AMD Ryzen 9 7900X',
    category: 'CPU',
    price: 14900.00,
    stock: 15,
    slug: 'cpu-amd-r9-7900x',
    brand: 'AMD',
    specs: { socket: 'AM5', tdp: 170, supported_ram: ['DDR5'], cores: 12, threads: 24, base_clock_ghz: 4.7, boost_clock_ghz: 5.6, cache: '76MB' },
    imageUrls: []
  },
  {
    name: 'AMD Ryzen 9 7950X',
    category: 'CPU',
    price: 18900.00,
    stock: 12,
    slug: 'cpu-amd-r9-7950x',
    brand: 'AMD',
    specs: { socket: 'AM5', tdp: 170, supported_ram: ['DDR5'], cores: 16, threads: 32, base_clock_ghz: 4.5, boost_clock_ghz: 5.7, cache: '80MB' },
    imageUrls: []
  },

  // ── Mainboard (15 items) ────────────────────────────────────
  {
    name: 'ASUS ROG STRIX Z790-E GAMING',
    category: 'Mainboard',
    price: 14500.00,
    stock: 12,
    slug: 'mb-z790e',
    brand: 'ASUS',
    specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 25, max_ram_gb: 128 },
    imageUrls: ['https://dlcdnwebimgs.asus.com/gain/B2A4C22C-6A81-4C12-A657-37AE0C2D31C9/w717/h525']
  },
  {
    name: 'MSI PRO Z790-A WIFI',
    category: 'Mainboard',
    price: 9900.00,
    stock: 18,
    slug: 'mb-z790a',
    brand: 'MSI',
    specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 20, max_ram_gb: 128 },
    imageUrls: ['https://asset.msi.com/resize/image/global/product/product_1669712987ec7f7ed7fdb0e30c03bd7f37fa77c85b.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png']
  },
  {
    name: 'GIGABYTE B760M DS3H DDR4',
    category: 'Mainboard',
    price: 4290.00,
    stock: 25,
    slug: 'mb-b760m',
    brand: 'GIGABYTE',
    specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 15, max_ram_gb: 64 },
    imageUrls: ['https://www.gigabyte.com/FileUpload/Global/KeyFeature/2049/innergigabyteimages/B760M-DS3H-DDR4-front.png']
  },
  {
    name: 'ASUS ROG STRIX X670E-F GAMING',
    category: 'Mainboard',
    price: 16900.00,
    stock: 10,
    slug: 'mb-x670e',
    brand: 'ASUS',
    specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 25, max_ram_gb: 128 },
    imageUrls: ['https://dlcdnwebimgs.asus.com/gain/49B92453-2735-4E7B-A480-14F914CDCE59/w717/h525']
  },
  {
    name: 'MSI MAG B650 TOMAHAWK WIFI',
    category: 'Mainboard',
    price: 8290.00,
    stock: 15,
    slug: 'mb-b650',
    brand: 'MSI',
    specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 20, max_ram_gb: 128 },
    imageUrls: ['https://asset.msi.com/resize/image/global/product/product_1663140590a9807ad931ca8a25c0e1db4e1d77aa5a.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png']
  },
  {
    name: 'ASUS PRIME H610M-K DDR4',
    category: 'Mainboard',
    price: 2390.00,
    stock: 40,
    slug: 'mb-asus-prime-h610m',
    brand: 'ASUS',
    specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 10, max_ram_gb: 64 },
    imageUrls: []
  },
  {
    name: 'GIGABYTE H610M S2H V2 DDR4',
    category: 'Mainboard',
    price: 2490.00,
    stock: 35,
    slug: 'mb-gigabyte-h610m',
    brand: 'GIGABYTE',
    specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 10, max_ram_gb: 64 },
    imageUrls: []
  },
  {
    name: 'MSI PRO B760M-P DDR4',
    category: 'Mainboard',
    price: 3490.00,
    stock: 28,
    slug: 'mb-msi-pro-b760m',
    brand: 'MSI',
    specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 12, max_ram_gb: 128 },
    imageUrls: []
  },
  {
    name: 'ASUS TUF GAMING B760M-PLUS WIFI',
    category: 'Mainboard',
    price: 6290.00,
    stock: 22,
    slug: 'mb-asus-tuf-b760m',
    brand: 'ASUS',
    specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'mATX', tdp: 15, max_ram_gb: 192 },
    imageUrls: []
  },
  {
    name: 'GIGABYTE Z790 AORUS ELITE AX',
    category: 'Mainboard',
    price: 9290.00,
    stock: 14,
    slug: 'mb-gigabyte-z790-aorus',
    brand: 'GIGABYTE',
    specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 20, max_ram_gb: 192 },
    imageUrls: []
  },
  {
    name: 'MSI MAG B550 TOMAHAWK',
    category: 'Mainboard',
    price: 5490.00,
    stock: 19,
    slug: 'mb-msi-mag-b550',
    brand: 'MSI',
    specs: { socket: 'AM4', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'ATX', tdp: 15, max_ram_gb: 128 },
    imageUrls: []
  },
  {
    name: 'ASUS PRIME B550M-K',
    category: 'Mainboard',
    price: 3190.00,
    stock: 25,
    slug: 'mb-asus-prime-b550m',
    brand: 'ASUS',
    specs: { socket: 'AM4', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 10, max_ram_gb: 128 },
    imageUrls: []
  },
  {
    name: 'GIGABYTE B650 GAMING X AX',
    category: 'Mainboard',
    price: 6890.00,
    stock: 18,
    slug: 'mb-gigabyte-b650-gaming',
    brand: 'GIGABYTE',
    specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 18, max_ram_gb: 192 },
    imageUrls: []
  },
  {
    name: 'ASUS TUF GAMING B650-PLUS WIFI',
    category: 'Mainboard',
    price: 7490.00,
    stock: 15,
    slug: 'mb-asus-tuf-b650',
    brand: 'ASUS',
    specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 18, max_ram_gb: 192 },
    imageUrls: []
  },
  {
    name: 'GIGABYTE X670 AORUS ELITE AX',
    category: 'Mainboard',
    price: 11900.00,
    stock: 8,
    slug: 'mb-gigabyte-x670-aorus',
    brand: 'GIGABYTE',
    specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 25, max_ram_gb: 192 },
    imageUrls: []
  },

  // ── GPU (30 items) ─────────────────────────────────────────
  { name: 'ASUS ROG Strix GeForce RTX 4090 OC', category: 'GPU', price: 78900.00, stock: 5, slug: 'gpu-asus-rtx4090-strix', brand: 'ASUS', specs: { tdp: 450, gpu_length_mm: 357, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 }, imageUrl: [] },
  { name: 'MSI GeForce RTX 4090 SUPRIM X', category: 'GPU', price: 76500.00, stock: 4, slug: 'gpu-msi-rtx4090-suprim', brand: 'MSI', specs: { tdp: 450, gpu_length_mm: 336, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 }, imageUrls: ['https://asset.msi.com/resize/image/global/product/product_1663140590a9807ad931ca8a25c0e1db4e1d77aa5a.png'] },
  { name: 'GIGABYTE GeForce RTX 4090 AORUS Master', category: 'GPU', price: 75900.00, stock: 3, slug: 'gpu-gigabyte-rtx4090-aorus', brand: 'GIGABYTE', specs: { tdp: 450, gpu_length_mm: 358, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.62 }, imageUrls: [] },
  { name: 'ZOTAC GAMING GeForce RTX 4090 Trinity', category: 'GPU', price: 69900.00, stock: 6, slug: 'gpu-zotac-rtx4090-trinity', brand: 'ZOTAC', specs: { tdp: 450, gpu_length_mm: 356, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.52 }, imageUrls: [] },
  { name: 'ASUS TUF Gaming GeForce RTX 4080 SUPER', category: 'GPU', price: 44900.00, stock: 8, slug: 'gpu-asus-rtx4080s-tuf', brand: 'ASUS', specs: { tdp: 320, gpu_length_mm: 348, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 }, imageUrls: [] },
  { name: 'MSI GeForce RTX 4080 SUPER GAMING X SLIM', category: 'GPU', price: 43500.00, stock: 7, slug: 'gpu-msi-rtx4080s-gaming', brand: 'MSI', specs: { tdp: 320, gpu_length_mm: 322, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.61 }, imageUrls: [] },
  { name: 'GIGABYTE GeForce RTX 4080 SUPER EAGLE OC', category: 'GPU', price: 42500.00, stock: 5, slug: 'gpu-gigabyte-rtx4080s-eagle', brand: 'GIGABYTE', specs: { tdp: 320, gpu_length_mm: 342, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.61 }, imageUrls: [] },
  { name: 'ZOTAC GAMING GeForce RTX 4080 SUPER Trinity', category: 'GPU', price: 39900.00, stock: 9, slug: 'gpu-zotac-rtx4080s-trinity', brand: 'ZOTAC', specs: { tdp: 320, gpu_length_mm: 306, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.55 }, imageUrls: [] },
  { name: 'ASUS ROG Strix GeForce RTX 4070 Ti SUPER', category: 'GPU', price: 36900.00, stock: 10, slug: 'gpu-asus-rtx4070tis-strix', brand: 'ASUS', specs: { tdp: 285, gpu_length_mm: 336, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.67 }, imageUrls: [] },
  { name: 'MSI GeForce RTX 4070 Ti SUPER VENTUS 3X', category: 'GPU', price: 34500.00, stock: 12, slug: 'gpu-msi-rtx4070tis-ventus', brand: 'MSI', specs: { tdp: 285, gpu_length_mm: 308, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 }, imageUrls: [] },
  { name: 'GIGABYTE GeForce RTX 4070 Ti SUPER WF3', category: 'GPU', price: 33900.00, stock: 8, slug: 'gpu-gigabyte-rtx4070tis-wf', brand: 'GIGABYTE', specs: { tdp: 285, gpu_length_mm: 300, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.61 }, imageUrls: [] },
  { name: 'GALAX GeForce RTX 4070 Ti SUPER EX', category: 'GPU', price: 31900.00, stock: 15, slug: 'gpu-galax-rtx4070tis-ex', brand: 'GALAX', specs: { tdp: 285, gpu_length_mm: 323, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.65 }, imageUrls: [] },
  { name: 'ASUS Dual GeForce RTX 4070 SUPER OC', category: 'GPU', price: 26900.00, stock: 14, slug: 'gpu-asus-rtx4070s-dual', brand: 'ASUS', specs: { tdp: 220, gpu_length_mm: 267, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.55 }, imageUrls: [] },
  { name: 'MSI GeForce RTX 4070 SUPER VENTUS 2X', category: 'GPU', price: 25500.00, stock: 11, slug: 'gpu-msi-rtx4070s-ventus', brand: 'MSI', specs: { tdp: 220, gpu_length_mm: 242, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.52 }, imageUrls: [] },
  { name: 'GIGABYTE GeForce RTX 4070 SUPER AERO OC', category: 'GPU', price: 27900.00, stock: 6, slug: 'gpu-gigabyte-rtx4070s-aero', brand: 'GIGABYTE', specs: { tdp: 220, gpu_length_mm: 300, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.565 }, imageUrls: [] },
  { name: 'ZOTAC GAMING GeForce RTX 4070 SUPER Twin', category: 'GPU', price: 23900.00, stock: 18, slug: 'gpu-zotac-rtx4070s-twin', brand: 'ZOTAC', specs: { tdp: 220, gpu_length_mm: 234, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.475 }, imageUrls: [] },
  { name: 'ASUS TUF Gaming GeForce RTX 4060 Ti', category: 'GPU', price: 16500.00, stock: 22, slug: 'gpu-asus-rtx4060ti-tuf', brand: 'ASUS', specs: { tdp: 160, gpu_length_mm: 300, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.655 }, imageUrls: [] },
  { name: 'MSI GeForce RTX 4060 Ti VENTUS 3X OC', category: 'GPU', price: 15900.00, stock: 20, slug: 'gpu-msi-rtx4060ti-ventus', brand: 'MSI', specs: { tdp: 160, gpu_length_mm: 308, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.64 }, imageUrls: [] },
  { name: 'GIGABYTE GeForce RTX 4060 Ti EAGLE OC', category: 'GPU', price: 15500.00, stock: 19, slug: 'gpu-gigabyte-rtx4060ti-eagle', brand: 'GIGABYTE', specs: { tdp: 160, gpu_length_mm: 272, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.61 }, imageUrls: [] },
  { name: 'ZOTAC GAMING GeForce RTX 4060 Ti Twin', category: 'GPU', price: 14500.00, stock: 24, slug: 'gpu-zotac-rtx4060ti-twin', brand: 'ZOTAC', specs: { tdp: 160, gpu_length_mm: 225, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.54 }, imageUrls: [] },
  { name: 'ASUS Dual GeForce RTX 4060 OC', category: 'GPU', price: 11900.00, stock: 30, slug: 'gpu-asus-rtx4060-dual', brand: 'ASUS', specs: { tdp: 115, gpu_length_mm: 227, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.535 }, imageUrls: [] },
  { name: 'MSI GeForce RTX 4060 VENTUS 2X BLACK', category: 'GPU', price: 11500.00, stock: 28, slug: 'gpu-msi-rtx4060-ventus', brand: 'MSI', specs: { tdp: 115, gpu_length_mm: 199, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.505 }, imageUrls: [] },
  { name: 'GIGABYTE GeForce RTX 4060 WINDFORCE OC', category: 'GPU', price: 10900.00, stock: 25, slug: 'gpu-gigabyte-rtx4060-wf', brand: 'GIGABYTE', specs: { tdp: 115, gpu_length_mm: 192, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.475 }, imageUrls: [] },
  { name: 'ZOTAC GAMING GeForce RTX 4060 Solo', category: 'GPU', price: 9900.00, stock: 35, slug: 'gpu-zotac-rtx4060-solo', brand: 'ZOTAC', specs: { tdp: 115, gpu_length_mm: 163, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.46 }, imageUrls: [] },
  { name: 'Sapphire NITRO+ Radeon RX 7900 XTX', category: 'GPU', price: 39900.00, stock: 8, slug: 'gpu-sapphire-rx7900xtx-nitro', brand: 'Sapphire', specs: { tdp: 355, gpu_length_mm: 320, memory_size: '24GB', memory_type: 'GDDR6', boost_clock_ghz: 2.68 }, imageUrls: [] },
  { name: 'PowerColor Red Devil Radeon RX 7900 XTX', category: 'GPU', price: 38900.00, stock: 7, slug: 'gpu-powercolor-rx7900xtx-devil', brand: 'PowerColor', specs: { tdp: 355, gpu_length_mm: 338, memory_size: '24GB', memory_type: 'GDDR6', boost_clock_ghz: 2.565 }, imageUrls: [] },
  { name: 'Sapphire PULSE Radeon RX 7900 XT', category: 'GPU', price: 29900.00, stock: 12, slug: 'gpu-sapphire-rx7900xt-pulse', brand: 'Sapphire', specs: { tdp: 315, gpu_length_mm: 313, memory_size: '20GB', memory_type: 'GDDR6', boost_clock_ghz: 2.45 }, imageUrls: [] },
  { name: 'PowerColor Hellhound Radeon RX 7800 XT', category: 'GPU', price: 19900.00, stock: 15, slug: 'gpu-powercolor-rx7800xt-hound', brand: 'PowerColor', specs: { tdp: 263, gpu_length_mm: 322, memory_size: '16GB', memory_type: 'GDDR6', boost_clock_ghz: 2.525 }, imageUrls: [] },
  { name: 'Sapphire PULSE Radeon RX 7700 XT', category: 'GPU', price: 16900.00, stock: 18, slug: 'gpu-sapphire-rx7700xt-pulse', brand: 'Sapphire', specs: { tdp: 245, gpu_length_mm: 280, memory_size: '12GB', memory_type: 'GDDR6', boost_clock_ghz: 2.544 }, imageUrls: [] },
  { name: 'Sapphire PULSE Radeon RX 7600 XT', category: 'GPU', price: 12900.00, stock: 20, slug: 'gpu-sapphire-rx7600xt-pulse', brand: 'Sapphire', specs: { tdp: 190, gpu_length_mm: 250, memory_size: '16GB', memory_type: 'GDDR6', boost_clock_ghz: 2.755 }, imageUrls: [] },

  // ── RAM (15 items) ──────────────────────────────────────────
  {
    name: 'Kingston Fury Beast DDR4 16GB (2x8) 3200MHz',
    category: 'RAM',
    price: 1590.00,
    stock: 40,
    slug: 'ram-ddr4-16',
    brand: 'Kingston',
    specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3200, tdp: 5, modules: 2 },
    imageUrls: ['https://m.media-amazon.com/images/I/61t7q2w95NL._AC_SL1200_.jpg']
  },
  {
    name: 'Corsair Vengeance LPX DDR4 32GB (2x16) 3600MHz',
    category: 'RAM',
    price: 2890.00,
    stock: 30,
    slug: 'ram-ddr4-32',
    brand: 'Corsair',
    specs: { ram_type: 'DDR4', capacity_gb: 32, speed_mhz: 3600, tdp: 6, modules: 2 },
    imageUrls: ['https://m.media-amazon.com/images/I/515t8q-dD+L._AC_SL1000_.jpg']
  },
  {
    name: 'G.SKILL Trident Z5 DDR5 32GB (2x16) 6000MHz',
    category: 'RAM',
    price: 4990.00,
    stock: 25,
    slug: 'ram-ddr5-32',
    brand: 'G.SKILL',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 },
    imageUrls: ['https://m.media-amazon.com/images/I/61tV96J8V0L._AC_SL1500_.jpg']
  },
  {
    name: 'Corsair Dominator Titanium DDR5 64GB (2x32)',
    category: 'RAM',
    price: 9900.00,
    stock: 12,
    slug: 'ram-ddr5-64',
    brand: 'Corsair',
    specs: { ram_type: 'DDR5', capacity_gb: 64, speed_mhz: 6400, tdp: 10, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Kingston Fury Renegade DDR5 32GB (2x16) 7200MHz',
    category: 'RAM',
    price: 5490.00,
    stock: 18,
    slug: 'ram-ddr5-32r',
    brand: 'Kingston',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 7200, tdp: 9, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Kingston Fury Beast DDR4 8GB 3200MHz',
    category: 'RAM',
    price: 890.00,
    stock: 50,
    slug: 'ram-kingston-fury-8',
    brand: 'Kingston',
    specs: { ram_type: 'DDR4', capacity_gb: 8, speed_mhz: 3200, tdp: 3, modules: 1 },
    imageUrls: []
  },
  {
    name: 'Corsair Vengeance LPX DDR4 16GB (2x8) 3200MHz',
    category: 'RAM',
    price: 1590.00,
    stock: 45,
    slug: 'ram-corsair-lpx-16',
    brand: 'Corsair',
    specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3200, tdp: 5, modules: 2 },
    imageUrls: []
  },
  {
    name: 'G.SKILL Ripjaws V DDR4 16GB (2x8) 3600MHz',
    category: 'RAM',
    price: 1690.00,
    stock: 38,
    slug: 'ram-gskill-ripjaws-16',
    brand: 'G.SKILL',
    specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3600, tdp: 5, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Kingston Fury Beast DDR4 32GB (2x16) 3200MHz',
    category: 'RAM',
    price: 2990.00,
    stock: 24,
    slug: 'ram-kingston-fury-32',
    brand: 'Kingston',
    specs: { ram_type: 'DDR4', capacity_gb: 32, speed_mhz: 3200, tdp: 6, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16) 5600MHz',
    category: 'RAM',
    price: 4390.00,
    stock: 20,
    slug: 'ram-corsair-rgb-ddr5',
    brand: 'Corsair',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 5600, tdp: 8, modules: 2 },
    imageUrls: []
  },
  {
    name: 'G.SKILL Ripjaws S5 DDR5 32GB (2x16) 6000MHz',
    category: 'RAM',
    price: 4590.00,
    stock: 28,
    slug: 'ram-gskill-ripjaws-ddr5',
    brand: 'G.SKILL',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Kingston Fury Beast DDR5 16GB (2x8) 5200MHz',
    category: 'RAM',
    price: 2490.00,
    stock: 32,
    slug: 'ram-kingston-fury-ddr5-16',
    brand: 'Kingston',
    specs: { ram_type: 'DDR5', capacity_gb: 16, speed_mhz: 5200, tdp: 6, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Corsair Vengeance DDR5 32GB (2x16) 6000MHz',
    category: 'RAM',
    price: 4790.00,
    stock: 18,
    slug: 'ram-corsair-vengeance-ddr5',
    brand: 'Corsair',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 },
    imageUrls: []
  },
  {
    name: 'G.SKILL Trident Z5 Neo DDR5 32GB (2x16) 6000MHz',
    category: 'RAM',
    price: 4990.00,
    stock: 15,
    slug: 'ram-gskill-trident-ddr5-32',
    brand: 'G.SKILL',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 },
    imageUrls: []
  },
  {
    name: 'Corsair Vengeance LPX DDR4 8GB 3200MHz',
    category: 'RAM',
    price: 890.00,
    stock: 45,
    slug: 'ram-corsair-lpx-8',
    brand: 'Corsair',
    specs: { ram_type: 'DDR4', capacity_gb: 8, speed_mhz: 3200, tdp: 3, modules: 1 },
    imageUrls: []
  },

  // ── SSD (15 items) ──────────────────────────────────────────
  {
    name: 'Kingston NV2 500GB NVMe PCIe 4.0',
    category: 'SSD',
    price: 1290.00,
    stock: 50,
    slug: 'ssd-nv2-500',
    brand: 'Kingston',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 500, tdp: 5, read_speed: '3500 MB/s', write_speed: '2100 MB/s' },
    imageUrls: ['https://m.media-amazon.com/images/I/51t7q2w95NL._AC_SL1200_.jpg']
  },
  {
    name: 'WD Blue SN580 1TB NVMe PCIe 4.0',
    category: 'SSD',
    price: 2490.00,
    stock: 40,
    slug: 'ssd-sn580-1t',
    brand: 'WD',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 6, read_speed: '4150 MB/s', write_speed: '4150 MB/s' },
    imageUrls: []
  },
  {
    name: 'Samsung 990 Pro 1TB NVMe PCIe 4.0',
    category: 'SSD',
    price: 4290.00,
    stock: 35,
    slug: 'ssd-990pro-1t',
    brand: 'Samsung',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 7, read_speed: '7450 MB/s', write_speed: '6900 MB/s' },
    imageUrls: []
  },
  {
    name: 'Crucial T705 2TB NVMe PCIe 5.0',
    category: 'SSD',
    price: 9990.00,
    stock: 15,
    slug: 'ssd-t705-2t',
    brand: 'Crucial',
    specs: { interface: 'PCIe 5.0', form_factor: 'M.2 2280', capacity_gb: 2000, tdp: 12, read_speed: '14500 MB/s', write_speed: '12700 MB/s' },
    imageUrls: []
  },
  {
    name: 'Samsung 870 EVO 1TB SATA',
    category: 'SSD',
    price: 2790.00,
    stock: 30,
    slug: 'ssd-870evo-1t',
    brand: 'Samsung',
    specs: { interface: 'SATA', form_factor: '2.5 inch', capacity_gb: 1000, tdp: 3, read_speed: '560 MB/s', write_speed: '530 MB/s' },
    imageUrls: []
  },
  {
    name: 'WD Green 240GB M.2 SATA',
    category: 'SSD',
    price: 790.00,
    stock: 60,
    slug: 'ssd-wd-green-240',
    brand: 'WD',
    specs: { interface: 'SATA', form_factor: 'M.2 2280', capacity_gb: 240, tdp: 2, read_speed: '545 MB/s', write_speed: '465 MB/s' },
    imageUrls: []
  },
  {
    name: 'Kingston A400 480GB SATA 2.5',
    category: 'SSD',
    price: 1190.00,
    stock: 55,
    slug: 'ssd-kingston-a400-480',
    brand: 'Kingston',
    specs: { interface: 'SATA', form_factor: '2.5 inch', capacity_gb: 480, tdp: 3, read_speed: '500 MB/s', write_speed: '450 MB/s' },
    imageUrls: []
  },
  {
    name: 'Samsung 870 EVO 500GB SATA 2.5',
    category: 'SSD',
    price: 1690.00,
    stock: 40,
    slug: 'ssd-samsung-870evo-500',
    brand: 'Samsung',
    specs: { interface: 'SATA', form_factor: '2.5 inch', capacity_gb: 500, tdp: 3, read_speed: '560 MB/s', write_speed: '530 MB/s' },
    imageUrls: []
  },
  {
    name: 'WD Blue SN580 500GB NVMe',
    category: 'SSD',
    price: 1590.00,
    stock: 35,
    slug: 'ssd-wd-sn580-500',
    brand: 'WD',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 500, tdp: 5, read_speed: '4000 MB/s', write_speed: '3600 MB/s' },
    imageUrls: []
  },
  {
    name: 'Kingston NV2 1TB NVMe PCIe 4.0',
    category: 'SSD',
    price: 2190.00,
    stock: 45,
    slug: 'ssd-kingston-nv2-1t',
    brand: 'Kingston',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 5, read_speed: '3500 MB/s', write_speed: '2100 MB/s' },
    imageUrls: []
  },
  {
    name: 'WD Black SN850X 1TB NVMe',
    category: 'SSD',
    price: 3490.00,
    stock: 25,
    slug: 'ssd-wd-sn850x-1t',
    brand: 'WD',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 7, read_speed: '7300 MB/s', write_speed: '6300 MB/s' },
    imageUrls: []
  },
  {
    name: 'Samsung 980 1TB NVMe PCIe 3.0',
    category: 'SSD',
    price: 2890.00,
    stock: 30,
    slug: 'ssd-samsung-980-1t',
    brand: 'Samsung',
    specs: { interface: 'PCIe 3.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 5, read_speed: '3500 MB/s', write_speed: '3000 MB/s' },
    imageUrls: []
  },
  {
    name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0',
    category: 'SSD',
    price: 6990.00,
    stock: 18,
    slug: 'ssd-samsung-990pro-2t',
    brand: 'Samsung',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 2000, tdp: 8, read_speed: '7450 MB/s', write_speed: '6900 MB/s' },
    imageUrls: []
  },
  {
    name: 'Crucial P3 Plus 1TB NVMe PCIe 4.0',
    category: 'SSD',
    price: 2390.00,
    stock: 32,
    slug: 'ssd-crucial-p3p-1t',
    brand: 'Crucial',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 5, read_speed: '5000 MB/s', write_speed: '3600 MB/s' },
    imageUrls: []
  },
  {
    name: 'Crucial P3 Plus 2TB NVMe PCIe 4.0',
    category: 'SSD',
    price: 4490.00,
    stock: 20,
    slug: 'ssd-crucial-p3p-2t',
    brand: 'Crucial',
    specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 2000, tdp: 6, read_speed: '5000 MB/s', write_speed: '4200 MB/s' },
    imageUrls: []
  },

  // ── Case (15 items) ─────────────────────────────────────────
  {
    name: 'NZXT H5 Flow',
    category: 'Case',
    price: 3290.00,
    stock: 20,
    slug: 'case-h5flow',
    brand: 'NZXT',
    specs: { max_gpu_length_mm: 365, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' },
    imageUrls: ['https://m.media-amazon.com/images/I/61N+pB3+H3L._AC_SL1500_.jpg']
  },
  {
    name: 'Fractal Design North',
    category: 'Case',
    price: 6890.00,
    stock: 10,
    slug: 'case-north',
    brand: 'Fractal Design',
    specs: { max_gpu_length_mm: 355, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Charcoal Black' },
    imageUrls: []
  },
  {
    name: 'Corsair 4000D Airflow',
    category: 'Case',
    price: 3890.00,
    stock: 25,
    slug: 'case-4000d',
    brand: 'Corsair',
    specs: { max_gpu_length_mm: 360, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Lian Li O11 Dynamic EVO',
    category: 'Case',
    price: 6490.00,
    stock: 15,
    slug: 'case-o11evo',
    brand: 'Lian Li',
    specs: { max_gpu_length_mm: 426, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'White' },
    imageUrls: []
  },
  {
    name: 'Cooler Master NR200P',
    category: 'Case',
    price: 3490.00,
    stock: 18,
    slug: 'case-nr200p',
    brand: 'Cooler Master',
    specs: { max_gpu_length_mm: 330, form_factor: ['ITX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Corsair 3000D Airflow',
    category: 'Case',
    price: 2890.00,
    stock: 30,
    slug: 'case-corsair-3000d',
    brand: 'Corsair',
    specs: { max_gpu_length_mm: 360, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Cooler Master MasterBox Q300L',
    category: 'Case',
    price: 1490.00,
    stock: 40,
    slug: 'case-cm-q300l',
    brand: 'Cooler Master',
    specs: { max_gpu_length_mm: 360, form_factor: ['mATX', 'ITX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'NZXT H7 Flow',
    category: 'Case',
    price: 4490.00,
    stock: 15,
    slug: 'case-nzxt-h7flow',
    brand: 'NZXT',
    specs: { max_gpu_length_mm: 400, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'NZXT H6 Flow',
    category: 'Case',
    price: 3990.00,
    stock: 22,
    slug: 'case-nzxt-h6flow',
    brand: 'NZXT',
    specs: { max_gpu_length_mm: 365, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Fractal Design Pop Air',
    category: 'Case',
    price: 3295.00,
    stock: 18,
    slug: 'case-fd-popair',
    brand: 'Fractal Design',
    specs: { max_gpu_length_mm: 405, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Lian Li LANCOOL 216',
    category: 'Case',
    price: 3690.00,
    stock: 25,
    slug: 'case-lianli-lc216',
    brand: 'Lian Li',
    specs: { max_gpu_length_mm: 392, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Lian Li O11 Vision',
    category: 'Case',
    price: 5490.00,
    stock: 10,
    slug: 'case-lianli-o11vision',
    brand: 'Lian Li',
    specs: { max_gpu_length_mm: 455, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Chrome' },
    imageUrls: []
  },
  {
    name: 'Montech AIR 903 MAX',
    category: 'Case',
    price: 2290.00,
    stock: 35,
    slug: 'case-montech-903max',
    brand: 'Montech',
    specs: { max_gpu_length_mm: 400, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Montech Sky Two',
    category: 'Case',
    price: 2990.00,
    stock: 20,
    slug: 'case-montech-skytwo',
    brand: 'Montech',
    specs: { max_gpu_length_mm: 400, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' },
    imageUrls: []
  },
  {
    name: 'Thermaltake Core P3 TG',
    category: 'Case',
    price: 4890.00,
    stock: 12,
    slug: 'case-tt-corep3',
    brand: 'Thermaltake',
    specs: { max_gpu_length_mm: 450, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' },
    imageUrls: []
  },

  // ── PSU (15 items) ──────────────────────────────────────────
  {
    name: 'Corsair CV650 650W 80+ Bronze',
    category: 'PSU',
    price: 1890.00,
    stock: 30,
    slug: 'psu-cv650',
    brand: 'Corsair',
    specs: { wattage: 650, efficiency_rating: '80+ Bronze', modular: 'Non-modular' },
    imageUrls: ['https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020211-NA-702x702.png']
  },
  {
    name: 'Corsair RM750x 750W 80+ Gold',
    category: 'PSU',
    price: 3890.00,
    stock: 25,
    slug: 'psu-rm750x',
    brand: 'Corsair',
    specs: { wattage: 750, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: ['https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020199-NA-702x702.png']
  },
  {
    name: 'Corsair RM850x 850W 80+ Gold',
    category: 'PSU',
    price: 4890.00,
    stock: 18,
    slug: 'psu-rm850x',
    brand: 'Corsair',
    specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: ['https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020200-NA-702x702.png']
  },
  {
    name: 'Seasonic Focus GX-1000 1000W 80+ Gold',
    category: 'PSU',
    price: 6490.00,
    stock: 12,
    slug: 'psu-gx1000',
    brand: 'Seasonic',
    specs: { wattage: 1000, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: ['https://seasonic.com/pub/media/catalog/product/cache/image/700x560/e9c3970ab036de70892d86c6d221abfe/f/o/focus-gx-702x702.png']
  },
  {
    name: 'be quiet! Dark Power 13 1000W 80+ Titanium',
    category: 'PSU',
    price: 8990.00,
    stock: 8,
    slug: 'psu-dp13',
    brand: 'be quiet!',
    specs: { wattage: 1000, efficiency_rating: '80+ Titanium', modular: 'Fully Modular' },
    imageUrls: ['https://www.bequiet.com/admin/ImageServer.php?ID=7a5a4ac9620@bequiet.com&key=702x702']
  },
  {
    name: 'MSI MAG A650BN 650W 80+ Bronze',
    category: 'PSU',
    price: 1990.00,
    stock: 45,
    slug: 'psu-msi-a650bn',
    brand: 'MSI',
    specs: { wattage: 650, efficiency_rating: '80+ Bronze', modular: 'Non-modular' },
    imageUrls: []
  },
  {
    name: 'MSI MAG A750GL 750W 80+ Gold',
    category: 'PSU',
    price: 3290.00,
    stock: 30,
    slug: 'psu-msi-a750gl',
    brand: 'MSI',
    specs: { wattage: 750, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'MSI MAG A850GL 850W 80+ Gold',
    category: 'PSU',
    price: 3890.00,
    stock: 24,
    slug: 'psu-msi-a850gl',
    brand: 'MSI',
    specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'Seasonic B12 BC-650 650W 80+ Bronze',
    category: 'PSU',
    price: 2190.00,
    stock: 35,
    slug: 'psu-seasonic-b12-650',
    brand: 'Seasonic',
    specs: { wattage: 650, efficiency_rating: '80+ Bronze', modular: 'Non-modular' },
    imageUrls: []
  },
  {
    name: 'Seasonic Focus GX-750 750W 80+ Gold',
    category: 'PSU',
    price: 3790.00,
    stock: 28,
    slug: 'psu-seasonic-gx750',
    brand: 'Seasonic',
    specs: { wattage: 750, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'Seasonic Focus GX-850 850W 80+ Gold',
    category: 'PSU',
    price: 4490.00,
    stock: 20,
    slug: 'psu-seasonic-gx850',
    brand: 'Seasonic',
    specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'Corsair RM1000x 1000W 80+ Gold',
    category: 'PSU',
    price: 6590.00,
    stock: 15,
    slug: 'psu-corsair-rm1000x',
    brand: 'Corsair',
    specs: { wattage: 1000, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'Corsair SF750 750W 80+ Platinum',
    category: 'PSU',
    price: 5890.00,
    stock: 12,
    slug: 'psu-corsair-sf750',
    brand: 'Corsair',
    specs: { wattage: 750, efficiency_rating: '80+ Platinum', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'Thermaltake Toughpower GF3 850W',
    category: 'PSU',
    price: 4290.00,
    stock: 18,
    slug: 'psu-tt-gf3-850',
    brand: 'Thermaltake',
    specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  },
  {
    name: 'Thermaltake Toughpower GF3 1000W',
    category: 'PSU',
    price: 5490.00,
    stock: 10,
    slug: 'psu-tt-gf3-1000',
    brand: 'Thermaltake',
    specs: { wattage: 1000, efficiency_rating: '80+ Gold', modular: 'Fully Modular' },
    imageUrls: []
  }
];

// ============================================================
// Image download & WebP conversion
// ============================================================

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function downloadImage(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: controller.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('image')) throw new Error(`Not an image: ${contentType}`);
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

async function convertToWebp(inputBuffer, outputPath) {
  await sharp(inputBuffer)
    .resize(800, 600, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

async function generatePlaceholder(outputPath, text) {
  const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#1a1a2e"/>
    <rect x="100" y="100" width="600" height="400" rx="20" fill="#16213e" stroke="#0f3460" stroke-width="2"/>
    <text x="400" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#e94560" font-weight="bold">📦</text>
    <text x="400" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#a0a0b0">${escapeXml(text)}</text>
    <text x="400" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#606080">Image Coming Soon</text>
  </svg>`;
  await sharp(Buffer.from(svg))
    .resize(800, 600)
    .webp({ quality: 80 })
    .toFile(outputPath);
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// Seed SQL generation
// ============================================================

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

function generateSeedSQL(products) {
  const categories = ['CPU', 'Mainboard', 'GPU', 'RAM', 'SSD', 'Case', 'PSU'];
  let sql = `-- ============================================================
-- ComHub MVP Seed Data — Products (120 items)
-- Auto-generated by seed-from-opendb.mjs from BuildCores OpenDB
-- Generated: ${new Date().toISOString()}
-- ============================================================

`;

  for (const cat of categories) {
    const catProducts = products.filter(p => p.category === cat);
    if (!catProducts.length) continue;

    sql += `-- ------------------------------------------------------------\n`;
    sql += `-- ${cat}\n`;
    sql += `-- ------------------------------------------------------------\n`;
    sql += `INSERT INTO products (name, category, price, stock_quantity, image_url, specifications, brand) VALUES\n`;

    const values = catProducts.map(p => {
      const specsJSON = JSON.stringify(p.specs);
      const brandVal = p.brand || 'Generic';
      return `('${escapeSQL(p.name)}', '${cat}', ${p.price.toFixed(2)}, ${p.stock}, '/images/products/${p.slug}.webp',\n  '${escapeSQL(specsJSON)}', '${escapeSQL(brandVal)}')`;
    });

    sql += values.join(',\n') + ';\n\n';
  }

  return sql;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('🚀 ComHub Seed Script — Expanded 120-Product Seeding & Image Downloader');
  console.log('='.repeat(60));

  // Ensure images directory exists
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`📁 Images directory: ${IMAGES_DIR}`);

  let downloaded = 0;
  let placeholders = 0;

  for (const product of PRODUCTS) {
    const outputPath = path.join(IMAGES_DIR, `${product.slug}.webp`);
    
    // If the file already exists, don't download it again to save bandwidth and prevent CDNs blocking
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
      console.log(`  💾 ${product.slug} already exists, skipping download...`);
      downloaded++;
      continue;
    }

    let success = false;

    // Collect all URLs to try (vendor URLs + Unsplash categories)
    const urlsToTry = [...(product.imageUrls || [])];
    const fallbacks = getUnsplashCategoryUrls(product.category);
    for (const url of fallbacks) {
      urlsToTry.push(url);
    }

    for (const url of urlsToTry) {
      try {
        process.stdout.write(`  ⏳ ${product.slug} ← ${new URL(url).hostname}...`);
        const buffer = await downloadImage(url);
        await convertToWebp(buffer, outputPath);
        console.log(` ✅ (${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB)`);
        downloaded++;
        success = true;
        break;
      } catch (err) {
        console.log(` ❌ ${err.message}`);
      }
    }

    if (!success) {
      console.log(`  🎨 ${product.slug} → generating placeholder...`);
      await generatePlaceholder(outputPath, product.name);
      placeholders++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results: ${downloaded} downloaded/cached, ${placeholders} placeholders`);

  // Generate seed.sql
  console.log('\n📝 Generating seed.sql...');
  const sql = generateSeedSQL(PRODUCTS);
  fs.writeFileSync(SEED_SQL_PATH, sql, 'utf-8');
  console.log(`✅ seed.sql written to ${SEED_SQL_PATH}`);

  console.log('\n🎉 Done!');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
