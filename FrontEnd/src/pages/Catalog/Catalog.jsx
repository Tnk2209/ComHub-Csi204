import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Search, Heart, ShoppingCart, BarChart3, ChevronLeft, ChevronRight, SlidersHorizontal, X, Zap } from 'lucide-react';
import * as productService from '../../services/productService.js';
import * as wishlistService from '../../services/wishlistService.js';
import { useCompare } from '../../contexts/CompareContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 90000;

const formatTHB = (price) =>
  `฿${Number(price).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function Catalog({ onNavigate }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { compareItems, addToCompare, removeFromCompare } = useCompare();

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [sortBy, setSortBy] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Data state
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // full unfiltered list for brand extraction
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const categories = [
    { id: 'all', label: t('catalog.categories.all') },
    { id: 'CPU', label: t('catalog.categories.cpu') },
    { id: 'GPU', label: t('catalog.categories.gpu') },
    { id: 'Mainboard', label: t('catalog.categories.motherboard') },
    { id: 'RAM', label: t('catalog.categories.ram') },
    { id: 'SSD', label: t('catalog.categories.storage') },
    { id: 'Case', label: t('catalog.categories.case') },
    { id: 'PSU', label: t('catalog.categories.psu') },
  ];

  const sortOptions = [
    { value: '', label: t('catalog.sort_default') },
    { value: 'price_asc', label: t('catalog.sort_price_asc') },
    { value: 'price_desc', label: t('catalog.sort_price_desc') },
    { value: 'name_asc', label: t('catalog.sort_name_az') },
  ];

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, sortBy, inStockOnly]);

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Reset brand filter & price range when category changes
  useEffect(() => {
    setSelectedBrands([]);
    setPriceRange([0, MAX_PRICE]);
  }, [selectedCategory]);

  // Fetch all products (for brand list extraction — no price/sort filter)
  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    productService.list(params)
      .then(data => setAllProducts(data))
      .catch(() => setAllProducts([]));
  }, [selectedCategory]);

  // Fetch filtered + paginated products from server
  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (priceRange[0] > 0) params.min_price = priceRange[0];
    if (priceRange[1] < MAX_PRICE) params.max_price = priceRange[1];
    if (sortBy) params.sort = sortBy;
    if (inStockOnly) params.in_stock = 'true';
    params.limit = ITEMS_PER_PAGE;
    params.offset = (currentPage - 1) * ITEMS_PER_PAGE;

    productService.listWithCount(params)
      .then(({ data, total }) => {
        setProducts(data);
        setTotalCount(total);
      })
      .catch(() => { setProducts([]); setTotalCount(0); })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, priceRange, sortBy, inStockOnly, currentPage, selectedBrands]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Wishlist
  useEffect(() => {
    if (!isAuthenticated) return;
    wishlistService.list()
      .then(items => setWishlist(items.map(i => i.product_id)))
      .catch(() => {});
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      try { await wishlistService.remove(productId); } catch {}
    } else {
      setWishlist(prev => [...prev, productId]);
      try { await wishlistService.add(productId); } catch {}
    }
  };

  const availableBrands = Array.from(
    new Set(allProducts.map(p => p.brand).filter(Boolean))
  ).sort();

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const compareList = compareItems.map(p => p.id);
  const toggleCompare = (product) => {
    if (compareList.includes(product.id)) removeFromCompare(product.id);
    else addToCompare({ id: product.id, name: product.name, category: product.category });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const hasActiveFilters = selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < MAX_PRICE || inStockOnly || sortBy;

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, MAX_PRICE]);
    setSortBy('');
    setInStockOnly(false);
  };

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue/20 to-blue/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-app-text mb-3">
              {t('catalog.hero_title')}
            </h1>
            <p className="text-lg text-app-text-muted max-w-2xl mx-auto">
              {t('catalog.hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search + Sort bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-muted" />
            <input
              type="text"
              placeholder={t('catalog.search_placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-app-surface text-app-text rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3.5 bg-app-surface text-app-text rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all min-w-[180px] cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-sm font-medium transition-all ${sidebarOpen ? 'bg-blue text-white' : 'bg-app-surface text-app-text'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('catalog.filter_sort')}
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 rounded-full bg-orange" />
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(cat => (
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

        {/* Compare Banner */}
        {compareList.length > 0 && (
          <div className="mb-6 bg-app-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex items-center justify-between">
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

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filter */}
          {sidebarOpen && (
            <div className="w-full md:w-78 shrink-0">
              <div className="bg-app-surface p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] sticky top-24 space-y-6">
                {/* Clear button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-red border border-red/30 rounded-lg py-2 hover:bg-red/5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t('catalog.clear_filters')}
                  </button>
                )}

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-bold text-app-text mb-3 border-b border-bg-secondary pb-2">
                    {t('catalog.filter_price_range')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-app-text-muted font-medium">
                      <span>{formatTHB(priceRange[0])}</span>
                      <span>{formatTHB(priceRange[1])}</span>
                    </div>
                    {/* Min price slider */}
                    <div>
                      <label className="text-xs text-app-text-muted mb-1 block">ขั้นต่ำ</label>
                      <input
                        type="range"
                        min={0}
                        max={MAX_PRICE}
                        step={500}
                        value={priceRange[0]}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
                        }}
                        className="w-full accent-blue cursor-pointer"
                      />
                    </div>
                    {/* Max price slider */}
                    <div>
                      <label className="text-xs text-app-text-muted mb-1 block">สูงสุด</label>
                      <input
                        type="range"
                        min={0}
                        max={MAX_PRICE}
                        step={500}
                        value={priceRange[1]}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
                        }}
                        className="w-full accent-blue cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* In Stock Only */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-blue rounded border-app-border focus:ring-blue"
                    />
                    <span className="text-sm font-medium text-app-text group-hover:text-blue transition-colors">
                      {t('catalog.in_stock_only')}
                    </span>
                  </label>
                </div>

                {/* Brand Filter */}
                {availableBrands.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-app-text mb-3 border-b border-bg-secondary pb-2">
                      {t('catalog.filter_by_brand')}
                    </h3>
                    <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                      {availableBrands.map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-blue rounded border-app-border focus:ring-blue"
                          />
                          <span className="text-sm text-app-text group-hover:text-blue transition-colors">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-app-text-muted">
                {!loading && t('catalog.showing_results', {
                  count: products.length,
                  total: totalCount
                })}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-app-text-muted">
                  {t('catalog.page_of', { page: currentPage, total: totalPages })}
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-app-surface rounded-2xl animate-pulse overflow-hidden">
                    <div className="h-48 bg-bg-secondary" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-bg-secondary rounded w-1/3" />
                      <div className="h-4 bg-bg-secondary rounded w-3/4" />
                      <div className="h-6 bg-bg-secondary rounded w-1/2" />
                      <div className="h-9 bg-bg-secondary rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map(product => {
                    const specs = product.specifications || {};
                    const specBadges = [
                      specs.socket && `Socket: ${specs.socket}`,
                      specs.tdp && `TDP: ${specs.tdp}W`,
                      specs.wattage && `${specs.wattage}W`,
                      specs.memory_size && `VRAM: ${specs.memory_size}`,
                      specs.capacity && `Cap: ${specs.capacity}`,
                    ].filter(Boolean).slice(0, 2);

                    return (
                      <div
                        key={product.id}
                        className="bg-app-surface/90 backdrop-blur-md rounded-2xl border border-app-border/40 hover:border-blue/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
                      >
                        {/* Product Image */}
                        <div
                          className="relative h-48 bg-white cursor-pointer overflow-hidden flex items-center justify-center border-b border-app-border/20"
                          onClick={() => onNavigate('product-detail', product.id)}
                        >
                          <img
                            src={product.image_url || `https://placehold.co/300x300?text=${encodeURIComponent(product.name)}`}
                            alt={product.name}
                            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                            onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/EEE/333?text=${encodeURIComponent(product.name)}`; }}
                          />
                          {/* Hover Spec Preview Overlay */}
                          {specBadges.length > 0 && (
                            <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {specBadges.map((badge, idx) => (
                                <span key={idx} className="text-[10px] font-mono font-bold bg-slate-900/80 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                              {t('catalog.low_stock')}
                            </div>
                          )}
                          {product.stock_quantity === 0 && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="bg-black/80 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-full shadow-lg">สินค้าหมด</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="text-[11px] font-bold text-blue tracking-wider uppercase mb-1">
                            {product.brand}
                          </div>
                          <h3
                            className="text-sm font-semibold text-app-text mb-3 line-clamp-2 cursor-pointer hover:text-blue transition-colors flex-1 leading-relaxed"
                            onClick={() => onNavigate('product-detail', product.id)}
                          >
                            {product.name}
                          </h3>
                          <div className="flex items-baseline justify-between mb-3 border-t border-app-border/20 pt-2.5">
                            <span className="text-xl font-bold text-blue font-mono">
                              {formatTHB(product.price)}
                            </span>
                            <span className="text-[11px] font-medium text-app-text-muted">
                              {t('catalog.in_stock')}: {product.stock_quantity}
                            </span>
                          </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              addItem({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url });
                              onNavigate && onNavigate('cart');
                            }}
                            disabled={product.stock_quantity === 0}
                            className="flex-1 bg-blue hover:bg-blue/90 disabled:bg-app-text-muted disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            title={t('catalog.buy_now')}
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            {t('catalog.buy_now')}
                          </button>
                          <button
                            onClick={() => {
                              addItem({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url });
                              Swal.fire({ icon: 'success', title: t('catalog.added_to_cart'), timer: 1500, showConfirmButton: false });
                            }}
                            disabled={product.stock_quantity === 0}
                            className="p-2.5 bg-app-surface border border-app-border/80 hover:bg-bg-secondary disabled:bg-app-text-muted disabled:cursor-not-allowed text-app-text hover:text-blue rounded-lg transition-all flex items-center justify-center cursor-pointer"
                            title={t('catalog.add_to_cart')}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="sr-only">{t('catalog.add_to_cart')}</span>
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2.5 rounded-lg transition-all ${
                              wishlist.includes(product.id)
                                ? 'bg-red text-white'
                                : 'bg-app-surface border border-app-border/80 text-app-text hover:bg-bg-secondary'
                            }`}
                            title={t('catalog.add_to_wishlist', 'รายการโปรด')}
                          >
                            <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
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
                  );
                })}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-app-text-muted text-lg font-medium">{t('catalog.no_products_found')}</p>
                    <button onClick={clearAllFilters} className="mt-4 text-blue hover:underline text-sm">
                      {t('catalog.clear_filters')}
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-app-surface text-app-text text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-secondary transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('catalog.prev_page')}
                    </button>

                    {currentPage > 3 && (
                      <>
                        <button onClick={() => setCurrentPage(1)} className="w-9 h-9 rounded-lg bg-app-surface text-app-text text-sm font-medium hover:bg-bg-secondary transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.08)]">1</button>
                        {currentPage > 4 && <span className="text-app-text-muted">…</span>}
                      </>
                    )}

                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${
                          page === currentPage
                            ? 'bg-blue text-white'
                            : 'bg-app-surface text-app-text hover:bg-bg-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="text-app-text-muted">…</span>}
                        <button onClick={() => setCurrentPage(totalPages)} className="w-9 h-9 rounded-lg bg-app-surface text-app-text text-sm font-medium hover:bg-bg-secondary transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.08)]">{totalPages}</button>
                      </>
                    )}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-app-surface text-app-text text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-secondary transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    >
                      {t('catalog.next_page')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog;
