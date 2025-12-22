import React from 'react';

export default function Section4() {
  const testimonials = [
    {
      name: 'Công Phượng',
      comment: 'TasteGood giao hàng đúng giờ và các món ăn vẫn ngon, thậm chí khi mang về.',
      rating: 5
    },
    {
      name: 'Ánh Viên',
      comment: 'Không gian đẹp, nhân viên tử tế, hương vị tinh tế. Chúng tôi sẽ quay lại sớm đấy.',
      rating: 5
    },
    {
      name: 'Quang Hải',
      comment: 'Sự pha trộn tuyệt vời giữa ẩm thực châu Á và phương Tây, giá cả hợp lý, chất lượng nhất quán.',
      rating: 4
    }
  ];

  return (
    <section className="section section4">
      <div className="container">
        <h2 className="section__title">Khách Hàng Nói Gì Về TasteGood</h2>
        <div className="testimonials__grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial__card">
              <div className="testimonial__stars">
                {'*'.repeat(testimonial.rating)}
              </div>
              <p className="testimonial__comment">{testimonial.comment}</p>
              <p className="testimonial__name">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
