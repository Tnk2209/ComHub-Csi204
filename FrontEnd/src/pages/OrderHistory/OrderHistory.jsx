import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, ShoppingBag, Eye, Calendar, XCircle, CreditCard, ChevronRight } from 'lucide-react';
import * as orderService from '../../services/orderService';

function OrderHistory({ onNavigate }) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.list()
      .then((data) => {
        setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColorMap = {
    pending_payment: 'bg-orange/10 text-orange border border-orange/20',
    paid: 'bg-green/10 text-green border border-green/20',
    processing: 'bg-blue/10 text-blue border border-blue/20',
    shipped: 'bg-blue/10 text-blue border border-blue/20',
    delivered: 'bg-green/10 text-green border border-green/20',
    cancelled: 'bg-red/10 text-red border border-red/20',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      {/* Header section with back navigation */}
      <div className="bg-app-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('order_history.back_to_home', 'Back to Home')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-app-text tracking-tight">{t('order_history.title', 'Order History')}</h1>
          <p className="text-sm text-app-text-muted mt-2">
            {t('order_history.subtitle', 'View details and track all your custom builds and orders')}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-app-surface rounded-2xl p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue/10 text-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-app-text mb-2">{t('order_history.empty', 'No orders found')}</h3>
            <p className="text-sm text-app-text-muted mb-6">{t('order_history.empty_desc', "You haven't placed any orders yet.")}</p>
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              {t('order_history.browse_now', 'Browse Products')}
            </button>
          </div>
        ) : (
          <div className="space-y-6 ">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden ">
              <table className="w-full text-left border-collapse ">
                <thead>
                  <tr className="border-b border-app-border bg-bg-secondary text-xs font-bold text-app-text-muted uppercase tracking-wider">
                    <th className="py-4 px-6">{t('order_history.order_number', 'Order No.')}</th>
                    <th className="py-4 px-6">{t('order_history.order_date', 'Order Date')}</th>
                    <th className="py-4 px-6">{t('order_history.payment_method', 'Payment Method')}</th>
                    <th className="py-4 px-6">{t('order_history.items', 'Items')}</th>
                    <th className="py-4 px-6">{t('order_history.total_price', 'Total')}</th>
                    <th className="py-4 px-6">{t('order_history.status', 'Status')}</th>
                    <th className="py-4 px-6">{t('order_history.cancellation_date', 'Cancelled On')}</th>
                    <th className="py-4 px-6 text-right">{t('order_history.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-bg-secondary/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-app-text">#{order.id}</td>
                      <td className="py-4 px-6 text-app-text">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-app-text-muted" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-app-text">
                        <div className="flex items-center gap-1.5 text-xs">
                          <CreditCard className="w-4 h-4 text-app-text-muted" />
                          {t('order_history.bank_transfer', 'Bank Transfer')}
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div className="text-app-text truncate" title={order.items?.map(i => `${i.product_name} (x${i.quantity})`).join(', ')}>
                          {order.items?.map(i => `${i.product_name} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-blue">
                        ฿{Number(order.total_price).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColorMap[order.order_status]}`}>
                          {t(`order_tracking.status_${order.order_status}`)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-red-500">
                        {order.cancelled_at ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <XCircle className="w-4 h-4" />
                            {new Date(order.cancelled_at).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-app-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onNavigate('order-tracking', { orderId: order.id })}
                          className="inline-flex items-center gap-1.5 bg-blue hover:bg-blue/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {t('order_history.track_btn', 'Track')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 border border-app-border relative flex flex-col justify-between"
                >
                  <div>
                    {/* Top Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs text-app-text-muted uppercase tracking-wider block">{t('order_history.order_number', 'Order No.')}</span>
                        <span className="text-lg font-extrabold text-app-text">#{order.id}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColorMap[order.order_status]}`}>
                        {t(`order_tracking.status_${order.order_status}`)}
                      </span>
                    </div>

                    {/* Meta Fields */}
                    <div className="space-y-2 mb-4 border-t border-app-border pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-app-text-muted">{t('order_history.order_date', 'Order Date')}</span>
                        <span className="text-app-text font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-app-text-muted">{t('order_history.payment_method', 'Payment Method')}</span>
                        <span className="text-app-text font-medium">{t('order_history.bank_transfer', 'Bank Transfer')}</span>
                      </div>
                      {order.cancelled_at && (
                        <div className="flex items-center justify-between text-sm text-red-500 font-semibold">
                          <span>{t('order_history.cancellation_date', 'Cancelled On')}</span>
                          <span>{new Date(order.cancelled_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-app-text-muted block">{t('order_history.items', 'Items')}</span>
                        <span className="text-app-text font-medium line-clamp-2">
                          {order.items?.map(i => `${i.product_name} (x${i.quantity})`).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between border-t border-app-border pt-4 mt-2">
                    <div>
                      <span className="text-xs text-app-text-muted block">{t('order_history.total_price', 'Total')}</span>
                      <span className="text-lg font-bold text-blue">฿{Number(order.total_price).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('order-tracking', { orderId: order.id })}
                      className="inline-flex items-center gap-1 bg-blue hover:bg-blue/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
                    >
                      <span>{t('order_history.track_btn', 'Track')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
