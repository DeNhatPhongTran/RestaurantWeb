import React from 'react';
import '../../styles/HomeStyle.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Section1() {
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <section className="section section1">
      <div className=".section1__container">
        <div className="section1__content">
          {/* <img src="https://static.vecteezy.com/system/resources/thumbnails/043/269/961/small_2x/open-flaming-charcoal-grill-with-various-food-items-cooking-on-it-showcasing-a-summer-grilling-barbecue-session-with-copy-space-photo.jpg" class="section1__image" alt="decor" /> */}
          <h1 className="section1__title">Chào mừng đến với TasteGood</h1>
          <p className="section1__subtitle">Cùng thưởng thức những món ăn bùng nổ vị giác</p>
          <div className="section1__buttons">
            <Link to="/menu" className="btn__secondary" onClick={closeMenu}>Khám phá thực đơn</Link>
            <Link to="/reservation" className="btn__secondary" onClick={closeMenu}>Đặt bàn</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
