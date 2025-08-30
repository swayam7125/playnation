import React from 'react';
import Card from '../../Card'; // Import the new Card component

export const CategoryCard = ({ imgSrc, name }) => (
  <Card className="sport-card">
    <div className="icon">
      <img src={imgSrc} alt={`${name} icon`} />
    </div>
    <span>{name}</span>
  </Card>
);

export default CategoryCard;