import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  ShoppingBag, Truck, CheckCircle, XCircle, Clock, Package,
  Filter, RefreshCw, Loader2, ChevronDown,
} from 'lucide-react';
import * as adminService from '../../services/adminService';
import { canTransitionTo, requiresTrackingNumber, isCancellable } from './orderStatusUtils';

const STATUS_COLORS = {
  pending_payment: 'bg-amber-500/10 text-amber-500',
  paid:            'bg-emerald-500/10 text-emerald-500',
  processing:      'bg-blue/10 text-blue',
  shipped:         'bg-purple-500/10 text-purple-500',
  delivered:       'bg-emerald-500/10 text-emerald-500',
  cancelled:       'bg-rose-500/10 text-rose-500',
};

const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  paid:            'Paid',
  processing:      'Processing',
  shipped:         'Shipped',
  delivered:       'Delivered',
  cancelled:       'Cancelled',
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ order_status: '', payment_status: '' });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.listOrders(filters);
      setOrders(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    let trackingNumber = null;
    if (requiresTrackingNumber(newStatus)) {
      const { value } = await Swal.fire({
        title: 'Enter Tracking Number',
        input: 'text',
        inputPlaceholder: 'e.g. TH123456789',
        showCancelButton: true,
        confirmButtonText: 'Confirm Ship',
        confirmButtonColor: '#7c3aed',
        inputValidator: (v) => { if (!v?.trim()) return 'Tracking number is required'; },
      });
      if (!value) return;
      trackingNumber = value.trim();
    }

    try {
      await adminService.updateOrderStatus(orderId, newStatus, trackingNumber);
      await fetchOrders();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to update status' });
    }
  };

  const handleCancel = async (orderId) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Cancel Order?',
      text: 'Stock will be restored. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel Order',
      confirmButtonColor: '#FF3B30',
      cancelButtonText: 'Keep Order',
    });
    if (!isConfirmed) return;
    try {
      await adminService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to cancel order' });
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue" />
            <div>
              <h1 className="text-3xl font-bold text-app-text">Order Management</h1>
              <p className="text-sm text-app-text-muted">Update shipping status and manage orders</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-app-surface border border-app-border px-4 py-2 rounded-lg text-sm font-medium text-app-text hover:bg-app-bg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 mb-6 flex flex-wrap gap-4 items-center">
          <Filter className="w-4 h-4 text-app-text-muted flex-shrink-0" />
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-app-text-muted uppercase tracking-wider whitespace-nowrap">Order Status</label>
            <div className="relative">
              <select
                value={filters.order_status}
                onChange={(e) => setFilters((f) => ({ ...f, order_status: e.target.value }))}
                className="appearance-none bg-app-bg border border-app-border rounded-lg px-3 py-1.5 pr-8 text-sm text-app-text cursor-pointer focus:outline-none focus:border-blue"
              >
                <option value="">All</option>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-app-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-app-text-muted uppercase tracking-wider whitespace-nowrap">Payment</label>
            <div className="relative">
              <select
                value={filters.payment_status}
                onChange={(e) => setFilters((f) => ({ ...f, payment_status: e.target.value }))}
                className="appearance-none bg-app-bg border border-app-border rounded-lg px-3 py-1.5 pr-8 text-sm text-app-text cursor-pointer focus:outline-none focus:border-blue"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="uploaded">Slip Uploaded</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-app-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          {(filters.order_status || filters.payment_status) && (
            <button
              onClick={() => setFilters({ order_status: '', payment_status: '' })}
              className="text-xs text-app-text-muted hover:text-rose-500 underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-app-text-muted font-mono">{orders.length} orders</span>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 text-center">
            <Package className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
            <p className="text-app-text-muted text-lg">No orders found</p>
          </div>
        ) : (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-app-bg border-b border-app-border">
                <tr>
                  {['Order ID', 'Customer', 'Total', 'Order Status', 'Payment', 'Tracking', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-app-bg/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-blue font-mono">#{order.id}</td>
                    <td className="px-4 py-3 text-app-text-muted">User #{order.user_id}</td>
                    <td className="px-4 py-3 font-bold text-app-text">฿{Number(order.total_price).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.order_status] || 'bg-app-border text-app-text-muted'}`}>
                        {STATUS_LABELS[order.order_status] || order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-app-text-muted capitalize">{order.payment_status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-app-text-muted font-mono">
                      {order.tracking_number || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-app-text-muted whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {canTransitionTo(order.order_status, 'processing') && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'processing')}
                            className="flex items-center gap-1 bg-blue/10 hover:bg-blue/20 text-blue text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                          >
                            <Package className="w-3.5 h-3.5" />
                            Process
                          </button>
                        )}
                        {canTransitionTo(order.order_status, 'shipped') && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Ship
                          </button>
                        )}
                        {canTransitionTo(order.order_status, 'delivered') && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Delivered
                          </button>
                        )}
                        {isCancellable(order.order_status) && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}
                        {!canTransitionTo(order.order_status, 'shipped') &&
                         !canTransitionTo(order.order_status, 'delivered') &&
                         !isCancellable(order.order_status) && (
                          <span className="text-xs text-app-text-muted italic">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
