// src/pages/player/BookingPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { supabase } from "../../supabaseClient"; // Ensure direct import if needed
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import toast from "react-hot-toast";
import { FiTag, FiXCircle } from "react-icons/fi"; // Import icons for offer section

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

// --- Component ---
function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();
  const { facilityId } = useParams();
  const [searchParams] = useSearchParams();
  const slotId = searchParams.get("slot_id");

  // State for booking details (fetched or from location state)
  const [bookingDetails, setBookingDetails] = useState(location.state || null);
  const [pageLoading, setPageLoading] = useState(!bookingDetails);
  const [pageError, setPageError] = useState(null);

  // State for booking confirmation action
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  // --- State for Offer Functionality ---
  const [offerCode, setOfferCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null); // Stores validated offer details { offer_id, title, calculated_discount, ... }
  const [offerError, setOfferError] = useState("");
  const [isApplyingOffer, setIsApplyingOffer] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  // --- End Offer State ---

  // --- Effect to Fetch Booking Data if not passed via state ---
  useEffect(() => {
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
  }, [facilityId, slotId, bookingDetails]); // Removed navigate from dependencies

  // --- Destructure details (ensure they exist) ---
  const { venue, facility, slot, price } = bookingDetails || {};

  // --- Calculate Amounts ---
  const baseTotalAmount = price || 0; // The price before any discounts
  const finalTotalAmount = Math.max(0, baseTotalAmount - discountAmount); // Ensure total doesn't go below 0

  // --- Loading / Error States ---
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 text-center">
        {/* Simple loading indicator */}
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

  // Fallback if details are somehow still missing after loading/error checks
   if (!venue || !facility || !slot || price === undefined) {
    useEffect(() => {
        toast.error("Could not load booking details. Redirecting...");
        navigate("/explore");
    }, [navigate]); // Navigate immediately if details are missing
    return null; // Render nothing while redirecting
  }

  // --- Offer Handling Functions ---
  const handleApplyOffer = useCallback(async () => {
    if (!offerCode || !bookingDetails) return;

    setIsApplyingOffer(true);
    setOfferError("");
    setAppliedOffer(null);
    setDiscountAmount(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in to apply offers.");

      console.log("Invoking validate-offer with:", {
        offer_code: offerCode,
        venue_id: bookingDetails.venue?.venue_id,
        sport_id: bookingDetails.facility?.sports?.sport_id, // Access nested sport_id
        booking_value: baseTotalAmount,
      });

      const { data: offerData, error: functionError } = await supabase.functions.invoke('validate-offer', {
        body: JSON.stringify({ // Ensure body is stringified
          offer_code: offerCode,
          venue_id: bookingDetails.venue?.venue_id,
          sport_id: bookingDetails.facility?.sports?.sport_id, // Correctly pass sport_id
          booking_value: baseTotalAmount,
        }),
      });

       if (functionError) {
           let message = 'Failed to validate offer.';
            // Deno Deploy often wraps errors, try to get the inner message
           if (functionError.context && typeof functionError.context.json === 'function') {
               try {
                   const errorJson = await functionError.context.json();
                   message = errorJson.error || errorJson.message || message;
               } catch (parseError) {
                   console.error("Failed to parse function error JSON:", parseError);
                   // Try getting text if JSON parse fails
                   try {
                     const errorText = await functionError.context.text();
                     message = errorText || message;
                   } catch(textError) {
                      console.error("Failed to get function error text:", textError);
                      if (functionError instanceof Error) {
                          message = functionError.message;
                      }
                   }
               }
           } else if (functionError instanceof Error) {
               message = functionError.message;
           }
           console.error("Validate Offer Function Error Raw:", functionError);
           throw new Error(message);
       }


      // Check if the function returned a specific error structure
      if (offerData && offerData.error) {
        throw new Error(offerData.error);
      }

      // Check for essential data
       if (!offerData || typeof offerData.calculated_discount === 'undefined' || !offerData.offer_id) {
          console.error("Invalid response structure from validate-offer:", offerData);
          throw new Error("Received an invalid response while validating the offer.");
       }

      // Success!
      setAppliedOffer(offerData);
      setDiscountAmount(offerData.calculated_discount);
      toast.success(`Offer "${offerData.title}" applied!`);
      setOfferCode(""); // Clear input on success

    } catch (err) {
      console.error("Error applying offer:", err);
      setOfferError(err.message || "An unexpected error occurred while applying the offer.");
      setAppliedOffer(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingOffer(false);
    }
  }, [offerCode, bookingDetails, baseTotalAmount]); // Dependencies for useCallback


 const handleRemoveOffer = () => {
    setAppliedOffer(null);
    setDiscountAmount(0);
    setOfferError("");
    setOfferCode("");
    toast.success("Offer removed.");
 };


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

      // Call the create-booking function
      const { data, error: functionError } = await supabase.functions.invoke('create-booking', {
        body: JSON.stringify({ // Ensure body is stringified
          facility_id: facilityIdToBook,
          slot_id: slotIdToBook,
          total_amount: baseTotalAmount, // Send the ORIGINAL amount before discount
          offer_id: appliedOffer ? appliedOffer.offer_id : null, // Pass offer_id if applied
        }),
      });

       if (functionError) {
           let errorMessage = 'An error occurred while creating the booking';
           // Attempt to parse Edge Function error response
           if (functionError.context && typeof functionError.context.json === 'function') {
               try {
                   const errorJson = await functionError.context.json();
                   if (errorJson.error) {
                       errorMessage = errorJson.error;
                   }
               } catch (e) { /* Ignore parsing error, use default */ }
           } else if (functionError instanceof Error) {
               errorMessage = functionError.message;
           }
           console.error("Create Booking Function Error Raw:", functionError);
           throw new Error(errorMessage);
       }


      // Check for errors returned within the function's response data
      if (data?.error) {
        throw new Error(data.error);
      }

      // Check if bookingId exists in the response
     // Inside handleConfirmBooking try block, after the function invoke
      const newBookingId = data?.booking_id; // Solution: Expect camelCase to match function response
      console.log(`[${new Date().toISOString()}] Extracted booking ID:`, newBookingId);
      if (!newBookingId) {
        // This error should now only happen if the function response is truly malformed
        console.error(`[${new Date().toISOString()}] Booking ID ('bookingId') missing in successful response data:`, data);
        throw new Error("Booking confirmation ID not received. Please check My Bookings, it might have succeeded.");
      }

      await showModal({
        title: "Success!",
        message: data?.message || `Your slot at ${venue.name} has been reserved.`,
        confirmText: "Go to My Bookings",
      });

      navigate("/my-bookings", {
        state: { highlightedId: newBookingId }
      });

    } catch (err) {
      console.error("Booking Confirmation Error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setConfirmError(errorMessage);
      showModal({
        title: "Booking Failed",
        message: errorMessage,
        confirmText: "Close",
        confirmStyle: "danger",
      });
    } finally {
      setConfirmLoading(false);
    }
  };


  // --- Render Component ---
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-light-text">
            Review details and complete your reservation
          </p>
        </div>

        {/* Booking Confirmation Error Message */}
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
          {/* Venue Header */}
          <div className="bg-primary-green text-white p-6 relative overflow-hidden">
             {/* Decorative elements */}
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
                {/* Updated Total Display */}
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
              {/* Date Card */}
              <div className="bg-light-green-bg rounded-lg p-4 border border-primary-green-light border-opacity-30">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-primary-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium text-primary-green">Date</span>
                </div>
                <p className="text-dark-text font-semibold">{formatDate(slot.start_time)}</p>
              </div>
              {/* Time Card */}
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

            {/* Offer Code Section - Integrated Here */}
            <div className="border-t border-border-color-light pt-6">
                <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
                   <FiTag className="text-primary-green"/> Apply Offer Code
                </h3>
                {offerError && (
                    <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded border border-red-200">{offerError}</p>
                )}
                {appliedOffer && !offerError && (
                    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg mb-4 text-sm flex justify-between items-center">
                    <span>Applied: "{appliedOffer.title}" (-₹{discountAmount.toFixed(2)})</span>
                     <button
                        onClick={handleRemoveOffer}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
                        title="Remove Offer"
                    >
                        REMOVE
                    </button>
                    </div>
                )}
                {!appliedOffer && ( // Only show input if no offer is applied
                    <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Enter code"
                        value={offerCode}
                        onChange={(e) => {
                            setOfferCode(e.target.value.toUpperCase());
                            setOfferError(""); // Clear error on typing
                        }}
                        className="flex-grow px-4 py-2 bg-background border border-border-color rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-green text-sm"
                        disabled={isApplyingOffer}
                        aria-label="Offer Code Input"
                    />
                    <button
                        onClick={handleApplyOffer}
                        disabled={!offerCode || isApplyingOffer}
                        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                        !offerCode || isApplyingOffer
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary-green text-white hover:bg-primary-green-dark"
                        }`}
                    >
                        {isApplyingOffer ? (
                             <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Applying...
                             </div>
                        ): "Apply"}
                    </button>
                    </div>
                )}
            </div>


            {/* Payment Summary - Updated */}
            <div className="border-t border-border-color-light pt-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-medium-text">Booking Fee</span>
                  <span className="text-dark-text">₹{baseTotalAmount.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
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
          <p className="text-sm text-light-text">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;