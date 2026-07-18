import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  ShoppingCart,
  Info,
  RotateCcw,
  X,
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
  const { t } = useTranslation();

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
      socket: { status: 'idle', message: t('builder.compat_rules.socket_idle') },
      power: { status: 'idle', message: t('builder.compat_rules.power_idle') },
      clearance: { status: 'idle', message: t('builder.compat_rules.clearance_idle') }
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
          message: t('builder.compat_rules.socket_match', { cpuSocket: cpu.socket })
        };
      } else {
        checks.socket = {
          status: 'error',
          message: t('builder.compat_rules.socket_mismatch', { cpuSocket: cpu.socket, mbSocket: mb.socket })
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
          message: t('builder.compat_rules.power_overload', { totalTdp, psuWattage: psu.wattage })
        };
      } else if (loadPercentage > 80) {
        checks.power = {
          status: 'warning',
          message: t('builder.compat_rules.power_warning', { loadPercentage: Math.round(loadPercentage) })
        };
      } else {
        checks.power = {
          status: 'success',
          message: t('builder.compat_rules.power_match', { totalTdp, psuWattage: psu.wattage, loadPercentage: Math.round(loadPercentage) })
        };
      }
    } else {
      if (totalTdp > 30) {
        checks.power = {
          status: 'warning',
          message: t('builder.compat_rules.power_need_psu', { totalTdp, recommendedWattage: Math.ceil((totalTdp * 1.25) / 50) * 50 })
        };
      }
    }

    // 3. Physical Clearance (GPU Length vs Case limit)
    if (gpu && computerCase) {
      if (gpu.length > computerCase.maxGpuLength) {
        checks.clearance = {
          status: 'error',
          message: t('builder.compat_rules.clearance_mismatch', { gpuLength: gpu.length, caseLimit: computerCase.maxGpuLength })
        };
      } else {
        checks.clearance = {
          status: 'success',
          message: t('builder.compat_rules.clearance_match', { gpuLength: gpu.length, caseLimit: computerCase.maxGpuLength })
        };
      }
    }

    return {
      checks,
      totalTdp,
      totalCost: Object.values(selectedParts).reduce((sum, item) => sum + (item ? item.price : 0), 0)
    };
  }, [selectedParts, t]);

  // Component configuration
  const categories = {
    cpu: { label: t('builder.categories.cpu'), icon: CpuIcon },
    motherboard: { label: t('builder.categories.motherboard'), icon: MbIcon },
    gpu: { label: t('builder.categories.gpu'), icon: GpuIcon },
    ram: { label: t('builder.categories.ram'), icon: RamIcon },
    storage: { label: t('builder.categories.storage'), icon: SsdIcon },
    case: { label: t('builder.categories.case'), icon: CaseIcon },
    psu: { label: t('builder.categories.psu'), icon: PsuIcon },
  };

  const renderLeftColumnBentoCard = (key) => {
    const selectedItem = selectedParts[key];
    const Icon = categories[key].icon;
    
    return (
      <div
        key={key}
        className={`bg-app-bg/40 border border-app-border/60 rounded-lg p-2.5 transition-all flex items-center gap-2.5 ${
          selectedItem
            ? 'border-blue/50 shadow-[0_0_8px_rgba(10,132,255,0.12)]'
            : 'hover:border-app-border hover:bg-app-bg/70'
        }`}
      >
        <div className={`p-1.5 rounded-lg flex-shrink-0 ${selectedItem ? 'bg-blue/10 text-blue' : 'bg-app-bg text-app-text-muted'}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-grow">
          <span className="text-[9px] font-bold text-app-text-muted uppercase tracking-wider block leading-tight">
            {categories[key].label}
          </span>
          {selectedItem ? (
            <h4 className="text-app-text font-semibold text-xs truncate leading-tight" title={selectedItem.name}>
              {selectedItem.name}
            </h4>
          ) : (
            <span className="text-app-text-muted text-[11px] italic leading-tight block">{t('builder.empty_selection')}</span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedItem ? (
            <>
              <span className="text-app-text font-bold text-xs font-mono">
                ${selectedItem.price.toFixed(0)}
              </span>
              <button
                onClick={() => removeComponent(key)}
                className="p-1 text-app-text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                title={t('builder.remove_btn')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveCategory(key)}
              className="bg-blue hover:bg-blue/90 text-white text-[10px] font-semibold px-2 py-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              {t('builder.select_btn')}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:h-[calc(100vh-4rem)] lg:overflow-hidden flex flex-col">

      {/* Title Header — compact single row */}
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] pb-3 flex-shrink-0">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-app-text truncate">{t('builder.title')}</h1>
          <p className="text-app-text-muted text-xs mt-0.5 hidden sm:block truncate">{t('builder.subtitle')}</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-app-surface hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] text-app-text font-medium px-3 py-2 rounded-lg transition-all text-sm cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex-shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">{t('builder.reset_btn')}</span>
        </button>
      </div>

      {/* 3-Column Layout — fills remaining viewport height on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-grow min-h-0">
        
        {/* ================= COLUMN 1: LEFT - Component Selector (scrollable) ================= */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <div className="bg-app-surface rounded-2xl flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] flex-shrink-0">
              <span className="text-xs font-semibold text-app-text uppercase tracking-wider">{t('builder.left_column_title')}</span>
            </div>
            <div className="flex flex-col gap-2.5 p-3 overflow-y-auto flex-grow scroll-smooth">
              {Object.keys(categories).map((key) => renderLeftColumnBentoCard(key))}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: MIDDLE - Case blueprint schematic ================= */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <div className="bg-app-surface rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between items-center h-full shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            
            {/* Background radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(var(--brand-blue-rgb),0.06),rgba(0,0,0,0))] pointer-events-none"></div>
            
            <div className="flex justify-between items-center w-full z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue animate-pulse"></div>
                <span className="text-xs font-semibold text-app-text uppercase tracking-wider">{t('builder.middle_column_title')}</span>
              </div>
              <span className="text-[9px] bg-app-border text-app-text-muted px-2 py-0.5 rounded font-mono">{t('builder.middle_column_tag')}</span>
            </div>

            {/* Vertical PC Case Tower SVG Schematic */}
            <div className="w-full max-w-[260px] flex-grow flex items-center justify-center relative z-10 py-2 min-h-0">
              <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet" className="w-full h-full text-gray-700">
                {/* 1. PC Case Outer Frame (Vertical Mid-Tower shape) */}
                <rect 
                  x="15" y="15" width="270" height="370" rx="10" 
                  fill="none" 
                  stroke={selectedParts.case ? 'var(--brand-blue)' : 'var(--app-border)'} 
                  strokeWidth="2.5" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.case ? 'drop-shadow(0 0 6px rgba(0,194,255,0.25))' : 'none' }}
                />
                
                {/* Rear Exhaust Fan (Top Left) */}
                <circle 
                  cx="45" cy="85" r="18" fill="none" 
                  stroke={selectedParts.case ? 'var(--brand-blue)' : 'var(--app-border)'} 
                  strokeWidth="1.5"
                  className={`transition-colors duration-300 ${selectedParts.case ? 'animate-[spin_4s_linear_infinite]' : ''}`} 
                  style={{ transformOrigin: '45px 85px' }}
                />
                <line x1="45" y1="67" x2="45" y2="103" stroke={selectedParts.case ? 'var(--brand-blue)' : 'var(--app-border)'} strokeWidth="1" />
                <line x1="27" y1="85" x2="63" y2="85" stroke={selectedParts.case ? 'var(--brand-blue)' : 'var(--app-border)'} strokeWidth="1" />

                {/* Front Intake Fans (Right side, 3 fans vertical) */}
                {[90, 165, 240].map((cy, i) => (
                  <circle 
                    key={i}
                    cx="255" cy={cy} r="20" fill="none" 
                    stroke={selectedParts.case ? 'var(--brand-blue)' : 'var(--app-border)'} 
                    strokeWidth="1.5"
                    className={`transition-colors duration-300 ${selectedParts.case ? 'animate-[spin_4s_linear_infinite]' : ''}`} 
                    style={{ transformOrigin: `255px ${cy}px` }}
                  />
                ))}

                {/* 2. Motherboard Board Area */}
                <rect 
                  x="80" y="45" width="150" height="230" rx="4" 
                  fill="none" 
                  stroke={selectedParts.motherboard ? 'var(--brand-blue)' : 'var(--app-border)'} 
                  strokeWidth="2" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.motherboard ? 'drop-shadow(0 0 5px rgba(0, 194, 255, 0.2))' : 'none' }}
                />
                
                {/* Motherboard socket text */}
                <text x="155" y="55" fill="var(--app-border)" fontSize="7" textAnchor="middle" fontWeight="bold">ATX FORM FACTOR</text>

                {/* 3. CPU Socket & Fan Cooler */}
                <rect 
                  x="115" y="70" width="55" height="55" rx="2" 
                  fill={selectedParts.cpu ? 'rgba(var(--brand-blue-rgb),0.06)' : 'none'} 
                  stroke={selectedParts.cpu ? 'var(--brand-blue)' : 'var(--app-border)'} 
                  strokeWidth="1.5" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.cpu ? 'drop-shadow(0 0 8px rgba(0, 194, 255, 0.35))' : 'none' }}
                />
                <text 
                  x="142" y="102" 
                  fill={selectedParts.cpu ? 'var(--brand-blue)' : '#475569'} 
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
                    stroke={selectedParts.ram ? 'var(--brand-blue)' : 'var(--app-border)'} 
                    strokeWidth="0.8" 
                    className="transition-all duration-300"
                    style={{ filter: selectedParts.ram ? 'drop-shadow(0 0 4px rgba(0, 194, 255, 0.3))' : 'none' }}
                  />
                ))}

                {/* 5. PCIe GPU Slot & Mounted GPU Card */}
                <rect 
                  x="90" y="155" width="130" height="3" 
                  fill="var(--app-border)" 
                />
                {selectedParts.gpu ? (
                  <rect 
                    x="85" y="145" width="165" height="32" rx="3" 
                    fill="rgba(0,194,255,0.1)" 
                    stroke="var(--brand-blue)" 
                    strokeWidth="1.5" 
                    className="transition-all duration-300"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0, 194, 255, 0.4))' }}
                  />
                ) : null}
                <text 
                  x="155" y="163" 
                  fill={selectedParts.gpu ? 'var(--brand-blue)' : '#475569'} 
                  fontSize="8" fontWeight="bold" textAnchor="middle"
                  className="transition-colors duration-300 font-mono"
                >
                  {selectedParts.gpu ? 'GPU ON PCIe' : 'PCIe SLOT'}
                </text>

                {/* 6. M.2 Storage SSD Indicator slot */}
                <rect 
                  x="115" y="195" width="40" height="10" rx="1" 
                  fill={selectedParts.storage ? 'rgba(0,194,255,0.15)' : 'none'} 
                  stroke={selectedParts.storage ? 'var(--brand-blue)' : 'var(--app-border)'} 
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <text x="135" y="202" fill={selectedParts.storage ? 'var(--brand-blue)' : '#475569'} fontSize="6" textAnchor="middle" fontWeight="bold">M.2 SSD</text>

                {/* 7. PSU Power Shroud Cover (Bottom Compartment) */}
                <rect 
                  x="25" y="315" width="250" height="55" rx="4" 
                  fill={selectedParts.psu ? 'rgba(var(--brand-blue-rgb),0.06)' : 'none'} 
                  stroke={selectedParts.psu ? 'var(--brand-blue)' : 'var(--app-border)'} 
                  strokeWidth="1.5" 
                  className="transition-colors duration-300"
                  style={{ filter: selectedParts.psu ? 'drop-shadow(0 0 6px rgba(0,194,255,0.25))' : 'none' }}
                />
                <text 
                  x="150" y="347" 
                  fill={selectedParts.psu ? 'var(--brand-blue)' : '#475569'} 
                  fontSize="9" fontWeight="bold" textAnchor="middle"
                  className="transition-colors duration-300 font-mono"
                >
                  {selectedParts.psu ? 'PSU POWER SHROUD' : 'PSU CHAMBER'}
                </text>
              </svg>
            </div>

            {/* Micro-legends at the bottom */}
            <div className="flex flex-wrap justify-center gap-3 text-[9px] text-app-text-muted z-10 border-t border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] pt-2 w-full flex-shrink-0">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.cpu ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                CPU
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.motherboard ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                Board
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.gpu ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                GPU
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.ram ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                RAM
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.storage ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                SSD
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.case ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                Case
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedParts.psu ? 'bg-brand-blue' : 'bg-gray-700'}`}></span>
                PSU
              </span>
            </div>

          </div>
        </div>

        {/* ================= COLUMN 3: RIGHT - Health + Power + Checkout ================= */}
        <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
          {/* Health Check card — compact 3-row list */}
          <div className="bg-app-surface rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex-shrink-0">
            <h3 className="text-xs font-semibold text-app-text uppercase tracking-wider mb-3 border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] pb-2">
              {t('builder.compat_box_title')}
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { key: 'socket', label: 'Socket' },
                { key: 'power', label: 'TDP Power' },
                { key: 'clearance', label: 'GPU Clearance' },
              ].map(({ key, label }) => {
                const status = buildCompatibility.checks[key].status;
                const Icon = status === 'success' ? CheckCircle2
                  : status === 'warning' ? AlertTriangle
                  : status === 'error' ? AlertCircle
                  : Info;
                const iconColor = status === 'success' ? 'text-emerald-500'
                  : status === 'warning' ? 'text-amber-500'
                  : status === 'error' ? 'text-rose-500'
                  : 'text-app-text-muted';
                return (
                  <div key={key} className="flex gap-2.5 items-start">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
                    <div className="min-w-0 flex-grow">
                      <h4 className="text-[10px] font-bold text-app-text uppercase tracking-wide">{label}</h4>
                      <p className="text-[11px] text-app-text-muted leading-snug line-clamp-2" title={buildCompatibility.checks[key].message}>
                        {buildCompatibility.checks[key].message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Power + Total + Checkout — main action card */}
          <div className="bg-app-surface rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col flex-grow min-h-0">
            <h3 className="text-xs font-semibold text-app-text uppercase tracking-wider mb-3 border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] pb-2 flex-shrink-0">
              {t('builder.tdp_bar_title')}
            </h3>

            {/* Wattage bar */}
            <div className="mb-4 flex-shrink-0">
              <div className="flex justify-between text-[11px] font-semibold text-app-text-muted mb-1.5">
                <span>Load</span>
                <span className="font-mono text-app-text">
                  {buildCompatibility.totalTdp}W{selectedParts.psu ? ` / ${selectedParts.psu.wattage}W` : ''}
                </span>
              </div>
              <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    !selectedParts.psu ? 'bg-amber-500' :
                    (buildCompatibility.totalTdp / selectedParts.psu.wattage) > 1.0 ? 'bg-rose-500' :
                    (buildCompatibility.totalTdp / selectedParts.psu.wattage) > 0.8 ? 'bg-amber-400' : 'bg-blue'
                  }`}
                  style={{
                    width: `${Math.min(
                      selectedParts.psu
                        ? (buildCompatibility.totalTdp / selectedParts.psu.wattage) * 100
                        : (buildCompatibility.totalTdp / 1000) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Total + Checkout pinned to bottom */}
            <div className="mt-auto border-t border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] pt-3 flex-shrink-0">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[11px] text-app-text-muted uppercase tracking-wider">Total</span>
                <h2 className="text-2xl font-extrabold text-app-text font-mono">
                  ${buildCompatibility.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h2>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('cart')}
                disabled={buildCompatibility.totalCost === 0}
                className={`w-full text-white font-semibold py-3 px-4 rounded-xl text-sm text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  buildCompatibility.totalCost > 0
                    ? 'bg-blue hover:bg-blue/90 hover:shadow-[0_0_15px_rgba(10,132,255,0.2)]'
                    : 'bg-gray-700/40 text-app-text-muted cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {t('builder.checkout_btn')}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Component Selection Drawer / Modal */}
      {activeCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-app-surface rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-app-text capitalize">{t('builder.select_hardware_title', { category: categories[activeCategory].label })}</h3>
                <p className="text-xs text-app-text-muted mt-1">{t('builder.select_hardware_desc')}</p>
              </div>
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-app-text-muted hover:text-app-text p-1 rounded-lg hover:bg-app-border transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Items list */}
            <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-3">
              {COMPONENT_DATABASE[activeCategory]?.map((item) => (
                <div
                  key={item.id}
                  className="bg-app-bg/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] p-4 rounded-xl flex justify-between items-center gap-4 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                >
                  <div className="min-w-0">
                    <h4 className="text-app-text font-bold text-base block">{item.name}</h4>
                    <p className="text-xs text-app-text-muted mt-1 leading-relaxed">{item.details}</p>
                    <div className="flex gap-2 mt-2">
                      {item.socket && (
                        <span className="text-[10px] font-bold bg-app-surface text-app-text-muted border border-app-border px-2 py-0.5 rounded">
                          Socket: {item.socket}
                        </span>
                      )}
                      {item.tdp > 0 && (
                        <span className="text-[10px] font-bold bg-app-surface text-app-text-muted border border-app-border px-2 py-0.5 rounded">
                          TDP: {item.tdp}W
                        </span>
                      )}
                      {item.length && (
                        <span className="text-[10px] font-bold bg-app-surface text-app-text-muted border border-app-border px-2 py-0.5 rounded">
                          Length: {item.length}mm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-app-text font-extrabold text-lg font-mono">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => selectComponent(activeCategory, item)}
                      className="bg-blue hover:bg-blue/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      {t('builder.select_btn')}
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
