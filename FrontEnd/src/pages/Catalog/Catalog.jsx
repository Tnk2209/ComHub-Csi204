import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Search, Heart, ShoppingCart, BarChart3 } from 'lucide-react';
import * as productService from '../../services/productService.js';
import * as wishlistService from '../../services/wishlistService.js';
import { useCompare } from '../../contexts/CompareContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

function Catalog({ onNavigate }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { compareItems, addToCompare, removeFromCompare } = useCompare();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: t('catalog.categories.all') },
    { id: 'CPU', label: t('catalog.categories.cpu') },
    { id: 'GPU', label: t('catalog.categories.gpu') },
    { id: 'Mainboard', label: t('catalog.categories.motherboard') },
    { id: 'RAM', label: t('catalog.categories.ram') },
    { id: 'SSD', label: t('catalog.categories.storage') },
    { id: 'Case', label: t('catalog.categories.case') },
    { id: 'PSU', label: t('catalog.categories.psu') }
  ];

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (searchQuery.trim()) params.q = searchQuery.trim();

    productService.list(params)
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (!isAuthenticated) return;
    wishlistService.list()
      .then((items) => setWishlist(items.map((i) => i.product_id)))
      .catch(() => {});
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      try { await wishlistService.remove(productId); } catch {}
    } else {
      setWishlist((prev) => [...prev, productId]);
      try { await wishlistService.add(productId); } catch {}
    }
  };

  const compareList = compareItems.map((p) => p.id);

  const toggleCompare = (product) => {
    if (compareList.includes(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare({ id: product.id, name: product.name, category: product.category });
    }
  };

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue/20 to-blue/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-app-text mb-4">
              {t('catalog.hero_title')}
            </h1>
            <p className="text-lg text-app-text-muted max-w-2xl mx-auto">
              {t('catalog.hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-app-text-muted" />
            <input
              type="text"
              placeholder={t('catalog.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-app-surface text-app-text rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue text-white shadow-sm'
                  : 'bg-app-surface text-app-text hover:bg-bg-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Compare Panel */}
        {compareList.length > 0 && (
          <div className="mb-8 bg-app-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue" />
              <span className="text-sm font-medium text-app-text">
                {t('catalog.compare_selected', { count: compareList.length })}
              </span>
            </div>
            <button
              onClick={() => onNavigate('compare')}
              className="bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              {t('catalog.compare_btn')}
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-app-text-muted text-lg">Loading...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all overflow-hidden group"
            >
              {/* Product Image */}
              <div
                className="relative h-48 bg-bg-secondary cursor-pointer"
                onClick={() => onNavigate('product-detail', product.id)}
              >
                <img
                  src={product.image_url || `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/EEE/333?text=${encodeURIComponent(product.name)}`; }}
                />
                {product.stock_quantity <= 5 && (
                  <div className="absolute top-2 right-2 bg-orange text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {t('catalog.low_stock')}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  className="text-base font-semibold text-app-text mb-2 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
                  onClick={() => onNavigate('product-detail', product.id)}
                >
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-blue">${Number(product.price).toFixed(2)}</span>
                  <span className="text-sm text-app-text-muted">
                    {t('catalog.in_stock')}: {product.stock_quantity}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url });
                      Swal.fire({ icon: 'success', title: t('catalog.added_to_cart'), timer: 1500, showConfirmButton: false });
                    }}
                    className="flex-1 bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t('catalog.add_to_cart')}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2.5 rounded-lg transition-all ${
                      wishlist.includes(product.id)
                        ? 'bg-red text-white'
                        : 'bg-bg-secondary text-app-text hover:bg-bg-tertiary'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Compare Checkbox */}
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compareList.includes(product.id)}
                    onChange={() => toggleCompare(product)}
                    className="w-4 h-4 text-blue rounded focus:ring-blue"
                  />
                  <span className="text-xs text-app-text-muted">{t('catalog.add_to_compare')}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-app-text-muted text-lg">{t('catalog.no_products_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;
