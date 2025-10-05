// src/components/reviews/ReviewModal.jsx

import React from 'react';
import ReviewForm from './ReviewForm'; // This uses your existing form
import Modal from '../common/Modal';   // This uses your existing generic modal

const ReviewModal = ({ booking, show, onClose, onReviewSubmitted }) => {
  if (!show) {
    return null;
  }

  // Defensive check to ensure data is available
  const venueName = booking?.facilities?.venues?.name || 'this venue';

  return (
    <Modal show={show} onClose={onClose} title={`Reviewing: ${venueName}`}>
      <div className="p-6">
        <ReviewForm
          bookingId={booking.booking_id}
          venueId={booking.facilities.venues.venue_id}
          userId={booking.user_id}
          onClose={onClose}
          onReviewSubmitted={onReviewSubmitted}
        />
      </div>
    </Modal>
  );
};

export default ReviewModal;