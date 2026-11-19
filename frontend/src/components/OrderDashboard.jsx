import React, { useState } from 'react';
import {
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Edit2,
  Trash2,
  Truck,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { ORDER_STATUSES } from '../data/menuData';

export default function OrderDashboard({
  orders,
  loading,
  onRefresh,
  onEditOrder,
  onViewInvoice,
  onDeleteOrder,
  showToast,
  onUpdateStatusFast,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [emailSearch, setEmailSearch] = useState('');

  // Calculate Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, o) => acc + (Number(o.totalAmount) || 0),
    0
  );
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== 'ALL' && order.orderStatus !== statusFilter) {
      return false;
    }

    // Email search filter
    if (
      emailSearch.trim() &&
      !order.customerEmail?.toLowerCase().includes(emailSearch.toLowerCase().trim())
    ) {
      return false;
    }

    // Generic search (Name, food item, orderId, address)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesId = String(order.orderId).includes(q);
      const matchesName = order.customerName?.toLowerCase().includes(q);
      const matchesFood = order.foodItem?.toLowerCase().includes(q);
      const matchesAddress = order.deliveryAddress?.toLowerCase().includes(q);
      return matchesId || matchesName || matchesFood || matchesAddress;
    }

    return true;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Order Management Console
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Live status updates, analytics, invoices, and order lifecycle tracking.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>{loading ? 'Refreshing...' : 'Refresh Orders'}</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#ffedd5', color: '#ea580c' }}>
            <Package size={24} />
          </div>
          <div className="metric-info">
            <h4>Total Orders</h4>
            <div className="metric-num">{totalOrders}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={24} />
          </div>
          <div className="metric-info">
            <h4>Total Revenue</h4>
            <div className="metric-num">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div className="metric-info">
            <h4>Pending Orders</h4>
            <div className="metric-num">{pendingOrders}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Truck size={24} />
          </div>
          <div className="metric-info">
            <h4>Preparing & Transit</h4>
            <div className="metric-num">{preparingOrders}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-info">
            <h4>Delivered</h4>
            <div className="metric-num">{deliveredOrders}</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="dashboard-controls">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Search by Order ID, Customer Name, or Food item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ minWidth: 200 }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '8px 12px' }}
            placeholder="Filter by Customer Email..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ padding: '8px 12px', minWidth: 160 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({totalOrders})</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || emailSearch || statusFilter !== 'ALL') && (
          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => {
              setSearchTerm('');
              setEmailSearch('');
              setStatusFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Details</th>
              <th>Food Item & Qty</th>
              <th>Total Amount</th>
              <th>Delivery Address</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                {/* ID */}
                <td>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      background: '#f1f5f9',
                      padding: '4px 8px',
                      borderRadius: 6,
                    }}
                  >
                    #{order.orderId}
                  </span>
                </td>

                {/* Customer */}
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {order.customerName}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {order.customerEmail}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    📞 {order.customerPhone}
                  </div>
                </td>

                {/* Food Item */}
                <td>
                  <div style={{ fontWeight: 600 }}>{order.foodItem}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {order.category}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {order.quantity} x ₹{order.price}
                  </div>
                </td>

                {/* Total */}
                <td>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{Number(order.totalAmount || (order.price * order.quantity)).toFixed(2)}
                  </div>
                </td>

                {/* Address */}
                <td style={{ maxWidth: 200, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {order.deliveryAddress}
                </td>

                {/* Payment */}
                <td>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    {order.paymentMode || 'COD'}
                  </span>
                </td>

                {/* Status Dropdown */}
                <td>
                  <select
                    className={`status-badge ${order.orderStatus}`}
                    value={order.orderStatus}
                    onChange={(e) => onUpdateStatusFast(order, e.target.value)}
                    style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Actions */}
                <td>
                  <div className="action-buttons" style={{ justifyContent: 'center' }}>
                    <button
                      className="btn-icon-action invoice"
                      title="View & Print Invoice Receipt"
                      onClick={() => onViewInvoice(order)}
                    >
                      <FileText size={15} />
                    </button>

                    <button
                      className="btn-icon-action edit"
                      title="Edit Order"
                      onClick={() => onEditOrder(order)}
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      className="btn-icon-action delete"
                      title="Delete Order"
                      onClick={() => onDeleteOrder(order.orderId)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <h3>No orders found</h3>
            <p>
              {orders.length === 0
                ? 'No food orders recorded yet. Go to Menu & Order to place the first order!'
                : 'No orders match your search or filter criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
