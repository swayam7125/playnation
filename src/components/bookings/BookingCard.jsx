import React from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

// Helper to format date and time
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

function BookingCard({ booking }) {
  // Destructure for easier access
  const { facilities, start_time, total_amount } = booking;
  const venueName = facilities?.venues?.name || 'N/A';
  const facilityName = facilities?.name || 'N/A';
  const sportName = facilities?.sports?.name || 'N/A';

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <h4>{venueName}</h4>
        <span className="booking-status">{booking.status}</span>
      </div>
      <div className="booking-card-body">
        <p><FaTag /> <strong>{facilityName}</strong> ({sportName})</p>
        <p><FaCalendarAlt /> {formatDate(start_time)}</p>
        <p><FaClock /> {formatTime(start_time)}</p>
      </div>
      <div className="booking-card-footer">
        <span>Total Amount</span>
        <strong>₹{total_amount}</strong>
      </div>
    </div>
  );
}

export default BookingCard;