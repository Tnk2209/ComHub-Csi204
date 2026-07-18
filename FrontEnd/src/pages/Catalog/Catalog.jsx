import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Heart, ShoppingCart, BarChart3 } from 'lucide-react';

function Catalog({ onNavigate }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: 'Intel Core i9-14900K',
      category: 'cpu',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
      stock: 12,
      specs: { socket: 'LGA1700', cores: 24, tdp: 125 }
    },
    {
      id: 2,
      name: 'AMD Ryzen 9 7950X',
      category: 'cpu',
      price: 549.99,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
      stock: 8,
      specs: { socket: 'AM5', cores: 16, tdp: 170 }
    },
    {
      id: 3,
      name: 'NVIDIA RTX 4090',
      category: 'gpu',
      price: 1599.99,
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop',
      stock: 5,
      specs: { vram: '24GB', tdp: 450, length: 336 }
    },
    {
      id: 4,
      name: 'ASUS ROG STRIX Z790-E',
      category: 'motherboard',
      price: 459.99,
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
      stock: 15,
      specs: { socket: 'LGA1700', formFactor: 'ATX', ram: 'DDR5' }
    },
    {
      id: 5,
      name: 'Corsair Vengeance DDR5 32GB',
      category: 'ram',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=400&h=300&fit=crop',
      stock: 25,
      specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5' }
    },
    {
      id: 6,
      name: 'Samsung 990 Pro 2TB NVMe',
      category: 'storage',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
      stock: 30,
      specs: { capacity: '2TB', interface: 'PCIe 4.0', speed: '7450MB/s' }
    },
    {
      id: 7,
      name: 'NZXT H7 Flow',
      category: 'case',
      price: 139.99,
      image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=400&h=300&fit=crop',
      stock: 10,
      specs: { formFactor: 'Mid Tower', gpuClearance: 400, panelType: 'Tempered Glass' }
    },
    {
      id: 8,
      name: 'Corsair RM1000x 1000W',
      category: 'psu',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1591238372408-221238c0c98e?w=400&h=300&fit=crop',
      stock: 18,
      specs: { wattage: 1000, efficiency: '80+ Gold', modular: 'Fully Modular' }
    }
  ];

  const categories = [
    { id: 'all', label: t('catalog.categories.all') },
    { id: 'cpu', label: t('catalog.categories.cpu') },
    { id: 'gpu', label: t('catalog.categories.gpu') },
    { id: 'motherboard', label: t('catalog.categories.motherboard') },
    { id: 'ram', label: t('catalog.categories.ram') },
    { id: 'storage', label: t('catalog.categories.storage') },
    { id: 'case', label: t('catalog.categories.case') },
    { id: 'psu', label: t('catalog.categories.psu') }
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (productId) => {
    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
    } else if (compareList.length < 3) {
      setCompareList((prev) => [...prev, productId]);
    } else {
      alert(t('catalog.compare_limit'));
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
              onClick={() => alert(t('catalog.compare_feature_coming_soon'))}
              className="bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              {t('catalog.compare_btn')}
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock <= 5 && (
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
                  <span className="text-2xl font-bold text-blue">${product.price}</span>
                  <span className="text-sm text-app-text-muted">
                    {t('catalog.in_stock')}: {product.stock}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(t('catalog.added_to_cart'))}
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
                    onChange={() => toggleCompare(product.id)}
                    className="w-4 h-4 text-blue rounded focus:ring-blue"
                  />
                  <span className="text-xs text-app-text-muted">{t('catalog.add_to_compare')}</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-app-text-muted text-lg">{t('catalog.no_products_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;
