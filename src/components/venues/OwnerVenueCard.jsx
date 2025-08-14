import React from 'react';
import { Link } from 'react-router-dom';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function OwnerVenueCard({ venue }) {
  return (
    <div className="venue-card">
      <img
        src={venue.image_url || placeholderImage}
        alt={venue.name}
        className="venue-card-image"
      />
      <div className="venue-card-content">
        <h3>{venue.name}</h3>
        <p>{venue.address}, {venue.city}</p>
        <div className="owner-card-footer">
          <span className={`status-badge ${venue.is_approved ? 'approved' : 'pending'}`}>
            {venue.is_approved ? 'Approved' : 'Pending Approval'}
          </span>
          {/* --- REFERENCE UPDATED HERE --- */}
          <Link to={`/owner/edit-venue/${venue.venue_id}`} className="btn btn-secondary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OwnerVenueCard;