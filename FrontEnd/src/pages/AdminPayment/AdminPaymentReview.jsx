import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Receipt, CheckCircle, XCircle, Eye, DollarSign, User, Calendar, AlertTriangle } from 'lucide-react';
import * as adminService from '../../services/adminService';

function AdminPaymentReview({ onNavigate }) {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const data = await adminService.listOrders({ payment_status: 'pending' });
      setOrders(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleApprove = async (orderId) => {
    try {
      await adminService.approvePayment(orderId);
      setOrders(orders.filter((o) => o.id !== orderId));
      setSelectedOrder(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to approve' });
    }
  };

  const handleReject = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: t('admin_payment.reject_reason') || 'Reason for rejection:',
      input: 'text',
      inputPlaceholder: t('admin_payment.reject_reason_placeholder', 'Enter reason...'),
      showCancelButton: true,
      confirmButtonColor: '#FF3B30',
      confirmButtonText: t('admin_payment.reject', 'Reject'),
      cancelButtonText: t('common.cancel', 'Cancel'),
      inputValidator: (value) => {
        if (!value) return t('admin_payment.reason_required', 'Please enter a reason');
      }
    });
    if (!reason) return;
    try {
      await adminService.rejectPayment(orderId, reason);
      setOrders(orders.filter((o) => o.id !== orderId));
      setSelectedOrder(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to reject' });
    }
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
            <Receipt className="w-8 h-8 text-blue" />
            <div>
              <h1 className="text-3xl font-bold text-app-text">{t('admin_payment.title')}</h1>
              <p className="text-sm text-app-text-muted">{t('admin_payment.subtitle')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange">{orders.length}</div>
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
        {orders.length === 0 ? (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 text-center">
            <Receipt className="w-16 h-16 text-green mx-auto mb-4" />
            <p className="text-app-text-muted text-lg">{t('admin_payment.no_pending')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all overflow-hidden"
              >
                {/* Payment Slip Preview */}
                {order.payment_slip_mockup && (
                  <div
                    className="relative h-64 bg-bg-secondary overflow-hidden group cursor-pointer flex items-center justify-center"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <img
                      src={order.payment_slip_mockup}
                      alt={`Payment slip for order #${order.id}`}
                      className="max-h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}

                {/* Order Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-app-text">Order #{order.id}</h3>
                    <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-xs font-semibold px-3 py-1.5 rounded-full">
                      {t('admin_payment.pending')}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-app-text-muted" />
                      <span className="text-app-text">User #{order.user_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-app-text-muted" />
                      <span className="text-2xl font-bold text-blue">
                        ฿{Number(order.total_price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-app-text-muted" />
                      <span className="text-app-text-muted">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  {order.items && (
                    <div className="bg-bg-secondary rounded-xl p-3 mb-4">
                      <div className="text-xs text-app-text-muted uppercase mb-2">{t('admin_payment.order_items')}</div>
                      <div className="space-y-1 text-sm text-app-text">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="truncate">
                            • Product #{item.product_id} (×{item.quantity})
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-app-text-muted">+{order.items.length - 3} {t('admin_payment.more_items')}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-green hover:bg-green/90 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t('admin_payment.approve')}
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
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
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-app-surface rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.2)] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left: Payment Slip */}
                <div>
                  <h3 className="text-lg font-semibold text-app-text mb-3">{t('admin_payment.payment_slip')}</h3>
                  <div className="bg-bg-secondary rounded-xl overflow-hidden flex items-center justify-center p-4">
                    {selectedOrder.payment_slip_mockup ? (
                      <img src={selectedOrder.payment_slip_mockup} alt="Payment slip" className="max-w-full h-auto" />
                    ) : (
                      <p className="text-app-text-muted">No slip uploaded</p>
                    )}
                  </div>
                </div>

                {/* Right: Order Details */}
                <div>
                  <h3 className="text-lg font-semibold text-app-text mb-3">{t('admin_payment.order_details')}</h3>
                  <div className="space-y-4">
                    <div className="bg-bg-secondary rounded-xl p-4">
                      <div className="text-xs text-app-text-muted uppercase mb-1">{t('admin_payment.order_id')}</div>
                      <div className="text-xl font-bold text-blue">#{selectedOrder.id}</div>
                    </div>
                    <div className="bg-bg-secondary rounded-xl p-4">
                      <div className="text-xs text-app-text-muted uppercase mb-1">{t('admin_payment.total_amount')}</div>
                      <div className="text-2xl font-bold text-green">฿{Number(selectedOrder.total_price).toLocaleString()}</div>
                    </div>
                    {selectedOrder.items && (
                      <div className="bg-bg-secondary rounded-xl p-4">
                        <div className="text-xs text-app-text-muted uppercase mb-2">{t('admin_payment.items_list')}</div>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm border-b border-app-border pb-2 last:border-0">
                              <span className="text-app-text">Product #{item.product_id} ×{item.quantity}</span>
                              <span className="font-semibold text-app-text">฿{Number(item.price_per_unit).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Actions */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleApprove(selectedOrder.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-green hover:bg-green/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {t('admin_payment.approve')}
                    </button>
                    <button
                      onClick={() => handleReject(selectedOrder.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-red hover:bg-red/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                      {t('admin_payment.reject')}
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
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