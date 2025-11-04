// src/components/bookings/BookingCard.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  XCircle,
  CheckCircle,
  MessageSquare,
  AlertOctagon, // Icon for "too late"
} from "lucide-react";
import ReviewModal from "../reviews/ReviewModal";
import CancelBookingModal from "./CancelBookingModal";
import DownloadInvoiceButton from "../common/DownloadInvoiceButton";

// --- Helper Functions for Formatting ---
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// --- Helper Components for UI ---
const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-medium-text">
    <Icon className="h-4 w-4 flex-shrink-0 text-primary-green" />
    <span className="text-sm">{text}</span>
  </div>
);

const BookingStatusBadge = ({ status }) => {
  let bgColor, textColor, text, Icon;
  switch (status) {
    case "confirmed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      text = "Confirmed";
      Icon = CheckCircle;
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      text = "Cancelled";
      Icon = XCircle;
      break;
    default:
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      text = status;
      Icon = Clock;
  }
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
    >
      <Icon className="h-3 w-3" />
      {text}
    </div>
  );
};

// --- Main BookingCard Component ---

export function BookingCard({
  booking,
  onReviewSubmitted,
  onCancelBooking,
  isHighlighted = false,
}) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const cardRef = useRef(null);

  // Auto-scroll to the card if it's highlighted
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [isHighlighted]);

  if (!booking || !booking.facilities || !booking.facilities.venues) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Booking information is currently unavailable.</p>
      </div>
    );
  }

  const {
    booking_id,
    start_time,
    end_time,
    total_amount,
    status,
    facilities,
  } = booking;
  const { name: facilityName, sports } = facilities;
  
  // Destructure policy from venue
  const {
    venue_id,
    name: venueName,
    address,
    cancellation_cutoff_hours,
  } = facilities.venues;

  const isUpcoming = new Date(start_time) >= new Date() && status === "confirmed";
  const isPast = new Date(start_time) < new Date() && status === "confirmed";
  const hasBeenReviewed = booking.reviews && booking.reviews.length > 0;

  // --- Cancellation Logic ---
  const now = new Date();
  const startTime = new Date(booking.start_time);
  const cutoffHours = cancellation_cutoff_hours ?? 24; // Default to 24 if null
  const cutoffTime = new Date(startTime.getTime() - cutoffHours * 60 * 60 * 1000);
  const isCancellable = now < cutoffTime;
  // --- End Cancellation Logic ---

  // --- Handlers ---
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (bookingId, reason) => {
    await onCancelBooking(bookingId, reason);
    setIsCancelModalOpen(false);
  };

  const handleReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    setIsReviewModalOpen(false);
    onReviewSubmitted();
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`flex flex-col overflow-hidden rounded-xl bg-card-bg shadow-lg transition-all duration-500 ease-in-out ${
          isHighlighted
            ? "ring-4 ring-primary-green ring-offset-2 ring-offset-background"
            : "border border-border-color-light hover:shadow-xl"
        }`}
      >
        {/* --- Card Content (No Image) --- */}
        <div className="flex flex-1 flex-col p-5">
          {/* --- Header --- */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-primary-green">
              {sports.name.toUpperCase()}
            </p>
            <BookingStatusBadge status={status} />
          </div>

          {/* --- Details --- */}
          <div className="flex-1">
            <Link to={`/venues/${venue_id}`}>
              <h3 className="text-xl font-bold text-dark-text hover:text-primary-green">
                {venueName}
              </h3>
            </Link>
            <p className="mt-1 text-sm font-semibold text-medium-text">
              {facilityName}
            </p>

            <hr className="my-4 border-t border-border-color-light" />

            {/* --- Booking Details --- */}
            <div className="space-y-3">
              <InfoRow icon={Calendar} text={formatDate(start_time)} />
              <InfoRow
                icon={Clock}
                text={`${formatTime(start_time)} - ${formatTime(end_time)}`}
              />
              <InfoRow icon={MapPin} text={address} />
            </div>
          </div>

          {/* --- Price and Actions --- */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-medium-text">Total Paid:</span>
              <span className="text-2xl font-bold text-dark-text">
                ₹{total_amount}
              </span>
            </div>

            {/* --- Action Buttons --- */}
            <div className="flex w-full gap-3">
              {isUpcoming && isCancellable && (
                <button
                  onClick={handleCancelClick}
                  className="flex-1 rounded-lg border-2 border-red-500 bg-red-50 px-4 py-2.5 text-center text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Cancel Booking
                </button>
              )}

              {isUpcoming && !isCancellable && (
                <button
                  disabled
                  title="The cancellation period for this booking has passed."
                  className="flex-1 rounded-lg border-2 border-border-color bg-hover-bg px-4 py-2.5 text-center text-sm font-semibold text-medium-text flex items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  <AlertOctagon className="h-4 w-4" />
                  Too late to cancel
                </button>
              )}

              {isPast && (
                <>
                  {hasBeenReviewed ? (
                    <button
                      disabled
                      className="flex-1 rounded-lg border-2 border-border-color bg-hover-bg px-4 py-2.5 text-center text-sm font-semibold text-medium-text"
                    >
                      <CheckCircle className="mr-1.5 inline h-4 w-4" />
                      Reviewed
                    </button>
                  ) : (
                    <button
                      onClick={handleReviewClick}
                      className="flex-1 rounded-lg border-2 border-primary-green bg-primary-green px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-green-dark"
                    >
                      <Sparkles className="mr-1.5 inline h-4 w-4" />
                      Write a Review
                    </button>
                  )}
                </>
              )}

              {status === "cancelled" && (
                <Link
                  to="/explore"
                  className="flex-1 rounded-lg bg-primary-green px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-green-dark"
                >
                  Book Again
                </Link>
              )}
              {status === "confirmed" && (
                <DownloadInvoiceButton bookingId={booking_id} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      {isUpcoming && isCancellable && (
        <CancelBookingModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          booking={booking}
          onSubmit={handleConfirmCancel}
        />
      )}

      {isPast && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          booking={booking}
          onReviewSubmitted={handleReviewSuccess}
        />
      )}
    </>
  );
}
