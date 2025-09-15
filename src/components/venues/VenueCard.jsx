import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function VenueCard({ venue, viewMode = 'grid' }) {
    const availableSports = [...new Set((venue.facilities ?? []).map(f => f.sports?.name).filter(Boolean))];
    const allAmenities = (venue.facilities ?? []).flatMap(f => f.facility_amenities?.map(fa => fa.amenities?.name) ?? []).filter(Boolean);
    const availableAmenities = [...new Set(allAmenities)];

    const getImageUrl = () => {
        if (!venue.image_url) return placeholderImage;
        return venue.image_url.includes('/venue_image/') 
            ? venue.image_url.replace('/venue_image/', '/venue-images/') 
            : venue.image_url;
    };

    // LIST VIEW
    if (viewMode === 'list') {
        return (
            <Link to={`/venue/${venue.venue_id}`} className="block">
                <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color-light hover:shadow-lg hover:border-primary-green/20 transition-all duration-300 group flex gap-6 p-4">
                    <img 
                        src={getImageUrl()} 
                        alt={venue.name} 
                        className="w-48 h-full object-cover rounded-xl hidden sm:block"
                        onError={(e) => { e.target.src = placeholderImage; }}
                    />
                    <div className="flex-1 py-2">
                        <h3 className="text-xl font-semibold text-dark-text mb-2 group-hover:text-primary-green-dark transition-colors">{venue.name}</h3>
                        <p className="text-sm text-medium-text flex items-center gap-2 mb-4"><FaMapMarkerAlt className="text-light-text" /> {venue.address}, {venue.city}</p>
                        
                        {availableSports.length > 0 && (
                             <div className="flex items-center gap-2 text-sm text-light-text mb-3">
                                <FaTrophy className="text-primary-green" />
                                <span>{availableSports.join(', ')}</span>
                            </div>
                        )}
                        {availableAmenities.length > 0 && (
                             <div className="flex flex-wrap gap-2">
                                {availableAmenities.slice(0, 4).map(amenity => 
                                  <span key={amenity} className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">{amenity}</span>
                                )}
                              </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    }
    
    // GRID VIEW (DEFAULT)
    return (
        <Link to={`/venue/${venue.venue_id}`} className="block h-full">
            <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color-light hover:shadow-lg hover:border-primary-green/20 transition-all duration-300 group overflow-hidden h-full flex flex-col">
                <img 
                    src={getImageUrl()} 
                    alt={venue.name} 
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.src = placeholderImage; }}
                />
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-dark-text mb-2 group-hover:text-primary-green-dark transition-colors">{venue.name}</h3>
                    <p className="text-sm text-medium-text mb-4 flex-grow">{venue.address}, {venue.city}</p>
                    <div className="mt-auto space-y-3">
                        {availableSports.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {availableSports.slice(0, 3).map(sport => 
                                  <span key={sport} className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">{sport}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VenueCard;