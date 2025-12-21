import React from 'react';
import Cards from '../../components/Layouts/Cards';

export default function Section2() {
  const features = [
    {
      title: 'Elevated dining space',
      description: 'Modern interiors with warm lighting and cozy seating for every occasion.',
      image: 'https://nhabephoanggia.vn/contents/images/mau-thiet-ke-nha-hang-don-gian-dep-nam-2019%205.jpg',
      badge: 'Modern'
    },
    {
      title: 'Fresh, seasonal produce',
      description: 'We source the best ingredients daily to keep every plate vibrant.',
      image: 'https://www.gobble.com/wp-content/uploads/2021/11/how-to-select-fresh-ingredients-1-1024x683.jpg',
      badge: 'Fresh'
    },
    {
      title: 'Expert culinary team',
      description: 'Chefs with global experience crafting balanced, memorable flavors.',
      image: 'https://i0.wp.com/harrisaoki.com/wp-content/uploads/2025/10/Experience-That-Fits-%E2%80%94-Why-Aligning-a-Chefs-Background-with-Your-Restaurant-Concept-Matters.jpg?fit=1000%2C636&ssl=1',
      badge: 'Quality'
    }
  ];

  return (
    <section className="section section2">
      <div className="container">
        <h2 className="section__title">Why guests choose TasteGood first</h2>
        <div className="cards__grid">
          {features.map((feature, idx) => (
            <Cards key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
