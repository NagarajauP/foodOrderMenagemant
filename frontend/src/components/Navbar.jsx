import React from 'react';
import { UtensilsCrossed, LayoutDashboard, Search, Settings, Radio } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  ordersCount,
  isBackendConnected,
  onOpenConfig,
}) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => setActiveTab('menu')}>
          <div className="brand-logo-icon">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <div className="brand-title">FoodieOrder</div>
            <div className="brand-subtitle">Order Management System</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <UtensilsCrossed size={16} />
            <span>Menu & Order</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} />
            <span>Orders Dashboard</span>
            {ordersCount > 0 && (
              <span className="nav-badge-count">{ordersCount}</span>
            )}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={16} />
            <span>Track Order</span>
          </button>
        </div>

        {/* Right Actions & Health Status */}
        <div className="nav-actions">
          <div
            className={`health-pill ${isBackendConnected ? 'connected' : 'disconnected'}`}
            onClick={onOpenConfig}
            title="Click to check or change backend API settings"
          >
            <div className="health-dot" />
            <span>{isBackendConnected ? 'API Connected' : 'API Offline'}</span>
            <Settings size={13} style={{ marginLeft: 2, opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </nav>
  );
}
