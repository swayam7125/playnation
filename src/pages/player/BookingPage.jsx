// src/pages/player/BookingPage.jsx
import React, { useState, useEffect, useCallback } from "react"; // No more 'useRef'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import toast from "react-hot-toast";
import { FiXCircle } from "react-icons/fi"; // Removed offer icons
import BookingOfferSection from "../../components/bookings/BookingOfferSection"; // --- NEW: Import component ---

// --- Helper Functions (Unchanged) ---
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

// --- Debounce Hook (REMOVED) ---

// --- Component ---
function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();
  const { facilityId } = useParams();
  const [searchParams] = useSearchParams();
  const slotId = searchParams.get("slot_id");

  const [bookingDetails, setBookingDetails] = useState(location.state || null);
  const [pageLoading, setPageLoading] = useState(!bookingDetails);
  const [pageError, setPageError] = useState(null);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  // --- MODIFIED: Simplified Offer State ---
  // This state is now controlled by the child component via the callback
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  // --- All other offer state has been REMOVED ---

  // --- Effect to Fetch Booking Data (Unchanged) ---
  useEffect(() => {
    // ... (existing data fetching logic remains the same) ...
     if (bookingDetails) {
      setPageLoading(false);
      return;
    }

    const fetchBookingData = async () => {
      if (!facilityId || !slotId) {
        setPageError("Invalid booking link. Missing facility or slot info.");
        setPageLoading(false);
        return;
      }
      setPageLoading(true);
      try {
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select(`*, sports (name, sport_id), venues (*)`)
          .eq("facility_id", facilityId)
          .single();
        if (facilityError) throw new Error(`Facility fetch failed: ${facilityError.message}`);
        if (!facilityData) throw new Error("Facility not found.");

        const { data: slotData, error: slotError } = await supabase
          .from("time_slots")
          .select("*")
          .eq("slot_id", slotId)
          .single();
        if (slotError) throw new Error(`Slot fetch failed: ${slotError.message}`);
        if (!slotData) throw new Error("Slot not found or unavailable.");

        const finalPrice = slotData.price_override ?? facilityData.hourly_rate;

        setBookingDetails({
          venue: facilityData.venues,
          facility: facilityData,
          slot: slotData,
          price: finalPrice,
        });
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchBookingData();
  }, [facilityId, slotId]); // Removed bookingDetails from dependency array

  // --- Effect to handle missing booking details ---
  useEffect(() => {
    if (!pageLoading && !bookingDetails && !pageError) {
      toast.error("Could not load booking details. Redirecting...");
      navigate("/explore");
    }
  }, [pageLoading, bookingDetails, pageError, navigate]);

  // --- Destructure details ---
  const { venue, facility, slot, price } = bookingDetails || {};

  // --- Calculate Amounts ---
  const baseTotalAmount = price || 0;
  const finalTotalAmount = Math.max(0, baseTotalAmount - discountAmount); // This now uses the state

  // --- ALL OFFER-RELATED LOGIC AND EFFECTS (fetch, validate, handlers) HAVE BEEN REMOVED ---

  // --- NEW: Callback for the child component ---
  const handleOfferUpdate = useCallback((discount, offer) => {
    setDiscountAmount(discount);
    setAppliedOffer(offer);
  }, []); // Empty dependency array, this function is stable

  // --- Booking Confirmation Function (MODIFIED) ---
  const handleConfirmBooking = async () => {
     if (!user) {
      showModal({
        title: "Login Required",
        message: "Please log in to complete your booking.",
        confirmText: "Login",
        onConfirm: () => navigate("/login", { state: { from: location.pathname + location.search } })
      });
      return;
    }

    setConfirmLoading(true);
    setConfirmError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found. Please log in again.');
      }

      const facilityIdToBook = facility.facility_id || facility.id;
      const slotIdToBook = slot.slot_id || slot.id;

      // This logic remains the same, but uses the state variables
      const offerIdToSend = (appliedOffer) ? appliedOffer.offer_id : null;

      const { data, error: functionError } = await supabase.functions.invoke('create-booking', {
        body: JSON.stringify({
          facility_id: facilityIdToBook,
          slot_id: slotIdToBook,
          total_amount: baseTotalAmount,
          offer_id: offerIdToSend,
        }),
      });

       if (functionError) {
           let errorMessage = 'An error occurred while creating the booking';
           if (functionError.context && typeof functionError.context.json === 'function') {
               try { const errorJson = await functionError.context.json(); if (errorJson.error) { errorMessage = errorJson.error; } } catch (e) { /* Ignore */ }
           } else if (functionError instanceof Error) { errorMessage = functionError.message; }
           console.error("Create Booking Function Error Raw:", functionError);
           throw new Error(errorMessage);
       }
      if (data?.error) throw new Error(data.error);

      const newBookingId = data?.booking_id;
      if (!newBookingId) {
        console.error("Booking ID missing in successful response:", data);
        throw new Error("Booking confirmation ID not received.");
      }

      toast.success(data?.message || `Your slot at ${venue.name} has been reserved.`);
      navigate("/my-bookings", { state: { highlightedId: newBookingId } });

    } catch (err) {
      console.error("Booking Confirmation Error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setConfirmError(errorMessage);
      showModal({ title: "Booking Failed", message: errorMessage, confirmText: "Close", confirmStyle: "danger" });
    } finally {
      setConfirmLoading(false);
    }
  };

  // --- Loading / Error States (Unchanged) ---
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-medium-text">Loading Booking Details...</h1>
      </div>
    );
   }
  if (pageError) {
     return (
      <div className="min-h-screen bg-background py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Booking</h1>
        <p className="text-medium-text mt-2">{pageError}</p>
        <button
          onClick={() => navigate("/explore")}
          className="mt-6 py-2 px-6 rounded-lg font-semibold bg-primary-green text-white hover:bg-primary-green-dark transition-all"
        >
          Go to Explore
        </button>
      </div>
    );
   }
  if (!venue || !facility || !slot || price === undefined) {
    useEffect(() => {
        toast.error("Could not load booking details. Redirecting...");
        navigate("/explore");
    }, [navigate]);
    return null;
  }

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header (Unchanged) */}
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-dark-text mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-light-text">
            Review details and complete your reservation
          </p>
        </div>

        {/* Booking Confirmation Error Message (Unchanged) */}
        {confirmError && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <FiXCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">Error: {confirmError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Booking Card */}
        <div className="bg-card-bg rounded-xl shadow-lg border border-border-color overflow-hidden">
          {/* Venue Header (Unchanged) */}
          <div className="bg-primary-green text-white p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{venue.name}</h2>
                  <p className="text-primary-green-light mt-1">
                    {facility.sports?.name || 'Sport'} • {facility.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-lg px-4 py-3 border border-white border-opacity-20">
                    <div className="text-sm text-primary-green-light">
                      Total
                    </div>
                    <div className="text-2xl font-bold">₹{finalTotalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Date & Time Section (Unchanged) */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-light-green-bg rounded-lg p-4 border border-primary-green-light border-opacity-30">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-primary-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium text-primary-green">Date</span>
                </div>
                <p className="text-dark-text font-semibold">{formatDate(slot.start_time)}</p>
              </div>
              <div className="bg-light-green-bg rounded-lg p-4 border border-primary-green-light border-opacity-30">
                <div className="flex items-center mb-2">
                   <svg className="h-5 w-5 text-primary-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm font-medium text-primary-green">Time</span>
                </div>
                <p className="text-dark-text font-semibold">{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
              </div>
            </div>

            {/* Facility Details (Unchanged) */}
            <div className="border-t border-border-color-light pt-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4">Facility Details</h3>
              <div className="grid gap-4">
                <div className="flex justify-between items-center py-3 px-4 bg-hover-bg rounded-lg">
                  <span className="text-medium-text">Facility</span><span className="font-semibold text-dark-text">{facility.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-hover-bg rounded-lg">
                  <span className="text-medium-text">Sport</span><span className="font-semibold text-dark-text">{facility.sports?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-hover-bg rounded-lg">
                  <span className="text-medium-text">Venue</span><span className="font-semibold text-dark-text">{venue.name}</span>
                </div>
              </div>
            </div>

            {/* --- MODIFIED: Offer Code Section --- */}
            {/* The entire offer section is replaced by the new component */}
            <BookingOfferSection 
              supabase={supabase}
              bookingDetails={bookingDetails}
              baseTotalAmount={baseTotalAmount}
              confirmLoading={confirmLoading}
              onOfferApplied={handleOfferUpdate}
            />
            {/* --- END MODIFIED --- */}


            {/* Payment Summary (MODIFIED) */}
            {/* This section now reads from the local state updated by the callback */}
            <div className="border-t border-border-color-light pt-6">
               <h3 className="text-lg font-semibold text-dark-text mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-medium-text">Booking Fee</span>
                  <span className="text-dark-text">₹{baseTotalAmount.toFixed(2)}</span>
                </div>
                
                {/* This uses the local discountAmount and appliedOffer state */}
                {appliedOffer && discountAmount > 0 && (
                  <div className="flex justify-between items-center py-2 text-green-700">
                    <span className="text-medium-text">Discount ({appliedOffer.title || 'Offer'})</span>
                    <span className="font-semibold">- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-medium-text">Platform Fee</span>
                  <span className="text-dark-text">₹0.00</span>
                </div>
                <div className="border-t border-border-color-light pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-dark-text">Total Amount</span>
                    <span className="text-xl font-bold text-primary-green">₹{finalTotalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* --- END MODIFIED --- */}

          </div>

          {/* Action Buttons (Unchanged) */}
          <div className="p-6 bg-hover-bg border-t border-border-color-light">
             <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border-2 border-border-color text-medium-text font-semibold rounded-lg hover:bg-card-bg hover:border-primary-green-light transition-all duration-200"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={confirmLoading}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-200 relative overflow-hidden ${
                  confirmLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-primary-green text-white hover:bg-primary-green-dark shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!confirmLoading && (
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200"></div>
                )}
                <div className="relative z-10">
                  {confirmLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing...
                    </div>
                  ) : (
                    `Proceed to Pay (₹${finalTotalAmount.toFixed(2)})`
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice (Unchanged) */}
        <div className="mt-6 text-center">
           <p className="text-sm text-light-text">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;