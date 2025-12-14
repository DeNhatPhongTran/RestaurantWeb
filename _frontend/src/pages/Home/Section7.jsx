import React from 'react';

export default function Section7() {
  return (
    <section className="section section7">
      <div className="container">
        <h2 className="section__title">Newsletter Subscription</h2>
        <div className="newsletter__content">
          <p>Subscribe to our newsletter and get exclusive offers and updates!</p>
          <form className="newsletter__form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            <button type="submit" className="btn btn__primary">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}
