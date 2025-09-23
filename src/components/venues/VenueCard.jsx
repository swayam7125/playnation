// src/components/venues/VenueCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function VenueCard({ venue, viewMode = 'grid' }) {
    const [isHovered, setIsHovered] = useState(false); 

    const availableSports = [...new Set((venue.facilities ?? []).map(f => f.sports?.name).filter(Boolean))];

    // Determine the images to display. This will handle cases with multiple images.
    const imagesToDisplay = (venue.image_url && venue.image_url.length > 1) 
        ? venue.image_url
        : (venue.image_url?.[0] ? [venue.image_url[0]] : [placeholderImage]);

    const getImageUrl = (url) => {
        if (!url) return placeholderImage;
        return url.includes('supabase.co') 
            ? `${url}${viewMode === 'list' ? '?width=400&height=200&resize=cover' : '?width=300&height=200&resize=cover'}`
            : url;
    };

    // Handle card click - this will navigate to the venue page
    const handleCardClick = (e) => {
        // Don't navigate if clicking on swiper navigation buttons
        if (e.target.closest('.swiper-button-next') || 
            e.target.closest('.swiper-button-prev') || 
            e.target.closest('.swiper-pagination')) {
            e.preventDefault();
            return;
        }
    };

    return (
        <Link 
            to={`/venues/${venue.venue_id}`} 
            className="block h-full"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color-light hover:shadow-lg hover:border-primary-green/20 transition-all duration-300 group overflow-hidden h-full flex flex-col w-[300px] cursor-pointer">
                <div className="relative w-full h-48 overflow-hidden">
                    {isHovered && imagesToDisplay.length > 1 ? (
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={true}
                            className="w-full h-full user-card-swiper"
                            onClick={(swiper, event) => event.stopPropagation()}
                            onTap={(swiper, event) => event.stopPropagation()}
                        >
                            {imagesToDisplay.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img 
                                        src={getImageUrl(image)} 
                                        alt={`${venue.name} - ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = placeholderImage; }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <img 
                            src={getImageUrl(imagesToDisplay[0])} 
                            alt={venue.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = placeholderImage; }}
                        />
                    )}
                    
                    {/* Overlay to indicate it's clickable */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-sm font-medium">Click to view details</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-dark-text mb-2 group-hover:text-primary-green-dark transition-colors">
                        {venue.name}
                    </h3>
                    <p className="text-sm text-medium-text mb-4 flex-grow flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-primary-green" />
                        {venue.address}, {venue.city}
                    </p>
                    <div className="mt-auto space-y-3">
                        {availableSports.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {availableSports.slice(0, 3).map(sport => 
                                    <span 
                                        key={sport} 
                                        className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200"
                                    >
                                        {sport}
                                    </span>
                                )}
                                {availableSports.length > 3 && (
                                    <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-semibold border border-gray-200">
                                        +{availableSports.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {/* Call to action button */}
                        <div className="pt-2">
                            <div className="text-xs text-primary-green font-semibold group-hover:text-primary-green-dark transition-colors">
                                View Details & Book →
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VenueCard;