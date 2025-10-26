import React, { useState, useEffect } from "react"; // 👈 Add useEffect
import {
  useLocation,
  useNavigate,
  useParams, // 👈 Add useParams
  useSearchParams, // 👈 Add useSearchParams
} from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import toast from "react-hot-toast"; // 👈 Import toast for errors

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

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();

  // --- NEW: URL-based data fetching ---
  const { facilityId } = useParams(); // 👈 Get facilityId from URL
  const [searchParams] = useSearchParams(); // 👈 Get query params
  const slotId = searchParams.get("slot_id");

  // This local state will hold our booking info, whether from state or fetch
  const [bookingDetails, setBookingDetails] = useState(location.state || null);
  
  // This loading state is for the *initial* page load fetch
  const [pageLoading, setPageLoading] = useState(!bookingDetails);
  // This error is for the *initial* page load fetch
  const [pageError, setPageError] = useState(null);

  // Renamed: This state is for the "Confirm Booking" button action
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  useEffect(() => {
    // If we already have details from location.state, we don't need to fetch
    if (bookingDetails) {
      setPageLoading(false);
      return;
    }

    // If state is missing, fetch from Supabase using URL params
    const fetchBookingData = async () => {
      if (!facilityId || !slotId) {
        setPageError("Invalid booking link. Missing facility or slot information.");
        setPageLoading(false);
        return;
      }

      try {
        // 1. Fetch Facility, Venue, and Sport info
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select(
            `
            *,
            sports (name),
            venues (*)
          `
          )
          .eq("facility_id", facilityId)
          .single();

        if (facilityError) throw new Error(`Could not find facility. ${facilityError.message}`);
        if (!facilityData) throw new Error("Facility not found.");

        // 2. Fetch the specific Time Slot
        const { data: slotData, error: slotError } = await supabase
          .from("time_slots")
          .select("*")
          .eq("slot_id", slotId)
          .single();
        
        if (slotError) throw new Error(`Could not find slot. ${slotError.message}`);
        if (!slotData) throw new Error("Slot not found or is no longer available.");

        // 3. Re-calculate the price
        const finalPrice = slotData.price_override ?? facilityData.hourly_rate;

        // 4. Set our local state
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
  }, [facilityId, slotId, bookingDetails, navigate]); // 👈 Deps array

  // --- END: NEW URL-based data fetching ---

  // Destructure details *after* they have been potentially fetched
  const { venue, facility, slot, price } = bookingDetails || {};

  // --- MODIFIED: Loading/Error/Redirect states ---
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-dark-text">Loading Booking Details...</h1>
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

  // This can happen if the URL params were invalid and fetchBookingData set an error
  // or if something truly unexpected happened.
  if (!venue || !facility || !slot || price === undefined) {
    // We can navigate away, but it's better to show an error (handled above)
    // For safety, we'll keep a fallback redirect.
    useEffect(() => {
      if (!pageLoading) {
        toast.error("Could not load booking details. Redirecting...");
        navigate("/explore");
      }
    }, [pageLoading, navigate]);
    return null;
  }
  // --- END: MODIFIED states ---

  const totalAmount = price;

  const handleConfirmBooking = async () => {
    if (!user) {
      showModal({
        title: "Login Required",
        message: "Please log in to complete your booking.",
      });
      // 👇 Pass current path (with query params) to redirect back after login
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    setConfirmLoading(true); // 👈 Use confirmLoading
    setConfirmError(null);   // 👈 Use confirmError
    
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No valid session found. Please log in again.');
      }

      const facilityIdToBook = facility.facility_id || facility.id;
      const slotIdToBook = slot.slot_id || slot.id;
      
      const { data, error: functionError } = await supabase.functions.invoke('create-booking', {
        body: {
          facility_id: facilityIdToBook,
          slot_id: slotIdToBook,
          total_amount: totalAmount,
        },
      });

      if (functionError) {
        let errorMessage = 'An error occurred while creating the booking';
        
        if (functionError.context && typeof functionError.context.text === 'function') {
          try {
            const errorText = await functionError.context.text();
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            // Use default error message
          }
        }
        
        throw new Error(errorMessage);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const newBookingId = data?.booking_id;

      await showModal({
        title: "Success!",
        message: data?.message || `Your slot at ${venue.name} has been reserved.`,
        confirmText: "Go to My Bookings",
      });

      navigate("/my-bookings", { 
        state: { highlightedId: newBookingId } 
      });
      
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      
      setConfirmError(errorMessage); // 👈 Use confirmError
      showModal({
        title: "Booking Failed",
        message: errorMessage,
        confirmText: "Close",
        confirmStyle: "danger",
      });
    } finally {
      setConfirmLoading(false); // 👈 Use confirmLoading
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-light-text">
            Review your booking details and complete your reservation
          </p>
        </div>

        {/* MODIFIED: Error Message */}
        {confirmError && ( 
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{venue.name}</h2>
                  <p className="text-primary-green-light mt-1">
                    {facility.sports?.name} • {facility.name} {/* 👈 Add optional chaining for safety */}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-lg px-4 py-3 border border-white border-opacity-20">
                    <div className="text-sm text-primary-green-light">
                      Total
                    </div>
                    <div className="text-2xl font-bold">₹{totalAmount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Date & Time Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-light-green-bg rounded-lg p-4 border border-primary-green-light border-opacity-30">
                <div className="flex items-center mb-2">
                  <svg
                    className="h-5 w-5 text-primary-green mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-primary-green">
                    Date
                  </span>
                </div>
                <p className="text-dark-text font-semibold">
                  {formatDate(slot.start_time)}
                </p>
              </div>

              <div className="bg-light-green-bg rounded-lg p-4 border border-primary-green-light border-opacity-30">
                <div className="flex items-center mb-2">
                  <svg
                    className="h-5 w-5 text-primary-green mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-primary-green">
                    Time
                  </span>
                </div>
                <p className="text-dark-text font-semibold">
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </p>
              </div>
            </div>

            {/* Facility Details */}
            <div className="border-t border-border-color-light pt-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4">
                Facility Details
              </h3>
              <div className="grid gap-4">
                <div className="flex justify-between items-center py-3 px-4 bg-hover-bg rounded-lg">
                  <span className="text-medium-text">Facility</span>
                  <span className="font-semibold text-dark-text">
                    {facility.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-hover-bg rounded-lg">
                  <span className="text-medium-text">Sport</span>
                  <span className="font-semibold text-dark-text">
                    {facility.sports?.name} {/* 👈 Add optional chaining */}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-hover-bg rounded-lg">
                  <span className="text-medium-text">Venue</span>
                  <span className="font-semibold text-dark-text">
                    {venue.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-border-color-light pt-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4">
                Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-medium-text">Booking Fee</span>
                  <span className="text-dark-text">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-medium-text">Platform Fee</span>
                  <span className="text-dark-text">₹0</span>
                </div>
                <div className="border-t border-border-color-light pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-dark-text">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-primary-green">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
                disabled={confirmLoading} // 👈 Use confirmLoading
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-200 relative overflow-hidden ${
                  confirmLoading // 👈 Use confirmLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-primary-green text-white hover:bg-primary-green-dark shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!confirmLoading && ( // 👈 Use confirmLoading
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200"></div>
                )}
                <div className="relative z-10">
                  {confirmLoading ? ( // 👈 Use confirmLoading
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Proceed to Pay"
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