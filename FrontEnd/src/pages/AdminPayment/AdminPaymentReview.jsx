import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt, CheckCircle, XCircle, Eye, DollarSign, User, Calendar, AlertTriangle } from 'lucide-react';

function AdminPaymentReview({ onNavigate }) {
  const { t } = useTranslation();

  const [pendingPayments, setPendingPayments] = useState([
    {
      id: 1,
      orderId: 'ORD-2024-045',
      customerName: 'Somchai Jaidee',
      amount: 2850.00,
      paymentMethod: 'Bank Transfer',
      slipImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=600&fit=crop',
      submittedAt: '2024-07-16 14:30',
      status: 'pending',
      items: [
        { name: 'Intel Core i7-14700K', qty: 1, price: 599.99 },
        { name: 'NVIDIA RTX 4070', qty: 1, price: 799.99 },
        { name: 'Corsair Vengeance DDR5 32GB', qty: 1, price: 249.99 },
        { name: 'ASUS ROG STRIX Z790', qty: 1, price: 499.99 },
        { name: 'Samsung 990 Pro 1TB', qty: 1, price: 199.99 },
        { name: 'NZXT H7 Flow', qty: 1, price: 149.99 },
        { name: 'Corsair RM850x', qty: 1, price: 139.99 }
      ]
    },
    {
      id: 2,
      orderId: 'ORD-2024-046',
      customerName: 'Nattawut Pongpanit',
      amount: 1650.00,
      paymentMethod: 'Bank Transfer',
      slipImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop',
      submittedAt: '2024-07-16 15:45',
      status: 'pending',
      items: [
        { name: 'AMD Ryzen 5 7600X', qty: 1, price: 299.99 },
        { name: 'AMD RX 7700 XT', qty: 1, price: 449.99 },
        { name: 'G.Skill Ripjaws DDR5 32GB', qty: 1, price: 179.99 }
      ]
    },
    {
      id: 3,
      orderId: 'ORD-2024-047',
      customerName: 'Siriporn Rattana',
      amount: 3200.00,
      paymentMethod: 'Bank Transfer',
      slipImageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=600&fit=crop',
      submittedAt: '2024-07-16 16:20',
      status: 'pending',
      items: [
        { name: 'Intel Core i9-14900K', qty: 1, price: 599.99 },
        { name: 'NVIDIA RTX 4080', qty: 1, price: 1199.99 }
      ]
    }
  ]);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleApprove = (paymentId) => {
    const payment = pendingPayments.find((p) => p.id === paymentId);
    setPendingPayments(
      pendingPayments.map((p) => (p.id === paymentId ? { ...p, status: 'approved' } : p))
    );
    alert(t('admin_payment.approve_success', { orderId: payment.orderId }));
    setSelectedPayment(null);
  };

  const handleReject = (paymentId) => {
    const payment = pendingPayments.find((p) => p.id === paymentId);
    if (confirm(t('admin_payment.confirm_reject', { orderId: payment.orderId }))) {
      setPendingPayments(
        pendingPayments.map((p) => (p.id === paymentId ? { ...p, status: 'rejected' } : p))
      );
      alert(t('admin_payment.reject_success', { orderId: payment.orderId }));
      setSelectedPayment(null);
    }
  };

  const filteredPayments = pendingPayments.filter((p) => p.status === 'pending');

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-blue" />
            <div>
              <h1 className="text-3xl font-bold text-app-text">{t('admin_payment.title')}</h1>
              <p className="text-sm text-app-text-muted">{t('admin_payment.subtitle')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange">{filteredPayments.length}</div>
            <div className="text-sm text-app-text-muted">{t('admin_payment.pending_review')}</div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-orange/5 border-l-4 border-orange rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-app-text leading-relaxed">{t('admin_payment.info_text')}</p>
            </div>
          </div>
        </div>

        {/* Payments Grid */}
        {filteredPayments.length === 0 ? (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 text-center">
            <Receipt className="w-16 h-16 text-green mx-auto mb-4" />
            <p className="text-app-text-muted text-lg">{t('admin_payment.no_pending')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all overflow-hidden"
              >
                {/* Payment Slip Image */}
                <div
                  className="relative h-64 bg-bg-secondary overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <img
                    src={payment.slipImageUrl}
                    alt={`Payment slip for ${payment.orderId}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-app-text">{payment.orderId}</h3>
                    <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-xs font-semibold px-3 py-1.5 rounded-full">
                      {t('admin_payment.pending')}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-app-text-muted" />
                      <span className="text-app-text">{payment.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-app-text-muted" />
                      <span className="text-2xl font-bold text-blue">
                        ${payment.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-app-text-muted" />
                      <span className="text-app-text-muted">{payment.submittedAt}</span>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="bg-bg-secondary rounded-xl p-3 mb-4">
                    <div className="text-xs text-app-text-muted uppercase mb-2">
                      {t('admin_payment.order_items')}
                    </div>
                    <div className="space-y-1 text-sm text-app-text">
                      {payment.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="truncate">
                          • {item.name} (×{item.qty})
                        </div>
                      ))}
                      {payment.items.length > 3 && (
                        <div className="text-app-text-muted">
                          +{payment.items.length - 3} {t('admin_payment.more_items')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(payment.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-green hover:bg-green/90 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t('admin_payment.approve')}
                    </button>
                    <button
                      onClick={() => handleReject(payment.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-red hover:bg-red/90 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      {t('admin_payment.reject')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedPayment && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <div
              className="bg-app-surface rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.2)] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left: Payment Slip */}
                <div>
                  <h3 className="text-lg font-semibold text-app-text mb-3">
                    {t('admin_payment.payment_slip')}
                  </h3>
                  <div className="bg-bg-secondary rounded-xl overflow-hidden">
                    <img
                      src={selectedPayment.slipImageUrl}
                      alt="Payment slip"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Right: Order Details */}
                <div>
                  <h3 className="text-lg font-semibold text-app-text mb-3">
                    {t('admin_payment.order_details')}
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-bg-secondary rounded-xl p-4">
                      <div className="text-xs text-app-text-muted uppercase mb-1">
                        {t('admin_payment.order_id')}
                      </div>
                      <div className="text-xl font-bold text-blue">{selectedPayment.orderId}</div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl p-4">
                      <div className="text-xs text-app-text-muted uppercase mb-1">
                        {t('admin_payment.customer')}
                      </div>
                      <div className="text-base font-semibold text-app-text">
                        {selectedPayment.customerName}
                      </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl p-4">
                      <div className="text-xs text-app-text-muted uppercase mb-1">
                        {t('admin_payment.total_amount')}
                      </div>
                      <div className="text-2xl font-bold text-green">
                        ${selectedPayment.amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl p-4">
                      <div className="text-xs text-app-text-muted uppercase mb-2">
                        {t('admin_payment.items_list')}
                      </div>
                      <div className="space-y-2">
                        {selectedPayment.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm border-b border-app-border pb-2 last:border-0"
                          >
                            <span className="text-app-text">
                              {item.name} ×{item.qty}
                            </span>
                            <span className="font-semibold text-app-text">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleApprove(selectedPayment.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-green hover:bg-green/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {t('admin_payment.approve')}
                    </button>
                    <button
                      onClick={() => handleReject(selectedPayment.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-red hover:bg-red/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                      {t('admin_payment.reject')}
                    </button>
                    <button
                      onClick={() => setSelectedPayment(null)}
                      className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-app-text rounded-lg font-medium transition-all"
                    >
                      {t('admin_payment.close')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPaymentReview;
