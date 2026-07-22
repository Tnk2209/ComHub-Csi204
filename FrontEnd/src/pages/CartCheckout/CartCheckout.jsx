import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { ArrowLeft, ShoppingCart, Trash2, Upload, CheckCircle, MapPin, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import * as orderService from '../../services/orderService';
import * as productService from '../../services/productService';
import { compressImage } from '../../utils/imageCompressor';

function CartCheckout({ onNavigate }) {
  const { t } = useTranslation();
  const { items: cartItems, removeItem, updateQuantity, clear, totalPrice } = useCart();
  
  // Step state: 'cart' or 'checkout'
  const [step, setStep] = useState('cart');

  // Selected item IDs in cart
  const [selectedIds, setSelectedIds] = useState([]);

  // Stock Map to hold real-time stock quantities for cart items
  const [stockMap, setStockMap] = useState({});

  useEffect(() => {
    if (cartItems.length > 0) {
      productService.list({ limit: 100 })
        .then((res) => {
          const products = res?.data || res || [];
          if (Array.isArray(products)) {
            const map = {};
            products.forEach((p) => {
              map[p.id] = p.stock_quantity ?? p.stock ?? 0;
            });
            setStockMap(map);

            // Auto clamp quantity if cart item exceeds real stock
            cartItems.forEach((item) => {
              const realStock = map[item.product_id];
              if (realStock !== undefined && item.quantity > realStock && realStock > 0) {
                updateQuantity(item.product_id, realStock, realStock);
              }
            });
          }
        })
        .catch(() => {});
    }
  }, [cartItems.length]);

  // Auto select all items when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedIds((prev) => {
        // Keep existing selections that still exist in cartItems, or default to all if empty
        const validPrev = prev.filter((id) => cartItems.some((item) => item.product_id === id));
        return validPrev.length > 0 ? validPrev : cartItems.map((item) => item.product_id);
      });
    } else {
      setSelectedIds([]);
    }
  }, [cartItems]);

  // Checkbox helpers
  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.product_id));
    }
  };

  const toggleSelectItem = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) return;
    Swal.fire({
      title: t('cart.confirm_remove_selected', 'ลบรายการที่เลือกหรือไม่?'),
      text: t('cart.remove_selected_desc', 'รายการที่เลือกจะถูกนำออกจากตะกร้าสินค้า'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('cart.remove', 'ลบ'),
      cancelButtonText: t('cart.cancel', 'ยกเลิก'),
    }).then((result) => {
      if (result.isConfirmed) {
        selectedIds.forEach((id) => removeItem(id));
        setSelectedIds([]);
      }
    });
  };

  // Selected items calculation
  const selectedCartItems = useMemo(() => {
    return cartItems.filter((item) => selectedIds.includes(item.product_id));
  }, [cartItems, selectedIds]);

  const selectedSubtotal = useMemo(() => {
    return selectedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [selectedCartItems]);

  const shippingCost = selectedCartItems.length > 0 ? 15.0 : 0.0;
  const finalTotal = selectedSubtotal + shippingCost;

  // Checkout / Payment step states
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [uploadedSlipName, setUploadedSlipName] = useState('');
  const [slipData, setSlipData] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipSizes, setSlipSizes] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleProceedToCheckout = () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: t('cart.no_selected_items', 'กรุณาเลือกอย่างน้อย 1 รายการเพื่อสั่งซื้อ'),
      });
      return;
    }
    setStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSlipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedSlipName(file.name);
    setCompressing(true);
    try {
      const result = await compressImage(file);
      setSlipData(result.base64);
      setSlipPreview(result.base64);
      setSlipSizes({ original: result.originalSize, compressed: result.compressedSize });
      setSlipUploaded(true);
    } catch {
      Swal.fire({ icon: 'error', title: t('cart.compression_failed') || 'Compression failed' });
    } finally {
      setCompressing(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!shippingAddress.trim()) {
      Swal.fire({ icon: 'warning', title: t('cart.address_required') });
      return;
    }
    if (!slipUploaded) {
      Swal.fire({ icon: 'warning', title: t('cart.slip_required') });
      return;
    }
    setSubmitting(true);
    try {
      const items = selectedCartItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity }));
      const order = await orderService.create({ items, shipping_address: shippingAddress.trim() });

      await orderService.uploadSlip(order.id, slipData);

      // Remove checked items from cart after order creation
      selectedIds.forEach((id) => removeItem(id));
      setSelectedIds([]);

      onNavigate('order-tracking', { orderId: order.id });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to create order' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pb-16">
      {/* Header Bar */}
      <div className="bg-app-surface border-b border-app-border/40 shadow-xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'checkout') {
                setStep('cart');
              } else {
                onNavigate('catalog');
              }
            }}
            className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'checkout' ? t('cart.back_to_cart', 'กลับไปยังตะกร้าสินค้า') : t('cart.back_to_catalog')}</span>
          </button>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`px-3 py-1 rounded-full ${step === 'cart' ? 'bg-blue text-white' : 'bg-app-bg text-app-text-muted'}`}>
              1. {t('cart.title')}
            </span>
            <span className="text-app-text-muted">→</span>
            <span className={`px-3 py-1 rounded-full ${step === 'checkout' ? 'bg-blue text-white' : 'bg-app-bg text-app-text-muted'}`}>
              2. {t('cart.checkout_step_title', 'ชำระเงิน & จัดส่ง')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= STEP 1: CART VIEW (Shopee Style Table) ================= */}
        {step === 'cart' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-blue" />
                <h1 className="text-2xl sm:text-3xl font-bold text-app-text">{t('cart.title')}</h1>
                <span className="text-app-text-muted font-medium">({cartItems.length} {t('cart.items')})</span>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 p-12 text-center shadow-xs">
                <ShoppingCart className="w-16 h-16 text-app-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-app-text-muted text-lg font-medium">{t('cart.empty')}</p>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="mt-6 bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {t('cart.browse_products')}
                </button>
              </div>
            ) : (
              <>
                {/* Shopee-style Table Header (Desktop) */}
                <div className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 shadow-xs overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-bg-secondary/60 text-xs font-semibold text-app-text-muted uppercase tracking-wider border-b border-app-border/40">
                    <div className="col-span-6 flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue rounded border-app-border focus:ring-blue cursor-pointer"
                      />
                      <span>สินค้า ({cartItems.length})</span>
                    </div>
                    <div className="col-span-2 text-right">{t('cart.unit_price', 'ราคาต่อชิ้น')}</div>
                    <div className="col-span-2 text-center">{t('product_detail.quantity')}</div>
                    <div className="col-span-2 text-right">{t('cart.item_total', 'ราคารวม')}</div>
                  </div>

                  {/* Cart Item Rows */}
                  <div className="divide-y divide-app-border/30">
                    {cartItems.map((item) => {
                      const isSelected = selectedIds.includes(item.product_id);
                      const maxStock = stockMap[item.product_id] ?? item.stock_quantity ?? item.stock ?? 999;
                      const isMinReached = item.quantity <= 1;
                      const isMaxReached = item.quantity >= maxStock;

                      return (
                        <div
                          key={item.product_id}
                          className={`p-4 sm:p-6 transition-colors ${
                            isSelected ? 'bg-blue/5 dark:bg-blue/10' : 'hover:bg-bg-secondary/40'
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            
                            {/* Checkbox + Product Info */}
                            <div className="md:col-span-6 flex items-center gap-3 sm:gap-4 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectItem(item.product_id)}
                                className="w-4 h-4 text-blue rounded border-app-border focus:ring-blue cursor-pointer flex-shrink-0"
                              />
                              <img
                                src={item.image_url || `https://placehold.co/200x150/EEE/333?text=${encodeURIComponent(item.name)}`}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white dark:bg-slate-900/40 p-2 border border-app-border/40 flex-shrink-0"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x150/EEE/333?text=${encodeURIComponent(item.name)}`; }}
                              />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base text-app-text truncate">{item.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                  {item.brand && (
                                    <span className="text-[11px] font-bold text-blue uppercase tracking-wider">{item.brand}</span>
                                  )}
                                  <span className="text-xs text-app-text-muted font-medium">
                                    • {t('cart.stock_available', 'มีในสต็อก')}: <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{maxStock}</span> {t('cart.items_unit', 'ชิ้น')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Unit Price */}
                            <div className="md:col-span-2 text-left md:text-right text-xs sm:text-sm font-semibold text-app-text-muted font-mono">
                              ฿{item.price.toLocaleString()}
                            </div>

                            {/* Quantity Controls */}
                            <div className="md:col-span-2 flex items-center justify-start md:justify-center">
                              <div className="flex items-center gap-2 bg-app-bg rounded-lg px-3 py-1.5 border border-app-border/40 shadow-xs">
                                <button
                                  type="button"
                                  disabled={isMinReached}
                                  onClick={() => {
                                    if (!isMinReached) {
                                      updateQuantity(item.product_id, item.quantity - 1, maxStock);
                                    }
                                  }}
                                  className={`font-bold px-1.5 py-0.5 rounded transition-colors ${
                                    isMinReached
                                      ? 'text-app-text-muted/40 cursor-not-allowed'
                                      : 'text-app-text hover:text-blue cursor-pointer'
                                  }`}
                                  title={isMinReached ? t('cart.min_qty_reached', 'จำนวนขั้นต่ำคือ 1 ชิ้น') : ''}
                                >
                                  −
                                </button>
                                <span className="text-app-text font-semibold min-w-[1.75rem] text-center text-sm font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={isMaxReached}
                                  onClick={() => {
                                    if (!isMaxReached) {
                                      updateQuantity(item.product_id, item.quantity + 1, maxStock);
                                    } else {
                                      Swal.fire({
                                        icon: 'warning',
                                        title: t('cart.max_stock_reached_title', 'เกินจำนวนสินค้าในสต็อก'),
                                        text: t('cart.max_stock_reached_desc', `สินค้าชิ้นนี้มีในสต็อกทั้งหมด ${maxStock} ชิ้น ไม่สามารถสั่งซื้อเกินจำนวนที่มีอยู่จริงได้`),
                                        confirmButtonColor: '#0284c7',
                                        confirmButtonText: t('cart.ok', 'ตกลง')
                                      });
                                    }
                                  }}
                                  className={`font-bold px-1.5 py-0.5 rounded transition-colors ${
                                    isMaxReached
                                      ? 'text-app-text-muted/40 cursor-not-allowed opacity-50'
                                      : 'text-app-text hover:text-blue cursor-pointer'
                                  }`}
                                  title={isMaxReached ? t('cart.max_qty_reached', `ไม่สามารถสั่งซื้อเกินจำนวนสต็อกที่มีอยู่จริง (${maxStock} ชิ้น)`) : ''}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Item Subtotal & Delete */}
                            <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                              <div className="text-right font-mono font-bold text-base sm:text-lg text-blue">
                                ฿{(item.price * item.quantity).toLocaleString()}
                              </div>
                              <button
                                onClick={() => removeItem(item.product_id)}
                                className="text-app-text-muted hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title={t('cart.remove')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shopee-style Bottom Summary Bar */}
                <div className="sticky bottom-4 z-40 bg-app-surface/95 backdrop-blur-md rounded-2xl border border-app-border/50 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-app-text select-none">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue rounded border-app-border focus:ring-blue cursor-pointer"
                      />
                      <span>{t('cart.select_all', 'เลือกทั้งหมด')} ({cartItems.length})</span>
                    </label>

                    {selectedIds.length > 0 && (
                      <button
                        onClick={handleRemoveSelected}
                        className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                      >
                        {t('cart.remove_selected', 'ลบที่เลือก')} ({selectedIds.length})
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 border-app-border/40 pt-3 sm:pt-0">
                    <div className="text-right">
                      <span className="text-xs text-app-text-muted block">
                        {t('cart.selected_items', { count: selectedIds.length })}
                      </span>
                      <div className="text-lg sm:text-2xl font-extrabold text-blue font-mono">
                        ฿{selectedSubtotal.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToCheckout}
                      disabled={selectedIds.length === 0}
                      className="bg-blue hover:bg-blue/90 disabled:bg-gray-700/40 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-blue/25 cursor-pointer flex items-center gap-2"
                    >
                      <span>{t('cart.proceed_to_checkout', 'สั่งซื้อสินค้า')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= STEP 2: CHECKOUT & PAYMENT STEP ================= */}
        {step === 'checkout' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue" />
              <h1 className="text-2xl sm:text-3xl font-bold text-app-text">{t('cart.checkout_step_title', 'ชำระเงิน & จัดส่ง')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Selected Items Summary & Shipping Address */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Shipping Address */}
                <div className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 shadow-xs p-6">
                  <h2 className="text-base font-semibold text-app-text mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue" />
                    {t('cart.shipping_address')}
                  </h2>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder={t('cart.address_placeholder')}
                    rows={3}
                    className="w-full px-4 py-3 bg-bg-secondary text-app-text rounded-xl border border-app-border/40 focus:outline-none focus:ring-2 focus:ring-blue/50 resize-none text-sm"
                  />
                </div>

                {/* Selected Items List Summary */}
                <div className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 shadow-xs p-6">
                  <h2 className="text-base font-semibold text-app-text mb-4 border-b border-app-border/40 pb-3">
                    {t('order_tracking.order_items')} ({selectedCartItems.length} รายการ)
                  </h2>
                  <div className="space-y-3">
                    {selectedCartItems.map((item) => (
                      <div key={item.product_id} className="flex items-center justify-between gap-4 py-2 border-b border-app-border/20 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image_url || `https://placehold.co/100x100?text=${encodeURIComponent(item.name)}`}
                            alt={item.name}
                            className="w-12 h-12 object-contain bg-white dark:bg-slate-900/40 rounded-lg p-1 border border-app-border/30"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-app-text truncate">{item.name}</h4>
                            <span className="text-xs text-app-text-muted">x{item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-blue">฿{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Slip Upload */}
              <div className="space-y-6">
                
                {/* Order Cost Breakdown */}
                <div className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 shadow-xs p-6">
                  <h2 className="text-base font-semibold text-app-text mb-4">{t('cart.order_summary')}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-app-text-muted">
                      <span>{t('cart.subtotal')}</span>
                      <span className="font-mono">฿{selectedSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-app-text-muted">
                      <span>{t('cart.shipping')}</span>
                      <span className="font-mono">฿{shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-app-border/40 pt-3 flex justify-between text-app-text font-bold text-lg">
                      <span>{t('cart.total')}</span>
                      <span className="text-blue font-mono">฿{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment QR Code & Slip Upload */}
                <div className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 shadow-xs p-6">
                  <h2 className="text-base font-semibold text-app-text mb-4">{t('cart.payment_method')}</h2>

                  {/* QR Code PromptPay */}
                  <div className="bg-bg-secondary/60 rounded-xl p-4 mb-4 text-center border border-app-border/30">
                    <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center mb-3 shadow-xs p-2">
                      <div className="text-5xl">📱</div>
                    </div>
                    <p className="text-xs text-app-text-muted font-medium">{t('cart.scan_qr')}</p>
                    <p className="text-xs text-blue font-mono font-bold mt-1">{t('cart.bank_account')}: 123-456-7890 (ComHub Co., Ltd.)</p>
                  </div>

                  {/* Slip Upload Box */}
                  <label className="block">
                    <div
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                        slipUploaded
                          ? 'border-emerald-500 bg-emerald-500/5'
                          : 'border-app-border/60 hover:border-blue bg-bg-secondary/40'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="hidden"
                      />
                      {compressing ? (
                        <div className="flex items-center justify-center gap-2 text-app-text-muted">
                          <div className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-medium">{t('cart.compressing') || 'Compressing...'}</span>
                        </div>
                      ) : slipUploaded ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-500">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-xs font-semibold truncate">{uploadedSlipName}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-app-text-muted mx-auto mb-2" />
                          <p className="text-xs text-app-text font-semibold">{t('cart.upload_slip')}</p>
                          <p className="text-[10px] text-app-text-muted mt-1">{t('cart.upload_desc')}</p>
                        </>
                      )}
                    </div>
                  </label>

                  {/* Preview */}
                  {slipPreview && (
                    <div className="mt-4 space-y-2">
                      <img
                        src={slipPreview}
                        alt="Payment slip preview"
                        className="w-full max-h-40 object-contain rounded-xl border border-app-border/40"
                      />
                      {slipSizes && (
                        <div className="flex justify-between text-[10px] text-app-text-muted bg-bg-secondary rounded-lg px-3 py-1.5 font-mono">
                          <span>Original: {(slipSizes.original / 1024).toFixed(1)} KB</span>
                          <span className="text-emerald-500 font-semibold">
                            -{Math.round((1 - slipSizes.compressed / slipSizes.original) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Order Button */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                  className="w-full bg-blue hover:bg-blue/90 text-white text-base font-semibold px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-blue/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{submitting ? t('cart.processing') : t('cart.confirm_order')}</span>
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CartCheckout;
