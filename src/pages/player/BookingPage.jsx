import React, { useState, useEffect, useCallback } from "react";
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
import { FiXCircle } from "react-icons/fi";
import BookingOfferSection from "../../components/bookings/BookingOfferSection";
import BookingPageSkeleton from "../../components/skeletons/BookingPageSkeleton";

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
  const { facilityId } = useParams();
  const [searchParams] = useSearchParams();
  const slotId = searchParams.get("slot_id");

  const [bookingDetails, setBookingDetails] = useState(location.state || null);
  const [pageLoading, setPageLoading] = useState(!bookingDetails);
  const [pageError, setPageError] = useState(null);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

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
  }, [facilityId, slotId]);

  useEffect(() => {
    if (!pageLoading && !bookingDetails && !pageError) {
      toast.error("Could not load booking details. Redirecting...");
      navigate("/explore");
    }
  }, [pageLoading, bookingDetails, pageError, navigate]);

  const { venue, facility, slot, price } = bookingDetails || {};

  const baseTotalAmount = price || 0;
  const finalTotalAmount = Math.max(0, baseTotalAmount - discountAmount);

  const handleOfferUpdate = useCallback((discount, offer) => {
    setDiscountAmount(discount);
    setAppliedOffer(offer);
  }, []);

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

  if (pageLoading) {
    return <BookingPageSkeleton />;
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Booking</h1>
          <p className="text-gray-600 mt-2">{pageError}</p>
          <button
            onClick={() => navigate("/explore")}
            className="mt-6 py-3 px-8 rounded-lg font-semibold bg-primary-green text-white hover:bg-primary-green-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Go to Explore
          </button>
        </div>
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600">
            Review details and complete your reservation
          </p>
        </div>

        {confirmError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">Error: {confirmError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary-green to-green-600 text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{venue.name}</h2>
                <p className="opacity-80 mt-1">
                  {facility.sports?.name || 'Sport'} • {facility.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg opacity-80">Total</p>
                <p className="text-4xl font-bold">₹{finalTotalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-primary-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-lg font-semibold text-gray-800">Date</span>
                </div>
                <p className="text-gray-600 font-medium">{formatDate(slot.start_time)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-primary-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-lg font-semibold text-gray-800">Time</span>
                </div>
                <p className="text-gray-600 font-medium">{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Facility Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 px-5 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Facility</span><span className="font-semibold text-gray-800">{facility.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-5 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Sport</span><span className="font-semibold text-gray-800">{facility.sports?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-5 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Venue</span><span className="font-semibold text-gray-800">{venue.name}</span>
                </div>
              </div>
            </div>

            <BookingOfferSection 
              supabase={supabase}
              bookingDetails={bookingDetails}
              baseTotalAmount={baseTotalAmount}
              confirmLoading={confirmLoading}
              onOfferApplied={handleOfferUpdate}
            />

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Fee</span>
                  <span className="text-gray-800 font-medium">₹{baseTotalAmount.toFixed(2)}</span>
                </div>
                
                {appliedOffer && discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-gray-600">Discount ({appliedOffer.title || 'Offer'})</span>
                    <span className="font-semibold">- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="text-gray-800 font-medium">₹0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-green">₹{finalTotalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={confirmLoading}
                className={`flex-1 py-4 px-6 font-bold text-lg rounded-lg transition-all duration-300 relative overflow-hidden shadow-lg transform hover:-translate-y-1 ${
                  confirmLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-primary-green text-white hover:bg-primary-green-dark"
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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;