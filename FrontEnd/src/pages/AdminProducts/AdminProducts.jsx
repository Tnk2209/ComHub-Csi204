import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Edit2, Trash2, Power, PowerOff, Save, X, Search } from 'lucide-react';

function AdminProducts({ onNavigate }) {
  const { t } = useTranslation();

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Intel Core i9-14900K',
      category: 'CPU',
      price: 599.99,
      stock: 45,
      isActive: true,
      specifications: {
        cores: 24,
        threads: 32,
        baseClock: '3.0 GHz',
        boostClock: '6.0 GHz',
        socket: 'LGA1700'
      }
    },
    {
      id: 2,
      name: 'NVIDIA RTX 4090',
      category: 'GPU',
      price: 1599.99,
      stock: 8,
      isActive: true,
      specifications: {
        memory: '24GB GDDR6X',
        coreClock: '2.23 GHz',
        boostClock: '2.52 GHz',
        tdp: '450W'
      }
    },
    {
      id: 3,
      name: 'AMD RX 6700 XT',
      category: 'GPU',
      price: 399.99,
      stock: 0,
      isActive: false,
      specifications: {
        memory: '12GB GDDR6',
        coreClock: '2.42 GHz',
        boostClock: '2.58 GHz',
        tdp: '230W'
      }
    },
    {
      id: 4,
      name: 'Corsair Vengeance DDR5 64GB',
      category: 'RAM',
      price: 249.99,
      stock: 52,
      isActive: true,
      specifications: {
        capacity: '64GB',
        speed: '5600 MHz',
        type: 'DDR5',
        modules: '2x32GB'
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'CPU',
    price: '',
    stock: '',
    specifications: {}
  });

  const categories = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'Case', 'PSU'];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      specifications: { ...product.specifications }
    });
    setIsCreating(true);
  };

  const handleDelete = (id) => {
    if (confirm(t('admin_products.confirm_delete'))) {
      setProducts(products.filter((p) => p.id !== id));
      alert(t('admin_products.delete_success'));
    }
  };

  const handleToggleActive = (id) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    const product = products.find((p) => p.id === id);
    alert(
      product.isActive
        ? t('admin_products.deactivate_success')
        : t('admin_products.activate_success')
    );
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert(t('admin_products.validation_required'));
      return;
    }

    const newProduct = {
      id: editingProduct || Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      isActive: true,
      specifications: { ...formData.specifications }
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct ? newProduct : p)));
      alert(t('admin_products.update_success'));
    } else {
      setProducts([...products, newProduct]);
      alert(t('admin_products.create_success'));
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'CPU',
      price: '',
      stock: '',
      specifications: {}
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSpecChange = (key, value) => {
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [key]: value }
    });
  };

  const addSpecField = () => {
    const key = prompt(t('admin_products.spec_key_prompt'));
    if (key) {
      handleSpecChange(key, '');
    }
  };

  const removeSpecField = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue" />
            <div>
              <h1 className="text-3xl font-bold text-app-text">{t('admin_products.title')}</h1>
              <p className="text-sm text-app-text-muted">{t('admin_products.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            {t('admin_products.add_product')}
          </button>
        </div>

        {/* Search & Filter */}
        {!isCreating && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin_products.search_placeholder')}
                className="w-full pl-12 pr-4 py-3 bg-app-surface border border-app-border rounded-xl text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-app-surface border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-blue transition-all"
            >
              <option value="all">{t('admin_products.all_categories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
            <h2 className="text-xl font-bold text-app-text mb-6">
              {editingProduct ? t('admin_products.edit_product') : t('admin_products.new_product')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_products.product_name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Intel Core i9-14900K"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_products.category')} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_products.price')} * ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="599.99"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_products.stock')} *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="45"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t border-app-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-app-text">
                    {t('admin_products.specifications')}
                  </h3>
                  <button
                    onClick={addSpecField}
                    className="text-sm text-blue hover:text-blue/90 font-medium"
                  >
                    + {t('admin_products.add_spec')}
                  </button>
                </div>
                <div className="space-y-3">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-3">
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="w-1/3 px-4 py-3 bg-bg-tertiary border border-app-border rounded-lg text-app-text-muted"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpecChange(key, e.target.value)}
                        placeholder={t('admin_products.spec_value')}
                        className="flex-grow px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                      />
                      <button
                        onClick={() => removeSpecField(key)}
                        className="p-3 text-red hover:bg-red/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-grow flex items-center justify-center gap-2 bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <Save className="w-5 h-5" />
                  {editingProduct ? t('admin_products.update') : t('admin_products.create')}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-app-text rounded-lg font-medium transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {!isCreating && (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-app-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_products.product')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_products.category')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_products.price')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_products.stock')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">
                      {t('admin_products.status')}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-app-text uppercase">
                      {t('admin_products.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-app-text">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center bg-blue/10 text-blue text-xs font-medium px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-blue">${product.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-semibold ${
                            product.stock === 0
                              ? 'text-red'
                              : product.stock < 10
                              ? 'text-orange'
                              : 'text-green'
                          }`}
                        >
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-green/10 text-green text-xs font-semibold px-2 py-1 rounded-full">
                            <Power className="w-3 h-3" />
                            {t('admin_products.active')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red/10 text-red text-xs font-semibold px-2 py-1 rounded-full">
                            <PowerOff className="w-3 h-3" />
                            {t('admin_products.inactive')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue hover:bg-blue/10 rounded-lg transition-all"
                            title={t('admin_products.edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(product.id)}
                            className={`p-2 rounded-lg transition-all ${
                              product.isActive
                                ? 'text-orange hover:bg-orange/10'
                                : 'text-green hover:bg-green/10'
                            }`}
                            title={
                              product.isActive
                                ? t('admin_products.deactivate')
                                : t('admin_products.activate')
                            }
                          >
                            {product.isActive ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red hover:bg-red/10 rounded-lg transition-all"
                            title={t('admin_products.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
                <p className="text-app-text-muted text-lg">{t('admin_products.no_products')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
