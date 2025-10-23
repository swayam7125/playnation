// src/components/bookings/CancelBookingModal.jsx

import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const CancelBookingModal = ({ booking, isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }
    setError("");
    setLoading(true);
    
    // onSubmit is the handleCancelBooking function from MyBookingsPage
    await onSubmit(booking.booking_id, reason); 
    
    setLoading(false);
    onClose(); // Close the modal on success
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-color">
          <div>
            <h3 className="text-xl font-bold text-dark-text">Confirm Cancellation</h3>
            <p className="mt-1 text-sm text-medium-text">
              For booking at {booking.facilities.venues.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-light-text transition hover:bg-hover-bg hover:text-dark-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Cancellation Policy */}
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-yellow-800">Cancellation Policy</h4>
              <p className="mt-1 text-sm text-yellow-700">
                Please note: All cancellations are final. As per our policy, 
                **no refund will be issued** for this cancellation.
              </p>
            </div>
          </div>

          {/* Reason Textbox */}
          <div>
            <label
              htmlFor="cancellation_reason"
              className="mb-2 block text-sm font-semibold text-dark-text"
            >
              Reason for Cancellation
            </label>
            <textarea
              id="cancellation_reason"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Change of plans, found another venue..."
              className="w-full rounded-lg border border-border-color bg-background p-3 text-sm text-dark-text focus:border-primary-green focus:ring-1 focus:ring-primary-green"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        </div>
        
        {/* Footer with Buttons */}
        <div className="flex justify-end gap-3 p-6 bg-hover-bg border-t border-border-color-light rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border-2 border-border-color px-5 py-2.5 text-sm font-semibold text-medium-text transition hover:bg-card-bg"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;