import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import type { NightCanteenItem } from '../../types';
import { getNightCanteenItems } from '../../data/nightCanteenRepository';
import './NightCanteenView.css';

type DietaryFilter = 'ALL' | 'VEG' | 'NON_VEG';
type PriceSort = 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC';

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
        console.warn('Failed to load night canteen items:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (dietaryFilter === 'VEG' && item.type !== 'Veg') return false;
        if (dietaryFilter === 'NON_VEG' && item.type !== 'Non-Veg') return false;
        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'PRICE_ASC') return a.price - b.price;
        if (priceSort === 'PRICE_DESC') return b.price - a.price;
        return a.sno - b.sno;
      });
  }, [items, dietaryFilter, priceSort]);

  return (
    <div className="night-canteen-container">
      {/* 2 Clean Dropdown Filters */}
      <div className="nc-dropdowns-bar">
        {/* Dropdown 1: Veg / Non-Veg */}
        <div className="nc-select-box">
          <div className="nc-select-icon-left" aria-hidden="true">
            <Filter size={15} />
          </div>
          <select
            id="dietary-filter-select"
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

        {/* Dropdown 2: Price Sorting */}
        <div className="nc-select-box">
          <div className="nc-select-icon-left" aria-hidden="true">
            <ArrowUpDown size={15} />
          </div>
          <select
            id="price-sort-select"
            className="nc-dropdown-select"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as PriceSort)}
            aria-label="Sort by price"
          >
            <option value="DEFAULT">Sort: Price</option>
            <option value="PRICE_ASC">Price: Min → Max</option>
            <option value="PRICE_DESC">Price: Max → Min</option>
          </select>
          <div className="nc-select-caret" aria-hidden="true">
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Simple, Non-glowing Clean Table */}
      {loading ? (
        <div className="nc-simple-message">
          <p>Loading items...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="nc-table-wrapper">
          <table className="nc-simple-table">
            <thead>
              <tr>
                <th className="nc-col-sno">#</th>
                <th className="nc-col-name">Food Item</th>
                <th className="nc-col-type">Type</th>
                <th className="nc-col-cat">Category</th>
                <th className="nc-col-qty">Quantity</th>
                <th className="nc-col-price">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isVeg = item.type === 'Veg';
                return (
                  <tr key={item.sno}>
                    <td className="nc-col-sno">{item.sno}</td>
                    <td className="nc-col-name">
                      <div className="nc-name-wrap">
                        <span className={`nc-dot ${isVeg ? 'dot-veg' : 'dot-nonveg'}`} />
                        <span className="nc-name-text">{item.name}</span>
                      </div>
                      <div className="nc-mobile-meta">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.quantity}</span>
                      </div>
                    </td>
                    <td className="nc-col-type">
                      <span className={`nc-type-badge ${isVeg ? 'veg' : 'non-veg'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="nc-col-cat">{item.category}</td>
                    <td className="nc-col-qty">{item.quantity}</td>
                    <td className="nc-col-price">₹{item.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="nc-simple-message">
          <p>No items found.</p>
        </div>
      )}
    </div>
  );
};
