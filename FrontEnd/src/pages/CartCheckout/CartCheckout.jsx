import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Trash2, Upload, CheckCircle, MapPin } from 'lucide-react';

function CartCheckout({ onNavigate }) {
  const { t } = useTranslation();
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [uploadedSlipName, setUploadedSlipName] = useState('');

  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Intel Core i9-14900K',
      category: 'CPU',
      price: 599.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'NVIDIA RTX 4090',
      category: 'GPU',
      price: 1599.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&h=150&fit=crop'
    },
    {
      id: 5,
      name: 'Corsair Vengeance DDR5 32GB',
      category: 'RAM',
      price: 129.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=200&h=150&fit=crop'
    }
  ]);

  const shippingCost = 15.0;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  const [shippingAddress, setShippingAddress] = useState('');

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app: compress to WebP and upload
      setUploadedSlipName(file.name);
      setSlipUploaded(true);
      alert(t('cart.slip_uploaded', { name: file.name }));
    }
  };

  const handleCheckout = () => {
    if (!shippingAddress.trim()) {
      alert(t('cart.address_required'));
      return;
    }
    if (!slipUploaded) {
      alert(t('cart.slip_required'));
      return;
    }
    alert(t('cart.checkout_success', { total: total.toFixed(2) }));
    onNavigate('order-tracking', { orderId: 'ORD-2026-001' });
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
                  key={item.id}
                  className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg bg-bg-secondary flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-app-text">{item.name}</h3>
                        <p className="text-sm text-app-text-muted">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red hover:text-red/80 transition-colors p-2"
                        title={t('cart.remove')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-bg-secondary rounded-lg px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-app-text hover:text-blue font-bold"
                        >
                          −
                        </button>
                        <span className="text-app-text font-semibold min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-app-text hover:text-blue font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-app-text-muted">
                          ${item.price.toFixed(2)} {t('cart.each')}
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-app-text-muted">
                  <span>{t('cart.shipping')}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-app-border pt-3 flex justify-between text-app-text font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span className="text-blue">${total.toFixed(2)}</span>
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
                  {slipUploaded ? (
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
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-blue hover:bg-blue/90 text-white text-base font-semibold px-6 py-4 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('cart.confirm_order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCheckout;
