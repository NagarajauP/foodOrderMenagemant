import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, AlertTriangle, PhoneCall } from 'lucide-react';
import { api } from '../services/api';

export default function TrackOrder({ showToast }) {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const id = orderIdInput.trim();
    if (!id) {
      showToast('Please enter an Order ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const order = await api.getOrderById(id);
      if (!order || !order.orderId) {
        showToast(`Order #${id} not found in database.`, 'error');
        setTrackedOrder(null);
      } else {
        setTrackedOrder(order);
      }
    } catch (err) {
      console.error('Track error:', err);
      showToast(`Could not find order #${id}. Ensure backend is running.`, 'error');
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepName) => {
    if (!trackedOrder) return '';
    const status = trackedOrder.orderStatus;

    if (status === 'CANCELLED') return 'cancelled';

    const orderStages = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = orderStages.indexOf(status);
    const targetIdx = orderStages.indexOf(stepName);

    if (currentIdx > targetIdx) return 'completed';
    if (currentIdx === targetIdx) return 'active';
    return '';
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          Track Your Order Live
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Enter your Order ID received upon checkout to track cooking and delivery progress.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleTrack}
          style={{
            maxWidth: 500,
            margin: '20px auto 0',
            display: 'flex',
            gap: 10,
          }}
        >
          <input
            type="number"
            className="form-input"
            placeholder="Enter Order ID (e.g. 1, 2, 3...)"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}
            disabled={loading}
          >
            <Search size={18} />
            <span>{loading ? 'Tracking...' : 'Track'}</span>
          </button>
        </form>
      </div>

      {trackedOrder && (
        <div className="tracking-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Order Tracking
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Order #{trackedOrder.orderId}
              </h3>
            </div>
            <span className={`status-badge ${trackedOrder.orderStatus}`}>
              {trackedOrder.orderStatus}
            </span>
          </div>

          {/* Cancelled Notice */}
          {trackedOrder.orderStatus === 'CANCELLED' ? (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: 16,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <AlertTriangle size={24} />
              <div>
                <strong>This order was cancelled.</strong>
                <div style={{ fontSize: '0.85rem' }}>
                  If you did not request this cancellation or have payment questions, please contact customer support.
                </div>
              </div>
            </div>
          ) : (
            /* Progress Timeline */
            <div className="timeline-stepper">
              {/* Step 1: Placed */}
              <div className={`timeline-step ${getStepStatus('PENDING')}`}>
                <div className="step-circle">
                  <Package size={20} />
                </div>
                <div className="step-label">Order Placed</div>
              </div>

              {/* Step 2: Preparing */}
              <div className={`timeline-step ${getStepStatus('PREPARING')}`}>
                <div className="step-circle">
                  <Clock size={20} />
                </div>
                <div className="step-label">In Kitchen</div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className={`timeline-step ${getStepStatus('OUT_FOR_DELIVERY')}`}>
                <div className="step-circle">
                  <Truck size={20} />
                </div>
                <div className="step-label">Out for Delivery</div>
              </div>

              {/* Step 4: Delivered */}
              <div className={`timeline-step ${getStepStatus('DELIVERED')}`}>
                <div className="step-circle">
                  <CheckCircle2 size={20} />
                </div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
          )}

          {/* Details breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              background: '#f8fafc',
              padding: 16,
              borderRadius: 12,
              marginTop: 20,
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Customer Name
              </div>
              <div style={{ fontWeight: 700 }}>{trackedOrder.customerName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{trackedOrder.customerPhone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Item Ordered
              </div>
              <div style={{ fontWeight: 700 }}>{trackedOrder.foodItem}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {trackedOrder.quantity} item(s) • ₹{trackedOrder.totalAmount || (trackedOrder.price * trackedOrder.quantity)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Payment Method
              </div>
              <div style={{ fontWeight: 700 }}>{trackedOrder.paymentMode || 'Cash on Delivery'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Delivery Destination
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {trackedOrder.deliveryAddress}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
