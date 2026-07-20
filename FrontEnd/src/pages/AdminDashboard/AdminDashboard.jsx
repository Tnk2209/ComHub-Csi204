import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import * as adminService from '../../services/adminService';

function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-red">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-blue" />
          <h1 className="text-3xl font-bold text-app-text">{t('admin_dashboard.title', 'Dashboard')}</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green" />
              <span className="text-sm text-app-text-muted">{t('admin_dashboard.revenue', 'Total Revenue')}</span>
            </div>
            <div className="text-2xl font-bold text-green">฿{data.total_revenue.toLocaleString()}</div>
          </div>

          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-blue" />
              <span className="text-sm text-app-text-muted">{t('admin_dashboard.total_orders', 'Total Orders')}</span>
            </div>
            <div className="text-2xl font-bold text-blue">{data.total_orders.total}</div>
          </div>

          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange" />
              <span className="text-sm text-app-text-muted">{t('admin_dashboard.processing', 'Processing')}</span>
            </div>
            <div className="text-2xl font-bold text-orange">{data.total_orders.processing || 0}</div>
          </div>

          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red" />
              <span className="text-sm text-app-text-muted">{t('admin_dashboard.low_stock', 'Low Stock Items')}</span>
            </div>
            <div className="text-2xl font-bold text-red">{data.low_stock_products.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-lg font-bold text-app-text mb-4">{t('admin_dashboard.top_products', 'Top 5 Products')}</h2>
            {data.top_products.length === 0 ? (
              <p className="text-app-text-muted text-sm">{t('admin_dashboard.no_sales', 'No sales data yet')}</p>
            ) : (
              <div className="space-y-3">
                {data.top_products.map((p, idx) => (
                  <div key={p.product_id} className="flex items-center justify-between py-2 border-b border-app-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-blue/10 text-blue text-xs font-bold rounded-full">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-app-text">{p.name}</div>
                        <div className="text-xs text-app-text-muted">{p.category}</div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue">{p.total_sold} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-lg font-bold text-app-text mb-4">{t('admin_dashboard.low_stock_title', 'Low Stock Alert (≤ 3)')}</h2>
            {data.low_stock_products.length === 0 ? (
              <p className="text-green text-sm">{t('admin_dashboard.stock_ok', 'All products sufficiently stocked')}</p>
            ) : (
              <div className="space-y-3">
                {data.low_stock_products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-app-border last:border-0">
                    <div>
                      <div className="text-sm font-medium text-app-text">{p.name}</div>
                      <div className="text-xs text-app-text-muted">{p.category}</div>
                    </div>
                    <span className={`text-sm font-bold ${p.stock_quantity === 0 ? 'text-red' : 'text-orange'}`}>
                      {p.stock_quantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="mt-8 bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-lg font-bold text-app-text mb-4">{t('admin_dashboard.order_breakdown', 'Orders by Status')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <div key={status} className="text-center p-3 bg-bg-secondary rounded-xl">
                <div className="text-xl font-bold text-app-text">{data.total_orders[status] || 0}</div>
                <div className="text-xs text-app-text-muted capitalize">{status.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
