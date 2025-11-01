// src/components/venues/OwnerVenueCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaEdit, FaEye, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function OwnerVenueCard({ venue }) {
    const [isHovered, setIsHovered] = useState(false);
    
    // Get all available sports from facilities
    const availableSports = [
        ...new Set(
            (venue.facilities ?? []).map((f) => f.sports?.name).filter(Boolean)
        ),
    ];

    const imagesToDisplay = (venue.image_url && venue.image_url.length > 1) 
        ? venue.image_url
        : (venue.image_url?.[0] ? [venue.image_url[0]] : [placeholderImage]);

    const cardStatus = venue.is_approved ? 'approved' : (venue.rejection_reason ? 'rejected' : 'pending');

    const statusConfig = {
        approved: { 
            label: 'Approved', 
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            icon: <FaCheckCircle className="text-emerald-700" size={10} />
        },
        pending: { 
            label: 'Pending', 
            color: 'bg-amber-100 text-amber-700 border-amber-200',
            icon: <FaClock className="text-amber-700" size={10} />
        },
        rejected: { 
            label: 'Suspended', 
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: <FaTimesCircle className="text-red-700" size={10} />
        }
    };
    const currentStatus = statusConfig[cardStatus];

    const getImageUrl = (url) => {
        if (!url) return placeholderImage;
        return url.includes("supabase.co")
            ? `${url}?width=600&height=400&resize=cover`
            : url;
    };

    return (
        <div 
            className="bg-card-bg rounded-lg shadow-sm border border-border-color-light hover:shadow-md hover:border-primary-green/30 transition-all duration-300 group overflow-hidden h-full flex flex-col w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="relative w-full h-36 overflow-hidden flex-shrink-0">
                {isHovered && imagesToDisplay.length > 1 ? (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        className="w-full h-full owner-card-swiper"
                        onClick={(e) => e.stopPropagation()}
                        onTap={(e) => e.stopPropagation()}
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
                
                {/* Status Badge - Positioned on Image */}
                <div className="absolute top-2 right-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${currentStatus.color} backdrop-blur-sm bg-opacity-95`}>
                        {currentStatus.icon}
                        {currentStatus.label}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-base font-semibold text-dark-text mb-0.5 line-clamp-1 group-hover:text-primary-green-dark transition-colors">
                    {venue.name}
                </h3>
                
                {/* Address */}
                <p className="text-xs text-medium-text mb-2 flex items-center line-clamp-1">
                    <FaMapMarkerAlt className="mr-1 text-primary-green flex-shrink-0" size={10} />
                    <span className="truncate">{venue.address}, {venue.city}</span>
                </p>

                {/* Sports Tags */}
                {availableSports.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {availableSports.slice(0, 3).map((sport) => (
                            <span
                                key={sport}
                                className="bg-light-green-bg text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium border border-emerald-200 whitespace-nowrap"
                            >
                                {sport}
                            </span>
                        ))}
                        {availableSports.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200 whitespace-nowrap">
                                +{availableSports.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Rejection Reason (if applicable) */}
                {venue.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
                        <p className="text-xs text-red-700 font-medium mb-0.5">Rejection Reason:</p>
                        <p className="text-xs text-red-600 line-clamp-2">{venue.rejection_reason}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <Link 
                        to={`/owner/edit-venue/${venue.venue_id}`} 
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-green text-white rounded-lg text-xs font-medium hover:bg-primary-green-dark transition-colors no-underline"
                    >
                        <FaEdit size={12} />
                        <span>Edit</span>
                    </Link>
                    <Link 
                        to={`/venues/${venue.venue_id}`} 
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-dark-text rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors no-underline border border-border-color"
                    >
                        <FaEye size={12} />
                        <span>View</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OwnerVenueCard;