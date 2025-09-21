// src/components/offers/HeroOfferCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Re-import EffectFade
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import HeroOfferBanner from "./HeroOfferBanner";

const HeroOfferCarousel = ({ offers }) => {
  return (
    <div className="my-8">
      <Swiper
        // Add EffectFade to the modules array
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade" // Set the effect to 'fade'
        fadeEffect={{
          crossFade: true, // This ensures a smooth cross-fade between slides
        }}
        speed={800} // Keep the slow speed for a smooth transition
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={offers.length > 1}
        className="!pb-12"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.offer_id}>
            <HeroOfferBanner offer={offer} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroOfferCarousel;
