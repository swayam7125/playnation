import React from 'react';
import './CategoryCard.css';

export const CategoryCard = ({ imgSrc, name }) => (
  <div className="sport-card">
    <div className="icon">
      <img src={imgSrc} alt={`${name} icon`} style={{ width: '24px', height: '24px' }} />
    </div>
    <span>{name}</span>
  </div>
);

export default CategoryCard;
