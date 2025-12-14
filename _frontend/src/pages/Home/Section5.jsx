import React from 'react';

export default function Section5() {
  return (
    <section className="section section5">
      <div className="container">
        <div className="section5__content">
          <div className="section5__text">
            <h2>About Our Restaurant</h2>
            <p>
              FoodHub is dedicated to bringing you the finest culinary experiences 
              with fresh ingredients and authentic recipes. Our team of expert chefs 
              work tirelessly to ensure every meal is prepared with love and care.
            </p>
            <p>
              Since our establishment, we have been committed to delivering not just 
              food, but an unforgettable dining experience to our valued customers.
            </p>
            <button className="btn btn__primary">Read More</button>
          </div>
          <div className="section5__image">
            <img 
              src="https://cdn.pixabay.com/photo/2016/11/21/12/42/kitchen-1645434_1280.jpg" 
              alt="Restaurant"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
