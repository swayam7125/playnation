import React from 'react';

export const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card-new">
    <div className="icon">{icon}</div>
    <div className="title">{title}</div>
    <div className="description">{description}</div>
  </div>
);

export default FeatureCard;
