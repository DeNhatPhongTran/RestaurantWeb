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
        const response = await apiCall('/api/dish_menu/list');

        // Kiểm tra dữ liệu trả về
        if (response.success && response.data) {
          const menuData = response.data;

          setMenuItems(menuData);

          // Lấy danh sách các category duy nhất (unique categories)
          const uniqueCategories = new Set(menuData.map(item => item.category)); // Sử dụng category là chuỗi
          const cats = Array.from(uniqueCategories).map(name => ({
            name
          }));
          setCategories(cats);
          setError(null);
        } else {
          setError('Không thể tải thực đơn');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Không thể tải các mục thực đơn');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [apiCall]);

  // Lọc các món ăn theo danh mục đã chọn
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);  // So sánh category là chuỗi

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
            {categories.map((cat, index) => (
              <button
                key={index} // Dùng index cho key nếu không có _id
                className={`filter__btn ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
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
                badge={item.status === 'Đang phục vụ' ? 'Còn bán' : 'Đã bán hết'}
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
