import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const placeholderImage =
  "https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500";

function VenueCard({ venue, viewMode = "grid" }) {
  const [isHovered, setIsHovered] = useState(false);

  const availableSports = [
    ...new Set(
      (venue.facilities ?? []).map((f) => f.sports?.name).filter(Boolean)
    ),
  ];

  const imagesToDisplay =
    venue.image_url && venue.image_url.length > 1
      ? venue.image_url
      : venue.image_url?.[0]
      ? [venue.image_url[0]]
      : [placeholderImage];

  const getImageUrl = (url) => {
    if (!url) return placeholderImage;
    return url.includes("supabase.co")
      ? `${url}?width=600&height=400&resize=cover`
      : url;
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest(".swiper-button-next") ||
      e.target.closest(".swiper-button-prev") ||
      e.target.closest(".swiper-pagination")
    ) {
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
      <div
        className={`bg-card-bg rounded-xl shadow-md border border-border-color-light 
          hover:shadow-lg hover:border-primary-green/30 transition-all duration-300 
          group overflow-hidden cursor-pointer
          ${viewMode === "grid" ? "flex flex-col w-[300px] h-full" : "flex flex-row w-full h-52"}`}
      >
        {/* IMAGE */}
        <div
          className={`${
            viewMode === "grid" ? "w-full h-48" : "w-64 h-full"
          } relative overflow-hidden`}
        >
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
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={getImageUrl(imagesToDisplay[0])}
              alt={venue.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />
          )}
        </div>

        {/* INFO */}
        <div
          className={`p-5 flex flex-col flex-grow 
            ${viewMode === "list" ? "justify-between" : ""}`}
        >
          {/* Title & Address */}
          <div>
            <h3 className="text-xl font-semibold text-dark-text mb-1 group-hover:text-primary-green-dark transition-colors">
              {venue.name}
            </h3>
            <p className="text-sm text-medium-text flex items-center">
              <FaMapMarkerAlt className="mr-1 text-primary-green" />
              {venue.address}, {venue.city}
            </p>
          </div>

          {/* Sports Tags */}
          {availableSports.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {availableSports.slice(0, 4).map((sport) => (
                <span
                  key={sport}
                  className="bg-light-green-bg text-emerald-800 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200 whitespace-nowrap"
                >
                  {sport}
                </span>
              ))}
              {availableSports.length > 4 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 whitespace-nowrap">
                  +{availableSports.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-end mt-4">
            <span className="text-sm font-semibold text-primary-green group-hover:text-primary-green-dark transition-colors">
              View Details & Book →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VenueCard;