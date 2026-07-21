import 'dotenv/config';
import { pool } from '../config/db';

const PRODUCTS = [
  // ── CPU (15 items) ──────────────────────────────────────────
  { name: 'Intel Core i5-14600K', category: 'CPU', price: 12500.00, stock: 25, slug: 'cpu-i5-14600k', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 14, threads: 20, base_clock_ghz: 3.5, boost_clock_ghz: 5.3, cache: '24MB' } },
  { name: 'Intel Core i7-14700K', category: 'CPU', price: 15900.00, stock: 20, slug: 'cpu-i7-14700k', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 20, threads: 28, base_clock_ghz: 3.4, boost_clock_ghz: 5.6, cache: '33MB' } },
  { name: 'Intel Core i9-14900K', category: 'CPU', price: 22900.00, stock: 12, slug: 'cpu-i9-14900k', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 24, threads: 32, base_clock_ghz: 3.2, boost_clock_ghz: 6.0, cache: '36MB' } },
  { name: 'AMD Ryzen 5 7600X', category: 'CPU', price: 9900.00, stock: 30, slug: 'cpu-r5-7600x', brand: 'AMD', specs: { socket: 'AM5', tdp: 105, supported_ram: ['DDR5'], cores: 6, threads: 12, base_clock_ghz: 4.7, boost_clock_ghz: 5.3, cache: '38MB' } },
  { name: 'AMD Ryzen 7 7800X3D', category: 'CPU', price: 16500.00, stock: 15, slug: 'cpu-r7-7800x3d', brand: 'AMD', specs: { socket: 'AM5', tdp: 120, supported_ram: ['DDR5'], cores: 8, threads: 16, base_clock_ghz: 4.2, boost_clock_ghz: 5.0, cache: '104MB' } },
  { name: 'Intel Core i3-14100', category: 'CPU', price: 4690.00, stock: 40, slug: 'cpu-intel-i3-14100', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 60, supported_ram: ['DDR4', 'DDR5'], cores: 4, threads: 8, base_clock_ghz: 3.5, boost_clock_ghz: 4.7, cache: '12MB' } },
  { name: 'Intel Core i5-12400F', category: 'CPU', price: 4590.00, stock: 50, slug: 'cpu-intel-i5-12400f', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 65, supported_ram: ['DDR4', 'DDR5'], cores: 6, threads: 12, base_clock_ghz: 2.5, boost_clock_ghz: 4.4, cache: '18MB' } },
  { name: 'Intel Core i5-13400F', category: 'CPU', price: 7290.00, stock: 35, slug: 'cpu-intel-i5-13400f', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 65, supported_ram: ['DDR4', 'DDR5'], cores: 10, threads: 16, base_clock_ghz: 2.5, boost_clock_ghz: 4.6, cache: '20MB' } },
  { name: 'Intel Core i7-13700K', category: 'CPU', price: 13900.00, stock: 18, slug: 'cpu-intel-i7-13700k', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 16, threads: 24, base_clock_ghz: 3.4, boost_clock_ghz: 5.4, cache: '30MB' } },
  { name: 'Intel Core i9-13900K', category: 'CPU', price: 19900.00, stock: 10, slug: 'cpu-intel-i9-13900k', brand: 'Intel', specs: { socket: 'LGA1700', tdp: 125, supported_ram: ['DDR4', 'DDR5'], cores: 24, threads: 32, base_clock_ghz: 3.0, boost_clock_ghz: 5.8, cache: '36MB' } },
  { name: 'AMD Ryzen 5 5600X', category: 'CPU', price: 5190.00, stock: 45, slug: 'cpu-amd-r5-5600x', brand: 'AMD', specs: { socket: 'AM4', tdp: 65, supported_ram: ['DDR4'], cores: 6, threads: 12, base_clock_ghz: 3.7, boost_clock_ghz: 4.6, cache: '35MB' } },
  { name: 'AMD Ryzen 7 5700X', category: 'CPU', price: 6890.00, stock: 30, slug: 'cpu-amd-r7-5700x', brand: 'AMD', specs: { socket: 'AM4', tdp: 65, supported_ram: ['DDR4'], cores: 8, threads: 16, base_clock_ghz: 3.4, boost_clock_ghz: 4.6, cache: '36MB' } },
  { name: 'AMD Ryzen 7 7700X', category: 'CPU', price: 11900.00, stock: 25, slug: 'cpu-amd-r7-7700x', brand: 'AMD', specs: { socket: 'AM5', tdp: 105, supported_ram: ['DDR5'], cores: 8, threads: 16, base_clock_ghz: 4.5, boost_clock_ghz: 5.4, cache: '40MB' } },
  { name: 'AMD Ryzen 9 7900X', category: 'CPU', price: 14900.00, stock: 15, slug: 'cpu-amd-r9-7900x', brand: 'AMD', specs: { socket: 'AM5', tdp: 170, supported_ram: ['DDR5'], cores: 12, threads: 24, base_clock_ghz: 4.7, boost_clock_ghz: 5.6, cache: '76MB' } },
  { name: 'AMD Ryzen 9 7950X', category: 'CPU', price: 18900.00, stock: 12, slug: 'cpu-amd-r9-7950x', brand: 'AMD', specs: { socket: 'AM5', tdp: 170, supported_ram: ['DDR5'], cores: 16, threads: 32, base_clock_ghz: 4.5, boost_clock_ghz: 5.7, cache: '80MB' } },

  // ── Mainboard (15 items) ────────────────────────────────────
  { name: 'ASUS ROG STRIX Z790-E GAMING', category: 'Mainboard', price: 14500.00, stock: 12, slug: 'mb-z790e', brand: 'ASUS', specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 25, max_ram_gb: 128 } },
  { name: 'MSI PRO Z790-A WIFI', category: 'Mainboard', price: 9900.00, stock: 18, slug: 'mb-z790a', brand: 'MSI', specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 20, max_ram_gb: 128 } },
  { name: 'GIGABYTE B760M DS3H DDR4', category: 'Mainboard', price: 4290.00, stock: 25, slug: 'mb-b760m', brand: 'GIGABYTE', specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 15, max_ram_gb: 64 } },
  { name: 'ASUS ROG STRIX X670E-F GAMING', category: 'Mainboard', price: 16900.00, stock: 10, slug: 'mb-x670e', brand: 'ASUS', specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 25, max_ram_gb: 128 } },
  { name: 'MSI MAG B650 TOMAHAWK WIFI', category: 'Mainboard', price: 8290.00, stock: 15, slug: 'mb-b650', brand: 'MSI', specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 20, max_ram_gb: 128 } },
  { name: 'ASUS PRIME H610M-K DDR4', category: 'Mainboard', price: 2390.00, stock: 40, slug: 'mb-asus-prime-h610m', brand: 'ASUS', specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 10, max_ram_gb: 64 } },
  { name: 'GIGABYTE H610M S2H V2 DDR4', category: 'Mainboard', price: 2490.00, stock: 35, slug: 'mb-gigabyte-h610m', brand: 'GIGABYTE', specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 10, max_ram_gb: 64 } },
  { name: 'MSI PRO B760M-P DDR4', category: 'Mainboard', price: 3490.00, stock: 28, slug: 'mb-msi-pro-b760m', brand: 'MSI', specs: { socket: 'LGA1700', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 12, max_ram_gb: 128 } },
  { name: 'ASUS TUF GAMING B760M-PLUS WIFI', category: 'Mainboard', price: 6290.00, stock: 22, slug: 'mb-asus-tuf-b760m', brand: 'ASUS', specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'mATX', tdp: 15, max_ram_gb: 192 } },
  { name: 'GIGABYTE Z790 AORUS ELITE AX', category: 'Mainboard', price: 9290.00, stock: 14, slug: 'mb-gigabyte-z790-aorus', brand: 'GIGABYTE', specs: { socket: 'LGA1700', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 20, max_ram_gb: 192 } },
  { name: 'MSI MAG B550 TOMAHAWK', category: 'Mainboard', price: 5490.00, stock: 19, slug: 'mb-msi-mag-b550', brand: 'MSI', specs: { socket: 'AM4', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'ATX', tdp: 15, max_ram_gb: 128 } },
  { name: 'ASUS PRIME B550M-K', category: 'Mainboard', price: 3190.00, stock: 25, slug: 'mb-asus-prime-b550m', brand: 'ASUS', specs: { socket: 'AM4', ram_type: 'DDR4', supported_ram: 'DDR4', form_factor: 'mATX', tdp: 10, max_ram_gb: 128 } },
  { name: 'GIGABYTE B650 GAMING X AX', category: 'Mainboard', price: 6890.00, stock: 18, slug: 'mb-gigabyte-b650-gaming', brand: 'GIGABYTE', specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 18, max_ram_gb: 192 } },
  { name: 'ASUS TUF GAMING B650-PLUS WIFI', category: 'Mainboard', price: 7490.00, stock: 15, slug: 'mb-asus-tuf-b650', brand: 'ASUS', specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 18, max_ram_gb: 192 } },
  { name: 'GIGABYTE X670 AORUS ELITE AX', category: 'Mainboard', price: 11900.00, stock: 8, slug: 'mb-gigabyte-x670-aorus', brand: 'GIGABYTE', specs: { socket: 'AM5', ram_type: 'DDR5', supported_ram: 'DDR5', form_factor: 'ATX', tdp: 25, max_ram_gb: 192 } },

  // ── GPU (30 items) ─────────────────────────────────────────
  { name: 'ASUS ROG Strix GeForce RTX 4090 OC', category: 'GPU', price: 78900.00, stock: 5, slug: 'gpu-asus-rtx4090-strix', brand: 'ASUS', specs: { tdp: 450, gpu_length_mm: 357, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 } },
  { name: 'MSI GeForce RTX 4090 SUPRIM X', category: 'GPU', price: 76500.00, stock: 4, slug: 'gpu-msi-rtx4090-suprim', brand: 'MSI', specs: { tdp: 450, gpu_length_mm: 336, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 } },
  { name: 'GIGABYTE GeForce RTX 4090 AORUS Master', category: 'GPU', price: 75900.00, stock: 3, slug: 'gpu-gigabyte-rtx4090-aorus', brand: 'GIGABYTE', specs: { tdp: 450, gpu_length_mm: 358, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.62 } },
  { name: 'ZOTAC GAMING GeForce RTX 4090 Trinity', category: 'GPU', price: 69900.00, stock: 6, slug: 'gpu-zotac-rtx4090-trinity', brand: 'ZOTAC', specs: { tdp: 450, gpu_length_mm: 356, memory_size: '24GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.52 } },
  { name: 'ASUS TUF Gaming GeForce RTX 4080 SUPER', category: 'GPU', price: 44900.00, stock: 8, slug: 'gpu-asus-rtx4080s-tuf', brand: 'ASUS', specs: { tdp: 320, gpu_length_mm: 348, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 } },
  { name: 'MSI GeForce RTX 4080 SUPER GAMING X SLIM', category: 'GPU', price: 43500.00, stock: 7, slug: 'gpu-msi-rtx4080s-gaming', brand: 'MSI', specs: { tdp: 320, gpu_length_mm: 322, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.61 } },
  { name: 'GIGABYTE GeForce RTX 4080 SUPER EAGLE OC', category: 'GPU', price: 42500.00, stock: 5, slug: 'gpu-gigabyte-rtx4080s-eagle', brand: 'GIGABYTE', specs: { tdp: 320, gpu_length_mm: 342, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.61 } },
  { name: 'ZOTAC GAMING GeForce RTX 4080 SUPER Trinity', category: 'GPU', price: 39900.00, stock: 9, slug: 'gpu-zotac-rtx4080s-trinity', brand: 'ZOTAC', specs: { tdp: 320, gpu_length_mm: 306, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.55 } },
  { name: 'ASUS ROG Strix GeForce RTX 4070 Ti SUPER', category: 'GPU', price: 36900.00, stock: 10, slug: 'gpu-asus-rtx4070tis-strix', brand: 'ASUS', specs: { tdp: 285, gpu_length_mm: 336, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.67 } },
  { name: 'MSI GeForce RTX 4070 Ti SUPER VENTUS 3X', category: 'GPU', price: 34500.00, stock: 12, slug: 'gpu-msi-rtx4070tis-ventus', brand: 'MSI', specs: { tdp: 285, gpu_length_mm: 308, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.64 } },
  { name: 'GIGABYTE GeForce RTX 4070 Ti SUPER WF3', category: 'GPU', price: 33900.00, stock: 8, slug: 'gpu-gigabyte-rtx4070tis-wf', brand: 'GIGABYTE', specs: { tdp: 285, gpu_length_mm: 300, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.61 } },
  { name: 'GALAX GeForce RTX 4070 Ti SUPER EX', category: 'GPU', price: 31900.00, stock: 15, slug: 'gpu-galax-rtx4070tis-ex', brand: 'GALAX', specs: { tdp: 285, gpu_length_mm: 323, memory_size: '16GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.65 } },
  { name: 'ASUS Dual GeForce RTX 4070 SUPER OC', category: 'GPU', price: 26900.00, stock: 14, slug: 'gpu-asus-rtx4070s-dual', brand: 'ASUS', specs: { tdp: 220, gpu_length_mm: 267, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.55 } },
  { name: 'MSI GeForce RTX 4070 SUPER VENTUS 2X', category: 'GPU', price: 25500.00, stock: 11, slug: 'gpu-msi-rtx4070s-ventus', brand: 'MSI', specs: { tdp: 220, gpu_length_mm: 242, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.52 } },
  { name: 'GIGABYTE GeForce RTX 4070 SUPER AERO OC', category: 'GPU', price: 27900.00, stock: 6, slug: 'gpu-gigabyte-rtx4070s-aero', brand: 'GIGABYTE', specs: { tdp: 220, gpu_length_mm: 300, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.565 } },
  { name: 'ZOTAC GAMING GeForce RTX 4070 SUPER Twin', category: 'GPU', price: 23900.00, stock: 18, slug: 'gpu-zotac-rtx4070s-twin', brand: 'ZOTAC', specs: { tdp: 220, gpu_length_mm: 234, memory_size: '12GB', memory_type: 'GDDR6X', boost_clock_ghz: 2.475 } },
  { name: 'ASUS TUF Gaming GeForce RTX 4060 Ti', category: 'GPU', price: 16500.00, stock: 22, slug: 'gpu-asus-rtx4060ti-tuf', brand: 'ASUS', specs: { tdp: 160, gpu_length_mm: 300, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.655 } },
  { name: 'MSI GeForce RTX 4060 Ti VENTUS 3X OC', category: 'GPU', price: 15900.00, stock: 20, slug: 'gpu-msi-rtx4060ti-ventus', brand: 'MSI', specs: { tdp: 160, gpu_length_mm: 308, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.64 } },
  { name: 'GIGABYTE GeForce RTX 4060 Ti EAGLE OC', category: 'GPU', price: 15500.00, stock: 19, slug: 'gpu-gigabyte-rtx4060ti-eagle', brand: 'GIGABYTE', specs: { tdp: 160, gpu_length_mm: 272, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.61 } },
  { name: 'ZOTAC GAMING GeForce RTX 4060 Ti Twin', category: 'GPU', price: 14500.00, stock: 24, slug: 'gpu-zotac-rtx4060ti-twin', brand: 'ZOTAC', specs: { tdp: 160, gpu_length_mm: 225, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.54 } },
  { name: 'ASUS Dual GeForce RTX 4060 OC', category: 'GPU', price: 11900.00, stock: 30, slug: 'gpu-asus-rtx4060-dual', brand: 'ASUS', specs: { tdp: 115, gpu_length_mm: 227, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.535 } },
  { name: 'MSI GeForce RTX 4060 VENTUS 2X BLACK', category: 'GPU', price: 11500.00, stock: 28, slug: 'gpu-msi-rtx4060-ventus', brand: 'MSI', specs: { tdp: 115, gpu_length_mm: 199, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.505 } },
  { name: 'GIGABYTE GeForce RTX 4060 WINDFORCE OC', category: 'GPU', price: 10900.00, stock: 25, slug: 'gpu-gigabyte-rtx4060-wf', brand: 'GIGABYTE', specs: { tdp: 115, gpu_length_mm: 192, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.475 } },
  { name: 'ZOTAC GAMING GeForce RTX 4060 Solo', category: 'GPU', price: 9900.00, stock: 35, slug: 'gpu-zotac-rtx4060-solo', brand: 'ZOTAC', specs: { tdp: 115, gpu_length_mm: 163, memory_size: '8GB', memory_type: 'GDDR6', boost_clock_ghz: 2.46 } },
  { name: 'Sapphire NITRO+ Radeon RX 7900 XTX', category: 'GPU', price: 39900.00, stock: 8, slug: 'gpu-sapphire-rx7900xtx-nitro', brand: 'Sapphire', specs: { tdp: 355, gpu_length_mm: 320, memory_size: '24GB', memory_type: 'GDDR6', boost_clock_ghz: 2.68 } },
  { name: 'PowerColor Red Devil Radeon RX 7900 XTX', category: 'GPU', price: 38900.00, stock: 7, slug: 'gpu-powercolor-rx7900xtx-devil', brand: 'PowerColor', specs: { tdp: 355, gpu_length_mm: 338, memory_size: '24GB', memory_type: 'GDDR6', boost_clock_ghz: 2.565 } },
  { name: 'Sapphire PULSE Radeon RX 7900 XT', category: 'GPU', price: 29900.00, stock: 12, slug: 'gpu-sapphire-rx7900xt-pulse', brand: 'Sapphire', specs: { tdp: 315, gpu_length_mm: 313, memory_size: '20GB', memory_type: 'GDDR6', boost_clock_ghz: 2.45 } },
  { name: 'PowerColor Hellhound Radeon RX 7800 XT', category: 'GPU', price: 19900.00, stock: 15, slug: 'gpu-powercolor-rx7800xt-hound', brand: 'PowerColor', specs: { tdp: 263, gpu_length_mm: 322, memory_size: '16GB', memory_type: 'GDDR6', boost_clock_ghz: 2.525 } },
  { name: 'Sapphire PULSE Radeon RX 7700 XT', category: 'GPU', price: 16900.00, stock: 18, slug: 'gpu-sapphire-rx7700xt-pulse', brand: 'Sapphire', specs: { tdp: 245, gpu_length_mm: 280, memory_size: '12GB', memory_type: 'GDDR6', boost_clock_ghz: 2.544 } },
  { name: 'Sapphire PULSE Radeon RX 7600 XT', category: 'GPU', price: 12900.00, stock: 20, slug: 'gpu-sapphire-rx7600xt-pulse', brand: 'Sapphire', specs: { tdp: 190, gpu_length_mm: 250, memory_size: '16GB', memory_type: 'GDDR6', boost_clock_ghz: 2.755 } },

  // ── RAM (15 items) ──────────────────────────────────────────
  { name: 'Kingston Fury Beast DDR4 16GB (2x8) 3200MHz', category: 'RAM', price: 1590.00, stock: 40, slug: 'ram-ddr4-16', brand: 'Kingston', specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3200, tdp: 5, modules: 2 } },
  { name: 'Corsair Vengeance LPX DDR4 32GB (2x16) 3600MHz', category: 'RAM', price: 2890.00, stock: 30, slug: 'ram-ddr4-32', brand: 'Corsair', specs: { ram_type: 'DDR4', capacity_gb: 32, speed_mhz: 3600, tdp: 6, modules: 2 } },
  { name: 'G.SKILL Trident Z5 DDR5 32GB (2x16) 6000MHz', category: 'RAM', price: 4990.00, stock: 25, slug: 'ram-ddr5-32', brand: 'G.SKILL', specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 } },
  { name: 'Corsair Dominator Titanium DDR5 64GB (2x32)', category: 'RAM', price: 9900.00, stock: 12, slug: 'ram-ddr5-64', brand: 'Corsair', specs: { ram_type: 'DDR5', capacity_gb: 64, speed_mhz: 6400, tdp: 10, modules: 2 } },
  { name: 'Kingston Fury Renegade DDR5 32GB (2x16) 7200MHz', category: 'RAM', price: 5490.00, stock: 18, slug: 'ram-ddr5-32r', brand: 'Kingston', specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 7200, tdp: 9, modules: 2 } },
  { name: 'Kingston Fury Beast DDR4 8GB 3200MHz', category: 'RAM', price: 890.00, stock: 50, slug: 'ram-kingston-fury-8', brand: 'Kingston', specs: { ram_type: 'DDR4', capacity_gb: 8, speed_mhz: 3200, tdp: 3, modules: 1 } },
  { name: 'Corsair Vengeance LPX DDR4 16GB (2x8) 3200MHz', category: 'RAM', price: 1590.00, stock: 45, slug: 'ram-corsair-lpx-16', brand: 'Corsair', specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3200, tdp: 5, modules: 2 } },
  { name: 'G.SKILL Ripjaws V DDR4 16GB (2x8) 3600MHz', category: 'RAM', price: 1690.00, stock: 38, slug: 'ram-gskill-ripjaws-16', brand: 'G.SKILL', specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3600, tdp: 5, modules: 2 } },
  { name: 'Kingston Fury Beast DDR4 32GB (2x16) 3200MHz', category: 'RAM', price: 2990.00, stock: 24, slug: 'ram-kingston-fury-32', brand: 'Kingston', specs: { ram_type: 'DDR4', capacity_gb: 32, speed_mhz: 3200, tdp: 6, modules: 2 } },
  { name: 'Corsair Vengeance RGB DDR5 32GB (2x16) 5600MHz', category: 'RAM', price: 4390.00, stock: 20, slug: 'ram-corsair-rgb-ddr5', brand: 'Corsair', specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 5600, tdp: 8, modules: 2 } },
  { name: 'G.SKILL Ripjaws S5 DDR5 32GB (2x16) 6000MHz', category: 'RAM', price: 4590.00, stock: 28, slug: 'ram-gskill-ripjaws-ddr5', brand: 'G.SKILL', specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 } },
  { name: 'Kingston Fury Beast DDR5 16GB (2x8) 5200MHz', category: 'RAM', price: 2490.00, stock: 32, slug: 'ram-kingston-fury-ddr5-16', brand: 'Kingston', specs: { ram_type: 'DDR5', capacity_gb: 16, speed_mhz: 5200, tdp: 6, modules: 2 } },
  { name: 'Corsair Vengeance DDR5 32GB (2x16) 6000MHz', category: 'RAM', price: 4790.00, stock: 18, slug: 'ram-corsair-vengeance-ddr5', brand: 'Corsair', specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 } },
  { name: 'G.SKILL Trident Z5 Neo DDR5 32GB (2x16) 6000MHz', category: 'RAM', price: 4990.00, stock: 15, slug: 'ram-gskill-trident-ddr5-32', brand: 'G.SKILL', specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8, modules: 2 } },
  { name: 'Corsair Vengeance LPX DDR4 8GB 3200MHz', category: 'RAM', price: 890.00, stock: 45, slug: 'ram-corsair-lpx-8', brand: 'Corsair', specs: { ram_type: 'DDR4', capacity_gb: 8, speed_mhz: 3200, tdp: 3, modules: 1 } },

  // ── SSD (15 items) ──────────────────────────────────────────
  { name: 'Kingston NV2 500GB NVMe PCIe 4.0', category: 'SSD', price: 1290.00, stock: 50, slug: 'ssd-nv2-500', brand: 'Kingston', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 500, tdp: 5, read_speed: '3500 MB/s', write_speed: '2100 MB/s' } },
  { name: 'WD Blue SN580 1TB NVMe PCIe 4.0', category: 'SSD', price: 2490.00, stock: 40, slug: 'ssd-sn580-1t', brand: 'WD', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 6, read_speed: '4150 MB/s', write_speed: '4150 MB/s' } },
  { name: 'Samsung 990 Pro 1TB NVMe PCIe 4.0', category: 'SSD', price: 4290.00, stock: 35, slug: 'ssd-990pro-1t', brand: 'Samsung', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 7, read_speed: '7450 MB/s', write_speed: '6900 MB/s' } },
  { name: 'Crucial T705 2TB NVMe PCIe 5.0', category: 'SSD', price: 9990.00, stock: 15, slug: 'ssd-t705-2t', brand: 'Crucial', specs: { interface: 'PCIe 5.0', form_factor: 'M.2 2280', capacity_gb: 2000, tdp: 12, read_speed: '14500 MB/s', write_speed: '12700 MB/s' } },
  { name: 'Samsung 870 EVO 1TB SATA', category: 'SSD', price: 2790.00, stock: 30, slug: 'ssd-870evo-1t', brand: 'Samsung', specs: { interface: 'SATA', form_factor: '2.5 inch', capacity_gb: 1000, tdp: 3, read_speed: '560 MB/s', write_speed: '530 MB/s' } },
  { name: 'WD Green 240GB M.2 SATA', category: 'SSD', price: 790.00, stock: 60, slug: 'ssd-wd-green-240', brand: 'WD', specs: { interface: 'SATA', form_factor: 'M.2 2280', capacity_gb: 240, tdp: 2, read_speed: '545 MB/s', write_speed: '465 MB/s' } },
  { name: 'Kingston A400 480GB SATA 2.5', category: 'SSD', price: 1190.00, stock: 55, slug: 'ssd-kingston-a400-480', brand: 'Kingston', specs: { interface: 'SATA', form_factor: '2.5 inch', capacity_gb: 480, tdp: 3, read_speed: '500 MB/s', write_speed: '450 MB/s' } },
  { name: 'Samsung 870 EVO 500GB SATA 2.5', category: 'SSD', price: 1690.00, stock: 40, slug: 'ssd-samsung-870evo-500', brand: 'Samsung', specs: { interface: 'SATA', form_factor: '2.5 inch', capacity_gb: 500, tdp: 3, read_speed: '560 MB/s', write_speed: '530 MB/s' } },
  { name: 'WD Blue SN580 500GB NVMe', category: 'SSD', price: 1590.00, stock: 35, slug: 'ssd-wd-sn580-500', brand: 'WD', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 500, tdp: 5, read_speed: '4000 MB/s', write_speed: '3600 MB/s' } },
  { name: 'Kingston NV2 1TB NVMe PCIe 4.0', category: 'SSD', price: 2190.00, stock: 45, slug: 'ssd-kingston-nv2-1t', brand: 'Kingston', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 5, read_speed: '3500 MB/s', write_speed: '2100 MB/s' } },
  { name: 'WD Black SN850X 1TB NVMe', category: 'SSD', price: 3490.00, stock: 25, slug: 'ssd-wd-sn850x-1t', brand: 'WD', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 7, read_speed: '7300 MB/s', write_speed: '6300 MB/s' } },
  { name: 'Samsung 980 1TB NVMe PCIe 3.0', category: 'SSD', price: 2890.00, stock: 30, slug: 'ssd-samsung-980-1t', brand: 'Samsung', specs: { interface: 'PCIe 3.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 5, read_speed: '3500 MB/s', write_speed: '3000 MB/s' } },
  { name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0', category: 'SSD', price: 6990.00, stock: 18, slug: 'ssd-samsung-990pro-2t', brand: 'Samsung', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 2000, tdp: 8, read_speed: '7450 MB/s', write_speed: '6900 MB/s' } },
  { name: 'Crucial P3 Plus 1TB NVMe PCIe 4.0', category: 'SSD', price: 2390.00, stock: 32, slug: 'ssd-crucial-p3p-1t', brand: 'Crucial', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 1000, tdp: 5, read_speed: '5000 MB/s', write_speed: '3600 MB/s' } },
  { name: 'Crucial P3 Plus 2TB NVMe PCIe 4.0', category: 'SSD', price: 4490.00, stock: 20, slug: 'ssd-crucial-p3p-2t', brand: 'Crucial', specs: { interface: 'PCIe 4.0', form_factor: 'M.2 2280', capacity_gb: 2000, tdp: 6, read_speed: '5000 MB/s', write_speed: '4200 MB/s' } },

  // ── Case (15 items) ─────────────────────────────────────────
  { name: 'NZXT H5 Flow', category: 'Case', price: 3290.00, stock: 20, slug: 'case-h5flow', brand: 'NZXT', specs: { max_gpu_length_mm: 365, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' } },
  { name: 'Fractal Design North', category: 'Case', price: 6890.00, stock: 10, slug: 'case-north', brand: 'Fractal Design', specs: { max_gpu_length_mm: 355, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Charcoal Black' } },
  { name: 'Corsair 4000D Airflow', category: 'Case', price: 3890.00, stock: 25, slug: 'case-4000d', brand: 'Corsair', specs: { max_gpu_length_mm: 360, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' } },
  { name: 'Lian Li O11 Dynamic EVO', category: 'Case', price: 6490.00, stock: 15, slug: 'case-o11evo', brand: 'Lian Li', specs: { max_gpu_length_mm: 426, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'White' } },
  { name: 'Cooler Master NR200P', category: 'Case', price: 3490.00, stock: 18, slug: 'case-nr200p', brand: 'Cooler Master', specs: { max_gpu_length_mm: 330, form_factor: ['ITX'], color: 'Black' } },
  { name: 'Corsair 3000D Airflow', category: 'Case', price: 2890.00, stock: 30, slug: 'case-corsair-3000d', brand: 'Corsair', specs: { max_gpu_length_mm: 360, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' } },
  { name: 'Cooler Master MasterBox Q300L', category: 'Case', price: 1490.00, stock: 40, slug: 'case-cm-q300l', brand: 'Cooler Master', specs: { max_gpu_length_mm: 360, form_factor: ['mATX', 'ITX'], color: 'Black' } },
  { name: 'NZXT H7 Flow', category: 'Case', price: 4490.00, stock: 15, slug: 'case-nzxt-h7flow', brand: 'NZXT', specs: { max_gpu_length_mm: 400, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' } },
  { name: 'NZXT H6 Flow', category: 'Case', price: 3990.00, stock: 22, slug: 'case-nzxt-h6flow', brand: 'NZXT', specs: { max_gpu_length_mm: 365, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' } },
  { name: 'Fractal Design Pop Air', category: 'Case', price: 3295.00, stock: 18, slug: 'case-fd-popair', brand: 'Fractal Design', specs: { max_gpu_length_mm: 405, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' } },
  { name: 'Lian Li LANCOOL 216', category: 'Case', price: 3690.00, stock: 25, slug: 'case-lianli-lc216', brand: 'Lian Li', specs: { max_gpu_length_mm: 392, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' } },
  { name: 'Lian Li O11 Vision', category: 'Case', price: 5490.00, stock: 10, slug: 'case-lianli-o11vision', brand: 'Lian Li', specs: { max_gpu_length_mm: 455, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Chrome' } },
  { name: 'Montech AIR 903 MAX', category: 'Case', price: 2290.00, stock: 35, slug: 'case-montech-903max', brand: 'Montech', specs: { max_gpu_length_mm: 400, form_factor: ['ATX', 'mATX', 'ITX', 'E-ATX'], color: 'Black' } },
  { name: 'Montech Sky Two', category: 'Case', price: 2990.00, stock: 20, slug: 'case-montech-skytwo', brand: 'Montech', specs: { max_gpu_length_mm: 400, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' } },
  { name: 'Thermaltake Core P3 TG', category: 'Case', price: 4890.00, stock: 12, slug: 'case-tt-corep3', brand: 'Thermaltake', specs: { max_gpu_length_mm: 450, form_factor: ['ATX', 'mATX', 'ITX'], color: 'Black' } },

  // ── PSU (15 items) ──────────────────────────────────────────
  { name: 'Corsair CV650 650W 80+ Bronze', category: 'PSU', price: 1890.00, stock: 30, slug: 'psu-cv650', brand: 'Corsair', specs: { wattage: 650, efficiency_rating: '80+ Bronze', modular: 'Non-modular' } },
  { name: 'Corsair RM750x 750W 80+ Gold', category: 'PSU', price: 3890.00, stock: 25, slug: 'psu-rm750x', brand: 'Corsair', specs: { wattage: 750, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Corsair RM850x 850W 80+ Gold', category: 'PSU', price: 4890.00, stock: 18, slug: 'psu-rm850x', brand: 'Corsair', specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Seasonic Focus GX-1000 1000W 80+ Gold', category: 'PSU', price: 6490.00, stock: 12, slug: 'psu-gx1000', brand: 'Seasonic', specs: { wattage: 1000, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'be quiet! Dark Power 13 1000W 80+ Titanium', category: 'PSU', price: 8990.00, stock: 8, slug: 'psu-dp13', brand: 'be quiet!', specs: { wattage: 1000, efficiency_rating: '80+ Titanium', modular: 'Fully Modular' } },
  { name: 'MSI MAG A650BN 650W 80+ Bronze', category: 'PSU', price: 1990.00, stock: 45, slug: 'psu-msi-a650bn', brand: 'MSI', specs: { wattage: 650, efficiency_rating: '80+ Bronze', modular: 'Non-modular' } },
  { name: 'MSI MAG A750GL 750W 80+ Gold', category: 'PSU', price: 3290.00, stock: 30, slug: 'psu-msi-a750gl', brand: 'MSI', specs: { wattage: 750, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'MSI MAG A850GL 850W 80+ Gold', category: 'PSU', price: 3890.00, stock: 24, slug: 'psu-msi-a850gl', brand: 'MSI', specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Seasonic B12 BC-650 650W 80+ Bronze', category: 'PSU', price: 2190.00, stock: 35, slug: 'psu-seasonic-b12-650', brand: 'Seasonic', specs: { wattage: 650, efficiency_rating: '80+ Bronze', modular: 'Non-modular' } },
  { name: 'Seasonic Focus GX-750 750W 80+ Gold', category: 'PSU', price: 3790.00, stock: 28, slug: 'psu-seasonic-gx750', brand: 'Seasonic', specs: { wattage: 750, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Seasonic Focus GX-850 850W 80+ Gold', category: 'PSU', price: 4490.00, stock: 20, slug: 'psu-seasonic-gx850', brand: 'Seasonic', specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Corsair RM1000x 1000W 80+ Gold', category: 'PSU', price: 6590.00, stock: 15, slug: 'psu-corsair-rm1000x', brand: 'Corsair', specs: { wattage: 1000, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Corsair SF750 750W 80+ Platinum', category: 'PSU', price: 5890.00, stock: 12, slug: 'psu-corsair-sf750', brand: 'Corsair', specs: { wattage: 750, efficiency_rating: '80+ Platinum', modular: 'Fully Modular' } },
  { name: 'Thermaltake Toughpower GF3 850W', category: 'PSU', price: 4290.00, stock: 18, slug: 'psu-tt-gf3-850', brand: 'Thermaltake', specs: { wattage: 850, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
  { name: 'Thermaltake Toughpower GF3 1000W', category: 'PSU', price: 5490.00, stock: 10, slug: 'psu-tt-gf3-1000', brand: 'Thermaltake', specs: { wattage: 1000, efficiency_rating: '80+ Gold', modular: 'Fully Modular' } },
];

async function main() {
  console.log('[migrate] Safe Brand & Product Expansion starting...');
  
  try {
    // 1. Ensure brand column exists
    await pool.query(
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(100) NOT NULL DEFAULT 'Generic'`
    );

    // 2. Load existing product names to avoid duplicates
    const existingNames = new Set((await pool.query<{ name: string }>('SELECT name FROM products')).rows.map(r => r.name));
    
    console.log('[migrate] Seeding expanded catalog (preserving existing)...');
    let insertedCount = 0;
    
    for (const p of PRODUCTS) {
      if (existingNames.has(p.name)) {
        continue;
      }
      
      await pool.query(
        `INSERT INTO products (name, category, price, stock_quantity, image_url, specifications, brand)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          p.name,
          p.category,
          p.price,
          p.stock,
          `/images/products/${p.slug}.webp`,
          JSON.stringify(p.specs),
          p.brand || 'Generic'
        ]
      );
      insertedCount++;
    }

    console.log(`\n✅ Safe migration complete! Seeded ${insertedCount} new products. Existing data preserved.`);
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
