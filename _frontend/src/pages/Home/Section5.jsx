import React from 'react';

export default function Section5() {
  return (
    <section className="section section5">
      <div className="container">
        <div className="section5__content">
          <div className="section5__text">
            <h2>Về Nhà Hàng TasteGood</h2>
            <p>
              TasteGood cam kết mang đến những trải nghiệm ẩm thực tốt nhất 
              với nguyên liệu tươi và các công thức xác thực. Đội ngũ đầu bếp chuyên nghiệp 
              của chúng tôi luôn nỗ lực để đảm bảo mỗi bữa ăn được chế biến với tình yêu và tâm huyết.
            </p>
            <p>
              Kể từ khi thành lập, chúng tôi đã cam kết cung cấp không chỉ là thức ăn, 
              mà là một trải nghiệm ăn uống không thể quên cho các khách hàng quý giá của chúng tôi.
            </p>
            <button className="btn btn__primary">Đọc Thêm</button>
          </div>
          <div className="section5__image">
            <img 
              src="https://gubistronomy.com/wp-content/uploads/2023/05/nhung-dieu-can-biet-ve-nha-hang-sao-michelin-8.jpg" 
              alt="Restaurant"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
