import React from 'react';

export default function Cards({ title, description, image, price, badge }) {
  return (
    <div className="card">
      {image && (
        <div className="card__image">
          <img src={image} alt={title} />
          {badge && <span className="card__badge">{badge}</span>}
        </div>
      )}
      <div className="card__body">
        <div className="card__content">
          <h3 className="card__title">{title}</h3>
          {description && <p className="card__description">{description}</p>}
        </div>
        {price && <p className="card__price">{price.toFixed(0)} VND</p>}
        {/* <button className="card__button">Xem thêm</button> */}
      </div>
    </div>
  );
}
