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
  AlertOctagon,
} from "lucide-react";
import ReviewModal from "../reviews/ReviewModal";
import CancelBookingModal from "./CancelBookingModal";
import DownloadInvoiceButton from "../common/DownloadInvoiceButton";

// Helper function to format date
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// Helper function to format time
const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const InfoRow = ({ icon: Icon, label, value }) => (
  <div>
    <dt className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
      <Icon className="h-4 w-4" />
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 font-semibold">{value}</dd>
  </div>
);

export const BookingCard = ({
  booking,
  onReviewSubmitted,
  onCancelBooking,
  isHighlighted = false,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  if (!booking || !booking.facilities || !booking.facilities.venues) {
    return null; // Or a placeholder
  }

  const { start_time, end_time, status, facilities } = booking;
  const { name: facilityName, sports, venues: venue } = facilities;
  const { name: venueName, address, image_url, cancellation_cutoff_hours } = venue;

  const isUpcoming = new Date(start_time) >= new Date() && status === "confirmed";
  const isPast = new Date(start_time) < new Date() && status === "confirmed";
  const hasBeenReviewed = booking.reviews && booking.reviews.length > 0;

  const now = new Date();
  const startTime = new Date(start_time);
  const cutoffTime = new Date(
    startTime.getTime() - (cancellation_cutoff_hours || 24) * 60 * 60 * 1000
  );
  const isCancellable = now < cutoffTime;

  const handleConfirmCancel = async (bookingId, reason) => {
    await onCancelBooking(bookingId, reason);
    setIsCancelModalOpen(false);
  };

  const handleReviewSuccess = () => {
    setIsReviewModalOpen(false);
    onReviewSubmitted();
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ${
          isHighlighted ? "ring-2 ring-primary-green ring-offset-2" : ""
        }`}
      >
        <div className="relative">
          <img
            src={image_url?.[0] || "https://placehold.co/600x400/E2E8F0/4A5568?text=PlayNation"}
            alt={venueName}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-3">
            <BookingStatusBadge status={status} />
          </div>
          <div className="absolute bottom-3 left-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
              {sports.name}
            </p>
            <h3 className="text-xl font-bold text-white leading-tight">
              {venueName}
            </h3>
            <p className="text-sm text-white/90">{facilityName}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <dl className="grid grid-cols-2 gap-4 mb-5">
            <InfoRow icon={Calendar} label="Date" value={formatDate(start_time)} />
            <InfoRow
              icon={Clock}
              label="Time"
              value={`${formatTime(start_time)} - ${formatTime(end_time)}`}
            />
            <div className="col-span-2">
              <InfoRow icon={MapPin} label="Location" value={address} />
            </div>
          </dl>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-left">
              <p className="text-xs text-gray-500">Total Paid</p>
              <p className="text-xl font-bold text-gray-800">
                ₹{booking.total_amount}
              </p>
            </div>
            <div className="flex gap-2">
              {isUpcoming &&
                (isCancellable ? (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="btn-danger-outline"
                  >
                    Cancel
                  </button>
                ) : (
                  <button disabled className="btn-disabled flex items-center gap-1.5">
                    <AlertOctagon className="h-4 w-4" />
                    Too late
                  </button>
                ))}
              {isPast &&
                (hasBeenReviewed ? (
                  <button disabled className="btn-success-outline flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    Reviewed
                  </button>
                ) : (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="btn-primary"
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Review
                  </button>
                ))}
              {status === "cancelled" && (
                <Link to="/explore" className="btn-primary">
                  Book Again
                </Link>
              )}
              {status === "confirmed" && (
                <DownloadInvoiceButton bookingId={booking.booking_id} />
              )}
            </div>
          </div>
        </div>
      </div>

      {isCancellable && (
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
};

const BookingStatusBadge = ({ status }) => {
  const config = {
    confirmed: { text: "Confirmed", icon: CheckCircle, classes: "bg-green-100 text-green-800" },
    cancelled: { text: "Cancelled", icon: XCircle, classes: "bg-red-100 text-red-800" },
    default: { text: status, icon: Clock, classes: "bg-yellow-100 text-yellow-800" },
  };
  const { text, icon: Icon, classes } = config[status] || config.default;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </div>
  );
};
