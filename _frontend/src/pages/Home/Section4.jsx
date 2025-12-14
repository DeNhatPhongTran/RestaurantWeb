import React from 'react';

export default function Section4() {
  const testimonials = [
    {
      name: 'John Doe',
      comment: 'Best food delivery service I have ever used. Highly recommended!',
      rating: 5
    },
    {
      name: 'Jane Smith',
      comment: 'The food quality is exceptional and delivery is always on time.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      comment: 'Great variety of restaurants and very affordable prices.',
      rating: 4
    }
  ];

  return (
    <section className="section section4">
      <div className="container">
        <h2 className="section__title">Customer Testimonials</h2>
        <div className="testimonials__grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial__card">
              <div className="testimonial__stars">
                {'⭐'.repeat(testimonial.rating)}
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
