import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Loader2, Trash2, CheckCircle2, AlertTriangle, AlertCircle, Info, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import * as productService from '../../services/productService';
import * as reviewService from '../../services/reviewService';
import * as wishlistService from '../../services/wishlistService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { loadBuilderState, saveBuilderState } from '../PCBuilder/builderStorage';
import { buildCompatibility } from '../PCBuilder/buildCompatibility';

const CATEGORY_TO_KEY = {
  'CPU': 'cpu',
  'Mainboard': 'motherboard',
  'GPU': 'gpu',
  'RAM': 'ram',
  'SSD': 'storage',
  'Case': 'case',
  'PSU': 'psu',
};

const CATEGORY_CHECKS = {
  'cpu': ['socket', 'ramType', 'power'],
  'motherboard': ['socket', 'ramType', 'formFactor', 'power'],
  'gpu': ['clearance', 'power'],
  'ram': ['ramType', 'power'],
  'case': ['formFactor', 'clearance'],
  'psu': ['power'],
  'storage': ['power']
};

const SPEC_LABEL_MAP = {
  th: {
    socket: 'ประเภทซ็อกเก็ต (Socket)',
    cores: 'จำนวนคอร์ (Cores)',
    threads: 'จำนวนเธรด (Threads)',
    base_clock_ghz: 'ความเร็วพื้นฐาน (Base Clock)',
    boost_clock_ghz: 'ความเร็วบูสต์ (Boost Clock)',
    cache: 'แคช (Cache)',
    tdp: 'อัตราการกินไฟ (TDP)',
    supported_ram: 'ประเภทแรมที่รองรับ (Supported RAM)',
    ram_type: 'ประเภทแรม (RAM Type)',
    form_factor: 'ขนาด (Form Factor)',
    capacity: 'ความจุ (Capacity)',
    read_speed: 'ความเร็วการอ่าน (Read Speed)',
    write_speed: 'ความเร็วการเขียน (Write Speed)',
    gpu_length_mm: 'ความยาวการ์ดจอ (GPU Length)',
    max_gpu_length_mm: 'ความยาวการ์ดจอสูงสุดที่รองรับ (Max GPU Length)',
    wattage: 'กำลังไฟ (Wattage)',
    efficiency_rating: 'มาตรฐานพลังงาน (Efficiency Rating)',
    interface: 'อินเตอร์เฟส (Interface)',
    memory_size: 'ความจุแรมการ์ดจอ (VRAM Capacity)',
    memory_type: 'ประเภทแรมการ์ดจอ (VRAM Type)',
  },
  en: {
    socket: 'Socket Type',
    cores: 'Cores',
    threads: 'Threads',
    base_clock_ghz: 'Base Clock',
    boost_clock_ghz: 'Boost Clock',
    cache: 'Cache',
    tdp: 'TDP (Watts)',
    supported_ram: 'Supported RAM',
    ram_type: 'RAM Type',
    form_factor: 'Form Factor',
    capacity: 'Capacity',
    read_speed: 'Read Speed',
    write_speed: 'Write Speed',
    gpu_length_mm: 'GPU Length',
    max_gpu_length_mm: 'Max GPU Length Allowed',
    wattage: 'Wattage',
    efficiency_rating: 'Efficiency Rating',
    interface: 'Interface',
    memory_size: 'VRAM Capacity',
    memory_type: 'VRAM Type',
  }
};

