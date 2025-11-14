import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { 
  FaClock, 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight, 
  FaMapMarkerAlt, 
  FaExternalLinkAlt,
  FaShieldAlt
} from "react-icons/fa";
import StarRating from "../components/reviews/StarRating";
// REMOVED: import OfferCard from "../components/offers/OfferCard";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useAuth } from "../AuthContext";
import { useModal } from "../ModalContext";
import VenueSkeleton from "../components/skeletons/VenueSkeleton";
import SlotSkeleton from "../components/skeletons/SlotSkeleton";

const placeholderImage =
  "https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=800";

const getDateString = (date) => {
  const offset = date.getTimezoneOffset();
  const dateWithOffset = new Date(date.getTime() - offset * 60 * 1000);
  return dateWithOffset.toISOString().split("T")[0];
};

const getTodayString = () => getDateString(new Date());

const formatTime = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid Time";
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } catch (error) {
        console.error("Error formatting time:", dateString, error);
        return "Invalid Time";
    }
};

function VenuePage() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const { user } = useAuth();
  const { showModal } = useModal();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  // REMOVED: const [offers, setOffers] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [visibleReviews, setVisibleReviews] = useState(5);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchVenueData = async () => {
      setLoading(true);
      setError(null);
      setVenue(null);
      setReviews([]);
      // REMOVED: setOffers([]);
      setSelectedFacilityId(null);
      setSlots([]);
      try {
        const { data: venueData, error: venueError } = await supabase
          .from("venues")
          .select(
            `*, facilities (*, sports (name), facility_amenities (*, amenities (name)))`
          )
          .eq("venue_id", venueId)
          .maybeSingle(); 

        if (venueError) throw venueError;
        if (!venueData || (!venueData.is_approved && venueData.owner_id !== user?.id)) {
            throw new Error("Venue not found or may not be approved yet.");
        }

        setVenue(venueData);
        if (venueData.facilities && venueData.facilities.length > 0) {
          setSelectedFacilityId(venueData.facilities[0].facility_id);
        } else {
            setSelectedFacilityId(null);
        }

        const { data: reviewData, error: reviewError } = await supabase
          .from("reviews")
          .select(`*, users (username, first_name, last_name)`)
          .eq("venue_id", venueId)
          .order("created_at", { ascending: false });
        if (reviewError) throw reviewError;
        setReviews(reviewData || []);

        // REMOVED: Offer fetching logic
        /*
        const { data: offerData, error: offerError } = await supabase
          .from("offers")
          .select("*")
          .or(`and(venue_id.eq.${venueId},is_active.eq.true),and(is_global.eq.true,is_active.eq.true)`)
          .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
          .order("created_at", { ascending: false });

        if (offerError) throw offerError;
        setOffers(offerData || []);
        */

      } catch (err) {
        console.error("Error fetching venue data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
        fetchVenueData();
    } else {
        setError("No Venue ID provided.");
        setLoading(false);
    }
  }, [venueId, user?.id]);

  useEffect(() => {
    if (!selectedFacilityId || !selectedDate) {
      setSlots([]);
      setSlotsLoading(false);
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlots([]);
      setSelectedSlot(null);

      try {
         const { data: slotData, error: slotError } = await supabase
             .rpc('get_slots_for_facility', {
                 p_facility_id: selectedFacilityId,
                 p_date: selectedDate
             });

        if (slotError) throw slotError;

        const now = new Date(); 
        const futureSlots = (slotData || [])
          .filter(slot => new Date(slot.start_time) > now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        setSlots(futureSlots);

      } catch (err) {
        console.error("Error fetching time slots:", err.message);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedFacilityId, selectedDate]);

  const selectedFacility = useMemo(() => {
      return venue?.facilities?.find((f) => f.facility_id === selectedFacilityId);
  }, [venue?.facilities, selectedFacilityId]);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length);
  }, [reviews]);

  const venueImages = useMemo(() => {
    if (!venue?.image_url) return [placeholderImage];
    if (Array.isArray(venue.image_url) && venue.image_url.length > 0) return venue.image_url;
    if (typeof venue.image_url === "string") return [venue.image_url];
    return [placeholderImage];
  }, [venue?.image_url]);

  const uniqueAmenities = useMemo(() => [
       ...new Set(
           venue?.facilities
               ?.flatMap(f => f.facility_amenities?.map(fa => fa.amenities?.name) ?? [])
               .filter(Boolean)
        )
    ], [venue?.facilities]);

   const displayPrice = selectedSlot?.price ?? selectedFacility?.hourly_rate;

  const getImageUrl = (url) => {
       if (!url || typeof url !== 'string') return placeholderImage;
       try {
           if (url.includes('supabase.co/storage/v1/object/public/')) {
               const urlObj = new URL(url);
               if (!urlObj.searchParams.has('width')) {
                   urlObj.searchParams.set('width', '800');
                   urlObj.searchParams.set('height', '400');
                   urlObj.searchParams.set('resize', 'cover');
                   return urlObj.toString();
               }
           }
           return url;
       } catch (e) {
           console.error("Error processing image URL:", url, e);
           return placeholderImage;
       }
   };

  const getMapLink = () => {
    if (venue?.google_maps_url) {
      try {
        new URL(venue.google_maps_url);
        if (venue.google_maps_url.includes("google.com/maps") || venue.google_maps_url.includes("goo.gl/maps")) {
          return venue.google_maps_url;
        }
      } catch (_) {
        console.warn("Invalid google_maps_url stored:", venue.google_maps_url);
      }
    }
    if (venue?.latitude && venue?.longitude) {
       const lat = parseFloat(venue.latitude);
       const lng = parseFloat(venue.longitude);
       if (!isNaN(lat) && !isNaN(lng)) {
          return `https://www.google.com/maps?q=$${lat},${lng}`;
       }
    }
    if (venue?.name && venue?.address && venue?.city) {
      const query = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}`);
      return `https://www.google.com/maps?q=LATITUDE,LONGITUDE`
    }
    return null;
  };

  const mapLink = getMapLink();

  const handleFacilityChange = (facility) => {
    setSelectedFacilityId(facility.facility_id);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    if (slot.is_available) {
        if (new Date(slot.start_time) > new Date()) {
            setSelectedSlot(slot);
        } else {
             showModal({ title: "Slot Expired", message: "This time slot has just passed." });
         }
    } else {
        showModal({ title: "Slot Unavailable", message: "This slot is already booked or unavailable." });
    }
  };

  const handleDateChange = (daysToAdd) => {
      const currentDate = new Date(selectedDate + 'T00:00:00');
      currentDate.setDate(currentDate.getDate() + daysToAdd);
      const today = new Date(getTodayString() + 'T00:00:00');
      if (currentDate < today) return;
      setSelectedDate(getDateString(currentDate));
  };

  const handleProceedToBook = () => {
    if (!selectedSlot || !selectedFacility) return;

    if (new Date(selectedSlot.start_time) <= new Date()) {
        showModal({ title: "Slot Expired", message: "This time slot has just passed while you were deciding." });
        return;
    }

    if (!user) {
      showModal({
        title: "Login Required",
        message: "Please log in or sign up to proceed with your booking.",
        confirmText: "Login / Sign Up",
        onConfirm: () => {
          navigate("/login", {
            state: {
              from: location.pathname, 
               search: location.search
            },
          });
        },
      });
      return;
    }

    const finalPrice = selectedSlot.price;

    navigate(
      `/booking/${selectedFacility.facility_id}?slot_id=${selectedSlot.slot_id}`,
      {
        state: {
          venue,
          facility: selectedFacility,
          slot: selectedSlot,
          price: finalPrice,
          selectedDate: selectedDate,
        },
      }
    );
  };

  if (loading) return <VenueSkeleton />;
  
  if (error)
    return (
      <div className="container mx-auto text-center text-red-600 p-12">
        <p className="text-xl font-semibold">Could not load venue details.</p>
        <p>{error}</p>
         <button onClick={() => navigate('/explore')} className="mt-4 bg-primary-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-green-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Back to Explore</button>
      </div>
    );
  if (!venue)
    return (
      <p className="container mx-auto text-center p-12">Venue not found.</p>
    );

  const isPrevDayDisabled = selectedDate <= getTodayString();

  return (
    <motion.div 
      className="bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative w-full h-96 overflow-hidden group">
             {venueImages.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  prevEl: ".venue-swiper-button-prev",
                  nextEl: ".venue-swiper-button-next",
                }}
                pagination={{ clickable: true, el: ".venue-swiper-pagination" }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
              >
                {venueImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={getImageUrl(image)}
                      alt={`${venue.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = placeholderImage; }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img src={getImageUrl(venueImages[0])} alt={venue.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholderImage; }}/>
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <button className="venue-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100" aria-label="Previous image"><FaChevronLeft /></button>
             <button className="venue-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100" aria-label="Next image"><FaChevronRight /></button>
             <div className="venue-swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2"></div>
          </div>

          <div className="p-8">
            <div className="mb-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">{venue.name}</h1>
                
                <p className="text-lg text-gray-600 mb-3 flex items-center">
                    <FaMapMarkerAlt className="inline mr-3 text-primary-green" />
                    {venue.address}, {venue.city}, {venue.state} {venue.zip_code}
                </p>

                <div className="flex items-center gap-4 mb-4">
                     <StarRating rating={Number(averageRating)} />
                     <span className="font-bold text-gray-800 text-lg">{Number(averageRating).toFixed(1)}</span>
                     <span className="text-gray-600">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>

                <div className="flex items-center gap-3 mb-4 text-gray-600">
                  <FaShieldAlt className="inline mr-1 text-blue-500" />
                  <span>
                    Free cancellation up to 
                    <strong className="text-gray-800"> {venue.cancellation_cutoff_hours || 24} hours</strong> 
                    {' '}before your booking.
                  </span>
                </div>

                {mapLink && (
                   <a
                     href={mapLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 mt-2 px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-base"
                   >
                     View on Google Maps
                     <FaExternalLinkAlt size="0.9em" className="opacity-70"/>
                   </a>
                )}
               {venue.description && (
                   <div className="mt-6 prose max-w-none text-gray-700">
                        <p>{venue.description}</p>
                   </div>
              )}
              {uniqueAmenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Amenities Available
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {uniqueAmenities.map((amenity) => (
                      <span key={amenity} className="bg-green-100 text-green-800 py-2 px-4 rounded-full text-base font-medium border border-green-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

             {/* REMOVED: Offer rendering block */}
             {/*
             {offers.length > 0 && (
                <div className="mb-8 border-t border-gray-200 pt-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Special Offers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offers.map((offer) => <OfferCard key={offer.offer_id} offer={offer} />)}
                  </div>
                </div>
              )}
             */}

             <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Facility</h2>
                 {venue.facilities?.length > 0 ? (
                     <div className="flex flex-wrap gap-4">
                         {venue.facilities.map((facility) => (
                             <button
                                 key={facility.facility_id}
                                 onClick={() => handleFacilityChange(facility)}
                                 className={`px-6 py-3 font-semibold text-base rounded-lg transition duration-300 border-2 ${selectedFacilityId === facility.facility_id ? "bg-primary-green text-white border-primary-green-dark shadow-lg" : "bg-white text-gray-700 border-gray-300 hover:border-primary-green hover:text-primary-green"}`}>
                                {facility.name} ({facility.sports?.name || 'Unknown Sport'})
                             </button>
                         ))}
                     </div>
                 ) : (
                     <p className="text-gray-600">No facilities available for this venue.</p>
                 )}
            </div>

             {selectedFacilityId && (
                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Available Time Slots for <span className="text-primary-green">{selectedFacility?.name}</span>
                  </h2>
                  <div className="mb-6 flex items-center gap-3">
                      <label htmlFor="date-select" className="text-base font-medium text-gray-700 mr-2">Select Date:</label>
                      <button onClick={() => handleDateChange(-1)} disabled={isPrevDayDisabled} className={`p-3 rounded-lg ${isPrevDayDisabled ? 'text-gray-400 cursor-not-allowed bg-gray-200' : 'text-primary-green bg-green-100 hover:bg-green-200'}`} aria-label="Previous Day"><FaChevronLeft /></button>
                      <input id="date-select" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getTodayString()} className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-green" />
                      <button onClick={() => handleDateChange(1)} className="p-3 rounded-lg text-primary-green bg-green-100 hover:bg-green-200" aria-label="Next Day"><FaChevronRight /></button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <AnimatePresence mode="wait">
                      {slotsLoading ? (
                        <motion.div
                          key="slots-loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="col-span-full"
                        >
                          <SlotSkeleton />
                        </motion.div>
                      ) : slots.length > 0 ? (
                        <motion.div
                          key="slots-loaded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                          {slots.map((slot) => (
                            <button
                              key={slot.slot_id}
                              onClick={() => handleSlotSelect(slot)}
                              disabled={!slot.is_available}
                              className={`p-4 text-center font-semibold rounded-lg transition-all duration-300 border-2 text-base ${!slot.is_available ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : selectedSlot?.slot_id === slot.slot_id ? "bg-primary-green text-white border-primary-green-dark ring-4 ring-offset-2 ring-primary-green" : "bg-white text-primary-green border-primary-green/50 hover:border-primary-green hover:bg-green-50"}`}>
                              {formatTime(slot.start_time)}
                              <span className="block text-sm mt-1 opacity-80">₹{slot.price ?? selectedFacility?.hourly_rate}</span>
                            </button>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.p
                          key="no-slots"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="col-span-full text-gray-600 py-6 text-center"
                        >
                          No available future slots for {selectedFacility?.name} on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
             )}

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">What Players Are Saying</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-8">
                    {reviews.slice(0, visibleReviews).map((review) => (
                      <div key={review.review_id} className="border-b border-gray-200 pb-8 last:border-b-0">
                        <div className="flex items-center mb-3">
                          <StarRating rating={review.rating || 0} />
                          <span className="ml-4 font-bold text-gray-800 text-lg">{review.users?.first_name || review.users?.username || 'Anonymous'}</span>
                        </div>
                        {review.comment && ( <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.comment) }}/> )}
                        <p className="text-sm text-gray-500 mt-3">Reviewed on: {new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                  {reviews.length > visibleReviews && ( <div className="text-center mt-8"><button onClick={() => setVisibleReviews((prev) => prev + 5)} className="py-3 px-8 rounded-lg font-semibold bg-primary-green text-white hover:bg-primary-green-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Load More Reviews</button></div> )}
                </>
              ) : ( <p className="text-gray-600 text-center py-6">Be the first to leave a review for this venue!</p> )}
            </div>
          </div>
        </div>
      </div>

       {selectedSlot && selectedFacility && (
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] z-20">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <p className="text-base text-gray-600">Selected Slot:</p>
              <p className="font-bold text-gray-800 text-xl">
                {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                 <span className="text-gray-600 font-normal text-base"> on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </p>
               <p className="text-base text-gray-600">Facility: {selectedFacility.name}</p>
            </div>
            <button onClick={handleProceedToBook} className="w-full sm:w-auto py-4 px-10 rounded-lg font-bold text-xl bg-primary-green text-white shadow-lg hover:bg-primary-green-dark hover:-translate-y-1 transition-all duration-300">
              Book Now (₹{displayPrice})
            </button>
          </div>
        </div>
      )}

      <style>{`
        .venue-swiper-pagination .swiper-pagination-bullet { background: white; opacity: 0.7; }
        .venue-swiper-pagination .swiper-pagination-bullet-active { background: #10b981; opacity: 1; }
      `}</style>
    </motion.div>
  );
}

export default VenuePage;