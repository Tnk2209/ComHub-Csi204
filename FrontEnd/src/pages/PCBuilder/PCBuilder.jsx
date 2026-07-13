import React, { useState, useMemo } from 'react';
import { 
  Cpu as CpuIcon, 
  Layers as MbIcon, 
  Server as RamIcon, 
  HardDrive as SsdIcon, 
  Monitor as GpuIcon, 
  Box as CaseIcon, 
  Zap as PsuIcon, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Plus, 
  Share2, 
  ShoppingCart, 
  Info, 
  RotateCcw, 
  X,
  Sparkles
} from 'lucide-react';

// Mock database of PC Components
const COMPONENT_DATABASE = {
  cpu: [
    { id: 'cpu-1', name: 'Intel Core i7-14700K', price: 409.00, tdp: 125, socket: 'LGA1700', details: '20 Cores (8 P-Cores + 12 E-Cores), Up to 5.6 GHz' },
    { id: 'cpu-2', name: 'AMD Ryzen 7 7800X3D', price: 369.00, tdp: 120, socket: 'AM5', details: '8 Cores / 16 Threads, 3D V-Cache, Best for Gaming' },
    { id: 'cpu-3', name: 'AMD Ryzen 5 7600', price: 199.00, tdp: 65, socket: 'AM5', details: '6 Cores / 12 Threads, Up to 5.1 GHz, Includes Cooler' },
  ],
  gpu: [
    { id: 'gpu-1', name: 'NVIDIA RTX 4090 Founders Edition', price: 1599.00, tdp: 450, length: 340, details: '24GB GDDR6X, Ada Lovelace, DLSS 3, Ray Tracing' },
    { id: 'gpu-2', name: 'NVIDIA RTX 4070 Ti Super', price: 799.00, tdp: 285, length: 310, details: '16GB GDDR6X, Dual Fan, Excellent 1440p & 4K' },
    { id: 'gpu-3', name: 'AMD Radeon RX 7800 XT', price: 499.00, tdp: 263, length: 280, details: '16GB GDDR6, FSR 3, Competitive Performance' },
  ],
  motherboard: [
    { id: 'mb-1', name: 'ASUS ROG STRIX B650-A GAMING WIFI', price: 219.00, tdp: 30, socket: 'AM5', ramType: 'DDR5', details: 'ATX Form Factor, PCIe 5.0, WiFi 6E' },
    { id: 'mb-2', name: 'MSI PRO Z790-A MAX WIFI', price: 209.00, tdp: 35, socket: 'LGA1700', ramType: 'DDR5', details: 'ATX, PCIe 5.0, Heavy Duty VRMs' },
    { id: 'mb-3', name: 'Gigabyte B650 AORUS ELITE AX', price: 199.00, tdp: 30, socket: 'AM5', ramType: 'DDR5', details: 'ATX, Dual PCIe 4.0 M.2 slots, Sleek Black Design' },
  ],
  ram: [
    { id: 'ram-1', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', price: 110.00, tdp: 10, details: 'CL30, Intel XMP & AMD EXPO Compatible' },
    { id: 'ram-2', name: 'G.Skill Trident Z5 Neo 32GB (2x16GB) DDR5 6400MHz', price: 125.00, tdp: 12, details: 'CL32, Premium aluminum spreaders, RGB sync' },
  ],
  storage: [
    { id: 'ssd-1', name: 'Samsung 990 Pro 2TB NVMe M.2 SSD', price: 170.00, tdp: 8, details: 'Read Up to 7450 MB/s, Write Up to 6900 MB/s' },
    { id: 'ssd-2', name: 'Crucial T500 2TB PCIe Gen4 NVMe SSD', price: 140.00, tdp: 7, details: 'Read Up to 7400 MB/s, Write Up to 7000 MB/s' },
  ],
  case: [
    { id: 'case-1', name: 'NZXT H9 Flow Dual-Chamber Mid-Tower', price: 159.00, tdp: 0, maxGpuLength: 435, details: 'Panoramic glass panels, 4x 120mm fans included' },
    { id: 'case-2', name: 'Corsair 4000D Airflow Tempered Glass', price: 104.00, tdp: 0, maxGpuLength: 360, details: 'High-airflow front panel, cable routing channels' },
  ],
  psu: [
    { id: 'psu-1', name: 'Corsair RM850x 850W 80+ Gold Fully Modular', price: 149.00, tdp: 0, wattage: 850, efficiency: 'Gold', details: 'ATX 3.0 Compatible, Zero RPM fan mode' },
    { id: 'psu-2', name: 'Seasonic Focus GX-750 750W 80+ Gold Modular', price: 119.00, tdp: 0, wattage: 750, efficiency: 'Gold', details: 'Compact ATX size, high reliability japanese caps' },
    { id: 'psu-3', name: 'MSI MAG A650BN 650W 80+ Bronze Non-Modular', price: 59.00, tdp: 0, wattage: 650, efficiency: 'Bronze', details: 'Budget friendly, DC-to-DC circuit design' },
  ],
};

function PCBuilder({ onNavigate }) {
  // State for selected components
  const [selectedParts, setSelectedParts] = useState({
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    case: null,
    psu: null,
  });

  // Modal selector states
  const [activeCategory, setActiveCategory] = useState(null);

  // Reset all selections
  const handleReset = () => {
    setSelectedParts({
      cpu: null,
      gpu: null,
      motherboard: null,
      ram: null,
      storage: null,
      case: null,
      psu: null,
    });
  };

  // Add component to build
  const selectComponent = (category, item) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: item
    }));
    setActiveCategory(null);
  };

  // Remove component from build
  const removeComponent = (category) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: null
    }));
  };

  // Compatibility Calculations
  const buildCompatibility = useMemo(() => {
    const checks = {
      socket: { status: 'idle', message: 'กรุณาเลือก CPU และ Motherboard เพื่อวิเคราะห์ความเข้ากันได้' },
      power: { status: 'idle', message: 'เลือกชิ้นส่วนและพาวเวอร์ซัพพลายเพื่อตรวจเช็คกระแสไฟ' },
      clearance: { status: 'idle', message: 'เลือกการ์ดจอและเคสคอมพิวเตอร์เพื่อตรวจขนาดทางกายภาพ' }
    };

    const cpu = selectedParts.cpu;
    const mb = selectedParts.motherboard;
    const gpu = selectedParts.gpu;
    const computerCase = selectedParts.case;
    const psu = selectedParts.psu;

    // 1. Socket Check
    if (cpu && mb) {
      if (cpu.socket === mb.socket) {
        checks.socket = {
          status: 'success',
          message: `เข้ากันได้: ทั้ง CPU และ เมนบอร์ด ใช้ซ็อกเก็ต ${cpu.socket} ตรงกัน`
        };
      } else {
        checks.socket = {
          status: 'error',
          message: `ขั้วเชื่อมพอร์ตไม่ตรงกัน: CPU ใช้ ${cpu.socket} แต่เมนบอร์ดใช้ ${mb.socket}! ไม่สามารถประกอบร่วมกันได้`
        };
      }
    }

    // 2. Power Analysis (TDP calculations)
    let totalTdp = 0;
    if (cpu) totalTdp += cpu.tdp;
    if (gpu) totalTdp += gpu.tdp;
    if (mb) totalTdp += mb.tdp;
    if (selectedParts.ram) totalTdp += selectedParts.ram.tdp || 10;
    if (selectedParts.storage) totalTdp += selectedParts.storage.tdp || 10;
    totalTdp += 30; // safety baseline for fans & controllers

    if (psu) {
      const loadPercentage = (totalTdp / psu.wattage) * 100;
      if (totalTdp > psu.wattage) {
        checks.power = {
          status: 'error',
          message: `กระแสไฟโหลดเกินขีดจำกัด! อุปกรณ์ต้องการไฟอย่างน้อย ~${totalTdp}W แต่ PSU ให้ได้แค่ ${psu.wattage}W`
        };
      } else if (loadPercentage > 80) {
        checks.power = {
          status: 'warning',
          message: `กระแสไฟโหลดสูงระดับ ${Math.round(loadPercentage)}% ของพาวเวอร์ซัพพลาย แนะนำให้อัปเกรดเพื่อเผื่อความปลอดภัย 20% (Safety Buffer)`
        };
      } else {
        checks.power = {
          status: 'success',
          message: `กำลังไฟปลอดภัย: ใช้กำลังไฟรวมประมาณ ~${totalTdp}W จากพาวเวอร์ซัพพลายขนาด ${psu.wattage}W (โหลดเพียง ${Math.round(loadPercentage)}%)`
        };
      }
    } else {
      if (totalTdp > 30) {
        checks.power = {
          status: 'warning',
          message: `ชิ้นส่วนที่เลือกต้องการกำลังไฟอย่างน้อย ~${totalTdp}W แนะนำให้เลือกพาวเวอร์ซัพพลายขนาด ${Math.ceil((totalTdp * 1.25) / 50) * 50}W ขึ้นไป`
        };
      }
    }

    // 3. Physical Clearance (GPU Length vs Case limit)
    if (gpu && computerCase) {
      if (gpu.length > computerCase.maxGpuLength) {
        checks.clearance = {
          status: 'error',
          message: `การ์ดจอมีความยาว ${gpu.length}mm ซึ่งเกินขนาดการ์ดจอสูงสุดที่เคสรองรับได้ (${computerCase.maxGpuLength}mm)!`
        };
      } else {
        checks.clearance = {
          status: 'success',
          message: `ประกอบลงเคสได้แน่นอน: การ์ดจอ (${gpu.length}mm) สั้นกว่าขนาดสูงสุดของเคส (${computerCase.maxGpuLength}mm)`
        };
      }
    }

    return {
      checks,
      totalTdp,
      totalCost: Object.values(selectedParts).reduce((sum, item) => sum + (item ? item.price : 0), 0)
    };
  }, [selectedParts]);

  // Performance Estimates
  const performanceInfo = useMemo(() => {
    const gpu = selectedParts.gpu;
    if (!gpu) return { fps: 'N/A', rating: 'N/A' };
    
    let fps = '60 FPS';
    let rating = 'Standard';

    if (gpu.id === 'gpu-1') {
      fps = '144 FPS';
      rating = 'Extreme Gold';
    } else if (gpu.id === 'gpu-2') {
      fps = '110 FPS';
      rating = 'Ultra Silver';
    } else if (gpu.id === 'gpu-3') {
      fps = '90 FPS';
      rating = 'High Bronze';
    }

    return { fps, rating };
  }, [selectedParts.gpu]);

  // Component configuration
  const categories = {
    cpu: { label: 'CPU (หน่วยประมวลผล)', icon: CpuIcon },
    motherboard: { label: 'Motherboard (เมนบอร์ด)', icon: MbIcon },
    gpu: { label: 'GPU (การ์ดจอ)', icon: GpuIcon },
    ram: { label: 'Memory (แรม)', icon: RamIcon },
    storage: { label: 'Storage (ไดรฟ์ข้อมูล)', icon: SsdIcon },
    case: { label: 'PC Case (เคสคอมพิวเตอร์)', icon: CaseIcon },
    psu: { label: 'Power Supply (พาวเวอร์ซัพพลาย)', icon: PsuIcon },
  };

  const renderLeftColumnBentoCard = (key) => {
    const selectedItem = selectedParts[key];
    const Icon = categories[key].icon;
    
    return (
      <div 
        key={key}
        className={`bg-[#161a1f]/70 backdrop-blur-md border rounded-xl p-4 transition-all flex flex-col justify-between min-h-[110px] hover:-translate-y-0.5 ${
          selectedItem 
            ? 'border-[#00c2ff]/30 shadow-[0_0_10px_rgba(0,194,255,0.03)] bg-[#161a1f]/90' 
            : 'border-[#222a36] hover:border-gray-700'
        }`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-grow">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
              {categories[key].label}
            </span>
            {selectedItem ? (
              <div className="min-w-0">
                <h4 className="text-white font-bold text-xs sm:text-sm truncate">{selectedItem.name}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.socket && (
                    <span className="text-[8px] font-bold bg-[#222a36] text-gray-400 px-1 py-0.2 rounded">
                      {selectedItem.socket}
                    </span>
                  )}
                  {selectedItem.tdp > 0 && (
                    <span className="text-[8px] font-bold bg-[#222a36] text-gray-400 px-1 py-0.2 rounded">
                      {selectedItem.tdp}W
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-xs block">ยังไม่ได้เลือกอุปกรณ์</span>
            )}
          </div>
          <div className={`p-1.5 rounded-lg flex-shrink-0 ${selectedItem ? 'bg-[#00c2ff]/10 text-[#00c2ff]' : 'bg-[#0d0f12] text-gray-600'}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#222a36] pt-2 mt-2">
          {selectedItem ? (
            <>
              <span className="text-white font-extrabold text-xs">
                ${selectedItem.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <button 
                onClick={() => removeComponent(key)}
                className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                title="ลบชิ้นส่วนออก"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <span className="text-[10px] text-gray-600">ว่าง</span>
              <button 
                onClick={() => setActiveCategory(key)}
                className="bg-[#222a36]/60 hover:bg-[#00c2ff] hover:text-slate-950 text-gray-300 text-[9px] font-bold px-2 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                เลือกชิ้นส่วน
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#222a36] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#00c2ff] text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            Digital Lab v2.4.1 - 3-Column Bento Blueprint
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Configuration</h1>
          <p className="text-gray-400 text-sm mt-1">จัดชุดคอมพิวเตอร์ด้วยการตรวจสเปคและกำลังไฟสะสมแบบเรียลไทม์</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 border border-[#222a36] hover:border-gray-500 hover:bg-[#161a1f] text-gray-300 font-medium px-4 py-2.5 rounded transition-all text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            ล้างสเปคทั้งหมด
          </button>
          <button 
            onClick={() => alert('บันทึกสเปคลงบอร์ดคอมมูนิตี้เรียบร้อย!')}
            className="flex items-center gap-2 border border-[#00c2ff]/30 text-[#00c2ff] hover:bg-[#00c2ff]/10 font-semibold px-4 py-2.5 rounded transition-all text-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            แชร์สเปคสู่คอมมูนิตี้
          </button>
        </div>
      </div>

      {/* 3-Column Layout: Left (Menu Selection) | Middle (PC Case Blueprint) | Right (Health Checks & Checkout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ================= COLUMN 1: LEFT - hardware menus (Span 3 = 25%) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-[#161a1f]/30 border border-[#222a36] rounded-2xl p-4 flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2 mb-1 border-b border-[#222a36] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">📦 รายการเลือกชิ้นส่วน (Component Selector)</span>
            </div>
            {Object.keys(categories).map((key) => renderLeftColumnBentoCard(key))}
          </div>
        </div>

        {/* ================= COLUMN 2: MIDDLE - Case blueprint schematic (Span 6 = 50%) ================= */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-[#161a1f]/40 border border-[#222a36] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between items-center h-full min-h-[500px]">
            
            {/* Background radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(0,194,255,0.06),rgba(0,0,0,0))] pointer-events-none"></div>
            
            <div className="flex justify-between items-center w-full z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00c2ff] animate-pulse"></div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Chassis Blueprint (ผังประกอบเคสแนวตั้ง)</span>
              </div>
              <span className="text-[9px] bg-[#222a36] text-gray-400 px-2 py-0.5 rounded font-mono">TOWER VIEW</span>
            </div>

            {/* Vertical PC Case Tower SVG Schematic */}
            <div className="w-full max-w-[280px] flex-grow flex items-center justify-center relative z-10 py-6">
              <svg viewBox="0 0 300 400" className="w-full h-full max-h-[380px] text-gray-700">
                {/* 1. PC Case Outer Frame (Vertical Mid-Tower shape) */}
                <rect 
                  x="15" y="15" width="270" height="370" rx="10" 
                  fill="none" 
                  stroke={selectedParts.case ? '#00c2ff' : '#222a36'} 
                  strokeWidth="2.5" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.case ? 'drop-shadow(0 0 6px rgba(0, 194, 255, 0.25))' : 'none' }}
                />
                
                {/* Rear Exhaust Fan (Top Left) */}
                <circle 
                  cx="45" cy="85" r="18" fill="none" 
                  stroke={selectedParts.case ? '#00c2ff' : '#222a36'} 
                  strokeWidth="1.5"
                  className={`transition-colors duration-300 ${selectedParts.case ? 'animate-[spin_4s_linear_infinite]' : ''}`} 
                  style={{ transformOrigin: '45px 85px' }}
                />
                <line x1="45" y1="67" x2="45" y2="103" stroke={selectedParts.case ? '#00c2ff' : '#222a36'} strokeWidth="1" />
                <line x1="27" y1="85" x2="63" y2="85" stroke={selectedParts.case ? '#00c2ff' : '#222a36'} strokeWidth="1" />

                {/* Front Intake Fans (Right side, 3 fans vertical) */}
                {[90, 165, 240].map((cy, i) => (
                  <circle 
                    key={i}
                    cx="255" cy={cy} r="20" fill="none" 
                    stroke={selectedParts.case ? '#00c2ff' : '#222a36'} 
                    strokeWidth="1.5"
                    className={`transition-colors duration-300 ${selectedParts.case ? 'animate-[spin_4s_linear_infinite]' : ''}`} 
                    style={{ transformOrigin: `255px ${cy}px` }}
                  />
                ))}

                {/* 2. Motherboard Board Area */}
                <rect 
                  x="80" y="45" width="150" height="230" rx="4" 
                  fill="none" 
                  stroke={selectedParts.motherboard ? '#00c2ff' : '#2d333f'} 
                  strokeWidth="2" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.motherboard ? 'drop-shadow(0 0 5px rgba(0, 194, 255, 0.2))' : 'none' }}
                />
                
                {/* Motherboard socket text */}
                <text x="155" y="55" fill="#2d333f" fontSize="7" textAnchor="middle" fontWeight="bold">ATX FORM FACTOR</text>

                {/* 3. CPU Socket & Fan Cooler */}
                <rect 
                  x="115" y="70" width="55" height="55" rx="2" 
                  fill={selectedParts.cpu ? 'rgba(0,194,255,0.06)' : 'none'} 
                  stroke={selectedParts.cpu ? '#00c2ff' : '#2d333f'} 
                  strokeWidth="1.5" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.cpu ? 'drop-shadow(0 0 8px rgba(0, 194, 255, 0.35))' : 'none' }}
                />
                <text 
                  x="142" y="102" 
                  fill={selectedParts.cpu ? '#00c2ff' : '#475569'} 
                  fontSize="9" fontWeight="bold" textAnchor="middle"
                  className="transition-colors duration-300 font-mono"
                >
                  {selectedParts.cpu ? 'CPU' : 'SOCKET'}
                </text>

                {/* 4. RAM Slots (4 vertical bars to the right of CPU) */}
                {[0, 1, 2, 3].map((i) => (
                  <rect 
                    key={i}
                    x={185 + (i * 6)} y="65" width="3" height="65" rx="0.5" 
                    fill={selectedParts.ram ? 'rgba(0,194,255,0.2)' : 'none'} 
                    stroke={selectedParts.ram ? '#00c2ff' : '#2d333f'} 
                    strokeWidth="0.8" 
                    className="transition-all duration-300"
                    style={{ filter: selectedParts.ram ? 'drop-shadow(0 0 4px rgba(0, 194, 255, 0.3))' : 'none' }}
                  />
                ))}

                {/* 5. PCIe GPU Slot & Mounted GPU Card */}
                <rect 
                  x="90" y="155" width="130" height="3" 
                  fill="#2d333f" 
                />
                {selectedParts.gpu ? (
                  <rect 
                    x="85" y="145" width="165" height="32" rx="3" 
                    fill="rgba(0,194,255,0.1)" 
                    stroke="#00c2ff" 
                    strokeWidth="1.5" 
                    className="transition-all duration-300"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0, 194, 255, 0.4))' }}
                  />
                ) : null}
                <text 
                  x="155" y="163" 
                  fill={selectedParts.gpu ? '#00c2ff' : '#475569'} 
                  fontSize="8" fontWeight="bold" textAnchor="middle"
                  className="transition-colors duration-300 font-mono"
                >
                  {selectedParts.gpu ? 'GPU ON PCIe' : 'PCIe SLOT'}
                </text>

                {/* 6. M.2 Storage SSD Indicator slot */}
                <rect 
                  x="115" y="195" width="40" height="10" rx="1" 
                  fill={selectedParts.storage ? 'rgba(0,194,255,0.15)' : 'none'} 
                  stroke={selectedParts.storage ? '#00c2ff' : '#2d333f'} 
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <text x="135" y="202" fill={selectedParts.storage ? '#00c2ff' : '#475569'} fontSize="6" textAnchor="middle" fontWeight="bold">M.2 SSD</text>

                {/* 7. PSU Power Shroud Cover (Bottom Compartment) */}
                <rect 
                  x="25" y="315" width="250" height="55" rx="4" 
                  fill={selectedParts.psu ? 'rgba(0,194,255,0.06)' : 'none'} 
                  stroke={selectedParts.psu ? '#00c2ff' : '#2d333f'} 
                  strokeWidth="1.5" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.psu ? 'drop-shadow(0 0 6px rgba(0, 194, 255, 0.25))' : 'none' }}
                />
                <text 
                  x="150" y="347" 
                  fill={selectedParts.psu ? '#00c2ff' : '#475569'} 
                  fontSize="9" fontWeight="bold" textAnchor="middle"
                  className="transition-colors duration-300 font-mono"
                >
                  {selectedParts.psu ? 'PSU POWER SHROUD' : 'PSU CHAMBER'}
                </text>
              </svg>
            </div>

            {/* Micro-legends at the bottom */}
            <div className="flex flex-wrap justify-center gap-3 text-[9px] text-gray-500 z-10 border-t border-[#222a36] pt-3 w-full">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.cpu ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                CPU
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.motherboard ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                Board
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.gpu ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                GPU
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.ram ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                RAM
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.storage ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                SSD
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.case ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                Case
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.psu ? 'bg-[#00c2ff]' : 'bg-gray-700'}`}></span>
                PSU
              </span>
            </div>

          </div>
        </div>

        {/* ================= COLUMN 3: RIGHT - health analyses & checkout (Span 3 = 25%) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Health check card */}
          <div className="bg-[#161a1f] border border-[#222a36] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-emerald-400">🩺</span> Health Check
            </h3>
            <div className="flex flex-col gap-4">
              
              {/* Socket Validation */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {buildCompatibility.checks.socket.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : buildCompatibility.checks.socket.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Info className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Socket Compatibility</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{buildCompatibility.checks.socket.message}</p>
                </div>
              </div>

              {/* Power level Warning */}
              <div className="flex gap-3 border-t border-[#222a36] pt-4">
                <div className="flex-shrink-0 mt-0.5">
                  {buildCompatibility.checks.power.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : buildCompatibility.checks.power.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : buildCompatibility.checks.power.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Info className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">TDP Power Warning</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{buildCompatibility.checks.power.message}</p>
                </div>
              </div>

              {/* Physical clearance (GPU Size) */}
              <div className="flex gap-3 border-t border-[#222a36] pt-4">
                <div className="flex-shrink-0 mt-0.5">
                  {buildCompatibility.checks.clearance.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : buildCompatibility.checks.clearance.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Info className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Physical Clearance</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{buildCompatibility.checks.clearance.message}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Power Analysis card */}
          <div className="bg-[#161a1f] border border-[#222a36] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-[#00c2ff]">⚡</span> Power Analysis
            </h3>
            
            {/* Wattage bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                <span>กำลังไฟโหลดรวม</span>
                <span>
                  {buildCompatibility.totalTdp}W {selectedParts.psu ? `/ ${selectedParts.psu.wattage}W` : ''}
                </span>
              </div>
              <div className="w-full bg-[#0d0f12] rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    !selectedParts.psu ? 'bg-amber-500' :
                    (buildCompatibility.totalTdp / selectedParts.psu.wattage) > 1.0 ? 'bg-rose-500' :
                    (buildCompatibility.totalTdp / selectedParts.psu.wattage) > 0.8 ? 'bg-amber-400' : 'bg-[#00c2ff]'
                  }`}
                  style={{ 
                    width: `${Math.min(
                      selectedParts.psu 
                        ? (buildCompatibility.totalTdp / selectedParts.psu.wattage) * 100 
                        : (buildCompatibility.totalTdp / 1000) * 100, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
              {selectedParts.psu && (
                <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
                  <span>Current Load</span>
                  <span>Safety Buffer (20%)</span>
                </div>
              )}
            </div>

            {/* Estimated Total Price & Checkout */}
            <div className="border-t border-[#222a36] pt-4 mt-6">
              <span className="text-xs text-gray-500 block mb-1">Estimated Total</span>
              <h2 className="text-3xl font-extrabold text-white mb-6 font-mono">
                ${buildCompatibility.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <button 
                onClick={() => alert(`ดำเนินการสั่งซื้อสำเร็จ! ยอดรวมคือ $${buildCompatibility.totalCost}`)}
                disabled={buildCompatibility.totalCost === 0}
                className={`w-full text-slate-950 font-bold py-3.5 px-4 rounded-xl text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  buildCompatibility.totalCost > 0 
                    ? 'bg-[#00c2ff] hover:bg-[#00c2ff]/90 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(0,194,255,0.2)]' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Checkout System
              </button>
            </div>
          </div>

          {/* Benchmark Estimation card */}
          <div className="bg-[#161a1f] border border-[#222a36] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-amber-400">🎮</span> Benchmark Estimate
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0d0f12]/50 p-4 rounded-xl border border-[#222a36]">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">4K Gaming</span>
                <span className="text-white font-extrabold text-xl font-mono">{performanceInfo.fps}</span>
              </div>
              <div className="bg-[#0d0f12]/50 p-4 rounded-xl border border-[#222a36]">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Efficiency</span>
                <span className="text-[#00c2ff] font-extrabold text-sm block mt-1">{performanceInfo.rating}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Component Selection Drawer / Modal */}
      {activeCategory && (
        <div className="fixed inset-0 z-50 bg-[#0d0f12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a1f] border border-[#222a36] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#222a36] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white capitalize">เลือก {categories[activeCategory].label}</h3>
                <p className="text-xs text-gray-400 mt-1">เลือกฮาร์ดแวร์ไอทีที่ต้องการเพื่อติดตั้งลงสเปค</p>
              </div>
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#222a36] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Items list */}
            <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-3">
              {COMPONENT_DATABASE[activeCategory]?.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#0d0f12]/60 border border-[#222a36] hover:border-[#00c2ff]/40 p-4 rounded-xl flex justify-between items-center gap-4 transition-all hover:shadow-[0_0_12px_rgba(0,194,255,0.02)]"
                >
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-base block">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.details}</p>
                    <div className="flex gap-2 mt-2">
                      {item.socket && (
                        <span className="text-[10px] font-bold bg-[#161a1f] text-gray-400 border border-[#222a36] px-2 py-0.5 rounded">
                          Socket: {item.socket}
                        </span>
                      )}
                      {item.tdp > 0 && (
                        <span className="text-[10px] font-bold bg-[#161a1f] text-gray-400 border border-[#222a36] px-2 py-0.5 rounded">
                          TDP: {item.tdp}W
                        </span>
                      )}
                      {item.length && (
                        <span className="text-[10px] font-bold bg-[#161a1f] text-gray-400 border border-[#222a36] px-2 py-0.5 rounded">
                          Length: {item.length}mm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-white font-extrabold text-lg font-mono">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <button 
                      onClick={() => selectComponent(activeCategory, item)}
                      className="bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      เลือก
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default PCBuilder;
