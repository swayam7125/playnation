// src/components/reviews/ReviewModal.jsx

import React from "react";
import { X } from "lucide-react";
import ReviewForm from "./ReviewForm"; // We will create this next

const ReviewModal = ({ isOpen, onClose, booking, onReviewSubmitted }) => {
  if (!isOpen) return null;

  const { facilities } = booking;
  const { name: facilityName } = facilities;
  const { name: venueName } = facilities.venues;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        {/* --- Modal Header --- */}
        <div className="flex items-start justify-between p-6 border-b border-border-color">
          <div>
            <h3 className="text-xl font-bold text-dark-text">Write a Review</h3>
            <p className="mt-1 text-sm text-medium-text">
              Share your experience at{" "}
              <span className="font-semibold text-dark-text">{venueName}</span> (
              {facilityName})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-light-text transition hover:bg-hover-bg hover:text-dark-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- Modal Body --- */}
        <div className="p-6">
          <ReviewForm
            booking={booking}
            onSuccess={onReviewSubmitted}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;