const getSpecLabel = (key, lng) => {
  const map = SPEC_LABEL_MAP[lng] || SPEC_LABEL_MAP['en'];
  if (map && map[key.toLowerCase()]) {
    return map[key.toLowerCase()];
  }
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatSpecValue = (val) => {
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  return String(val);
};

function ProductDetail({ onNavigate, productId: propProductId }) {
  const { t, i18n } = useTranslation();
  const { addItem, totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const productId = propProductId || location.state;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // PC Builder Integration State
  const [builderParts, setBuilderParts] = useState(() => loadBuilderState());

  const key = product ? CATEGORY_TO_KEY[product.category] : null;

  const compatibilityInfo = useMemo(() => {
    if (!key || !product) return null;
    const testParts = { ...builderParts };
    const specs = product.specifications || {};
    testParts[key] = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      tdp: Number(specs.tdp) || 0,
      socket: specs.socket || null,
      ramType: specs.ram_type || specs.supported_ram || null,
      formFactor: specs.form_factor || null,
      length: (specs.gpu_length_mm || specs.length_mm) ? Number(specs.gpu_length_mm || specs.length_mm) : null,
      maxGpuLength: specs.max_gpu_length_mm ? Number(specs.max_gpu_length_mm) : null,
      wattage: specs.wattage ? Number(specs.wattage) : null,
    };

    const { checks } = buildCompatibility(testParts);
    const hasBuildStarted = Object.values(builderParts).some((item) => item !== null);

    if (!hasBuildStarted) return { hasBuildStarted: false };

    const relevantCheckNames = CATEGORY_CHECKS[key] || [];
    const relevantChecks = relevantCheckNames.map(name => ({
      name,
      ...checks[name]
    })).filter(c => c.status !== 'idle');

    const errors = relevantChecks.filter(c => c.status === 'error');
    const warnings = relevantChecks.filter(c => c.status === 'warning');
    const successes = relevantChecks.filter(c => c.status === 'success');

    return {
      hasBuildStarted,
      relevantChecks,
      errors,
      warnings,
      successes,
    };
  }, [product, builderParts, key]);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    Promise.all([
      productService.get(productId),
      reviewService.list(productId, { limit: 10, offset: 0 }),
    ])
      .then(([prod, revData]) => {
        setProduct(prod);
        setReviews(revData.reviews || []);
        setReviewTotal(revData.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!isAuthenticated || !productId) return;
    wishlistService.list()
      .then((items) => {
        setIsWishlisted(items.some((i) => i.product_id === productId));
      })
      .catch(() => {});
  }, [isAuthenticated, productId]);

  const refreshReviews = async () => {
    try {
      const revData = await reviewService.list(productId, { limit: 10, offset: 0 });
      setReviews(revData.reviews || []);
      setReviewTotal(revData.total || 0);
    } catch { /* ignore */ }
  };

  const handleSubmitReview = async () => {
    if (!reviewRating) return;
    setReviewError('');
    setReviewSubmitting(true);
    try {
      await reviewService.create(productId, { rating: reviewRating, comment: reviewComment });
      setReviewRating(0);
      setReviewComment('');
      await refreshReviews();
    } catch (err) {
      if (err?.status === 409) {
        setReviewError(t('product_detail.already_reviewed', 'You have already reviewed this product'));
      } else {
        setReviewError(err?.body?.message || t('product_detail.review_error', 'Failed to submit review'));
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.remove(reviewId);
      await refreshReviews();
    } catch { /* ignore */ }
  };

  const handleAddToCart = () => {
    if (product && product.stock_quantity > 0) {
      addItem({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url, brand: product.brand, stock_quantity: product.stock_quantity }, quantity);
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: t('product_detail.added_to_cart_toast', { name: product.name, quantity, total: totalItems + quantity }),
      });
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await wishlistService.remove(productId);
        setIsWishlisted(false);
      } else {
        await wishlistService.add(productId);
        setIsWishlisted(true);
      }
    } catch { /* ignore */ }
  };

  const handleAddToBuilder = () => {
    if (!key || !product) return;
    const specs = product.specifications || {};
    const builderItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      tdp: Number(specs.tdp) || 0,
      socket: specs.socket || null,
      ramType: specs.ram_type || specs.supported_ram || null,
      formFactor: specs.form_factor || null,
      length: (specs.gpu_length_mm || specs.length_mm) ? Number(specs.gpu_length_mm || specs.length_mm) : null,
      maxGpuLength: specs.max_gpu_length_mm ? Number(specs.max_gpu_length_mm) : null,
      wattage: specs.wattage ? Number(specs.wattage) : null,
    };
    
    const newParts = { ...builderParts, [key]: builderItem };
    saveBuilderState(newParts);
    setBuilderParts(newParts);
    
    Swal.fire({
      icon: 'success',
      title: t('product_detail.added_to_builder', 'เพิ่มลงสเปคคอมฯ เรียบร้อยแล้ว!'),
      text: `${product.name} ถูกติดตั้งลงในรายการจัดสเปคเรียบร้อย`,
      showCancelButton: true,
      confirmButtonText: t('product_detail.go_to_builder', 'ไปหน้าจัดสเปคคอมฯ'),
      cancelButtonText: t('common.close', 'ปิดหน้าต่าง'),
      confirmButtonColor: '#0a84ff',
    }).then((result) => {
      if (result.isConfirmed) {
        onNavigate('builder');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted">Product not found</p>
      </div>
    );
  }

  const avgRating = product.average_rating ? Number(product.average_rating) : 0;
  const specs = product.specifications || {};

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
          {/* Left: Product Image */}
          <div>
            <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="aspect-square bg-white flex items-center justify-center p-6 border border-app-border/20 rounded-2xl">
                <img
                  src={product.image_url || `https://placehold.co/800x600/EEE/333?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x600/EEE/333?text=${encodeURIComponent(product.name)}`; }}
                />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue/10 text-blue text-xs font-medium px-3 py-1.5 rounded-full">
              {product.category}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-app-text">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'fill-orange text-orange' : 'text-app-text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-app-text-muted">
                {avgRating.toFixed(1)} ({reviewTotal} {t('product_detail.reviews')})
              </span>
            </div>

            {/* Spec Highlight Badges */}
            {specs && Object.keys(specs).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {specs.socket && (
                  <div className="bg-app-surface/90 border border-app-border/40 p-2.5 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] uppercase text-app-text-muted block font-semibold">Socket</span>
                    <span className="text-xs font-bold text-blue font-mono">{specs.socket}</span>
                  </div>
                )}
                {(specs.tdp || specs.wattage) && (
                  <div className="bg-app-surface/90 border border-app-border/40 p-2.5 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] uppercase text-app-text-muted block font-semibold">Power</span>
                    <span className="text-xs font-bold text-amber-500 font-mono">{specs.tdp ? `${specs.tdp}W TDP` : `${specs.wattage}W`}</span>
                  </div>
                )}
                {specs.form_factor && (
                  <div className="bg-app-surface/90 border border-app-border/40 p-2.5 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] uppercase text-app-text-muted block font-semibold">Form Factor</span>
                    <span className="text-xs font-bold text-app-text font-mono">{specs.form_factor}</span>
                  </div>
                )}
                {(specs.supported_ram || specs.ram_type) && (
                  <div className="bg-app-surface/90 border border-app-border/40 p-2.5 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] uppercase text-app-text-muted block font-semibold">RAM</span>
                    <span className="text-xs font-bold text-cyan-500 font-mono">{formatSpecValue(specs.supported_ram || specs.ram_type)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Price */}
            <div className="bg-app-surface rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <span className="text-4xl font-bold text-blue">฿{Number(product.price).toLocaleString()}</span>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-sm font-medium ${product.stock_quantity > 10 ? 'text-green' : product.stock_quantity > 0 ? 'text-orange' : 'text-red'}`}>
                  {product.stock_quantity > 10 ? t('product_detail.in_stock') : product.stock_quantity > 0 ? t('product_detail.low_stock') : t('product_detail.out_of_stock')}
                </span>
                <span className="text-sm text-app-text-muted">({product.stock_quantity} {t('product_detail.available')})</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-app-text">{t('product_detail.quantity')}:</span>
              <div className="flex items-center gap-3 bg-app-surface rounded-lg px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-app-text hover:text-blue font-bold text-lg">−</button>
                <span className="text-app-text font-semibold min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="text-app-text hover:text-blue font-bold text-lg">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-app-surface hover:bg-bg-secondary text-app-text text-base font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('product_detail.add_to_cart')}
              </button>
            </div>

            {/* Wishlist & PC Builder buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isWishlisted ? 'bg-red/10 text-red' : 'bg-app-surface text-app-text hover:bg-bg-secondary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? t('product_detail.wishlisted') : t('product_detail.add_to_wishlist')}
              </button>

              <button
                onClick={handleAddToBuilder}
                className="flex items-center justify-center gap-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                {t('product_detail.add_to_builder')}
              </button>
            </div>

            {/* PC Builder Compatibility Card */}
            {compatibilityInfo?.hasBuildStarted && (
              <div className="bg-app-surface rounded-xl p-5 border border-app-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.08)] mt-4">
                <div className="flex items-center gap-2 mb-3 border-b border-app-border pb-2">
                  <Info className="w-4 h-4 text-blue" />
                  <h3 className="text-sm font-bold text-app-text">{t('product_detail.compatibility_status')}</h3>
                </div>
                <div className="space-y-2.5">
                  {compatibilityInfo.errors.map((check) => (
                    <div key={check.name} className="flex items-start gap-2 text-red text-xs font-medium leading-relaxed">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{t(`builder.compat_rules.${check.message}`, check.params)}</span>
                    </div>
                  ))}
                  {compatibilityInfo.warnings.map((check) => (
                    <div key={check.name} className="flex items-start gap-2 text-orange text-xs font-medium leading-relaxed">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{t(`builder.compat_rules.${check.message}`, check.params)}</span>
                    </div>
                  ))}
                  {compatibilityInfo.errors.length === 0 && (
                    <div className="flex items-start gap-2 text-green text-xs font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {compatibilityInfo.successes.length > 0
                          ? t('product_detail.compatible')
                          : t('product_detail.no_conflicts')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Specs, Reviews */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-app-border">
            {['specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === tab ? 'text-blue border-b-2 border-blue' : 'text-app-text-muted hover:text-app-text'
                }`}
              >
                {t(`product_detail.tab_${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content: Specs */}
        {activeTab === 'specs' && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-xl font-semibold text-app-text mb-6">{t('product_detail.specifications')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                    {getSpecLabel(key, i18n.language)}
                  </div>
                  <div className="text-base font-semibold text-app-text">
                    {formatSpecValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-xl font-semibold text-app-text mb-6">
              {t('product_detail.customer_reviews')} ({reviewTotal})
            </h2>

            {/* Review Form */}
            {isAuthenticated && (
              <div className="mb-8 border-b border-app-border pb-6">
                <h3 className="text-sm font-semibold text-app-text mb-3">{t('product_detail.write_review', 'Write a Review')}</h3>
                {reviewError && (
                  <div className="bg-red/10 text-red text-sm px-4 py-2 rounded-lg mb-3">{reviewError}</div>
                )}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      data-testid="review-star"
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-0.5"
                    >
                      <Star className={`w-6 h-6 transition-colors ${star <= reviewRating ? 'fill-orange text-orange' : 'text-app-text-muted hover:text-orange'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={t('product_detail.review_placeholder', 'Write your review...')}
                  maxLength={1000}
                  rows={3}
                  className="w-full px-4 py-3 bg-bg-secondary text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/50 resize-none mb-3"
                />
                <button
                  data-testid="submit-review"
                  onClick={handleSubmitReview}
                  disabled={!reviewRating || reviewSubmitting}
                  className="bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewSubmitting ? '...' : t('product_detail.submit_review', 'Submit Review')}
                </button>
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-app-text-muted">{t('product_detail.no_reviews')}</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-app-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-app-text">{review.user_name}</div>
                        <div className="text-xs text-app-text-muted">{new Date(review.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-orange text-orange' : 'text-app-text-muted'}`} />
                          ))}
                        </div>
                        {user && review.user_id === user.id && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-red hover:bg-red/10 rounded transition-colors"
                            title={t('product_detail.delete_review', 'Delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-app-text-muted text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
