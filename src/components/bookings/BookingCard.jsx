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
  const statusClass = `py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider ${
    status === 'cancelled'
      ? 'bg-red-100 text-red-800 border border-red-200'
      : 'bg-light-green-bg text-emerald-800 border border-green-200'
  }`;

  return (
    <div className={`bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-md transition-all duration-300 ease-in-out border-l-4 ${status === 'cancelled' ? 'bg-gray-50 border-l-gray-400 opacity-80' : 'border-l-primary-green'} hover:-translate-y-0.5 hover:shadow-xl hover:border-primary-green`}>
      <div className="flex justify-between items-center p-4 sm:p-6 bg-hover-bg border-b border-border-color">
        <h4 className={`m-0 text-lg font-bold text-dark-text ${status === 'cancelled' ? 'line-through text-light-text' : ''}`}>{venueName}</h4>
        <span className={statusClass}>{status}</span>
      </div>
      <div className="p-8 grid gap-4">
        <p className="m-0 flex items-center gap-4 text-medium-text font-medium p-3 bg-hover-bg rounded-md"><FaTag /> <strong>{facilityName}</strong> ({sportName})</p>
        <p className="m-0 flex items-center gap-4 text-medium-text font-medium p-3 bg-hover-bg rounded-md"><FaCalendarAlt /> {formatDate(start_time)}</p>
        <p className="m-0 flex items-center gap-4 text-medium-text font-medium p-3 bg-hover-bg rounded-md"><FaClock /> {formatTime(start_time)} - {formatTime(end_time)}</p>
      </div>
      <div className="flex justify-between items-center py-6 px-8 bg-hover-bg border-t border-border-color font-bold text-dark-text">
        <span>Total Amount</span>
        <strong>₹{total_amount}</strong>
      </div>
      
      {/* Conditionally render the Cancel button only for upcoming bookings */}
      {isUpcoming && (
        <div className="p-4 sm:p-6 bg-card-bg border-t border-border-color-light flex justify-end">
          <button onClick={() => onCancel(booking_id)} className="py-3 px-6 border border-red-300 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 ease-in-out inline-flex items-center justify-center gap-2 no-underline whitespace-nowrap bg-red-100 text-red-700 hover:bg-red-700 hover:text-white hover:border-red-700">
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingCard;