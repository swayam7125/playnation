// src/components/venues/OwnerVenueCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaEdit, FaTrash, FaEye, FaUsers, FaRupeeSign } from 'react-icons/fa';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

function OwnerVenueCard({ venue }) {
    const [isHovered, setIsHovered] = useState(false);
    const firstSport = venue.facilities?.[0]?.sports?.name || 'Sports';

    const imagesToDisplay = (venue.image_url && venue.image_url.length > 1) 
        ? venue.image_url
        : (venue.image_url?.[0] ? [venue.image_url[0]] : [placeholderImage]);

    const cardStatus = venue.is_approved ? 'approved' : (venue.rejection_reason ? 'rejected' : 'pending');

    const statusConfig = {
        approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
        pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
        rejected: { label: 'Review', color: 'bg-red-100 text-red-700' }
    };
    const currentStatus = statusConfig[cardStatus];

    return (
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color-light transition-all duration-300 group overflow-hidden h-full flex flex-col w-[300px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
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
    className="w-full h-full owner-card-swiper" // Added custom class
    onClick={(e) => e.stopPropagation()}
    onTap={(e) => e.stopPropagation()}
>
    {imagesToDisplay.map((image, index) => (
        <SwiperSlide key={index}>
            <img 
                src={image} 
                alt={`${venue.name} - ${index + 1}`} 
                className="w-full h-full object-cover"
            />
        </SwiperSlide>
    ))}
</Swiper>
                ) : (
                    <img 
                        src={imagesToDisplay[0]} 
                        alt={venue.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = placeholderImage; }}
                    />
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-dark-text group-hover:text-primary-green-dark transition-colors">{venue.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${currentStatus.color}`}>
                        {currentStatus.label}
                    </span>
                </div>
                <p className="text-sm text-medium-text mb-4 flex-grow">{venue.address}, {venue.city}</p>
                <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {firstSport && (
                            <span className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-xs font-semibold border border-emerald-200">{firstSport}</span>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <Link to={`/owner/edit-venue/${venue.venue_id}`} className="flex items-center space-x-2 px-4 py-2 bg-primary-green text-white rounded-lg text-sm font-medium hover:bg-primary-green-dark transition-colors no-underline">
                            <FaEdit className="text-xs" /> <span>Edit</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnerVenueCard;