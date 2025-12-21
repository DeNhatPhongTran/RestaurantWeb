import React, { useState, useEffect } from 'react';
import { useApi } from '../../context/ApiContext';
import Cards from '../../components/Layouts/Cards';

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Section3() {
  const { apiCall } = useApi();
  const [specialDishes, setSpecialDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/menu/items');
      
      if (response.success) {
        // Get all items and shuffle them
        const itemsArray = Array.isArray(response.data.data) ? response.data.data : [];
        const shuffledItems = shuffleArray(itemsArray);
        
        const dishes = shuffledItems.slice(0, 8).map(item => ({
          title: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
        }));
        setSpecialDishes(dishes);
      } else {
        console.error('Failed to fetch dishes:', response.error);
        setSpecialDishes([]);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setSpecialDishes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section3">
      <div className="container">
        <h2 className="section__title">Các Món Ăn Đặc Sắc</h2>
        <div className="cards__grid">
          {loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Đang tải...</p>
          ) : specialDishes.length > 0 ? (
            specialDishes.map((dish, idx) => (
              <Cards key={idx} {...dish} />
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Không có dữ liệu</p>
          )}
        </div>
      </div>
    </section>
  );
}
