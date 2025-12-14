import React from 'react';
import Cards from '../../components/Layouts/Cards';

export default function Section2() {
  const features = [
    {
      title: 'Không gian sang trọng',
      description: 'Nội thất bày trí hiện đại, cao cấp',
      image: 'https://nhabephoanggia.vn/contents/images/mau-thiet-ke-nha-hang-don-gian-dep-nam-2019%205.jpg',
      badge: 'Hiện đại'
    },
    {
      title: 'Nguyên liệu tươi sạch',
      description: 'Ở đây chỉ có những nguyên liệu tươi ngon nhất',
      image: 'https://www.gobble.com/wp-content/uploads/2021/11/how-to-select-fresh-ingredients-1-1024x683.jpg',
      badge: 'Tươi sạch'
    },
    {
      title: 'Đầu bếp chuyên nghiệp',
      description: 'Đầu bếp với trình độ tay nghề cao, giàu kinh nghiệm',
      image: 'https://i0.wp.com/harrisaoki.com/wp-content/uploads/2025/10/Experience-That-Fits-%E2%80%94-Why-Aligning-a-Chefs-Background-with-Your-Restaurant-Concept-Matters.jpg?fit=1000%2C636&ssl=1',
      badge: 'Chất lượng'
    }
  ];

  return (
    <section className="section section2">
      <div className="container">
        <h2 className="section__title">Vì sao nên lựa chọn chúng tôi?</h2>
        <div className="cards__grid">
          {features.map((feature, idx) => (
            <Cards key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
