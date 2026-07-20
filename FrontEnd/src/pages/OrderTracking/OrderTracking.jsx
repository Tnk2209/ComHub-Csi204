import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CreditCard, CheckCircle, Cog, Truck, PackageCheck, Clock, ShoppingBag, ChevronRight } from 'lucide-react';
import * as orderService from '../../services/orderService';

function OrderTracking({ onNavigate, orderData }) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = orderData?.orderId;
    if (orderId) {
      orderService.get(orderId)
        .then((data) => {
          setSelectedOrder(data);
          setView('detail');
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      orderService.list()
        .then((data) => {
          setOrders(data);
          setView('list');
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderData]);

  const handleSelectOrder = async (order) => {
    try {
      const detail = await orderService.get(order.id);
      setSelectedOrder(detail);
      setView('detail');
    } catch { /* ignore */ }
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setView('list');
  };

  const statusColorMap = {
    pending_payment: 'bg-orange text-white',
    paid: 'bg-green text-white',
    processing: 'bg-blue text-white',
    shipped: 'bg-purple text-white',
    delivered: 'bg-green text-white',
  };

  // --- LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-app-text-muted">Loading...</p>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (view === 'list' && orders.length === 0) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue/10 flex items-center justify-center">
            <PackageCheck className="w-10 h-10 text-blue" />
          </div>
          <h2 className="text-xl font-semibold text-app-text mb-2">
            {t('order_tracking.no_orders')}
          </h2>
          <p className="text-app-text-muted text-sm mb-6">
            {t('order_tracking.no_orders_desc')}
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 bg-blue hover:bg-blue/90 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            {t('cart.browse_products')}
          </button>
        </div>
      </div>
    );
  }

  // --- ORDER LIST VIEW ---
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-app-bg pb-12">
        <div className="bg-app-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t('order_tracking.back_to_home')}</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-app-text mb-6">{t('order_tracking.my_orders')}</h1>

          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                data-testid="order-card"
                onClick={() => handleSelectOrder(order)}
                className="w-full bg-app-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 sm:p-5 flex items-center justify-between hover:shadow-md transition-all text-left"
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-base font-semibold text-app-text">#{order.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColorMap[order.order_status] || 'bg-bg-secondary text-app-text-muted'}`}>
                      {t(`order_tracking.status_${order.order_status}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-app-text-muted">
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-base font-semibold text-blue">฿{Number(order.total_price).toLocaleString()}</span>
                  <ChevronRight className="w-5 h-5 text-app-text-muted" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- ORDER DETAIL VIEW ---
  const order = selectedOrder;
  if (!order) return null;

  const timelineSteps = [
    { id: 'pending_payment', icon: CreditCard, label: t('order_tracking.status_pending_payment'), color: 'orange' },
    { id: 'paid', icon: CheckCircle, label: t('order_tracking.status_paid'), color: 'green' },
    { id: 'processing', icon: Cog, label: t('order_tracking.status_processing'), color: 'blue' },
    { id: 'shipped', icon: Truck, label: t('order_tracking.status_shipped'), color: 'blue' },
    { id: 'delivered', icon: PackageCheck, label: t('order_tracking.status_delivered'), color: 'green' },
  ];

  const statusIndex = (s) => timelineSteps.findIndex((step) => step.id === s);

  const getStepStatus = (stepId) => {
    return statusIndex(stepId) <= statusIndex(order.order_status);
  };

  const getStepDate = (stepId) => {
    if (!order.logs) return null;
    const log = order.logs.find((l) => {
      if (stepId === 'pending_payment') return l.status === 'Order Created';
      if (stepId === 'paid') return l.status === 'Payment Approved';
      if (stepId === 'processing') return l.status === 'Status: processing';
      if (stepId === 'shipped') return l.status === 'Status: shipped';
      if (stepId === 'delivered') return l.status === 'Status: delivered';
      return false;
    });
    return log ? new Date(log.created_at).toLocaleString() : null;
  };

  const currentStepIndex = statusIndex(order.order_status);
  const total = Number(order.total_price);
  const showBackToList = !orderData?.orderId;

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      {/* Header */}
      <div className="bg-app-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {showBackToList ? (
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t('order_tracking.back_to_list')}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t('order_tracking.back_to_home')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-app-text mb-2">
                {t('order_tracking.order')} #{order.id}
              </h1>
              <p className="text-sm text-app-text-muted">
                {t('order_tracking.order_date')}: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-app-text-muted">
                Status: {order.order_status}
              </p>
            </div>
            {order.tracking_number && (
              <div className="bg-bg-secondary rounded-lg p-4">
                <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                  {t('order_tracking.tracking_number')}
                </div>
                <div className="text-base font-semibold text-app-text">{order.tracking_number}</div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
          <h2 className="text-xl font-semibold text-app-text mb-6">{t('order_tracking.timeline_title')}</h2>

          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute top-8 left-0 right-0 h-1 bg-bg-secondary" />
              <div
                className="absolute top-8 left-0 h-1 bg-blue transition-all duration-500"
                style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
              />
              <div className="relative grid grid-cols-5 gap-4">
                {timelineSteps.map((step) => {
                  const isCompleted = getStepStatus(step.id);
                  const isCurrent = step.id === order.order_status;
                  const stepDate = getStepDate(step.id);
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                        isCompleted
                          ? 'bg-blue text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                          : isCurrent
                          ? 'bg-orange text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] animate-pulse'
                          : 'bg-bg-secondary text-app-text-muted'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className={`text-sm font-semibold mb-1 ${
                        isCompleted || isCurrent ? 'text-app-text' : 'text-app-text-muted'
                      }`}>
                        {step.label}
                      </div>
                      {stepDate ? (
                        <div className="text-xs text-app-text-muted">{stepDate}</div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-app-text-muted">
                          <Clock className="w-3 h-3" />
                          {t('order_tracking.pending')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-4">
            {timelineSteps.map((step) => {
              const isCompleted = getStepStatus(step.id);
              const isCurrent = step.id === order.order_status;
              const stepDate = getStepDate(step.id);
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-blue text-white'
                      : isCurrent
                      ? 'bg-orange text-white animate-pulse'
                      : 'bg-bg-secondary text-app-text-muted'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="flex-grow pt-2">
                    <div className={`text-base font-semibold mb-1 ${
                      isCompleted || isCurrent ? 'text-app-text' : 'text-app-text-muted'
                    }`}>
                      {step.label}
                    </div>
                    {stepDate ? (
                      <div className="text-sm text-app-text-muted">{stepDate}</div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-app-text-muted">
                        <Clock className="w-4 h-4" />
                        {t('order_tracking.pending')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-xl font-semibold text-app-text mb-6">{t('order_tracking.order_items')}</h2>
          <div className="space-y-3">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-app-border last:border-0">
                <div>
                  <div className="font-medium text-app-text">Product #{item.product_id}</div>
                  <div className="text-sm text-app-text-muted">
                    {t('order_tracking.qty')}: {item.quantity} × ฿{Number(item.price_per_unit).toLocaleString()}
                  </div>
                </div>
                <div className="text-base font-semibold text-blue">฿{(Number(item.price_per_unit) * item.quantity).toLocaleString()}</div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 text-lg font-bold">
              <span className="text-app-text">{t('order_tracking.total')}</span>
              <span className="text-blue">฿{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
