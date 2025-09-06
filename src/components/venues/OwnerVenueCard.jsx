import React from 'react';
import { Link } from 'react-router-dom';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function OwnerVenueCard({ venue }) {
  return (
    <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden transition duration-300 shadow-sm">
      <img
        src={venue.image_url || placeholderImage}
        alt={venue.name}
        className="w-full h-52 object-cover bg-border-color-light"
      />
      <div className="p-6">
        <h3 className="m-0 mb-2 text-xl font-bold text-dark-text">{venue.name}</h3>
        <p className="m-0 mb-6 text-light-text text-sm leading-relaxed">{venue.address}, {venue.city}</p>
        <div className="mt-4 pt-4 border-t border-border-color flex justify-between items-center">
          <span className={`py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider ${venue.is_approved ? 'bg-light-green-bg text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {venue.is_approved ? 'Approved' : 'Pending'}
          </span>
          <Link to={`/owner/edit-venue/${venue.venue_id}`} className="py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-card-bg text-medium-text border border-border-color shadow-sm hover:bg-hover-bg hover:border-primary-green hover:text-primary-green hover:-translate-y-px hover:shadow-md">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OwnerVenueCard;