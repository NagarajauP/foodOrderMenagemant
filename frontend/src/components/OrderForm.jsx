import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Sparkles, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { PAYMENT_MODES, FOOD_CATEGORIES } from '../data/menuData';

export default function OrderForm({ selectedFood, onOrderCreated, showToast }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    foodItem: 'Paneer Butter Masala',
    category: 'Main Course',
    quantity: 1,
    price: 260,
    deliveryAddress: '',
    paymentMode: 'UPI / Google Pay',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selected item from catalogue
  useEffect(() => {
    if (selectedFood) {
      setFormData((prev) => ({
        ...prev,
        foodItem: selectedFood.name,
        category: selectedFood.category,
        price: selectedFood.price,
      }));
    }
  }, [selectedFood]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (delta) => {
    setFormData((prev) => {
      const newQty = Math.max(1, prev.quantity + delta);
      return { ...prev, quantity: newQty };
    });
  };

  const calculateSubtotal = () => {
    const qty = Number(formData.quantity) || 1;
    const prc = Number(formData.price) || 0;
    return qty * prc;
  };

  const subtotal = calculateSubtotal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.customerEmail.trim() || !formData.customerEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    const cleanPhone = formData.customerPhone.toString().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      showToast('Please provide your delivery address', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      customerPhone: Number(cleanPhone),
      foodItem: formData.foodItem.trim(),
      category: formData.category,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      totalAmount: subtotal,
      orderStatus: 'PENDING',
      deliveryAddress: formData.deliveryAddress.trim(),
      paymentMode: formData.paymentMode,
    };

    try {
      const created = await api.createOrder(payload);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Confetti silent fail if unsupported
      }

      showToast(`Order #${created.orderId || 'NEW'} placed successfully!`, 'success');
      onOrderCreated(created);

      // Reset food selection but keep user contact details for faster re-order
      setFormData((prev) => ({
        ...prev,
        quantity: 1,
      }));
    } catch (err) {
      console.error('Failed to create order:', err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Could not reach backend at port 2131. Ensure Spring Boot is running.';
      showToast(`Order failed: ${errMsg}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <ShoppingCart size={20} color="var(--primary)" />
          <span>Place Food Order</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Step-by-step Fast Checkout
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Name */}
        <div className="form-group">
          <label className="form-label">
            <User size={13} style={{ display: 'inline', marginRight: 4 }} />
            Customer Name *
          </label>
          <input
            type="text"
            name="customerName"
            className="form-input"
            placeholder="e.g. Nagaraju / Rahul Sharma"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Info (Email & Phone) */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
              Email Address *
            </label>
            <input
              type="email"
              name="customerEmail"
              className="form-input"
              placeholder="e.g. rahul@example.com"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={13} style={{ display: 'inline', marginRight: 4 }} />
              Phone Number *
            </label>
            <input
              type="tel"
              name="customerPhone"
              className="form-input"
              placeholder="10-digit mobile"
              value={formData.customerPhone}
              onChange={handleChange}
              maxLength={15}
              required
            />
          </div>
        </div>

        {/* Food Item & Category */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Food Item *</label>
            <input
              type="text"
              name="foodItem"
              className="form-input"
              placeholder="Dish name"
              value={formData.foodItem}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
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

        {/* Price & Quantity */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <div className="qty-stepper">
              <button
                type="button"
                className="qty-btn"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <div className="qty-display">{formData.quantity}</div>
              <button
                type="button"
                className="qty-btn"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
            Delivery Address *
          </label>
          <textarea
            name="deliveryAddress"
            className="form-textarea"
            rows="2"
            placeholder="Flat/House No, Street, Landmark, City, Pincode"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Payment Mode */}
        <div className="form-group">
          <label className="form-label">
            <CreditCard size={13} style={{ display: 'inline', marginRight: 4 }} />
            Payment Mode
          </label>
          <select
            name="paymentMode"
            className="form-select"
            value={formData.paymentMode}
            onChange={handleChange}
          >
            {PAYMENT_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        {/* Bill Summary */}
        <div className="bill-summary-box">
          <div className="bill-row">
            <span>Item Total ({formData.quantity}x ₹{formData.price}):</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="bill-row">
            <span>Delivery Fee:</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
          </div>
          <div className="bill-total-row">
            <span>Grand Total:</span>
            <span style={{ color: 'var(--primary)' }}>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          type="submit"
          className="btn-submit-order"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Placing Order...</span>
          ) : (
            <>
              <CheckCircle size={18} />
              <span>Confirm & Place Order (₹{subtotal.toFixed(2)})</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
