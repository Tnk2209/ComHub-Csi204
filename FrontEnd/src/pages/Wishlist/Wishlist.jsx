import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2, ShoppingCart, LogIn } from 'lucide-react';
import * as wishlistService from '../../services/wishlistService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

function Wishlist({ onNavigate }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    wishlistService.list()
      .then((data) => setWishlistItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.remove(productId);
      setWishlistItems(wishlistItems.filter((item) => item.product_id !== productId));
    } catch { /* ignore */ }
  };



  const addToCart = (item) => {
    if (item.product_stock > 0) {
      addItem({ id: item.product_id, name: item.product_name, price: Number(item.product_price), image_url: item.product_image_url });
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 bg-red/10 text-red text-xs font-semibold px-3 py-1 rounded-full">
          {t('wishlist.out_of_stock')}
        </span>
      );
    } else if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-xs font-semibold px-3 py-1 rounded-full">
          {t('wishlist.low_stock')} ({stock} {t('wishlist.left')})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-green/10 text-green text-xs font-semibold px-3 py-1 rounded-full">
        {t('wishlist.in_stock')} ({stock})
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 text-center max-w-md">
          <LogIn className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
          <p className="text-app-text text-lg font-semibold mb-2">{t('wishlist.login_required')}</p>
          <p className="text-app-text-muted text-sm mb-6">{t('wishlist.login_required_desc')}</p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all"
          >
            {t('nav.account')}
          </button>
        </div>
      </div>
    );
  }

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
                key={item.product_id}
                className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-bg-secondary cursor-pointer group" onClick={() => onNavigate('product-detail', item.product_id)}>
                  <img
                    src={item.product_image_url || 'https://via.placeholder.com/400x300'}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.product_id); }}
                    className="absolute top-2 right-2 bg-app-surface/90 backdrop-blur-sm p-2 rounded-full text-red hover:bg-app-surface transition-all shadow-sm"
                    title={t('wishlist.remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">{item.product_category}</div>
                  <h3
                    className="text-base font-semibold text-app-text mb-3 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
                    onClick={() => onNavigate('product-detail', item.product_id)}
                  >
                    {item.product_name}
                  </h3>

                  <div className="mb-3">{getStockBadge(item.product_stock)}</div>
                  <div className="text-2xl font-bold text-blue mb-4">฿{Number(item.product_price).toLocaleString()}</div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.product_stock === 0}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        item.product_stock > 0
                          ? 'bg-blue hover:bg-blue/90 text-white'
                          : 'bg-bg-secondary text-app-text-muted cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.product_stock > 0 ? t('wishlist.add_to_cart') : t('wishlist.out_of_stock')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue">{wishlistItems.length}</div>
                <div className="text-sm text-app-text-muted">{t('wishlist.total_items')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green">
                  {wishlistItems.filter((i) => i.product_stock > 0).length}
                </div>
                <div className="text-sm text-app-text-muted">{t('wishlist.available_items')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
