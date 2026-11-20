import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MenuCatalog from './components/MenuCatalog';
import OrderForm from './components/OrderForm';
import OrderDashboard from './components/OrderDashboard';
import TrackOrder from './components/TrackOrder';
import EditOrderModal from './components/EditOrderModal';
import InvoiceModal from './components/InvoiceModal';
import ApiConfigModal from './components/ApiConfigModal';
import Toast from './components/Toast';
import GlowCursor from './components/GlowCursor';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'menu' | 'track'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Theme Management (Dark by default for rich cyber restaurant glow)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('food_order_theme') || 'dark';
  });

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('food_order_theme', next);
      return next;
    });
  };

  // Toast Notification System
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check Backend Connection
  const checkHealth = useCallback(async () => {
    try {
      await api.checkHealth();
      setIsBackendConnected(true);
    } catch (err) {
      setIsBackendConnected(false);
    }
  }, []);

  // Fetch all orders
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getAllOrders();
      if (Array.isArray(data)) {
        // Sort newest first
        setOrders(data.slice().reverse());
        setIsBackendConnected(true);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn('Backend not responding yet:', err.message);
      setIsBackendConnected(false);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Mount
  useEffect(() => {
    checkHealth();
    loadOrders();
    // Poll every 30s
    const timer = setInterval(() => {
      checkHealth();
    }, 30000);
    return () => clearInterval(timer);
  }, [checkHealth, loadOrders]);

  // Handle selecting an item from catalog
  const handleSelectItem = (food) => {
    setSelectedFood(food);
    showToast(`Selected "${food.name}". Fill your details to complete order!`, 'info');
    // Scroll smoothly to order form on mobile
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Handle order created
  const handleOrderCreated = (createdOrder) => {
    setOrders((prev) => [createdOrder, ...prev]);
    setSelectedFood(null);
  };

  // Quick Status change from table dropdown
  const handleUpdateStatusFast = async (order, newStatus) => {
    try {
      const updated = await api.updateOrder(order.orderId, {
        ...order,
        orderStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderId === order.orderId ? updated : o))
      );
      showToast(`Order #${order.orderId} status changed to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to change status:', err);
      showToast('Status update failed', 'error');
    }
  };

  // Delete Order with confirmation
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${orderId}?`)) {
      return;
    }
    try {
      await api.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      showToast(`Order #${orderId} deleted successfully`, 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(`Could not delete order #${orderId}`, 'error');
    }
  };

  // Order updated from edit modal
  const handleOrderUpdated = (updated) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === updated.orderId ? updated : o))
    );
  };

  return (
    <GlowCursor
      color="#5f8bff"
      secondaryColor={theme === 'dark' ? '#ea580c' : '#3b82f6'}
      intensity={theme === 'dark' ? 1.1 : 1.4}
      trailWidth={2}
      linger={0.35}
      glow={theme === 'dark' ? 0.8 : 0.4}
      followSpeed={1.0}
      quality="medium"
      clickBurst
      theme={theme}
      blendMode={theme === 'dark' ? 'screen' : 'multiply'}
    >
      <div className={`app-container ${theme}-theme`}>
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={orders.length}
          isBackendConnected={isBackendConnected}
          onOpenConfig={() => setIsConfigOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Body */}
        <main className="main-content">
          {activeTab === 'dashboard' && (
            <OrderDashboard
              orders={orders}
              loading={loadingOrders}
              onRefresh={loadOrders}
              onEditOrder={(order) => setEditingOrder(order)}
              onViewInvoice={(order) => setInvoiceOrder(order)}
              onDeleteOrder={handleDeleteOrder}
              showToast={showToast}
              onUpdateStatusFast={handleUpdateStatusFast}
              onNavigateToOrder={() => setActiveTab('menu')}
            />
          )}

          {activeTab === 'menu' && (
            <div className="menu-grid-layout">
              {/* Left: Food Catalog */}
              <MenuCatalog
                onSelectItem={handleSelectItem}
                selectedFood={selectedFood}
              />

              {/* Right: Sticky Order Form */}
              <div>
                <OrderForm
                  selectedFood={selectedFood}
                  onOrderCreated={handleOrderCreated}
                  showToast={showToast}
                />
              </div>
            </div>
          )}

          {activeTab === 'track' && (
            <TrackOrder showToast={showToast} />
          )}
        </main>

        {/* Modals */}
        {editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onOrderUpdated={handleOrderUpdated}
            showToast={showToast}
          />
        )}

        {invoiceOrder && (
          <InvoiceModal
            order={invoiceOrder}
            onClose={() => setInvoiceOrder(null)}
          />
        )}

        <ApiConfigModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          onConfigSaved={() => {
            checkHealth();
            loadOrders();
          }}
          showToast={showToast}
        />

        {/* Toasts */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Footer */}
        <footer className="app-footer">
          <div>
            <strong>Food Order Management System</strong> • Spring Boot Backend (Port 2131) + React & Vite Frontend
          </div>
          <div style={{ marginTop: 6, fontSize: '0.775rem' }}>
            Responsive on Mobile, Tablet & Desktop • Real-time REST API Synchronization
          </div>
        </footer>
      </div>
    </GlowCursor>
  );
}
