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
  AlertCircle,
  Download,
  PlusCircle,
  TrendingUp,
  Percent,
  UtensilsCrossed,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ORDER_STATUSES, PAYMENT_MODES } from '../data/menuData';

export default function OrderDashboard({
  orders,
  loading,
  onRefresh,
  onEditOrder,
  onViewInvoice,
  onDeleteOrder,
  showToast,
  onUpdateStatusFast,
  onNavigateToOrder,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [emailSearch, setEmailSearch] = useState('');

  // Metrics Calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, o) => acc + (Number(o.totalAmount) || 0),
    0
  );
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING').length;
  const deliveryOrders = orders.filter((o) => o.orderStatus === 'OUT_FOR_DELIVERY').length;
  const inProgressOrders = preparingOrders + deliveryOrders;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;

  const deliverySuccessRate =
    totalOrders > 0
      ? Math.round((deliveredOrders / (totalOrders - pendingOrders || 1)) * 100)
      : 100;

  // Status Distribution Percentages
  const getPercent = (count) => (totalOrders > 0 ? (count / totalOrders) * 100 : 0);

  // Top Selling Dishes Calculation
  const dishCountMap = {};
  orders.forEach((o) => {
    if (o.foodItem) {
      dishCountMap[o.foodItem] = (dishCountMap[o.foodItem] || 0) + (Number(o.quantity) || 1);
    }
  });

  const topDishes = Object.entries(dishCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'ALL' && order.orderStatus !== statusFilter) {
      return false;
    }
    if (paymentFilter !== 'ALL' && order.paymentMode !== paymentFilter) {
      return false;
    }
    if (
      emailSearch.trim() &&
      !order.customerEmail?.toLowerCase().includes(emailSearch.toLowerCase().trim())
    ) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesId = String(order.orderId).includes(q);
      const matchesName = order.customerName?.toLowerCase().includes(q);
      const matchesFood = order.foodItem?.toLowerCase().includes(q);
      const matchesPhone = String(order.customerPhone).includes(q);
      const matchesAddress = order.deliveryAddress?.toLowerCase().includes(q);
      return matchesId || matchesName || matchesFood || matchesPhone || matchesAddress;
    }
    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders to export', 'info');
      return;
    }
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Food Item',
      'Category',
      'Quantity',
      'Unit Price',
      'Total Amount',
      'Order Status',
      'Payment Mode',
      'Delivery Address',
    ];

    const rows = orders.map((o) => [
      o.orderId,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${(o.foodItem || '').replace(/"/g, '""')}"`,
      `"${(o.category || '').replace(/"/g, '""')}"`,
      o.quantity || 1,
      o.price || 0,
      o.totalAmount || 0,
      o.orderStatus || 'PENDING',
      `"${(o.paymentMode || '').replace(/"/g, '""')}"`,
      `"${(o.deliveryAddress || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `food-orders-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders report exported as CSV!', 'success');
  };

  return (
    <div>
      {/* Executive Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Restaurant Operations Dashboard
            </h1>
            <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
              LIVE
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time fulfillment metrics, order pipeline tracking, and revenue overview.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={onNavigateToOrder}
            style={{ display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)' }}
          >
            <PlusCircle size={16} />
            <span>+ Place New Order</span>
          </button>

          <button
            className="btn-secondary"
            onClick={handleExportCSV}
            title="Export orders as CSV spreadsheet"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            className="btn-secondary"
            onClick={onRefresh}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 6 High-Impact KPI Metrics */}
      <div className="dashboard-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#ffedd5', color: '#ea580c' }}>
            <Package size={22} />
          </div>
          <div className="metric-info">
            <h4>Total Orders</h4>
            <div className="metric-num">{totalOrders}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={22} />
          </div>
          <div className="metric-info">
            <h4>Total Revenue</h4>
            <div className="metric-num">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <TrendingUp size={22} />
          </div>
          <div className="metric-info">
            <h4>Avg Order Value</h4>
            <div className="metric-num">₹{avgOrderValue}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div className="metric-info">
            <h4>Pending Kitchen</h4>
            <div className="metric-num">{pendingOrders}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
            <Truck size={22} />
          </div>
          <div className="metric-info">
            <h4>In Preparation/Transit</h4>
            <div className="metric-num">{inProgressOrders}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Percent size={22} />
          </div>
          <div className="metric-info">
            <h4>Delivered Orders</h4>
            <div className="metric-num">{deliveredOrders}</div>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Breakdown */}
      <div className="dashboard-grid-2col">
        {/* Card 1: Pipeline Lifecycle Distribution */}
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={17} color="var(--primary)" />
              Order Status Pipeline
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {totalOrders} Total Recorded
            </span>
          </div>

          {/* Segmented bar */}
          <div className="status-segment-bar">
            <div
              className="status-segment-item"
              style={{ width: `${getPercent(pendingOrders)}%`, background: '#f59e0b' }}
              title={`Pending: ${pendingOrders}`}
            />
            <div
              className="status-segment-item"
              style={{ width: `${getPercent(preparingOrders)}%`, background: '#0284c7' }}
              title={`Preparing: ${preparingOrders}`}
            />
            <div
              className="status-segment-item"
              style={{ width: `${getPercent(deliveryOrders)}%`, background: '#9333ea' }}
              title={`Out For Delivery: ${deliveryOrders}`}
            />
            <div
              className="status-segment-item"
              style={{ width: `${getPercent(deliveredOrders)}%`, background: '#10b981' }}
              title={`Delivered: ${deliveredOrders}`}
            />
            <div
              className="status-segment-item"
              style={{ width: `${getPercent(cancelledOrders)}%`, background: '#ef4444' }}
              title={`Cancelled: ${cancelledOrders}`}
            />
          </div>

          {/* Legend */}
          <div className="legend-grid">
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#f59e0b' }} />
              <span>Pending: <strong>{pendingOrders}</strong> ({getPercent(pendingOrders).toFixed(0)}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#0284c7' }} />
              <span>Preparing: <strong>{preparingOrders}</strong> ({getPercent(preparingOrders).toFixed(0)}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#9333ea' }} />
              <span>In Transit: <strong>{deliveryOrders}</strong> ({getPercent(deliveryOrders).toFixed(0)}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#10b981' }} />
              <span>Delivered: <strong>{deliveredOrders}</strong> ({getPercent(deliveredOrders).toFixed(0)}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#ef4444' }} />
              <span>Cancelled: <strong>{cancelledOrders}</strong> ({getPercent(cancelledOrders).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Most Popular Dishes */}
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UtensilsCrossed size={17} color="var(--primary)" />
              Top Ordered Food Items
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              By Quantity
            </span>
          </div>

          {topDishes.length > 0 ? (
            <div>
              {topDishes.map(([dish, count], idx) => (
                <div key={dish} className="rank-item-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className={`rank-badge top${idx + 1}`}>{idx + 1}</div>
                    <span style={{ fontWeight: 600 }}>{dish}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 700 }}>
                      {count} ordered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No dishes recorded yet. Place an order to see ranking!
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="dashboard-controls">
        <div className="search-input-wrapper" style={{ flex: '2 1 260px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Search by Order ID, customer, dish, phone, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '9px 12px', fontSize: '0.85rem' }}
            placeholder="Filter by email..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ padding: '8px 12px', minWidth: 150 }}
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

          <select
            className="form-select"
            style={{ padding: '8px 12px', minWidth: 150 }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="ALL">All Payments</option>
            {PAYMENT_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || emailSearch || statusFilter !== 'ALL' || paymentFilter !== 'ALL') && (
          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => {
              setSearchTerm('');
              setEmailSearch('');
              setStatusFilter('ALL');
              setPaymentFilter('ALL');
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
              <th>Customer</th>
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
                <td style={{ maxWidth: 220, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
                ? 'No food orders recorded yet. Click "+ Place New Order" or switch to Menu to create one!'
                : 'No orders match your search or filter criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
