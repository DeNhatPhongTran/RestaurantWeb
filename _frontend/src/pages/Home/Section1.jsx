import React from 'react';
import '../../styles/HomeStyle.css';
import { Link } from 'react-router-dom';

export default function Section1() {
  return (
    <section className="section section1">
      <div className="section1__container">
        <div className="section1__content">
          {/* <img src="https://static.vecteezy.com/system/resources/thumbnails/043/269/961/small_2x/open-flaming-charcoal-grill-with-various-food-items-cooking-on-it-showcasing-a-summer-grilling-barbecue-session-with-copy-space-photo.jpg" class="section1__image" alt="decor" /> */}
          <h1 className="section1__title">Chào Mừng Đến TasteGood</h1>
          <p className="section1__subtitle">Thưởng thức hương vị đặc biệt, được chế biến tại bếp lửa vì mỗi buổi tụ họp.</p>
          <div className="section1__buttons">
            <Link to="/menu" className="btn btn__primary">Xem thực đơn</Link>
            <Link to="/orders" className="btn btn__primary">Đặt bàn</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
