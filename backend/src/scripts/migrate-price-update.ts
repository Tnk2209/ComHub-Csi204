import 'dotenv/config';
import { pool } from '../config/db';

/**
 * Price Update Script — Thai Market Prices (THB)
 * Updates product prices to reflect current Thai market retail prices.
 * Safe: only UPDATEs by product name, no data deletion.
 */

const PRICE_UPDATES: { name: string; price: number }[] = [
  // ── CPU ──────────────────────────────────────
  { name: 'Intel Core i5-14600K',         price: 12490 },
  { name: 'Intel Core i7-14700K',          price: 15990 },
  { name: 'Intel Core i9-14900K',          price: 22900 },
  { name: 'AMD Ryzen 5 7600X',             price: 9990  },
  { name: 'AMD Ryzen 7 7800X3D',           price: 16990 },
  { name: 'Intel Core i3-14100',           price: 4490  },
  { name: 'Intel Core i5-12400F',          price: 4190  },
  { name: 'Intel Core i5-13400F',          price: 7190  },
  { name: 'Intel Core i7-13700K',          price: 13900 },
  { name: 'Intel Core i9-13900K',          price: 18900 },
  { name: 'AMD Ryzen 5 5600X',             price: 5190  },
  { name: 'AMD Ryzen 7 5700X',             price: 6890  },
  { name: 'AMD Ryzen 7 7700X',             price: 11900 },
  { name: 'AMD Ryzen 9 7900X',             price: 14900 },
  { name: 'AMD Ryzen 9 7950X',             price: 18500 },

  // ── Mainboard ─────────────────────────────────
  { name: 'ASUS ROG STRIX Z790-E GAMING',        price: 16990 },
  { name: 'MSI PRO Z790-A WIFI',                 price: 9990  },
  { name: 'GIGABYTE B760M DS3H DDR4',            price: 3990  },
  { name: 'ASUS ROG STRIX X670E-F GAMING',       price: 16990 },
  { name: 'MSI MAG B650 TOMAHAWK WIFI',          price: 8490  },
  { name: 'ASUS PRIME H610M-K DDR4',             price: 2390  },
  { name: 'GIGABYTE H610M S2H V2 DDR4',          price: 2390  },
  { name: 'MSI PRO B760M-P DDR4',                price: 3490  },
  { name: 'ASUS TUF GAMING B760M-PLUS WIFI',     price: 6290  },
  { name: 'GIGABYTE Z790 AORUS ELITE AX',        price: 10490 },
  { name: 'MSI MAG B550 TOMAHAWK',               price: 5490  },
  { name: 'ASUS PRIME B550M-K',                  price: 2990  },
  { name: 'GIGABYTE B650 GAMING X AX',           price: 6990  },
  { name: 'ASUS TUF GAMING B650-PLUS WIFI',      price: 7490  },
  { name: 'GIGABYTE X670 AORUS ELITE AX',        price: 12490 },

  // ── GPU ───────────────────────────────────────
  { name: 'ASUS ROG Strix GeForce RTX 4090 OC',             price: 79900 },
  { name: 'MSI GeForce RTX 4090 SUPRIM X',                  price: 76900 },
  { name: 'GIGABYTE GeForce RTX 4090 AORUS Master',         price: 75900 },
  { name: 'ZOTAC GAMING GeForce RTX 4090 Trinity',          price: 69900 },
  { name: 'ASUS TUF Gaming GeForce RTX 4080 SUPER',         price: 44900 },
  { name: 'MSI GeForce RTX 4080 SUPER GAMING X SLIM',       price: 43500 },
  { name: 'GIGABYTE GeForce RTX 4080 SUPER EAGLE OC',       price: 42500 },
  { name: 'ZOTAC GAMING GeForce RTX 4080 SUPER Trinity',    price: 39900 },
  { name: 'ASUS ROG Strix GeForce RTX 4070 Ti SUPER',       price: 36900 },
  { name: 'MSI GeForce RTX 4070 Ti SUPER VENTUS 3X',        price: 34500 },
  { name: 'GIGABYTE GeForce RTX 4070 Ti SUPER WF3',         price: 33900 },
  { name: 'GALAX GeForce RTX 4070 Ti SUPER EX',             price: 31900 },
  { name: 'ASUS Dual GeForce RTX 4070 SUPER OC',            price: 26900 },
  { name: 'MSI GeForce RTX 4070 SUPER VENTUS 2X',           price: 25900 },
  { name: 'GIGABYTE GeForce RTX 4070 SUPER AERO OC',        price: 27900 },
  { name: 'ZOTAC GAMING GeForce RTX 4070 SUPER Twin',       price: 23900 },
  { name: 'ASUS TUF Gaming GeForce RTX 4060 Ti',            price: 16500 },
  { name: 'MSI GeForce RTX 4060 Ti VENTUS 3X OC',           price: 15900 },
  { name: 'GIGABYTE GeForce RTX 4060 Ti EAGLE OC',          price: 15500 },
  { name: 'ZOTAC GAMING GeForce RTX 4060 Ti Twin',          price: 14500 },
  { name: 'ASUS Dual GeForce RTX 4060 OC',                  price: 11990 },
  { name: 'MSI GeForce RTX 4060 VENTUS 2X BLACK',           price: 11490 },
  { name: 'GIGABYTE GeForce RTX 4060 WINDFORCE OC',         price: 10990 },
  { name: 'ZOTAC GAMING GeForce RTX 4060 Solo',             price: 9790  },
  { name: 'Sapphire NITRO+ Radeon RX 7900 XTX',             price: 39900 },
  { name: 'PowerColor Red Devil Radeon RX 7900 XTX',        price: 38900 },
  { name: 'Sapphire PULSE Radeon RX 7900 XT',               price: 29900 },
  { name: 'PowerColor Hellhound Radeon RX 7800 XT',         price: 19900 },
  { name: 'Sapphire PULSE Radeon RX 7700 XT',               price: 16900 },
  { name: 'Sapphire PULSE Radeon RX 7600 XT',               price: 13490 },

  // ── RAM ───────────────────────────────────────
  { name: 'Kingston Fury Beast DDR4 16GB (2x8) 3200MHz',     price: 1590 },
  { name: 'Corsair Vengeance LPX DDR4 32GB (2x16) 3600MHz',  price: 2890 },
  { name: 'G.SKILL Trident Z5 DDR5 32GB (2x16) 6000MHz',     price: 4990 },
  { name: 'Corsair Dominator Titanium DDR5 64GB (2x32)',      price: 9990 },
  { name: 'Kingston Fury Renegade DDR5 32GB (2x16) 7200MHz',  price: 5490 },
  { name: 'Kingston Fury Beast DDR4 8GB 3200MHz',             price: 890  },
  { name: 'Corsair Vengeance LPX DDR4 16GB (2x8) 3200MHz',   price: 1490 },
  { name: 'G.SKILL Ripjaws V DDR4 16GB (2x8) 3600MHz',       price: 1690 },
  { name: 'Kingston Fury Beast DDR4 32GB (2x16) 3200MHz',    price: 2990 },
  { name: 'Corsair Vengeance RGB DDR5 32GB (2x16) 5600MHz',  price: 4390 },
  { name: 'G.SKILL Ripjaws S5 DDR5 32GB (2x16) 6000MHz',     price: 4590 },
  { name: 'Kingston Fury Beast DDR5 16GB (2x8) 5200MHz',     price: 2490 },
  { name: 'Corsair Vengeance DDR5 32GB (2x16) 6000MHz',      price: 4790 },
  { name: 'G.SKILL Trident Z5 Neo DDR5 32GB (2x16) 6000MHz', price: 4990 },
  { name: 'Corsair Vengeance LPX DDR4 8GB 3200MHz',          price: 890  },

  // ── SSD ───────────────────────────────────────
  { name: 'Kingston NV2 500GB NVMe PCIe 4.0',    price: 1190 },
  { name: 'WD Blue SN580 1TB NVMe PCIe 4.0',     price: 2290 },
  { name: 'Samsung 990 Pro 1TB NVMe PCIe 4.0',   price: 4490 },
  { name: 'Crucial T705 2TB NVMe PCIe 5.0',      price: 9990 },
  { name: 'Samsung 870 EVO 1TB SATA',            price: 2790 },
  { name: 'WD Green 240GB M.2 SATA',             price: 690  },
  { name: 'Kingston A400 480GB SATA 2.5',        price: 990  },
  { name: 'Samsung 870 EVO 500GB SATA 2.5',      price: 1590 },
  { name: 'WD Blue SN580 500GB NVMe',            price: 1490 },
  { name: 'Kingston NV2 1TB NVMe PCIe 4.0',      price: 1990 },
  { name: 'WD Black SN850X 1TB NVMe',            price: 3490 },
  { name: 'Samsung 980 1TB NVMe PCIe 3.0',       price: 2490 },
  { name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0',   price: 6990 },
  { name: 'Crucial P3 Plus 1TB NVMe PCIe 4.0',   price: 2190 },
  { name: 'Crucial P3 Plus 2TB NVMe PCIe 4.0',   price: 3990 },

  // ── Case ──────────────────────────────────────
  { name: 'NZXT H5 Flow',                  price: 2990 },
  { name: 'Fractal Design North',          price: 6990 },
  { name: 'Corsair 4000D Airflow',         price: 3290 },
  { name: 'Lian Li O11 Dynamic EVO',       price: 6490 },
  { name: 'Cooler Master NR200P',          price: 3290 },
  { name: 'Corsair 3000D Airflow',         price: 2590 },
  { name: 'Cooler Master MasterBox Q300L', price: 1390 },
  { name: 'NZXT H7 Flow',                 price: 4290 },
  { name: 'NZXT H6 Flow',                 price: 3790 },
  { name: 'Fractal Design Pop Air',        price: 3190 },
  { name: 'Lian Li LANCOOL 216',           price: 3490 },
  { name: 'Lian Li O11 Vision',            price: 5390 },
  { name: 'Montech AIR 903 MAX',           price: 2190 },
  { name: 'Montech Sky Two',               price: 2890 },
  { name: 'Thermaltake Core P3 TG',        price: 4790 },

  // ── PSU ───────────────────────────────────────
  { name: 'Corsair CV650 650W 80+ Bronze',              price: 1790 },
  { name: 'Corsair RM750x 750W 80+ Gold',               price: 3990 },
  { name: 'Corsair RM850x 850W 80+ Gold',               price: 4990 },
  { name: 'Seasonic Focus GX-1000 1000W 80+ Gold',      price: 6490 },
  { name: 'be quiet! Dark Power 13 1000W 80+ Titanium', price: 8990 },
  { name: 'MSI MAG A650BN 650W 80+ Bronze',             price: 1890 },
  { name: 'MSI MAG A750GL 750W 80+ Gold',               price: 3190 },
  { name: 'MSI MAG A850GL 850W 80+ Gold',               price: 3790 },
  { name: 'Seasonic B12 BC-650 650W 80+ Bronze',        price: 2090 },
  { name: 'Seasonic Focus GX-750 750W 80+ Gold',        price: 3790 },
  { name: 'Seasonic Focus GX-850 850W 80+ Gold',        price: 4490 },
  { name: 'Corsair RM1000x 1000W 80+ Gold',             price: 6490 },
  { name: 'Corsair SF750 750W 80+ Platinum',            price: 5890 },
  { name: 'Thermaltake Toughpower GF3 850W',            price: 4290 },
  { name: 'Thermaltake Toughpower GF3 1000W',           price: 5290 },
];

async function main() {
  console.log('[price-update] Updating product prices to Thai market rates (THB)...\n');
  let updatedCount = 0;
  let skippedCount = 0;

  try {
    for (const item of PRICE_UPDATES) {
      const result = await pool.query(
        `UPDATE products SET price = $1 WHERE name = $2`,
        [item.price, item.name]
      );
      if ((result.rowCount ?? 0) > 0) {
        console.log(`  ✅ ฿${item.price.toLocaleString('th-TH')} — ${item.name}`);
        updatedCount++;
      } else {
        console.log(`  ⚠️  Not found: ${item.name}`);
        skippedCount++;
      }
    }

    console.log(`\n✅ Price update complete!`);
    console.log(`   Updated: ${updatedCount} products`);
    console.log(`   Not found: ${skippedCount} products`);
  } catch (err) {
    console.error('\n❌ Price update failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
