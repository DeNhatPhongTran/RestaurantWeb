import React from 'react';
import '../../styles/HomeStyle.css';
import { Link } from 'react-router-dom';

export default function Section1() {
  return (
    <section className="section section1">
      <div className="container">
        <div className="section1__content">
          {/* <img src="https://static.vecteezy.com/system/resources/thumbnails/043/269/961/small_2x/open-flaming-charcoal-grill-with-various-food-items-cooking-on-it-showcasing-a-summer-grilling-barbecue-session-with-copy-space-photo.jpg" class="section1__image" alt="decor" /> */}
          <h1 className="section1__title">Welcome to TasteGood</h1>
          <p className="section1__subtitle">Savor bold, fire-kissed flavors crafted for every gathering.</p>
          <div className="section1__buttons">
            <Link to="/menu" className="btn__secondary">Explore menu</Link>
            <Link to="/reservation" className="btn__secondary">Book a table</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
