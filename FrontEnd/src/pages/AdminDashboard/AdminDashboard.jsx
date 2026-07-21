import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Percent, Activity } from 'lucide-react';
import * as adminService from '../../services/adminService';

function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    setLoading(true);
    adminService.getDashboard({ period })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted">{t('common.loading', 'Loading...')}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-red">{t('admin_dashboard.failed_load', 'Failed to load dashboard')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue" />
            <h1 className="text-3xl font-bold text-app-text">{t('admin_dashboard.title', 'Dashboard')}</h1>
          </div>
          
          {/* Period Selector Tabs */}
          <div className="bg-app-surface border border-app-border rounded-xl p-1 flex gap-1 self-start sm:self-auto shadow-sm">
            {[
              { id: 'all', label: t('admin_dashboard.all_time', 'All Time') },
              { id: 'month', label: t('admin_dashboard.this_month', 'This Month') },
              { id: 'week', label: t('admin_dashboard.this_week', 'This Week') },
              { id: 'today', label: t('admin_dashboard.today', 'Today') }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  period === p.id
                    ? 'bg-blue text-white shadow-sm'
                    : 'text-app-text-muted hover:text-app-text hover:bg-app-bg/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
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
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-app-text-muted">{t('admin_dashboard.aov', 'Average Order Value')}</span>
            </div>
            <div className="text-2xl font-bold text-purple-500">฿{data.average_order_value.toLocaleString()}</div>
          </div>

          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Percent className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-app-text-muted">{t('admin_dashboard.success_rate', 'Success Rate')}</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">{data.success_rate}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <span className="text-sm font-bold text-blue">{p.total_sold} {t('admin_dashboard.sold', 'sold')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sales by Category */}
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-lg font-bold text-app-text mb-4">{t('admin_dashboard.category_sales', 'Sales by Category')}</h2>
            {!data.category_sales || data.category_sales.length === 0 ? (
              <p className="text-app-text-muted text-sm">{t('admin_dashboard.no_sales', 'No sales data yet')}</p>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const maxSales = Math.max(...data.category_sales.map(c => c.sales), 1);
                  return data.category_sales.map((c) => {
                    const pct = Math.round((c.sales / maxSales) * 100);
                    return (
                      <div key={c.category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-app-text">{c.category}</span>
                          <span className="font-bold text-blue">฿{c.sales.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-app-bg rounded-full h-2">
                          <div
                            className="bg-blue h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
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
                      {p.stock_quantity} {t('admin_dashboard.left', 'left')}
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
