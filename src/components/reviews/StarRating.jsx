import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, totalStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStars = Math.round(rating - fullStars);
  const emptyStars = totalStars - fullStars - halfStars;

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
      {[...Array(halfStars)].map((_, i) => <FaStarHalfAlt key={`half-${i}`} />)}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
    </div>
  );
};

export default StarRating;