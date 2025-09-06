import React from 'react';

export const CategoryCard = ({ imgSrc, name }) => (
  <div className="flex flex-col items-center gap-3 p-6 border border-border-color rounded-xl bg-card-bg cursor-pointer transition duration-300 text-center shadow-md hover:-translate-y-1 hover:shadow-lg hover:border-primary-green">
    <div className="w-16 h-16 rounded-lg bg-light-green-bg flex items-center justify-center">
      <img src={imgSrc} alt={`${name} icon`} className="w-8 h-8 object-contain" />
    </div>
    <span className="font-semibold text-sm text-medium-text">{name}</span>
  </div>
);

export default CategoryCard;