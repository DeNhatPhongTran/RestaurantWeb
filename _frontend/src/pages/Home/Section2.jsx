import React from 'react';
import Cards from '../../components/Layouts/Cards';

export default function Section2() {
  const features = [
    {
      title: 'Không gian ăn uống hiện đại',
      description: 'Nội thất hiện đại với ánh sáng ấm áp và chỗ ngồi thoải mái cho mọi dịp.',
      image: 'https://nhabephoanggia.vn/contents/images/mau-thiet-ke-nha-hang-don-gian-dep-nam-2019%205.jpg',
      badge: 'Hiện đại'
    },
    {
      title: 'Nguyên liệu tươi, theo mùa',
      description: 'Chúng tôi cung cấp những nguyên liệu tốt nhất hàng ngày để giữ mỗi món ăn sống động.',
      image: 'https://www.gobble.com/wp-content/uploads/2021/11/how-to-select-fresh-ingredients-1-1024x683.jpg',
      badge: 'Tươi'
    },
    {
      title: 'Đội ngũ đầu bếp chuyên nghiệp',
      description: 'Các đầu bếp có kinh nghiệm quốc tế chế biến các hương vị cân bằng, đáng nhớ.',
      image: 'https://i0.wp.com/harrisaoki.com/wp-content/uploads/2025/10/Experience-That-Fits-%E2%80%94-Why-Aligning-a-Chefs-Background-with-Your-Restaurant-Concept-Matters.jpg?fit=1000%2C636&ssl=1',
      badge: 'Chất lượng'
    }
  ];

  return (
    <section className="section section2">
      <div className="container">
        <h2 className="section__title">Tại Sao Khách Hàng Chọn TasteGood</h2>
        <div className="cards__grid">
          {features.map((feature, idx) => (
            <Cards key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
