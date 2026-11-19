import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '../services/api';
import { FOOD_CATEGORIES, PAYMENT_MODES, ORDER_STATUSES } from '../data/menuData';

export default function EditOrderModal({ order, onClose, onOrderUpdated, showToast }) {
  const [formData, setFormData] = useState({ ...order });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({ ...order });
    }
  }, [order]);

  if (!order) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      customerPhone: Number(formData.customerPhone),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      totalAmount: Number(formData.quantity) * Number(formData.price),
    };

    try {
      const updated = await api.updateOrder(order.orderId, payload);
      showToast(`Order #${order.orderId} updated successfully`, 'success');
      onOrderUpdated(updated);
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      showToast('Failed to update order in backend', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Order #{order.orderId}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              name="customerName"
              className="form-input"
              value={formData.customerName || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="customerEmail"
                className="form-input"
                value={formData.customerEmail || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="customerPhone"
                className="form-input"
                value={formData.customerPhone || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Food Item</label>
              <input
                type="text"
                name="foodItem"
                className="form-input"
                value={formData.foodItem || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category || 'Main Course'}
                onChange={handleChange}
              >
                {FOOD_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                className="form-input"
                value={formData.quantity || 1}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                min="1"
                className="form-input"
                value={formData.price || 0}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order Status</label>
              <select
                name="orderStatus"
                className="form-select"
                value={formData.orderStatus || 'PENDING'}
                onChange={handleChange}
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                name="paymentMode"
                className="form-select"
                value={formData.paymentMode || 'Cash on Delivery'}
                onChange={handleChange}
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <textarea
              name="deliveryAddress"
              rows="2"
              className="form-textarea"
              value={formData.deliveryAddress || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Update Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
