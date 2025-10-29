// src/pages/VenuePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaClock, FaStar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa"; // Added FaMapMarkerAlt, FaExternalLinkAlt
import StarRating from "../components/reviews/StarRating";
import OfferCard from "../components/offers/OfferCard";
// Removed: import VenueLocationMap from "../components/maps/VenueLocationMap"; // Removed Map component import
import DOMPurify from "dompurify"; // Import DOMPurify

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useAuth } from "../AuthContext";
import { useModal } from "../ModalContext";
// -----------------------

const placeholderImage =
  "https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=800";

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date) => {
  const offset = date.getTimezoneOffset();
  const dateWithOffset = new Date(date.getTime() - offset * 60 * 1000);
  return dateWithOffset.toISOString().split("T")[0];
};

const getTodayString = () => getDateString(new Date());


// Helper function to format time (e.g., 9:30 AM)
const formatTime = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid Time"; // Handle invalid date strings
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
  const [offers, setOffers] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [visibleReviews, setVisibleReviews] = useState(5);

  // --- NEW STATE for dynamic slot loading ---
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false); // Default to false initially
  // ------------------------------------------

  useEffect(() => {
    const fetchVenueData = async () => {
      setLoading(true);
      setError(null);
      setVenue(null); // Reset venue on new fetch
      setReviews([]);
      setOffers([]);
      setSelectedFacilityId(null);
      setSlots([]); // Reset slots
      try {
        // --- Fetch venue data including coordinates ---
        const { data: venueData, error: venueError } = await supabase
          .from("venues")
          .select(
            `*, facilities (*, sports (name), facility_amenities (*, amenities (name)))`
          )
          .eq("venue_id", venueId)
          .maybeSingle(); // Use maybeSingle to handle null return without error

        if (venueError) throw venueError;
        // Check if venue exists and is approved (or if owner is viewing)
        // Adjust this logic based on your RLS policies if needed
        if (!venueData || (!venueData.is_approved && venueData.owner_id !== user?.id)) {
            throw new Error("Venue not found or may not be approved yet.");
        }


        setVenue(venueData);
        // Set initial selected facility ONLY if facilities exist
        if (venueData.facilities && venueData.facilities.length > 0) {
          setSelectedFacilityId(venueData.facilities[0].facility_id);
        } else {
            setSelectedFacilityId(null); // Explicitly set to null if no facilities
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
          // Fetch both global offers AND venue-specific offers that are active
          .or(`and(venue_id.eq.${venueId},is_active.eq.true),and(is_global.eq.true,is_active.eq.true)`)
          // Filter out expired offers (where valid_until is in the past)
          .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
          .order("created_at", { ascending: false });

        if (offerError) throw offerError;
        setOffers(offerData || []);

      } catch (err) {
        console.error("Error fetching venue data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

     // Only fetch if venueId is present
    if (venueId) {
        fetchVenueData();
    } else {
        setError("No Venue ID provided.");
        setLoading(false);
    }
  }, [venueId, user?.id]); // Re-fetch if venueId or user changes

  // --- useEffect to fetch slots dynamically ---
  useEffect(() => {
    // Don't fetch if we don't have a facility or date selected
    if (!selectedFacilityId || !selectedDate) {
      setSlots([]);
      setSlotsLoading(false); // Ensure loading is set to false
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlots([]); // Clear previous slots
      setSelectedSlot(null); // Clear selected slot

      try {
         // --- RPC Call ---
         const { data: slotData, error: slotError } = await supabase
             .rpc('get_slots_for_facility', {
                 p_facility_id: selectedFacilityId,
                 p_date: selectedDate
             });


        if (slotError) throw slotError;

        const now = new Date(); // Get current time

        // Filter out past slots and then sort
        const futureSlots = (slotData || [])
          .filter(slot => new Date(slot.start_time) > now) // <<< ONLY KEEP FUTURE SLOTS
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        setSlots(futureSlots); // Set the filtered and sorted slots

      } catch (err) {
        console.error("Error fetching time slots:", err.message);
        // Optionally set a slot-specific error state if needed
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedFacilityId, selectedDate]); // Re-run when facility or date changes
  // ------------------------------------------------

  // --- Memoized calculations ---
  const selectedFacility = useMemo(() => {
      return venue?.facilities?.find((f) => f.facility_id === selectedFacilityId);
  }, [venue?.facilities, selectedFacilityId]);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
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
               .filter(Boolean) // Filter out null/undefined names
        )
    ], [venue?.facilities]);

   const displayPrice = selectedSlot?.price ?? selectedFacility?.hourly_rate; // Use slot.price from RPC

  // --- Helper/Handler functions ---
  const getImageUrl = (url) => {
       if (!url || typeof url !== 'string') return placeholderImage;
       try {
           // Basic check if it looks like a Supabase storage URL
           if (url.includes('supabase.co/storage/v1/object/public/')) {
               // Append transform params if not already present
               const urlObj = new URL(url);
               if (!urlObj.searchParams.has('width')) {
                   urlObj.searchParams.set('width', '800');
                   urlObj.searchParams.set('height', '400');
                   urlObj.searchParams.set('resize', 'cover');
                   return urlObj.toString();
               }
           }
           return url; // Return original URL if not Supabase or params exist
       } catch (e) {
           console.error("Error processing image URL:", url, e);
           return placeholderImage; // Fallback on error
       }
   };

  // Function to generate the Google Maps link - CORRECTED
  const getMapLink = () => {
    // Priority 1: Use the specific Google Maps Share URL if provided and valid
    if (venue?.google_maps_url) {
      try {
        new URL(venue.google_maps_url); // Validate URL format
        // Ensure it's a Google Maps link (basic check)
        if (venue.google_maps_url.includes("google.com/maps") || venue.google_maps_url.includes("goo.gl/maps")) {
          return venue.google_maps_url;
        }
      } catch (_) {
        console.warn("Invalid google_maps_url stored:", venue.google_maps_url);
      }
    }
    // Priority 2: Use latitude and longitude if available
    if (venue?.latitude && venue?.longitude) {
       const lat = parseFloat(venue.latitude);
       const lng = parseFloat(venue.longitude);
       if (!isNaN(lat) && !isNaN(lng)) {
          // **FIXED:** Correct string interpolation using backticks (`)
          return `https://www.google.com/maps?q=${lat},${lng}`;
       }
    }
     // Priority 3: Fallback to searching by name and address (less precise)
    if (venue?.name && venue?.address && venue?.city) {
      const query = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}`);
       // **FIXED:** Correct string interpolation using backticks (`)
      return `https://www.google.com/maps?q=LATITUDE,LONGITUDE`
    }
    return null; // No usable map data available
  };


  const mapLink = getMapLink(); // Generate the link

  const handleFacilityChange = (facility) => {
    setSelectedFacilityId(facility.facility_id);
    setSelectedSlot(null); // Reset selected slot when facility changes
  };

  const handleSlotSelect = (slot) => {
    if (slot.is_available) {
        // Ensure the slot is still in the future right before selection
        if (new Date(slot.start_time) > new Date()) {
            setSelectedSlot(slot);
        } else {
             showModal({ title: "Slot Expired", message: "This time slot has just passed." });
             // Optionally refetch slots here if needed
             // fetchSlots(); // Assuming fetchSlots is accessible or defined within scope
         }

    } else {
        // Optionally show a message that the slot is booked
        showModal({ title: "Slot Unavailable", message: "This slot is already booked or unavailable." });
    }
  };

  const handleDateChange = (daysToAdd) => {
      const currentDate = new Date(selectedDate + 'T00:00:00'); // Use T00:00:00 to avoid timezone shifts affecting the date part
      currentDate.setDate(currentDate.getDate() + daysToAdd);
      const today = new Date(getTodayString() + 'T00:00:00');
      if (currentDate < today) return; // Prevent going before today
      setSelectedDate(getDateString(currentDate));
  };


  const handleProceedToBook = () => {
    if (!selectedSlot || !selectedFacility) return;

     // Double-check if the slot is still in the future before navigating
    if (new Date(selectedSlot.start_time) <= new Date()) {
        showModal({ title: "Slot Expired", message: "This time slot has just passed while you were deciding." });
        // Optionally refetch slots
        // fetchSlots();
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
              from: location.pathname, // Pass current path
               search: location.search // Pass current query params if any
            },
          });
        },
      });
      return;
    }

     // Use the price from the fetched slot data (which considers override)
    const finalPrice = selectedSlot.price;


    navigate(
      `/booking/${selectedFacility.facility_id}?slot_id=${selectedSlot.slot_id}`,
      {
        state: {
          venue,
          facility: selectedFacility,
          slot: selectedSlot,
          price: finalPrice,
          selectedDate: selectedDate, // Pass the selected date
        },
      }
    );
  };

  // --- Render logic ---
  if (loading)
    return (
       <div className="min-h-screen flex items-center justify-center">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-green"></div>
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto text-center text-red-600 p-12">
        <p className="text-xl font-semibold">Could not load venue details.</p>
        <p>{error}</p>
         <button onClick={() => navigate('/explore')} className="mt-4 bg-primary-green text-white px-4 py-2 rounded-lg">Back to Explore</button>
      </div>
    );
  if (!venue) // Should be handled by error state now, but kept as safeguard
    return (
      <p className="container mx-auto text-center p-12">Venue not found.</p>
    );

  const isPrevDayDisabled = selectedDate <= getTodayString();

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light overflow-hidden">
          {/* --- Image Carousel --- */}
          <div className="relative w-full h-80 md:h-96 overflow-hidden">
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
                className="w-full h-full venue-image-swiper"
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
                <button className="venue-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200" aria-label="Previous image"><FaChevronLeft /></button>
                <button className="venue-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200" aria-label="Next image"><FaChevronRight /></button>
                <div className="venue-swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2"></div>
              </Swiper>
            ) : (
              <img src={getImageUrl(venueImages[0])} alt={venue.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholderImage; }}/>
            )}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{venue.name}</h1>
                 {reviews.length > 0 && (
                     <div className="flex items-center gap-2">
                         <StarRating rating={Number(averageRating)} />
                         <span className="font-bold text-white">{averageRating}</span>
                         <span className="text-white/80">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                     </div>
                 )}
             </div>
          </div>

          <div className="p-6 md:p-8">
            {/* --- Venue Address & Map Link --- */}
            <div className="venue-header mb-8">
                <p className="text-lg text-medium-text mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-primary-green" />
                    {venue.address}, {venue.city}, {venue.state} {venue.zip_code}
                </p>
                {/* Google Maps Hyperlink - Uses corrected mapLink */}
                {mapLink && (
                   <a
                     href={mapLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm"
                   >
                     View on Google Maps
                     <FaExternalLinkAlt size="0.8em" className="opacity-70"/>
                   </a>
                )}
               {venue.description && (
                   <div className="mt-4 prose prose-sm max-w-none text-light-text">
                        <p>{venue.description}</p>
                   </div>
              )}
              {/* Amenities */}
              {uniqueAmenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-dark-text mb-3">
                    Amenities Available
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueAmenities.map((amenity) => (
                      <span key={amenity} className="bg-light-green-bg text-emerald-800 py-1 px-3 rounded-full text-sm font-medium border border-emerald-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

             {/* --- Offers Section --- */}
             {offers.length > 0 && (
                <div className="offers-section mb-8 border-t border-border-color-light pt-8">
                  <h2 className="text-2xl font-semibold text-dark-text mb-4">Special Offers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.map((offer) => <OfferCard key={offer.offer_id} offer={offer} />)}
                  </div>
                </div>
              )}

             {/* --- Facility Selection --- */}
             <div className="facility-tabs-section border-t border-border-color-light pt-8 mb-8">
                <h2 className="text-2xl font-semibold text-dark-text mb-4">Select Facility</h2>
                 {venue.facilities?.length > 0 ? (
                     <div className="flex flex-wrap gap-3">
                         {venue.facilities.map((facility) => (
                             <button
                                 key={facility.facility_id}
                                 onClick={() => handleFacilityChange(facility)}
                                 className={`px-4 py-2 font-semibold text-sm rounded-full transition duration-300 border-2 ${
                                     selectedFacilityId === facility.facility_id
                                         ? "bg-primary-green text-white border-primary-green-dark shadow-md"
                                         : "bg-hover-bg text-medium-text border-transparent hover:border-primary-green/50 hover:text-primary-green"
                                 }`}
                               >
                                {facility.name} ({facility.sports?.name || 'Unknown Sport'})
                             </button>
                         ))}
                     </div>
                 ) : (
                     <p className="text-medium-text">No facilities available for this venue.</p>
                 )}
            </div>


            {/* --- Time Slots Section --- */}
             {selectedFacilityId && (
                <div className="time-slots-section border-t border-border-color-light pt-8 mb-8">
                  <h2 className="text-2xl font-semibold text-dark-text mb-4">
                      Available Time Slots for <span className="text-primary-green">{selectedFacility?.name}</span>
                  </h2>
                   {/* -- Date Picker with Navigation -- */}
                  <div className="mb-6 flex items-center gap-2 max-w-xs">
                      <label htmlFor="date-select" className="text-sm font-medium text-medium-text mr-2 shrink-0">Select Date:</label>
                      <button
                          onClick={() => handleDateChange(-1)}
                          disabled={isPrevDayDisabled}
                          className={`p-2 h-10 flex items-center justify-center rounded-md ${isPrevDayDisabled ? 'text-slate-400 cursor-not-allowed bg-slate-100' : 'text-primary-green bg-emerald-100 hover:bg-emerald-200'}`}
                          aria-label="Previous Day"
                      >
                          <FaChevronLeft size="0.8em"/>
                      </button>
                      <input
                          id="date-select"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={getTodayString()}
                          className="w-auto px-3 py-2 h-10 bg-hover-bg border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                          style={{ minWidth: '130px' }}
                      />
                      <button
                          onClick={() => handleDateChange(1)}
                          className="p-2 h-10 flex items-center justify-center rounded-md text-primary-green bg-emerald-100 hover:bg-emerald-200"
                          aria-label="Next Day"
                      >
                           <FaChevronRight size="0.8em"/>
                      </button>
                  </div>
                  {/* -- End Date Picker -- */}

                  {/* Slot Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {slotsLoading ? (
                      <div className="col-span-full text-center py-4"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-green"></div><p className="text-medium-text text-sm mt-2">Loading slots...</p></div>
                    ) : slots.length > 0 ? (
                      slots.map((slot) => ( // 'slots' state now only contains future slots
                        <button
                          key={slot.slot_id}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!slot.is_available}
                          className={`p-3 text-center font-semibold rounded-lg transition-all duration-200 border-2 text-sm ${!slot.is_available ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : selectedSlot?.slot_id === slot.slot_id ? "bg-primary-green text-white border-primary-green-dark ring-2 ring-offset-1 ring-primary-green" : "bg-card-bg text-primary-green border-primary-green/30 hover:border-primary-green hover:bg-emerald-50"}`}
                        >
                          {formatTime(slot.start_time)}
                          <span className="block text-xs mt-1 opacity-80">₹{slot.price ?? selectedFacility?.hourly_rate}</span>
                        </button>
                      ))
                    ) : (
                      <p className="col-span-full text-medium-text py-4 text-center">No available future slots for {selectedFacility?.name} on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}.</p>
                    )}
                  </div>
                </div>
             )}

            {/* --- Reviews Section --- */}
            <div className="reviews-section border-t border-border-color-light pt-8">
              <h2 className="text-2xl font-semibold text-dark-text mb-6">What Players Are Saying</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {reviews.slice(0, visibleReviews).map((review) => (
                      <div key={review.review_id} className="border-b border-border-color-light pb-6 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <StarRating rating={review.rating || 0} />
                          <span className="ml-4 font-bold text-dark-text">{review.users?.first_name || review.users?.username || 'Anonymous'}</span>
                        </div>
                        {review.comment && ( <div className="prose prose-sm max-w-none text-medium-text" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.comment) }}/> )}
                        <p className="text-xs text-light-text mt-2">Reviewed on: {new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                  {reviews.length > visibleReviews && ( <div className="text-center mt-6"><button onClick={() => setVisibleReviews((prev) => prev + 5)} className="py-2 px-6 rounded-lg font-semibold bg-primary-green text-white hover:bg-primary-green-dark transition-all">Load More Reviews</button></div> )}
                </>
              ) : ( <p className="text-medium-text text-center py-4">Be the first to leave a review for this venue!</p> )}
            </div>
          </div>
        </div>
      </div>

       {/* --- Booking Footer --- */}
       {selectedSlot && selectedFacility && (
        <div className="sticky bottom-0 bg-card-bg p-4 md:p-6 border-t border-border-color shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-medium-text">Selected:</p>
              <p className="font-bold text-dark-text text-lg">
                {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                 <span className="text-medium-text font-normal text-sm"> on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </p>
               <p className="text-sm text-medium-text">Facility: {selectedFacility.name}</p>
            </div>
            <button onClick={handleProceedToBook} className="w-full sm:w-auto py-3 px-8 rounded-lg font-semibold text-lg bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px transition-all">
              Book Now (₹{displayPrice})
            </button>
          </div>
        </div>
      )}

      {/* --- Swiper styles --- */}
      <style>{`
        .venue-image-swiper .swiper-pagination { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; justify-content: center; }
        .venue-image-swiper .swiper-pagination-bullet { width: 8px; height: 8px; background: white; opacity: 0.6; border-radius: 50%; margin: 0 4px; transition: opacity 0.3s, background-color 0.3s; }
        .venue-image-swiper .swiper-pagination-bullet-active { opacity: 1; background: #10b981; width: 10px; height: 10px; }
      `}</style>
    </div>
  );
}

export default VenuePage;