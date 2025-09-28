import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaClock, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StarRating from "../components/reviews/StarRating";
import OfferCard from "../components/offers/OfferCard";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=800';

const getTodayString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayWithOffset = new Date(today.getTime() - offset * 60 * 1000);
  return todayWithOffset.toISOString().split("T")[0];
};

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

function VenuePage() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [visibleReviews, setVisibleReviews] = useState(5);

  useEffect(() => {
    const fetchVenueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: venueData, error: venueError } = await supabase
          .from("venues")
          .select(
            `*, facilities (*, sports (name), time_slots (*), facility_amenities (*, amenities (name)))`
          )
          .eq("venue_id", venueId)
          .single();
        if (venueError) throw venueError;
        setVenue(venueData);
        if (venueData.facilities && venueData.facilities.length > 0) {
          setSelectedFacilityId(venueData.facilities[0].facility_id);
        }

        const { data: reviewData, error: reviewError } = await supabase
          .from("reviews")
          .select(`*, users (username, first_name, last_name)`)
          .eq("venue_id", venueId)
          .order("created_at", { ascending: false });
        if (reviewError) throw reviewError;
        setReviews(reviewData || []);

        const { data: offerData, error: offerError } = await supabase
          .from("offers")
          .select("*")
          .eq("venue_id", venueId)
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (offerError) throw offerError;
        setOffers(offerData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [venueId]);

  const selectedFacility = venue?.facilities.find(
    (f) => f.facility_id === selectedFacilityId
  );

  const filteredTimeSlots = useMemo(() => {
    if (!selectedFacility) return [];
    return selectedFacility.time_slots
      .filter((slot) => {
        const slotDate = new Date(slot.start_time).toISOString().split("T")[0];
        const isFutureSlot = new Date(slot.start_time) > new Date();
        return slot.is_available && slotDate === selectedDate && isFutureSlot;
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [selectedFacility, selectedDate]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const venueImages = useMemo(() => {
    if (!venue?.image_url) return [placeholderImage];
    if (Array.isArray(venue.image_url) && venue.image_url.length > 0) {
      return venue.image_url;
    }
    if (typeof venue.image_url === 'string') {
      return [venue.image_url];
    }
    return [placeholderImage];
  }, [venue]);
  
  const getImageUrl = (url) => {
    if (!url) return placeholderImage;
    return url.includes('supabase.co') 
      ? `${url}?width=800&height=400&resize=cover`
      : url;
  };
  
  const handleFacilityChange = (facility) => {
    setSelectedFacilityId(facility.facility_id);
    setSelectedSlot(null);
  };
  
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };
  
  const handleProceedToBook = () => {
    if (!selectedSlot || !selectedFacility) return;
    const finalPrice = selectedSlot.price_override ?? selectedFacility.hourly_rate;
    navigate("/booking", {
      state: {
        venue,
        facility: selectedFacility,
        slot: selectedSlot,
        price: finalPrice,
      },
    });
  };

  const uniqueAmenities = [
    ...new Set(
      venue?.facilities
        .flatMap(
          (f) => f.facility_amenities?.map((fa) => fa.amenities?.name) ?? []
        )
        .filter(Boolean)
    ),
  ];
  
  const displayPrice = selectedSlot?.price_override ?? selectedFacility?.hourly_rate;

  if (loading) return <p className="container mx-auto text-center p-12">Loading venue details...</p>;
  if (error) return <p className="container mx-auto text-center text-red-600 p-12">Error: {error}</p>;
  if (!venue) return <p className="container mx-auto text-center p-12">Venue not found.</p>;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light overflow-hidden">
          
          <div className="relative w-full h-80 md:h-96 overflow-hidden">
            {venueImages.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{ prevEl: '.venue-swiper-button-prev', nextEl: '.venue-swiper-button-next' }}
                pagination={{ clickable: true, el: '.venue-swiper-pagination' }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full venue-image-swiper"
              >
                {venueImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={getImageUrl(image)} alt={`${venue.name} - Image ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholderImage; }} />
                  </SwiperSlide>
                ))}
                
                <button className="venue-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"><FaChevronLeft /></button>
                <button className="venue-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"><FaChevronRight /></button>
                <div className="venue-swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10"></div>
              </Swiper>
            ) : (
              <img src={getImageUrl(venueImages[0])} alt={venue.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholderImage; }}/>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h1 className="text-4xl font-bold text-white mb-2">{venue.name}</h1>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} />
                  <span className="font-bold text-white">{averageRating}</span>
                  <span className="text-white/80">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="venue-header mb-8">
              <p className="text-lg text-medium-text mb-4">{venue.address}, {venue.city}, {venue.state}</p>
              <p className="text-light-text max-w-3xl">{venue.description}</p>
              
              {uniqueAmenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-dark-text mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueAmenities.map(amenity => (
                      <span key={amenity} className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-sm font-medium border border-emerald-200">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {offers.length > 0 && (
              <div className="offers-section mb-8">
                <h2 className="text-2xl font-semibold text-dark-text mb-4">Special Offers</h2>
                <div className="space-y-4">
                  {offers.map((offer) => <OfferCard key={offer.offer_id} offer={offer} />)}
                </div>
              </div>
            )}

            <div className="facility-tabs flex flex-wrap gap-4 mb-8 border-y border-border-color py-6">
              {venue.facilities.map((facility) => (
                <button key={facility.facility_id} onClick={() => handleFacilityChange(facility)}
                  className={`px-5 py-2.5 font-semibold text-sm rounded-full transition duration-300 ${
                    selectedFacilityId === facility.facility_id
                      ? "bg-primary-green text-white shadow-md"
                      : "bg-hover-bg text-medium-text hover:bg-border-color-light"
                  }`}
                >
                  {facility.name} ({facility.sports.name})
                </button>
              ))}
            </div>

            <div className="time-slots-section mb-8">
              <h2 className="text-2xl font-semibold text-dark-text mb-4">Available Time Slots</h2>
              <div className="max-w-xs mb-6">
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getTodayString()}
                  className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTimeSlots.length > 0 ? (
                  filteredTimeSlots.map((slot) => (
                    <button key={slot.slot_id} onClick={() => handleSlotSelect(slot)}
                      className={`p-4 font-semibold rounded-lg transition-all duration-200 border-2 ${
                        selectedSlot?.slot_id === slot.slot_id
                          ? "bg-primary-green text-white border-primary-green-dark"
                          : "bg-card-bg text-primary-green border-primary-green/50 hover:border-primary-green"
                      }`}
                    >
                      <FaClock className="mx-auto mb-1" />
                      {formatTime(slot.start_time)}
                    </button>
                  ))
                ) : (
                  <p className="col-span-full text-medium-text">No available slots for the selected date.</p>
                )}
              </div>
            </div>

            <div className="reviews-section border-t border-border-color pt-8">
              <h2 className="text-2xl font-semibold text-dark-text mb-6">What Players Are Saying</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {reviews.slice(0, visibleReviews).map((review) => (
                      <div key={review.review_id} className="border-b border-border-color-light pb-6">
                        <div className="flex items-center mb-2">
                          <StarRating rating={review.rating} />
                          <span className="ml-4 font-bold text-dark-text">{review.users?.first_name || review.users?.username}</span>
                        </div>
                        <p className="text-medium-text">{review.comment}</p>
                        <p className="text-xs text-light-text mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                  {reviews.length > visibleReviews && (
                    <div className="text-center mt-6">
                      <button onClick={() => setVisibleReviews(prev => prev + 5)}
                        className="py-2 px-6 rounded-lg font-semibold bg-primary-green text-white hover:bg-primary-green-dark transition-all"
                      >
                        Load More Reviews
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-medium-text">Be the first to leave a review for this venue!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="sticky bottom-0 bg-card-bg p-6 border-t border-border-color shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-medium-text">Selected Slot:</p>
              <p className="font-bold text-dark-text">
                {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
              </p>
            </div>
            <button
              onClick={handleProceedToBook}
              className="py-3 px-8 rounded-lg font-semibold text-lg bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px transition-all"
            >
              Book Now (₹{displayPrice})
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .venue-image-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }
        .venue-image-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #10b981;
        }
      `}</style>
    </div>
  );
}

export default VenuePage;