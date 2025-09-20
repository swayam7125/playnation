import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaClock, FaStar } from "react-icons/fa";
import StarRating from "../components/reviews/StarRating";
import OfferCard from "../components/offers/OfferCard"; // <-- IMPORT OFFER CARD

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
  const [offers, setOffers] = useState([]); // <-- NEW STATE FOR OFFERS
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  useEffect(() => {
    const fetchVenueData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch venue details
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

        // Fetch reviews for the venue
        const { data: reviewData, error: reviewError } = await supabase
          .from("reviews")
          .select(`*, users (username, first_name, last_name)`)
          .eq("venue_id", venueId)
          .order("created_at", { ascending: false });
        if (reviewError) throw reviewError;
        setReviews(reviewData || []);

        // Fetch venue-specific offers
        const { data: offerData, error: offerError } = await supabase
          .from("offers")
          .select("*")
          .eq("venue_id", venueId) // Fetch offers for THIS venue
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

  const handleFacilityChange = (facility) => {
    setSelectedFacilityId(facility.facility_id);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleProceedToBook = () => {
    if (!selectedSlot || !selectedFacility) return;
    const finalPrice =
      selectedSlot.price_override ?? selectedFacility.hourly_rate;
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
  const displayPrice =
    selectedSlot?.price_override ?? selectedFacility?.hourly_rate;

  if (loading)
    return (
      <p className="container mx-auto text-center p-12">
        Loading venue details...
      </p>
    );
  if (error)
    return (
      <p className="container mx-auto text-center text-red-600 p-12">
        Error: {error}
      </p>
    );
  if (!venue)
    return (
      <p className="container mx-auto text-center p-12">Venue not found.</p>
    );

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-card-bg p-8 rounded-2xl shadow-lg border border-border-color-light">
          <div className="venue-header mb-8">
            <h1 className="text-4xl font-bold text-dark-text mb-2">
              {venue.name}
            </h1>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={averageRating} />
                <span className="font-bold text-dark-text">
                  {averageRating}
                </span>
                <span className="text-medium-text">
                  ({reviews.length} reviews)
                </span>
              </div>
            )}
            <p className="text-lg text-medium-text">
              {venue.address}, {venue.city}, {venue.state}
            </p>
            <p className="text-light-text mt-4 max-w-3xl">
              {venue.description}
            </p>
          </div>

          {/* OFFERS SECTION */}
          {offers.length > 0 && (
            <div className="offers-section mb-8">
              <h2 className="text-2xl font-semibold text-dark-text mb-4">
                Special Offers
              </h2>
              <div className="space-y-4">
                {offers.map((offer) => (
                  <OfferCard key={offer.offer_id} offer={offer} />
                ))}
              </div>
            </div>
          )}

          <div className="facility-tabs flex flex-wrap gap-4 mb-8 border-y border-border-color py-6">
            {venue.facilities.map((facility) => (
              <button
                key={facility.facility_id}
                onClick={() => handleFacilityChange(facility)}
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
            <h2 className="text-2xl font-semibold text-dark-text mb-4">
              Available Time Slots
            </h2>
            <div className="max-w-xs mb-6">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getTodayString()}
                className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredTimeSlots.length > 0 ? (
                filteredTimeSlots.map((slot) => (
                  <button
                    key={slot.slot_id}
                    onClick={() => handleSlotSelect(slot)}
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
                <p className="col-span-full text-medium-text">
                  No available slots for the selected date.
                </p>
              )}
            </div>
          </div>

          <div className="reviews-section border-t border-border-color pt-8">
            <h2 className="text-2xl font-semibold text-dark-text mb-6">
              What Players Are Saying
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.review_id}
                    className="border-b border-border-color-light pb-6"
                  >
                    <div className="flex items-center mb-2">
                      <StarRating rating={review.rating} />
                      <span className="ml-4 font-bold text-dark-text">
                        {review.users?.first_name || review.users?.username}
                      </span>
                    </div>
                    <p className="text-medium-text">{review.comment}</p>
                    <p className="text-xs text-light-text mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-medium-text">
                Be the first to leave a review for this venue!
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="sticky bottom-0 bg-card-bg p-6 border-t border-border-color shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-medium-text">Selected Slot:</p>
              <p className="font-bold text-dark-text">
                {formatTime(selectedSlot.start_time)} -{" "}
                {formatTime(selectedSlot.end_time)}
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
    </div>
  );
}

export default VenuePage;
