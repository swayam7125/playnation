import React from 'react';

export const CategoryCard = ({ imgSrc, name }) => (
  <div className="sport-card">
    <div className="icon">
      <img src={imgSrc} alt={`${name} icon`} />
    </div>
    <span>{name}</span>
  </div>
);

export default CategoryCard;