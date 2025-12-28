import React from 'react';
import '../../styles/HomeStyle.css';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function Section1() {
  const scrollToSection7 = () => {
    const section = document.getElementById("section7");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // cuộn mượt
    }
  };

  return (
    <section className="section section1">
      <div className="section1__container">
        <div className="section1__content">
          {/* <img src="https://static.vecteezy.com/system/resources/thumbnails/043/269/961/small_2x/open-flaming-charcoal-grill-with-various-food-items-cooking-on-it-showcasing-a-summer-grilling-barbecue-session-with-copy-space-photo.jpg" class="section1__image" alt="decor" /> */}
          <h1 className="section1__title">Chào Mừng Đến TasteGood</h1>
          <p className="section1__subtitle">Thưởng thức hương vị đặc biệt, được chế biến tại bếp lửa vì mỗi buổi tụ họp.</p>
          <div className="section1__buttons">
            <Link to="/menu" className="btn btn__primary">Xem thực đơn</Link>
            <Button onClick={scrollToSection7} className="btn btn__primary bg-orange-60 w-40 h-13 rounded-lg text-base">Đặt bàn</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
