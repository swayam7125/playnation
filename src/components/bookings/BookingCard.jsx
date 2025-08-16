import React from 'react';
import { FaCalendarAlt, FaClock, FaTag } from 'react-icons/fa';

// Helper function to format the date
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Helper function to format the time
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

function BookingCard({ booking, isUpcoming = false, onCancel }) {
  // Destructure all needed properties from the booking object
  const { facilities, start_time, end_time, total_amount, booking_id, status } = booking;

  // Safely access nested properties to prevent errors
  const venueName = facilities?.venues?.name || 'Venue Not Found';
  const facilityName = facilities?.name || 'Facility Not Found';
  const sportName = facilities?.sports?.name || 'Sport Not Found';

  // Dynamically create a class name based on the booking's status
  const statusClass = `booking-status ${status}`; // e.g., "booking-status cancelled"

  return (
    <div className={`booking-card ${status === 'cancelled' ? 'cancelled-card' : ''}`}>
      <div className="booking-card-header">
        <h4>{venueName}</h4>
        <span className={statusClass}>{status}</span>
      </div>
      <div className="booking-card-body">
        <p><FaTag /> <strong>{facilityName}</strong> ({sportName})</p>
        <p><FaCalendarAlt /> {formatDate(start_time)}</p>
        <p><FaClock /> {formatTime(start_time)} - {formatTime(end_time)}</p>
      </div>
      <div className="booking-card-footer">
        <span>Total Amount</span>
        <strong>₹{total_amount}</strong>
      </div>
      
      {/* Conditionally render the Cancel button only for upcoming bookings */}
      {isUpcoming && (
        <div className="booking-card-actions">
          <button onClick={() => onCancel(booking_id)} className="btn btn-danger">
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingCard;