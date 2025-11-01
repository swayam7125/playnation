// src/pages/player/BookingPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react"; // Import useRef
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
import { FiTag, FiXCircle, FiLoader, FiCheck, FiX } from "react-icons/fi"; // Import more icons

// --- Helper Functions (Keep as they are) ---
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

// --- Debounce Hook ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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

  // --- State for Offer Functionality ---
  const [offerCode, setOfferCode] = useState("");
  const debouncedOfferCode = useDebounce(offerCode, 500); // Debounce input for 500ms
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [offerStatus, setOfferStatus] = useState("idle"); // 'idle', 'checking', 'valid', 'invalid'
  const [offerMessage, setOfferMessage] = useState(""); // Feedback message
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingOffer, setIsApplyingOffer] = useState(false); // Used only for button click state
  // --- End Offer State ---

  // Ref to prevent initial validation run on mount
  const isInitialMount = useRef(true);

  // --- Effect to Fetch Booking Data ---
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
      setPageLoading(true); // Ensure loading is true while fetching
      try {
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select(`*, sports (name, sport_id), venues (*)`) // Include sport_id
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
  }, [facilityId, slotId, bookingDetails]);

  // --- Destructure details ---
  const { venue, facility, slot, price } = bookingDetails || {};

  // --- Calculate Amounts ---
  const baseTotalAmount = price || 0;
  const finalTotalAmount = Math.max(0, baseTotalAmount - discountAmount);

  // --- Debounced Offer Validation Effect ---
  useEffect(() => {
    // Skip the effect run on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Reset if code is cleared or too short (e.g., less than 3 chars)
    if (!debouncedOfferCode || debouncedOfferCode.length < 3) {
      setOfferStatus("idle");
      setOfferMessage("");
      setAppliedOffer(null);
      setDiscountAmount(0);
      return;
    }

    const validateCode = async () => {
      if (!bookingDetails) return; // Need details to validate

      setOfferStatus("checking");
      setOfferMessage("Checking code...");
      setAppliedOffer(null); // Clear previous valid offer while checking new one
      setDiscountAmount(0);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Please log in to validate offers.");

        const { data: offerData, error: functionError } = await supabase.functions.invoke('validate-offer', {
            body: JSON.stringify({
              offer_code: debouncedOfferCode,
              venue_id: bookingDetails.venue?.venue_id,
              sport_id: bookingDetails.facility?.sports?.sport_id,
              booking_value: baseTotalAmount,
            }),
          });

        if (functionError) {
           let message = 'Failed to validate offer.';
           if (functionError.context && typeof functionError.context.json === 'function') {
               try { const errorJson = await functionError.context.json(); message = errorJson.error || errorJson.message || message; } catch { /* ignore */ }
           } else if (functionError instanceof Error) { message = functionError.message; }
           console.error("Debounced Validate Offer Function Error Raw:", functionError);
           throw new Error(message);
        }

        if (offerData && offerData.error) throw new Error(offerData.error);
        if (!offerData || typeof offerData.calculated_discount === 'undefined' || !offerData.offer_id) {
          console.error("Invalid response structure from validate-offer (debounced):", offerData);
          throw new Error("Received an invalid response from the server.");
        }

        // Success!
        setOfferStatus("valid");
        setOfferMessage(`Offer applied: ${offerData.title} (-₹${offerData.calculated_discount.toFixed(2)})`);
        setAppliedOffer(offerData); // Store validated offer
        setDiscountAmount(offerData.calculated_discount);

      } catch (err) {
        console.error("Debounced offer validation error:", err);
        setOfferStatus("invalid");
        setOfferMessage(err.message || "Invalid offer code.");
        setAppliedOffer(null);
        setDiscountAmount(0);
      }
    };

    validateCode();

  }, [debouncedOfferCode, bookingDetails, baseTotalAmount]); // Re-run when debounced code or booking details change

  // --- Offer Handling Functions ---

  // Apply button click still triggers validation, ensuring the *latest* code is used if typed quickly before clicking
  const handleApplyOffer = useCallback(async () => {
    if (!offerCode || !bookingDetails) return;

    // Use isApplyingOffer for button state, offerStatus for live feedback
    setIsApplyingOffer(true);
    setOfferStatus("checking");
    setOfferMessage("Checking code...");
    setAppliedOffer(null); // Clear previous valid offer
    setDiscountAmount(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in to apply offers.");

      const { data: offerData, error: functionError } = await supabase.functions.invoke('validate-offer', {
        body: JSON.stringify({
          offer_code: offerCode, // Use the current (non-debounced) offerCode
          venue_id: bookingDetails.venue?.venue_id,
          sport_id: bookingDetails.facility?.sports?.sport_id,
          booking_value: baseTotalAmount,
        }),
      });

      // (Error handling remains the same as your previous version)
       if (functionError) {
           let message = 'Failed to validate offer.';
           if (functionError.context && typeof functionError.context.json === 'function') {
               try { const errorJson = await functionError.context.json(); message = errorJson.error || errorJson.message || message; } catch { /* ignore */ }
           } else if (functionError instanceof Error) { message = functionError.message; }
           console.error("Apply Offer Function Error Raw:", functionError);
           throw new Error(message);
       }
      if (offerData && offerData.error) throw new Error(offerData.error);
      if (!offerData || typeof offerData.calculated_discount === 'undefined' || !offerData.offer_id) {
          console.error("Invalid response structure from validate-offer (apply click):", offerData);
          throw new Error("Received an invalid response while validating the offer.");
       }

      // Success! Update state based on button click result
      setOfferStatus("valid");
      setOfferMessage(`Offer applied: ${offerData.title} (-₹${offerData.calculated_discount.toFixed(2)})`);
      setAppliedOffer(offerData);
      setDiscountAmount(offerData.calculated_discount);
      toast.success(`Offer "${offerData.title}" applied!`);
      // setOfferCode(""); // Keep the code in the input after successful apply via button

    } catch (err) {
      console.error("Error applying offer:", err);
      setOfferStatus("invalid");
      setOfferMessage(err.message || "An unexpected error occurred while applying the offer.");
      setAppliedOffer(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingOffer(false);
    }
  }, [offerCode, bookingDetails, baseTotalAmount]);


  const handleRemoveOffer = () => {
    setAppliedOffer(null);
    setDiscountAmount(0);
    setOfferCode(""); // Clear input when removing
    setOfferStatus("idle");
    setOfferMessage("");
    toast.success("Offer removed.");
 };

  // --- Booking Confirmation Function ---
  // --- Booking Confirmation Function ---
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

      // Ensure appliedOffer is valid before sending its ID
      const offerIdToSend = (offerStatus === 'valid' && appliedOffer) ? appliedOffer.offer_id : null;

      const { data, error: functionError } = await supabase.functions.invoke('create-booking', {
        body: JSON.stringify({
          facility_id: facilityIdToBook,
          slot_id: slotIdToBook,
          total_amount: baseTotalAmount,
          offer_id: offerIdToSend, // Send validated offer ID
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

      // --- THIS IS THE CHANGE ---
      // Show success toast instead of modal
      toast.success(data?.message || `Your slot at ${venue.name} has been reserved.`);

      // Navigate immediately to My Bookings
      navigate("/my-bookings", { state: { highlightedId: newBookingId } });
      // --- END OF CHANGE ---

    } catch (err) {
      console.error("Booking Confirmation Error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setConfirmError(errorMessage);
      // We still use the modal for failure, as that's an important stop for the user
      showModal({ title: "Booking Failed", message: errorMessage, confirmText: "Close", confirmStyle: "danger" });
    } finally {
      setConfirmLoading(false);
    }
  };

  // --- Loading / Error States ---
  if (pageLoading) { /* ... (same as before) ... */
    return (
      <div className="min-h-screen bg-background py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-medium-text">Loading Booking Details...</h1>
      </div>
    );
   }
  if (pageError) { /* ... (same as before) ... */
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
  if (!venue || !facility || !slot || price === undefined) { /* ... (same as before) ... */
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
        {/* Header */}
        <div className="text-center mb-8">
          {/* ... (same as before) ... */}
           <h1 className="text-3xl font-bold text-dark-text mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-light-text">
            Review details and complete your reservation
          </p>
        </div>

        {/* Booking Confirmation Error Message */}
        {confirmError && (
          // ... (same as before) ...
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
          {/* Venue Header */}
          <div className="bg-primary-green text-white p-6 relative overflow-hidden">
             {/* ... (same as before) ... */}
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
            {/* Date & Time Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* ... (Date and Time Cards remain the same) ... */}
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

            {/* Facility Details */}
            <div className="border-t border-border-color-light pt-6">
              {/* ... (Facility Details remain the same) ... */}
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

            {/* Offer Code Section - **MODIFIED** */}
            <div className="border-t border-border-color-light pt-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
                 <FiTag className="text-primary-green"/> Apply Offer Code
              </h3>

              {/* Offer Input and Apply Button */}
              <div className="flex gap-2 items-start"> {/* Use items-start for alignment */}
                <div className="flex-grow">
                  <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter code (min 3 chars)"
                        value={offerCode}
                        onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                        className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                           offerStatus === 'invalid' ? 'border-red-500 ring-red-500' :
                           offerStatus === 'valid' ? 'border-green-500 ring-green-500' :
                           'border-border-color focus:ring-primary-green'
                        }`}
                        disabled={isApplyingOffer || confirmLoading}
                        aria-label="Offer Code Input"
                    />
                    {/* Status Icon Inside Input */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                       {offerStatus === 'checking' && <FiLoader className="animate-spin text-blue-500" />}
                       {offerStatus === 'valid' && <FiCheck className="text-green-500" />}
                       {offerStatus === 'invalid' && <FiX className="text-red-500" />}
                    </div>
                  </div>
                   {/* Feedback Message Below Input */}
                   {offerMessage && (
                     <p className={`mt-1.5 text-xs ${
                         offerStatus === 'invalid' ? 'text-red-600' :
                         offerStatus === 'valid' ? 'text-green-600' :
                         'text-blue-600' // For 'checking'
                     }`}>
                       {offerMessage}
                     </p>
                   )}
                </div>

                {/* Apply Button (Optional, or repurposed) */}
                <button
                    onClick={handleApplyOffer} // Still calls the validation on click
                    disabled={!offerCode || isApplyingOffer || confirmLoading || offerStatus === 'checking'} // Disable while checking or applying
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                    !offerCode || isApplyingOffer || confirmLoading || offerStatus === 'checking'
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary-green text-white hover:bg-primary-green-dark"
                    }`}
                >
                  {isApplyingOffer ? (
                     <div className="flex items-center justify-center">
                        <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"/> Applying...
                     </div>
                    ) : "Apply"}
                </button>
                {/* Remove Offer Button */}
                {(offerStatus === 'valid' || appliedOffer) && (
                     <button
                        onClick={handleRemoveOffer}
                        className="p-2.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                        title="Remove Offer"
                        disabled={isApplyingOffer || confirmLoading}
                    >
                        <FiXCircle size={18} />
                    </button>
                 )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-border-color-light pt-6">
              {/* ... (Payment Summary remains the same) ... */}
               <h3 className="text-lg font-semibold text-dark-text mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-medium-text">Booking Fee</span>
                  <span className="text-dark-text">₹{baseTotalAmount.toFixed(2)}</span>
                </div>
                {/* Conditionally show discount only if status is valid and amount > 0 */}
                {offerStatus === 'valid' && discountAmount > 0 && (
                  <div className="flex justify-between items-center py-2 text-green-700">
                    <span className="text-medium-text">Discount ({appliedOffer?.title || 'Offer'})</span>
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
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-hover-bg border-t border-border-color-light">
            {/* ... (Action Buttons remain the same) ... */}
             <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)} // Go back one step in history
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
                    `Proceed to Pay (₹${finalTotalAmount.toFixed(2)})` // Show final amount on button
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          {/* ... (same as before) ... */}
           <p className="text-sm text-light-text">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;