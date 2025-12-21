import React from 'react';

export default function Section4() {
  const testimonials = [
    {
      name: 'John Doe',
      comment: 'TasteGood delivers on time and the dishes stay flavorful, even for takeout.',
      rating: 5
    },
    {
      name: 'Jane Smith',
      comment: 'Beautiful space, attentive staff, and refined flavors. We will be back soon.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      comment: 'Great mix of Asian and Western dishes at a fair price, with consistent quality.',
      rating: 4
    }
  ];

  return (
    <section className="section section4">
      <div className="container">
        <h2 className="section__title">What our guests say</h2>
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
