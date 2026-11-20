import React from 'react';
import { UtensilsCrossed, LayoutDashboard, Search, Settings, Sun, Moon } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  ordersCount,
  isBackendConnected,
  onOpenConfig,
  theme,
  onToggleTheme,
}) {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Brand */}
          <div className="brand-wrapper" onClick={() => setActiveTab('dashboard')}>
            <div className="brand-logo-icon">
              <UtensilsCrossed size={22} />
            </div>
            <div>
              <div className="brand-title">FoodieOrder</div>
              <div className="brand-subtitle">Order Management System</div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="nav-tabs desktop-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
              {ordersCount > 0 && (
                <span className="nav-badge-count">{ordersCount}</span>
              )}
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <UtensilsCrossed size={16} />
              <span>Menu & Order</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
              onClick={() => setActiveTab('track')}
            >
              <Search size={16} />
              <span>Track Order</span>
            </button>
          </div>

          {/* Right Actions: Theme Toggle & Health Status */}
          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <button
              className="btn-theme-toggle"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#3b82f6" />}
            </button>

            {/* Health status pill */}
            <div
              className={`health-pill ${isBackendConnected ? 'connected' : 'disconnected'}`}
              onClick={onOpenConfig}
              title="Click to check or change backend API settings"
            >
              <div className="health-dot" />
              <span>{isBackendConnected ? 'Connected' : 'Offline'}</span>
              <Settings size={13} style={{ marginLeft: 2, opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
          {ordersCount > 0 && (
            <span className="mobile-nav-badge">{ordersCount}</span>
          )}
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <UtensilsCrossed size={20} />
          <span>Menu</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          <Search size={20} />
          <span>Track</span>
        </button>
      </div>
    </>
  );
}
