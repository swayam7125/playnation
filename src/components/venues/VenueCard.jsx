import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaStar } from 'react-icons/fa';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function VenueCard({ venue }) {
  const availableSports = [...new Set((venue.facilities ?? []).map(f => f.sports?.name).filter(Boolean))];
  const allAmenities = (venue.facilities ?? []).flatMap(f => f.facility_amenities?.map(fa => fa.amenities?.name) ?? []).filter(Boolean);
  const availableAmenities = [...new Set(allAmenities)];

  const getImageUrl = () => {
    if (!venue.image_url) return placeholderImage;
    if (venue.image_url.includes('/venue_image/')) {
      return venue.image_url.replace('/venue_image/', '/venue-images/');
    }
    return venue.image_url;
  };

  return (
    <Link to={`/venue/${venue.venue_id}`} className="no-underline text-inherit block">
      <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden transition duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-green">
        <img 
          src={getImageUrl()} 
          alt={venue.name} 
          className="w-full h-52 object-cover bg-border-color-light"
          onError={(e) => { e.target.src = placeholderImage; }}
        />
        <div className="p-6">
          <h3 className="m-0 mb-2 text-xl font-bold text-dark-text">{venue.name}</h3>
          <p className="m-0 mb-6 text-light-text text-sm leading-relaxed">{venue.address}, {venue.city}</p>
          
          {availableSports.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-medium-text mb-3 uppercase tracking-wider">
                <FaTrophy /> Sports Available
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSports.slice(0, 3).map(sport => 
                  <span key={sport} className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">{sport}</span>
                )}
                {availableSports.length > 3 && 
                  <span className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">+{availableSports.length - 3} more</span>
                }
              </div>
            </div>
          )}

          {availableAmenities.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-medium-text mb-3 uppercase tracking-wider">
                <FaStar /> Amenities
              </div>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.slice(0, 3).map(amenity => 
                  <span key={amenity} className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">{amenity}</span>
                )}
                {availableAmenities.length > 3 && 
                  <span className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">+{availableAmenities.length - 3} more</span>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default VenueCard;