import React from 'react';

export default function Section7() {
  return (
    <section className="section section7">
      <div className="container">
        <h2 className="section__title">Đăng Ký Bản Tin</h2>
        <div className="newsletter__content">
          <p>Đăng ký bản tin của chúng tôi và nhận các ưu đãi và cập nhật độc quyền!</p>
          <form className="newsletter__form">
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
              required 
            />
            <button type="submit" className="btn btn__primary">Đăng Ký</button>
          </form>
        </div>
      </div>
    </section>
  );
}
