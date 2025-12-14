import React from 'react';
import Cards from '../../components/Layouts/Cards';

export default function Section3() {
  const specialDishes = [
    {
      title: 'Grilled Salmon',
      description: 'Fresh salmon with lemon butter sauce',
      price: 25.99,
      image: 'https://cdn.pixabay.com/photo/2016/12/26/17/28/food-1932466_1280.jpg',
      badge: 'Popular'
    },
    {
      title: 'Pasta Carbonara',
      description: 'Classic Italian pasta with bacon and cream',
      price: 15.99,
      image: 'https://cdn.pixabay.com/photo/2016/02/19/11/08/pasta-1209338_1280.jpg',
      badge: 'Classic'
    },
    {
      title: 'Kung Pao Chicken',
      description: 'Spicy chicken with peanuts and vegetables',
      price: 14.99,
      image: 'https://cdn.pixabay.com/photo/2016/11/18/23/31/food-1835369_1280.jpg'
    },
    {
      title: 'Sushi Platter',
      description: 'Assorted fresh sushi rolls',
      price: 32.99,
      image: 'https://cdn.pixabay.com/photo/2017/06/01/12/39/sushi-2363418_1280.jpg',
      badge: 'Premium'
    }
  ];

  return (
    <section className="section section3">
      <div className="container">
        <h2 className="section__title">Our Special Dishes</h2>
        <div className="cards__grid">
          {specialDishes.map((dish, idx) => (
            <Cards key={idx} {...dish} />
          ))}
        </div>
      </div>
    </section>
  );
}
