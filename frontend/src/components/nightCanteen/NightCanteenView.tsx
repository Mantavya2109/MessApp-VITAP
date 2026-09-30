import React, { useState, useEffect, useMemo } from 'react';
import { Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import type { NightCanteenItem } from '../../types';
import { getNightCanteenItems } from '../../data/nightCanteenRepository';
import './NightCanteenView.css';

type DietaryFilter = 'ALL' | 'VEG' | 'NON_VEG';
type PriceSort = 'DEFAULT' | 'LOW_TO_HIGH' | 'HIGH_TO_LOW';

const VegNonVegBadge: React.FC<{ type: 'Veg' | 'Non-Veg' }> = ({ type }) => {
  const isVeg = type === 'Veg';
  return (
    <div
      className={`fssai-indicator ${isVeg ? 'fssai-veg' : 'fssai-nonveg'}`}
      aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span className="fssai-symbol-inner" />
    </div>
  );
};

export const NightCanteenView: React.FC = () => {
  const [items, setItems] = useState<NightCanteenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('ALL');
  const [priceSort, setPriceSort] = useState<PriceSort>('DEFAULT');

  useEffect(() => {
    let isMounted = true;

    getNightCanteenItems()
      .then((data) => {
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[NightCanteenView] Failed to load night canteen items:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Combined Filter & Sort
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter((item) => {
      if (dietaryFilter === 'VEG') return item.type === 'Veg';
      if (dietaryFilter === 'NON_VEG') return item.type === 'Non-Veg';
      return true; // ALL
    });

    // Price Sorting
    if (priceSort === 'LOW_TO_HIGH') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'HIGH_TO_LOW') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => a.sno - b.sno);
    }

    return result;
  }, [items, dietaryFilter, priceSort]);

  return (
    <div className="night-canteen-container animate-fade-in">
      {/* 2 Dropdown Filters Bar */}
      <div className="nc-dropdowns-bar">
        {/* 1. Veg / Non-Veg Filter */}
        <div className="nc-select-box">
          <div className="nc-select-icon-left" aria-hidden="true">
            <Filter size={15} />
          </div>
          <select
            id="nc-dietary-filter"
            className="nc-dropdown-select"
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value as DietaryFilter)}
            aria-label="Filter by dietary type"
          >
            <option value="ALL">Filter: Veg / Non-Veg</option>
            <option value="VEG">Veg</option>
            <option value="NON_VEG">Non-Veg</option>
          </select>
          <div className="nc-select-caret" aria-hidden="true">
            <ChevronDown size={15} />
          </div>
        </div>

        {/* 2. Price Sorting */}
        <div className="nc-select-box">
          <div className="nc-select-icon-left" aria-hidden="true">
            <ArrowUpDown size={15} />
          </div>
          <select
            id="nc-price-sort"
            className="nc-dropdown-select"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as PriceSort)}
            aria-label="Sort by price"
          >
            <option value="DEFAULT">Sort: Price</option>
            <option value="LOW_TO_HIGH">Price: Low → High</option>
            <option value="HIGH_TO_LOW">Price: High → Low</option>
          </select>
          <div className="nc-select-caret" aria-hidden="true">
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Item Count Status */}
      <div className="nc-meta-bar">
        <span className="nc-count-label">
          Showing {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Menu Cards Feed */}
      {loading ? (
        <div className="nc-empty-box">
          <p>Loading Night Canteen menu...</p>
        </div>
      ) : filteredAndSortedItems.length > 0 ? (
        <div className="nc-menu-cards-grid">
          {filteredAndSortedItems.map((item) => (
            <div key={item.sno} className="nc-dish-card">
              <div className="nc-dish-header">
                <VegNonVegBadge type={item.type} />
                <h3 className="nc-dish-title">{item.name}</h3>
              </div>

              <div className="nc-dish-footer">
                <div className="nc-dish-tags">
                  <span className="nc-tag-category">{item.category}</span>
                  {item.quantity && item.quantity.trim() !== '' && (
                    <span className="nc-tag-portion">{item.quantity.trim()}</span>
                  )}
                </div>

                <div className="nc-dish-price-badge">
                  <span className="nc-price-currency">₹</span>
                  <span className="nc-price-val">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="nc-empty-box">
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No items found</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Try adjusting your Veg/Non-Veg filter.
          </p>
        </div>
      )}
    </div>
  );
};
