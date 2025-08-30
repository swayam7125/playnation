import React from 'react';
import Card from '../../Card'; // Import the new Card component

export const FeatureCard = ({ icon, title, description }) => (
  <Card className="feature-card-new">
    <div className="icon">{icon}</div>
    <div className="title">{title}</div>
    <div className="description">{description}</div>
  </Card>
);

export default FeatureCard;