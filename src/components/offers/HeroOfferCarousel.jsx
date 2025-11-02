// src/components/offers/HeroOfferCarousel.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import HeroOfferBanner from "./HeroOfferBanner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const HeroOfferCarousel = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveOffers = async () => {
      setLoading(true);
      setError(null);

      // Get the current date in ISO format for querying
      const today = new Date().toISOString();

      // This query fetches offers that are:
      // 1. Marked as active
      // 2. Have already started
      // 3. Have not yet expired (or have no expiration date)
      const { data, error: fetchError } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .lte("valid_from", today)
        .or(`valid_until.is.null,valid_until.gte.${today}`);

      if (fetchError) {
        // Log the detailed error to the browser console for debugging
        console.error("Supabase fetch error:", fetchError);
        setError("Failed to fetch offers from the database.");
      } else if (!data) {
        console.warn("No active offers found or data is null.");
        setOffers([]);
      } else {
        setOffers(data);
      }

      setLoading(false);
    };

    fetchActiveOffers();
  }, []);

  // Display a loading skeleton for better UX
  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
        <p className="text-medium-text">Loading special offers...</p>
      </div>
    );
  }

  // Display an error message if the fetch fails
  if (error) {
    return (
      <div className="w-full h-[400px] bg-red-100 rounded-2xl flex items-center justify-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // If there are no valid active offers to display, don't render the component
  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={offers.length > 1} // Only loop if there's more than one slide
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="rounded-2xl shadow-lg"
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
