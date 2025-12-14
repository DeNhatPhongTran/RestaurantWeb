import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3>TasteGood</h3>
          <p>Nhà hàng chuẩn quốc tế với đầy đủ món ăn đến từ mọi châu lục</p>
        </div>

        <div className="footer__section">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><a href="#home">Trang chủ</a></li>
            <li><a href="#menu">Thực đơn</a></li>
            <li><a href="#about">Thông tin nhà hàng</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4>Theo dõi chúng tôi</h4>
          <ul>
            <li><a href="#facebook">Facebook</a></li>
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#instagram">Instagram</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4>Liên hệ</h4>
          <p>Email: info@tastegood.com</p>
          <p>Phone: +84 123 456 789</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; 2025 TasteGood. All rights reserved.</p>
      </div>
    </footer>
  );
}
