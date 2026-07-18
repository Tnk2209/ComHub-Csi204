import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Heart, Bell, Star, ThermometerSun, Wind } from 'lucide-react';

function ProductDetail({ onNavigate, productId }) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [stockAlertEnabled, setStockAlertEnabled] = useState(false);

  // Mock product data - in real app, fetch by productId
  const product = {
    id: productId || 1,
    name: 'Intel Core i9-14900K',
    category: 'CPU (Processor)',
    price: 599.99,
    originalPrice: 649.99,
    stock: 12,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop'
    ],
    description: 'High-performance processor with 24 cores and 32 threads. Perfect for gaming, content creation, and professional workloads.',
    specs: {
      socket: 'LGA1700',
      cores: 24,
      threads: 32,
      baseClock: '3.0 GHz',
      boostClock: '6.0 GHz',
      cache: '36MB L3',
      tdp: 125,
      maxTdp: 253,
      integrated: 'Intel UHD Graphics 770',
      technology: 'Intel 7'
    },
    cooling: {
      type: 'Advanced Hybrid Architecture',
      heatpipes: 6,
      fanCount: 2,
      airflow: '120 CFM',
      compatibility: ['LGA1700', 'AM5', 'AM4']
    },
    reviews: [
      {
        id: 1,
        author: 'John D.',
        rating: 5,
        date: '2026-07-10',
        comment: 'Exceptional performance for gaming and productivity. Runs cool under load.',
        helpful: 45
      },
      {
        id: 2,
        author: 'Sarah M.',
        rating: 4,
        date: '2026-07-05',
        comment: 'Great CPU but requires a good cooler. Worth the investment.',
        helpful: 32
      },
      {
        id: 3,
        author: 'Mike T.',
        rating: 5,
        date: '2026-06-28',
        comment: 'Best processor I\'ve ever owned. Handles everything I throw at it.',
        helpful: 28
      }
    ]
  };

  const [selectedImage, setSelectedImage] = useState(product.image);

  const handleAddToCart = () => {
    alert(t('product_detail.added_to_cart', { name: product.name, quantity }));
  };

  const handleBuyNow = () => {
    alert(t('product_detail.buy_now_success'));
    onNavigate('checkout');
  };

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      {/* Back Navigation */}
      <div className="bg-app-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('product_detail.back_to_catalog')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="aspect-square bg-bg-secondary">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all ${
                    selectedImage === img
                      ? 'ring-2 ring-blue shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                      : 'shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-blue/10 text-blue text-xs font-medium px-3 py-1.5 rounded-full">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-app-text">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-orange text-orange'
                        : 'text-app-text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-app-text-muted">
                {product.rating} ({product.reviews.length} {t('product_detail.reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="bg-app-surface rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-app-text-muted line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    product.stock > 10 ? 'text-green' : product.stock > 0 ? 'text-orange' : 'text-red'
                  }`}
                >
                  {product.stock > 10
                    ? t('product_detail.in_stock')
                    : product.stock > 0
                    ? t('product_detail.low_stock')
                    : t('product_detail.out_of_stock')}
                </span>
                <span className="text-sm text-app-text-muted">
                  ({product.stock} {t('product_detail.available')})
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-app-text-muted leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-app-text">{t('product_detail.quantity')}:</span>
              <div className="flex items-center gap-3 bg-app-surface rounded-lg px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-app-text hover:text-blue font-bold text-lg"
                >
                  −
                </button>
                <span className="text-app-text font-semibold min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-app-text hover:text-blue font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-app-surface hover:bg-bg-secondary text-app-text text-base font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('product_detail.add_to_cart')}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue hover:bg-blue/90 text-white text-base font-semibold px-6 py-4 rounded-xl transition-all shadow-sm"
              >
                {t('product_detail.buy_now')}
              </button>
            </div>

            {/* Wishlist & Stock Alert */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isWishlisted
                    ? 'bg-red/10 text-red'
                    : 'bg-app-surface text-app-text hover:bg-bg-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? t('product_detail.wishlisted') : t('product_detail.add_to_wishlist')}
              </button>
              <button
                onClick={() => setStockAlertEnabled(!stockAlertEnabled)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  stockAlertEnabled
                    ? 'bg-blue/10 text-blue'
                    : 'bg-app-surface text-app-text hover:bg-bg-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                }`}
              >
                <Bell className="w-5 h-5" />
                {stockAlertEnabled ? t('product_detail.alert_enabled') : t('product_detail.stock_alert')}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: Specs, Reviews, Cooling */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-app-border">
            {['specs', 'reviews', 'cooling'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'text-blue border-b-2 border-blue'
                    : 'text-app-text-muted hover:text-app-text'
                }`}
              >
                {t(`product_detail.tab_${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-xl font-semibold text-app-text mb-6">{t('product_detail.specifications')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                    {t(`product_detail.spec_${key}`)}
                  </div>
                  <div className="text-base font-semibold text-app-text">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-xl font-semibold text-app-text mb-6">
              {t('product_detail.customer_reviews')} ({product.reviews.length})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-app-border last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-app-text">{review.author}</div>
                      <div className="text-xs text-app-text-muted">{review.date}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-orange text-orange' : 'text-app-text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-app-text-muted text-sm mb-2">{review.comment}</p>
                  <button className="text-xs text-app-text-muted hover:text-blue transition-colors">
                    👍 {t('product_detail.helpful')} ({review.helpful})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cooling' && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <ThermometerSun className="w-6 h-6 text-blue" />
              <h2 className="text-xl font-semibold text-app-text">
                {t('product_detail.cooling_architecture')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-blue" />
                  <div>
                    <div className="text-sm text-app-text-muted">{t('product_detail.cooling_type')}</div>
                    <div className="text-base font-semibold text-app-text">{product.cooling.type}</div>
                  </div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                    {t('product_detail.heatpipes')}
                  </div>
                  <div className="text-base font-semibold text-app-text">{product.cooling.heatpipes}</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                    {t('product_detail.airflow')}
                  </div>
                  <div className="text-base font-semibold text-app-text">{product.cooling.airflow}</div>
                </div>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <div className="text-sm font-medium text-app-text mb-3">
                  {t('product_detail.compatible_sockets')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.cooling.compatibility.map((socket) => (
                    <span
                      key={socket}
                      className="bg-blue/10 text-blue text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {socket}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
