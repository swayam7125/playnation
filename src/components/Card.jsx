import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ children, to, className = '' }) => {
  const cardClassName = `card ${className}`;

  if (to) {
    return (
      <Link to={to} className="card-link">
        <div className={cardClassName}>{children}</div>
      </Link>
    );
  }

  return <div className={cardClassName}>{children}</div>;
};

export default Card;