import React, { useState, useEffect, useMemo } from 'react';
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
  Loader2,
} from 'lucide-react';
import * as productService from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { buildCompatibility as computeCompatibility } from './buildCompatibility';
import { loadBuilderState, saveBuilderState, clearBuilderState } from './builderStorage';
import IsometricChassis from './IsometricChassis';

const CATEGORY_MAP = {
  cpu: 'CPU',
  motherboard: 'Mainboard',
  gpu: 'GPU',
  ram: 'RAM',
  storage: 'SSD',
  case: 'Case',
  psu: 'PSU',
};

function PCBuilder({ onNavigate }) {
  const { t } = useTranslation();
  const { addItem } = useCart();

  const [componentDB, setComponentDB] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);

  // State for selected components
  const [selectedParts, setSelectedParts] = useState(loadBuilderState);

  useEffect(() => {
    saveBuilderState(selectedParts);
  }, [selectedParts]);

  // Modal selector states
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterRecommendedPsu, setFilterRecommendedPsu] = useState(true);

  const openCategoryModal = async (key) => {
    setActiveCategory(key);
    if (componentDB[key]) return;
    setLoadingCategory(key);
    try {
      const apiCategory = CATEGORY_MAP[key];
      const products = await productService.getByCategory(apiCategory);
      const mapped = products.map((p) => {
        const specs = p.specifications || {};
        return {
          id: p.id,
          name: p.name,
          price: Number(p.price),
          tdp: Number(specs.tdp) || 0,
          socket: specs.socket || null,
          ramType: specs.ram_type || specs.supported_ram || null,
          formFactor: specs.form_factor || null,
          length: (specs.gpu_length_mm || specs.length_mm) ? Number(specs.gpu_length_mm || specs.length_mm) : null,
          maxGpuLength: specs.max_gpu_length_mm ? Number(specs.max_gpu_length_mm) : null,
          wattage: specs.wattage ? Number(specs.wattage) : null,
          details: Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join(', '),
        };
      });
      setComponentDB((prev) => ({ ...prev, [key]: mapped }));
    } catch {
      setComponentDB((prev) => ({ ...prev, [key]: [] }));
    } finally {
      setLoadingCategory(null);
    }
  };

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
    clearBuilderState();
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
    return computeCompatibility(selectedParts);
  }, [selectedParts]);

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
              onClick={() => openCategoryModal(key)}
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

            {/* Isometric 3D PC Case SVG */}
            <div className="w-full max-w-[400px] flex-grow flex items-center justify-center relative z-10 py-2 min-h-0">
              <IsometricChassis selectedParts={selectedParts} />
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
                { key: 'ramType', label: 'RAM Type' },
                { key: 'formFactor', label: 'Form Factor' },
                { key: 'power', label: 'TDP Power' },
                { key: 'clearance', label: 'GPU Clearance' },
              ].map(({ key, label }) => {
                const check = buildCompatibility.checks[key];
                const status = check.status;
                const message = t(`builder.compat_rules.${check.message}`, check.params || {});
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
                      <p className="text-[11px] text-app-text-muted leading-snug line-clamp-2" title={message}>
                        {message}
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
                <span>System Load</span>
                <span className="font-mono text-app-text font-bold">
                  {buildCompatibility.totalTdp}W{selectedParts.psu ? ` / ${selectedParts.psu.wattage}W` : ''}
                </span>
              </div>
              <div className="w-full bg-app-bg rounded-full h-2.5 overflow-hidden p-0.5 border border-app-border/40">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    !selectedParts.psu ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                    (buildCompatibility.totalTdp / selectedParts.psu.wattage) > 1.0 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                    (buildCompatibility.totalTdp / selectedParts.psu.wattage) > 0.8 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]'
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
              {selectedParts.psu && (
                <div className="mt-2 flex items-center justify-between text-[10px] text-app-text-muted font-medium">
                  <span>Usage: {Math.round((buildCompatibility.totalTdp / selectedParts.psu.wattage) * 100)}%</span>
                  <span className={selectedParts.psu.wattage - buildCompatibility.totalTdp >= 0 ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                    {selectedParts.psu.wattage - buildCompatibility.totalTdp >= 0 ? `+${selectedParts.psu.wattage - buildCompatibility.totalTdp}W Headroom` : `${selectedParts.psu.wattage - buildCompatibility.totalTdp}W Deficit`}
                  </span>
                </div>
              )}
            </div>

            {/* Total + Checkout pinned to bottom */}
            <div className="mt-auto border-t border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] pt-3 flex-shrink-0">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[11px] text-app-text-muted uppercase tracking-wider">Total</span>
                <h2 className="text-2xl font-extrabold text-app-text font-mono">
                  ฿{buildCompatibility.totalCost.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
                </h2>
              </div>
              <button
                onClick={() => {
                  Object.values(selectedParts).filter(Boolean).forEach((part) => addItem(part));
                  onNavigate && onNavigate('cart');
                }}
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

            {/* PSU Safety Margin Filter */}
            {activeCategory === 'psu' && (
              <div className="px-5 py-3 bg-blue/5 border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] flex items-center justify-between flex-shrink-0">
                <label htmlFor="psu-filter-checkbox" className="flex items-center gap-2.5 text-xs text-app-text font-medium cursor-pointer select-none">
                  <input
                    id="psu-filter-checkbox"
                    type="checkbox"
                    checked={filterRecommendedPsu}
                    onChange={(e) => setFilterRecommendedPsu(e.target.checked)}
                    className="w-4 h-4 rounded border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.65)] text-blue focus:ring-blue cursor-pointer"
                  />
                  <span>{t('builder.psu_filter_label', { wattage: Math.ceil(buildCompatibility.totalTdp * 1.2) })}</span>
                </label>
                <span className="text-[10px] bg-blue/20 text-blue font-bold px-2.5 py-0.5 rounded-full">
                  Min: {Math.ceil(buildCompatibility.totalTdp * 1.2)}W
                </span>
              </div>
            )}

            {/* Modal Body: Items list */}
            <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-3">
              {loadingCategory === activeCategory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue animate-spin" />
                </div>
              ) : (() => {
                const items = componentDB[activeCategory] || [];
                const recommendedMinWattage = Math.ceil(buildCompatibility.totalTdp * 1.2);
                let displayItems = items;

                if (activeCategory === 'psu' && filterRecommendedPsu) {
                  displayItems = items.filter((item) => item.wattage >= recommendedMinWattage);
                }

                if (displayItems.length === 0 && activeCategory === 'psu') {
                  return (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl text-center">
                      <p className="text-sm font-semibold text-amber-500 mb-1">
                        {t('builder.psu_no_recommended_title', 'No recommended PSUs match your build.')}
                      </p>
                      <p className="text-xs text-app-text-muted">
                        {t('builder.psu_no_recommended_desc', 'Your system needs at least {{wattage}}W. Uncheck the filter to see all options.', { wattage: recommendedMinWattage })}
                      </p>
                    </div>
                  );
                }

                return displayItems;
              })().map((item) => (
                <div
                  key={item.id}
                  className="bg-app-bg/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] p-4 rounded-xl flex justify-between items-center gap-4 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                >
                  <div className="min-w-0">
                    <h4 className="text-app-text font-bold text-base block">{item.name}</h4>
                    <p className="text-xs text-app-text-muted mt-1 leading-relaxed">{item.details}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
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
                      {item.wattage && (
                        <span className="text-[10px] font-bold bg-app-surface text-app-text-muted border border-app-border px-2 py-0.5 rounded">
                          Wattage: {item.wattage}W
                        </span>
                      )}
                      {activeCategory === 'psu' && item.wattage >= Math.ceil(buildCompatibility.totalTdp * 1.2) && (
                        <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {t('builder.recommended_badge', 'Recommended')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-app-text font-extrabold text-lg font-mono">
                      ฿{item.price.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
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
