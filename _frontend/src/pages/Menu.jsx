import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import Cards from '../components/Layouts/Cards';
import '../styles/MenuStyle.css';

const categoryTranslation = {
  'Appetizers': 'Khai Vị',
  'Soups': 'Súp',
  'Main Dishes': 'Món Chính',
  'Desserts': 'Tráng Miệng',
  'Drinks': 'Đồ Uống'
};

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
            name,
            viName: categoryTranslation[name] || name
          }));
          setCategories(cats);
          setError(null);
        } else {
          setError(response.error || 'Không thể tải thực đơn');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Không thể tải các mục thực đơn');
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
        <div className="loading">Đang tải thực đơn...</div>
      </div>
    );
  }

  return (
    <div className="menu-page">
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
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                className={`filter__btn ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.viName}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu__grid" key={`${selectedCategory}-${filteredItems.length}`}>
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
