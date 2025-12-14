import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import Cards from '../components/Layouts/Cards';
import '../styles/MenuStyle.css';

export default function Menu() {
  const { apiCall } = useApi();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await apiCall('/api/menu/items');
        
        if (response.success) {
          setMenuItems(response.data.data || response.data);
          
          // Extract unique categories
          const uniqueCategories = {};
          (response.data.data || response.data).forEach(item => {
            if (item.category) {
              uniqueCategories[item.category._id] = item.category.category_name;
            }
          });
          
          const cats = Object.entries(uniqueCategories).map(([id, name]) => ({
            _id: id,
            name
          }));
          setCategories(cats);
          setError(null);
        } else {
          setError(response.error || 'Failed to load menu');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category._id === selectedCategory);

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu__header">
          <h1>Thực đơn</h1>
          <p>Thưởng thức những món ăn hấp dẫn</p>
        </div>
        <div className="loading">Đang tải thực đơn ...</div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu__header">
        <h1>Thực đơn</h1>
        <p>Thưởng thức những món ăn hấp dẫn</p>
      </div>

      {error && (
        <div className="menu__error">
          <p>{error}</p>
        </div>
      )}

      <div className="container">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="menu__filters">
            <button
              className={`filter__btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Tất cả món ăn
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                className={`filter__btn ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu__grid">
            {filteredItems.map(item => (
              <Cards
                key={item._id}
                title={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                badge={item.status === 'available' ? 'Còn bán' : 'Đã bán hết'}
              />
            ))}
          </div>
        ) : (
          <div className="menu__empty">
            <p>Không có món ăn ở danh mục này</p>
          </div>
        )}
      </div>
    </div>
  );
}
