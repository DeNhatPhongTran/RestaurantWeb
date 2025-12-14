import React from 'react';
import '../../styles/HomeStyle.css';

export default function Section1() {
  return (
    <section className="section section1">
      <div className="container">
        <div className="section1__content">
          <h1 className="section1__title">Chào mừng đến với TasteGood</h1>
          <p className="section1__subtitle">Cùng thưởng thức những món ăn bùng nổ vị giác</p>
          <div className="section1__buttons">
            <button className="btn btn__primary">Khám phá thực đơn</button>
            <button className="btn btn__secondary">Xem thêm</button>
          </div>
        </div>
      </div>
    </section>
  );
}
