import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Bell, Trash2, ShoppingCart } from 'lucide-react';

function Wishlist({ onNavigate }) {
  const { t } = useTranslation();

  // Mock wishlist data
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Intel Core i9-14900K',
      category: 'CPU',
      price: 599.99,
      stock: 12,
      stockStatus: 'in_stock',
      image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
      alertEnabled: true
    },
    {
      id: 3,
      name: 'NVIDIA RTX 4090',
      category: 'GPU',
      price: 1599.99,
      stock: 3,
      stockStatus: 'low_stock',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop',
      alertEnabled: false
    },
    {
      id: 9,
      name: 'AMD Ryzen 9 7900X',
      category: 'CPU',
      price: 449.99,
      stock: 0,
      stockStatus: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
      alertEnabled: true
    },
    {
      id: 10,
      name: 'ASUS ROG STRIX X670E',
      category: 'Motherboard',
      price: 499.99,
      stock: 8,
      stockStatus: 'in_stock',
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
      alertEnabled: false
    }
  ]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
  };

  const toggleStockAlert = (itemId) => {
    setWishlistItems(
      wishlistItems.map((item) =>
        item.id === itemId ? { ...item, alertEnabled: !item.alertEnabled } : item
      )
    );
  };

  const addToCart = (itemId) => {
    const item = wishlistItems.find((i) => i.id === itemId);
    if (item.stock > 0) {
      alert(t('wishlist.added_to_cart', { name: item.name }));
    } else {
      alert(t('wishlist.out_of_stock_error'));
    }
  };

  const getStockBadge = (stockStatus, stock) => {
    if (stockStatus === 'out_of_stock') {
      return (
        <span className="inline-flex items-center gap-1 bg-red/10 text-red text-xs font-semibold px-3 py-1 rounded-full">
          {t('wishlist.out_of_stock')}
        </span>
      );
    } else if (stockStatus === 'low_stock') {
      return (
        <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-xs font-semibold px-3 py-1 rounded-full">
          {t('wishlist.low_stock')} ({stock} {t('wishlist.left')})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 bg-green/10 text-green text-xs font-semibold px-3 py-1 rounded-full">
          {t('wishlist.in_stock')} ({stock})
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red fill-current" />
          <h1 className="text-3xl font-bold text-app-text">{t('wishlist.title')}</h1>
          <span className="text-app-text-muted">
            ({wishlistItems.length} {t('wishlist.items')})
          </span>
        </div>

        {/* Info Card */}
        <div className="bg-blue/5 border-l-4 border-blue rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-app-text leading-relaxed">{t('wishlist.alert_info')}</p>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 text-center">
            <Heart className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
            <p className="text-app-text-muted text-lg mb-2">{t('wishlist.empty')}</p>
            <p className="text-app-text-muted text-sm mb-6">{t('wishlist.empty_desc')}</p>
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all"
            >
              {t('wishlist.browse_catalog')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all overflow-hidden"
              >
                {/* Product Image */}
                <div
                  className="relative h-48 bg-bg-secondary cursor-pointer group"
                  onClick={() => onNavigate('product-detail', item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 bg-app-surface/90 backdrop-blur-sm p-2 rounded-full text-red hover:bg-app-surface transition-all shadow-sm"
                    title={t('wishlist.remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                    {item.category}
                  </div>
                  <h3
                    className="text-base font-semibold text-app-text mb-3 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
                    onClick={() => onNavigate('product-detail', item.id)}
                  >
                    {item.name}
                  </h3>

                  {/* Stock Status Badge */}
                  <div className="mb-3">{getStockBadge(item.stockStatus, item.stock)}</div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-blue mb-4">${item.price}</div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(item.id)}
                      disabled={item.stock === 0}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        item.stock > 0
                          ? 'bg-blue hover:bg-blue/90 text-white'
                          : 'bg-bg-secondary text-app-text-muted cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.stock > 0 ? t('wishlist.add_to_cart') : t('wishlist.out_of_stock')}
                    </button>

                    {/* Stock Alert Toggle */}
                    {item.stock <= 5 && (
                      <button
                        onClick={() => toggleStockAlert(item.id)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          item.alertEnabled
                            ? 'bg-orange/10 text-orange border-2 border-orange'
                            : 'bg-bg-secondary text-app-text hover:bg-bg-tertiary border-2 border-transparent'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                        {item.alertEnabled
                          ? t('wishlist.alert_enabled')
                          : t('wishlist.enable_alert')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue">{wishlistItems.length}</div>
                <div className="text-sm text-app-text-muted">{t('wishlist.total_items')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green">
                  {wishlistItems.filter((i) => i.stock > 0).length}
                </div>
                <div className="text-sm text-app-text-muted">{t('wishlist.available_items')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange">
                  {wishlistItems.filter((i) => i.alertEnabled).length}
                </div>
                <div className="text-sm text-app-text-muted">{t('wishlist.alerts_enabled')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
