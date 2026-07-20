import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { ArrowLeft, ShoppingCart, Trash2, Upload, CheckCircle, MapPin } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import * as orderService from '../../services/orderService';
import { compressImage } from '../../utils/imageCompressor';

function CartCheckout({ onNavigate }) {
  const { t } = useTranslation();
  const { items: cartItems, removeItem, updateQuantity, clear, totalPrice } = useCart();
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [uploadedSlipName, setUploadedSlipName] = useState('');
  const [slipData, setSlipData] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipSizes, setSlipSizes] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = 15.0;
  const total = totalPrice + shippingCost;

  const [shippingAddress, setShippingAddress] = useState('');

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

  const handleCheckout = async () => {
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
      const items = cartItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity }));
      const order = await orderService.create({ items, shipping_address: shippingAddress.trim() });

      await orderService.uploadSlip(order.id, slipData);

      clear();
      onNavigate('order-tracking', { orderId: order.id });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to create order' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      {/* Header */}
      <div className="bg-app-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('cart.back_to_catalog')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-blue" />
          <h1 className="text-3xl font-bold text-app-text">{t('cart.title')}</h1>
          <span className="text-app-text-muted">({cartItems.length} {t('cart.items')})</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
                <p className="text-app-text-muted text-lg">{t('cart.empty')}</p>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="mt-6 bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all"
                >
                  {t('cart.browse_products')}
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex gap-4"
                >
                  <img
                    src={item.image_url || `https://placehold.co/200x150/EEE/333?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg bg-bg-secondary flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x150/EEE/333?text=${encodeURIComponent(item.name)}`; }}
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-app-text">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-red hover:text-red/80 transition-colors p-2"
                        title={t('cart.remove')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-bg-secondary rounded-lg px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="text-app-text hover:text-blue font-bold"
                        >
                          −
                        </button>
                        <span className="text-app-text font-semibold min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="text-app-text hover:text-blue font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-xs text-app-text-muted">
                          ฿{item.price.toLocaleString()} {t('cart.each')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Summary & Payment */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
              <h2 className="text-lg font-semibold text-app-text mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue" />
                {t('cart.shipping_address')}
              </h2>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={t('cart.address_placeholder')}
                rows={3}
                className="w-full px-4 py-3 bg-bg-secondary text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50 resize-none"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
              <h2 className="text-lg font-semibold text-app-text mb-4">{t('cart.order_summary')}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-app-text-muted">
                  <span>{t('cart.subtotal')}</span>
                  <span>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-app-text-muted">
                  <span>{t('cart.shipping')}</span>
                  <span>฿{shippingCost.toLocaleString()}</span>
                </div>
                <div className="border-t border-app-border pt-3 flex justify-between text-app-text font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span className="text-blue">฿{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment QR Code & Slip Upload */}
            <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
              <h2 className="text-lg font-semibold text-app-text mb-4">{t('cart.payment_method')}</h2>

              {/* QR Code */}
              <div className="bg-bg-secondary rounded-lg p-4 mb-4 text-center">
                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-3">
                  <div className="text-6xl">📱</div>
                </div>
                <p className="text-sm text-app-text-muted">{t('cart.scan_qr')}</p>
                <p className="text-xs text-app-text-muted mt-1">{t('cart.bank_account')}: 123-456-7890</p>
              </div>

              {/* Slip Upload */}
              <label className="block">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    slipUploaded
                      ? 'border-green bg-green/5'
                      : 'border-app-border hover:border-blue bg-bg-secondary'
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
                      <div className="w-5 h-5 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium">{t('cart.compressing') || 'Compressing...'}</span>
                    </div>
                  ) : slipUploaded ? (
                    <div className="flex items-center justify-center gap-2 text-green">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-sm font-medium">{uploadedSlipName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-app-text-muted mx-auto mb-2" />
                      <p className="text-sm text-app-text font-medium">{t('cart.upload_slip')}</p>
                      <p className="text-xs text-app-text-muted mt-1">{t('cart.upload_desc')}</p>
                    </>
                  )}
                </div>
              </label>

              {/* Preview + Size Comparison */}
              {slipPreview && (
                <div className="mt-4 space-y-3">
                  <img
                    src={slipPreview}
                    alt="Payment slip preview"
                    className="w-full max-h-48 object-contain rounded-lg border border-app-border"
                  />
                  {slipSizes && (
                    <div className="flex justify-between text-xs text-app-text-muted bg-bg-secondary rounded-lg px-3 py-2">
                      <span>{t('cart.original_size') || 'Original'}: {(slipSizes.original / 1024).toFixed(1)} KB</span>
                      <span>{t('cart.compressed_size') || 'Compressed'}: {(slipSizes.compressed / 1024).toFixed(1)} KB</span>
                      <span className="text-green font-semibold">
                        -{Math.round((1 - slipSizes.compressed / slipSizes.original) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || submitting}
              className="w-full bg-blue hover:bg-blue/90 text-white text-base font-semibold px-6 py-4 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t('cart.processing') || 'Processing...' : t('cart.confirm_order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCheckout;
