import React from 'react';
import { X, Printer, CheckCircle, Utensils } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Utensils size={18} color="var(--primary)" />
            <span>Tax Invoice / Order Receipt</span>
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Printable Sheet */}
        <div className="invoice-sheet" id="printable-receipt">
          <div className="invoice-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              FOODIE HUB RESTAURANT
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Delicious Meals Delivered Fresh
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              GSTIN: 36AAACG1234F1Z5 • FSSAI Lic No: 13621014000452
            </div>
          </div>

          <div className="invoice-row">
            <span style={{ color: '#64748b' }}>Order ID:</span>
            <strong>#{order.orderId}</strong>
          </div>
          <div className="invoice-row">
            <span style={{ color: '#64748b' }}>Date & Time:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="invoice-row">
            <span style={{ color: '#64748b' }}>Status:</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{order.orderStatus}</span>
          </div>
          <div className="invoice-row">
            <span style={{ color: '#64748b' }}>Payment Mode:</span>
            <span>{order.paymentMode || 'Cash on Delivery'}</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '14px 0' }} />

          {/* Customer section */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Billed To:
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.customerName}</div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>📞 {order.customerPhone}</div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>✉ {order.customerEmail}</div>
            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: 4 }}>
              📍 {order.deliveryAddress}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '14px 0' }} />

          {/* Itemized Table */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.8rem', paddingBottom: 6 }}>
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0' }}>
              <div>
                <div>{order.foodItem} ({order.category})</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {order.quantity} x ₹{order.price}
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>
                ₹{Number(order.totalAmount || (order.price * order.quantity)).toFixed(2)}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '2px solid #0f172a', margin: '14px 0' }} />

          <div className="invoice-row" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            <span>Total Payable:</span>
            <span>₹{Number(order.totalAmount || (order.price * order.quantity)).toFixed(2)}</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.75rem', color: '#94a3b8' }}>
            Thank you for dining with us! Have a wonderful meal!
          </div>
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
