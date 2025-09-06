import React from 'react';

export const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 border border-border-color rounded-lg bg-card-bg text-center">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="font-semibold text-base mb-1">{title}</div>
    <div className="text-sm text-light-text">{description}</div>
  </div>
);

export default FeatureCard;