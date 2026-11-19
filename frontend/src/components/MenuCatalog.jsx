import React, { useState } from 'react';
import { Search, Star, ShoppingBag, Sparkles, Clock, Flame } from 'lucide-react';
import { FOOD_CATEGORIES, FOOD_ITEMS } from '../data/menuData';

export default function MenuCatalog({ onSelectItem, selectedFood }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('ALL'); // 'ALL' | 'Veg' | 'Non-Veg'

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      foodTypeFilter === 'ALL' || item.foodType === foodTypeFilter;
    return matchesCategory && matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div>
          <div className="hero-tag">
            <Sparkles size={14} /> Fresh & Delicious Everyday
          </div>
          <h1 className="hero-title">Hungry? Order Your Favorite Meal</h1>
          <p className="hero-subtitle">
            Explore authentic flavors, chef specials, and fast delights. Place your order in seconds and track it live to your doorstep.
          </p>
        </div>

        <div className="hero-stats-row">
          <div className="hero-stat-card">
            <div className="hero-stat-val">15+</div>
            <div className="hero-stat-lbl">Dishes</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val">⚡ 30m</div>
            <div className="hero-stat-lbl">Avg Delivery</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val">4.9 ★</div>
            <div className="hero-stat-lbl">Top Rated</div>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-input-wrapper" style={{ flex: '1 1 300px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Search pizza, biryani, burgers, desserts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Veg / Non-veg Quick Switch */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`category-pill ${foodTypeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFoodTypeFilter('ALL')}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            All Types
          </button>
          <button
            className={`category-pill ${foodTypeFilter === 'Veg' ? 'active' : ''}`}
            onClick={() => setFoodTypeFilter('Veg')}
            style={{ padding: '6px 14px', fontSize: '0.8rem', color: foodTypeFilter === 'Veg' ? 'white' : '#166534' }}
          >
            🟢 Veg Only
          </button>
          <button
            className={`category-pill ${foodTypeFilter === 'Non-Veg' ? 'active' : ''}`}
            onClick={() => setFoodTypeFilter('Non-Veg')}
            style={{ padding: '6px 14px', fontSize: '0.8rem', color: foodTypeFilter === 'Non-Veg' ? 'white' : '#991b1b' }}
          >
            🔴 Non-Veg
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-filter-bar">
        {FOOD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="food-cards-grid">
        {filteredItems.map((item) => {
          const isSelected = selectedFood?.id === item.id;
          return (
            <div
              key={item.id}
              className="food-card"
              style={isSelected ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 2px var(--primary)' } : {}}
            >
              <div className="food-card-img-wrapper">
                <img src={item.image} alt={item.name} className="food-card-img" loading="lazy" />
                <span className={`food-tag-type ${item.foodType === 'Veg' ? 'veg' : 'non-veg'}`}>
                  {item.foodType === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
                <span className="food-tag-rating">
                  <Star size={12} fill="#fbbf24" stroke="none" /> {item.rating}
                </span>
              </div>

              <div className="food-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="food-card-category">{item.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {item.prepTime}
                  </span>
                </div>
                <h3 className="food-card-title">{item.name}</h3>
                <p className="food-card-desc">{item.description}</p>

                <div className="food-card-footer">
                  <div className="food-card-price">
                    ₹{item.price} <span>/ item</span>
                  </div>
                  <button
                    className="btn-order-now"
                    onClick={() => onSelectItem(item)}
                  >
                    <ShoppingBag size={15} />
                    {isSelected ? 'Selected' : 'Order Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <Flame className="empty-state-icon" />
          <h3>No food items found</h3>
          <p>Try searching with another keyword or resetting the filter category.</p>
        </div>
      )}
    </div>
  );
}
