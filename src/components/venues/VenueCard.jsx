import React from 'react';
import { FaTrophy, FaStar } from 'react-icons/fa';
import Card from '../Card'; // Import the new Card component

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function VenueCard({ venue }) {
  const availableSports = [...new Set((venue.facilities ?? []).map(f => f.sports?.name).filter(Boolean))];
  const allAmenities = (venue.facilities ?? []).flatMap(f => f.facility_amenities?.map(fa => fa.amenities?.name) ?? []).filter(Boolean);
  const availableAmenities = [...new Set(allAmenities)];

  const getImageUrl = () => {
    if (!venue.image_url) {
      return placeholderImage;
    }
    if (venue.image_url.includes('/venue_image/')) {
      return venue.image_url.replace('/venue_image/', '/venue-images/');
    }
    return venue.image_url;
  };

  return (
    <Card to={`/venue/${venue.venue_id}`} className="venue-card">
      <img
        src={getImageUrl()}
        alt={venue.name}
        className="venue-card-image"
        onError={(e) => {
          e.target.src = placeholderImage;
        }}
      />
      <div className="venue-card-content">
        <h3>{venue.name}</h3>
        <p>{venue.address}, {venue.city}</p>
        {availableSports.length > 0 && (
          <div className="venue-card-features">
            <div className="feature-title"><FaTrophy /> Sports Available</div>
            <div className="feature-list">
              {availableSports.slice(0, 3).map(sport => <span key={sport} className="feature-item">{sport}</span>)}
              {availableSports.length > 3 && <span className="feature-item">+{availableSports.length - 3} more</span>}
            </div>
          </div>
        )}
        {availableAmenities.length > 0 && (
          <div className="venue-card-features">
            <div className="feature-title"><FaStar /> Amenities</div>
            <div className="feature-list">
              {availableAmenities.slice(0, 3).map(amenity => <span key={amenity} className="feature-item">{amenity}</span>)}
              {availableAmenities.length > 3 && <span className="feature-item">+{availableAmenities.length - 3} more</span>}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default VenueCard;