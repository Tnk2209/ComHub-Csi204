import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CreditCard, CheckCircle, Cog, Truck, PackageCheck, Clock } from 'lucide-react';

function OrderTracking({ onNavigate, orderData }) {
  const { t } = useTranslation();

  // Mock order data - in real app, fetch by orderId
  // MVP: 5-step flow: pending_payment → paid → processing → shipped → delivered
  const order = orderData || {
    orderId: 'ORD-2026-001',
    orderDate: '2026-07-12',
    estimatedDelivery: '2026-07-18',
    currentStatus: 'shipped', // pending_payment | paid | processing | shipped | delivered
    trackingNumber: 'TH1234567890',
    items: [
      { name: 'Intel Core i9-14900K', quantity: 1, price: 599.99 },
      { name: 'NVIDIA RTX 4090', quantity: 1, price: 1599.99 },
      { name: 'Corsair Vengeance DDR5 32GB', quantity: 2, price: 129.99 }
    ],
    timeline: [
      { status: 'pending_payment', date: '2026-07-12 10:30', completed: true },
      { status: 'paid', date: '2026-07-12 14:20', completed: true },
      { status: 'processing', date: '2026-07-13 09:15', completed: true },
      { status: 'shipped', date: '2026-07-15 16:45', completed: true },
      { status: 'delivered', date: null, completed: false }
    ]
  };

  const timelineSteps = [
    {
      id: 'pending_payment',
      icon: CreditCard,
      label: t('order_tracking.status_pending_payment'),
      color: 'orange'
    },
    {
      id: 'paid',
      icon: CheckCircle,
      label: t('order_tracking.status_paid'),
      color: 'blue'
    },
    {
      id: 'processing',
      icon: Cog,
      label: t('order_tracking.status_processing'),
      color: 'blue'
    },
    {
      id: 'shipped',
      icon: Truck,
      label: t('order_tracking.status_shipped'),
      color: 'blue'
    },
    {
      id: 'delivered',
      icon: PackageCheck,
      label: t('order_tracking.status_delivered'),
      color: 'green'
    }
  ];

  const getStepStatus = (stepId) => {
    const step = order.timeline.find((s) => s.status === stepId);
    return step && step.completed;
  };

  const getStepDate = (stepId) => {
    const step = order.timeline.find((s) => s.status === stepId);
    return step ? step.date : null;
  };

  const currentStepIndex = timelineSteps.findIndex((step) => step.id === order.currentStatus);

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      {/* Header */}
      <div className="bg-app-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-app-text-muted hover:text-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('order_tracking.back_to_home')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-app-text mb-2">
                {t('order_tracking.order')} #{order.orderId}
              </h1>
              <p className="text-sm text-app-text-muted">
                {t('order_tracking.order_date')}: {order.orderDate}
              </p>
              <p className="text-sm text-app-text-muted">
                {t('order_tracking.estimated_delivery')}: {order.estimatedDelivery}
              </p>
            </div>
            {order.trackingNumber && (
              <div className="bg-bg-secondary rounded-lg p-4">
                <div className="text-xs text-app-text-muted uppercase tracking-wide mb-1">
                  {t('order_tracking.tracking_number')}
                </div>
                <div className="text-base font-semibold text-app-text">{order.trackingNumber}</div>
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
              {/* Progress Bar Background */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-bg-secondary" />
              {/* Progress Bar Fill */}
              <div
                className="absolute top-8 left-0 h-1 bg-blue transition-all duration-500"
                style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
              />

              <div className="relative grid grid-cols-5 gap-4">
                {timelineSteps.map((step) => {
                  const isCompleted = getStepStatus(step.id);
                  const isCurrent = step.id === order.currentStatus;
                  const stepDate = getStepDate(step.id);
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center text-center">
                      {/* Icon Circle */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                          isCompleted
                            ? 'bg-blue text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                            : isCurrent
                            ? 'bg-orange text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] animate-pulse'
                            : 'bg-bg-secondary text-app-text-muted'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>

                      {/* Label */}
                      <div
                        className={`text-sm font-semibold mb-1 ${
                          isCompleted || isCurrent ? 'text-app-text' : 'text-app-text-muted'
                        }`}
                      >
                        {step.label}
                      </div>

                      {/* Date/Time */}
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
              const isCurrent = step.id === order.currentStatus;
              const stepDate = getStepDate(step.id);
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-blue text-white'
                        : isCurrent
                        ? 'bg-orange text-white animate-pulse'
                        : 'bg-bg-secondary text-app-text-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>

                  {/* Content */}
                  <div className="flex-grow pt-2">
                    <div
                      className={`text-base font-semibold mb-1 ${
                        isCompleted || isCurrent ? 'text-app-text' : 'text-app-text-muted'
                      }`}
                    >
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
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-app-border last:border-0">
                <div>
                  <div className="font-medium text-app-text">{item.name}</div>
                  <div className="text-sm text-app-text-muted">
                    {t('order_tracking.qty')}: {item.quantity}
                  </div>
                </div>
                <div className="text-base font-semibold text-blue">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 text-lg font-bold">
              <span className="text-app-text">{t('order_tracking.total')}</span>
              <span className="text-blue">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
