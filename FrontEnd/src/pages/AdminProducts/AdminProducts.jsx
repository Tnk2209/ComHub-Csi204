import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Package, Plus, Edit2, Trash2, Power, PowerOff, Save, X, Search } from 'lucide-react';
import * as adminService from '../../services/adminService';

function AdminProducts({ onNavigate }) {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'CPU',
    price: '',
    stock_quantity: '',
    specifications: {}
  });

  const CATEGORY_SPECS = {
    CPU: [
      { key: 'socket', label: 'Socket', placeholder: 'LGA1700' },
      { key: 'cores', label: 'Cores', placeholder: '24' },
      { key: 'threads', label: 'Threads', placeholder: '32' },
      { key: 'base_clock_ghz', label: 'Base Clock (GHz)', placeholder: '3.2' },
      { key: 'boost_clock_ghz', label: 'Boost Clock (GHz)', placeholder: '5.8' },
      { key: 'tdp', label: 'TDP (W)', placeholder: '125' },
    ],
    GPU: [
      { key: 'vram_gb', label: 'VRAM (GB)', placeholder: '16' },
      { key: 'boost_clock_mhz', label: 'Boost Clock (MHz)', placeholder: '2520' },
      { key: 'tdp', label: 'TDP (W)', placeholder: '320' },
      { key: 'gpu_length_mm', label: 'Length (mm)', placeholder: '336' },
    ],
    Mainboard: [
      { key: 'socket', label: 'Socket', placeholder: 'LGA1700' },
      { key: 'supported_ram', label: 'Supported RAM (e.g. DDR5)', placeholder: 'DDR5' },
      { key: 'form_factor', label: 'Form Factor', placeholder: 'ATX' },
    ],
    RAM: [
      { key: 'ram_type', label: 'Type', placeholder: 'DDR5' },
      { key: 'capacity_gb', label: 'Capacity (GB)', placeholder: '32' },
      { key: 'speed_mhz', label: 'Speed (MHz)', placeholder: '6000' },
    ],
    SSD: [
      { key: 'form_factor', label: 'Form Factor', placeholder: 'M.2' },
      { key: 'capacity_gb', label: 'Capacity (GB)', placeholder: '1000' },
      { key: 'interface', label: 'Interface', placeholder: 'NVMe M.2' },
      { key: 'read_mb_s', label: 'Read Speed (MB/s)', placeholder: '7000' },
      { key: 'write_mb_s', label: 'Write Speed (MB/s)', placeholder: '5000' },
    ],
    Case: [
      { key: 'form_factor', label: 'Form Factor (comma-separated)', placeholder: 'ATX, mATX, ITX' },
      { key: 'max_gpu_length_mm', label: 'Max GPU Length (mm)', placeholder: '400' },
    ],
    PSU: [
      { key: 'wattage', label: 'Wattage (W)', placeholder: '850' },
      { key: 'efficiency', label: 'Efficiency', placeholder: '80+ Gold' },
    ],
  };

  const categories = ['CPU', 'GPU', 'RAM', 'Mainboard', 'SSD', 'Case', 'PSU'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminService.listProducts();
      setProducts(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

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
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      specifications: product.specifications ? { ...product.specifications } : {}
    });
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t('admin_products.confirm_delete'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF3B30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: t('common.delete', 'Delete'),
      cancelButtonText: t('common.cancel', 'Cancel')
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to delete' });
    }
  };

  const handleToggleActive = async (id) => {
    const product = products.find((p) => p.id === id);
    try {
      await adminService.toggleProductStatus(id, !product.is_active);
      setProducts(products.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to toggle status' });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      Swal.fire({ icon: 'warning', title: t('admin_products.validation_required') });
      return;
    }
    setSaving(true);

    // Process and sanitize specifications
    const processedSpecs = { ...formData.specifications };

    // 1. Convert numeric specifications from strings to Numbers
    const numericKeys = [
      'tdp',
      'gpu_length_mm',
      'max_gpu_length_mm',
      'wattage',
      'capacity_gb',
      'speed_mhz',
      'read_mb_s',
      'write_mb_s',
      'cores',
      'threads',
      'base_clock_ghz',
      'boost_clock_ghz',
      'boost_clock_mhz'
    ];
    for (const key of numericKeys) {
      if (processedSpecs[key] !== undefined && processedSpecs[key] !== null && processedSpecs[key] !== '') {
        const val = Number(processedSpecs[key]);
        if (!isNaN(val)) processedSpecs[key] = val;
      }
    }

    // 2. Convert comma-separated strings to arrays where expected
    if (formData.category === 'Case' && processedSpecs.form_factor) {
      processedSpecs.form_factor = String(processedSpecs.form_factor)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (formData.category === 'CPU' && processedSpecs.supported_ram) {
      processedSpecs.supported_ram = String(processedSpecs.supported_ram)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (formData.category === 'Mainboard' && processedSpecs.supported_ram) {
      const strVal = String(processedSpecs.supported_ram);
      processedSpecs.supported_ram = strVal.split(',').map((s) => s.trim()).filter(Boolean);
      // For backwards compatibility in rendering, set both supported_ram and ram_type
      processedSpecs.ram_type = processedSpecs.supported_ram[0] || '';
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity),
      specifications: processedSpecs
    };

    try {
      if (editingProduct) {
        const updated = await adminService.updateProduct(editingProduct, payload);
        setProducts(products.map((p) => (p.id === editingProduct ? updated : p)));
      } else {
        const created = await adminService.createProduct(payload);
        setProducts([...products, created]);
      }
      handleCancel();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'CPU', price: '', stock_quantity: '', specifications: {} });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSpecChange = (key, value) => {
    setFormData({ ...formData, specifications: { ...formData.specifications, [key]: value } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted">Loading...</p>
      </div>
    );
  }

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
                <option key={cat} value={cat}>{cat}</option>
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
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">
                    {t('admin_products.price')} * (฿)
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
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                    placeholder="45"
                    className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                  />
                </div>
              </div>

              {/* Specifications — auto fields per category */}
              <div className="border-t border-app-border pt-4">
                <h3 className="text-lg font-semibold text-app-text mb-4">{t('admin_products.specifications')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(CATEGORY_SPECS[formData.category] || []).map((spec) => (
                    <div key={spec.key}>
                      <label htmlFor={`spec-${spec.key}`} className="block text-sm font-medium text-app-text mb-2">{spec.label}</label>
                      <input
                        id={`spec-${spec.key}`}
                        type="text"
                        value={
                          Array.isArray(formData.specifications[spec.key])
                            ? formData.specifications[spec.key].join(', ')
                            : formData.specifications[spec.key] || ''
                        }
                        onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                        placeholder={spec.placeholder}
                        className="w-full px-4 py-3 bg-bg-secondary border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-grow flex items-center justify-center gap-2 bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {editingProduct ? t('admin_products.update') : t('admin_products.create')}
                </button>
                <button onClick={handleCancel} className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-app-text rounded-lg font-medium transition-all">
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_products.product')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_products.category')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_products.price')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_products.stock')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase">{t('admin_products.status')}</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-app-text uppercase">{t('admin_products.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-app-text">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center bg-blue/10 text-blue text-xs font-medium px-2 py-1 rounded-full">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-blue">฿{Number(product.price).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-semibold ${product.stock_quantity === 0 ? 'text-red' : product.stock_quantity < 10 ? 'text-orange' : 'text-green'}`}>
                          {product.stock_quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.is_active ? (
                          <span className="inline-flex items-center gap-1 bg-green/10 text-green text-xs font-semibold px-2 py-1 rounded-full">
                            <Power className="w-3 h-3" />{t('admin_products.active')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red/10 text-red text-xs font-semibold px-2 py-1 rounded-full">
                            <PowerOff className="w-3 h-3" />{t('admin_products.inactive')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-blue hover:bg-blue/10 rounded-lg transition-all" title={t('admin_products.edit')}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(product.id)}
                            className={`p-2 rounded-lg transition-all ${product.is_active ? 'text-orange hover:bg-orange/10' : 'text-green hover:bg-green/10'}`}
                            title={product.is_active ? t('admin_products.deactivate') : t('admin_products.activate')}
                          >
                            {product.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red hover:bg-red/10 rounded-lg transition-all" title={t('admin_products.delete')}>
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