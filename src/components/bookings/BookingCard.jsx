import React from 'react';
import { FaCalendarAlt, FaClock, FaTag, FaEdit, FaCheckCircle } from 'react-icons/fa';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric'
});
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', {
  hour: 'numeric', minute: '2-digit', hour12: true
});

function BookingCard({ booking, isUpcoming = false, onCancel, onLeaveReview }) {
  const { facilities, start_time, end_time, total_amount, status, has_been_reviewed } = booking;
  const venueName = facilities?.venues?.name || 'Venue Not Found';
  const facilityName = facilities?.name || 'Facility Not Found';
  const sportName = facilities?.sports?.name || 'Sport Not Found';

  const statusClasses = {
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const statusClass = `booking-status ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
  
  const canReview = !isUpcoming && status === 'completed' && !has_been_reviewed;

  return (
    <div className={`bg-card-bg border border-border-color rounded-xl shadow-sm transition-all duration-300 ${status === 'cancelled' ? 'opacity-70' : 'hover:shadow-lg'}`}>
      <div className="booking-card-header p-4 border-b border-border-color flex justify-between items-center">
        <h4 className="font-bold text-lg text-dark-text">{venueName}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className="booking-card-body p-6 space-y-3">
        <p className="flex items-center gap-3 text-medium-text"><FaTag className="text-primary-green"/> <strong>{facilityName}</strong> ({sportName})</p>
        <p className="flex items-center gap-3 text-medium-text"><FaCalendarAlt className="text-primary-green"/> {formatDate(start_time)}</p>
        <p className="flex items-center gap-3 text-medium-text"><FaClock className="text-primary-green"/> {formatTime(start_time)} - {formatTime(end_time)}</p>
      </div>
      <div className="booking-card-footer p-4 bg-hover-bg border-t border-border-color flex justify-between items-center">
        <div>
          {isUpcoming && (
            <button onClick={onCancel} className="text-sm font-semibold text-red-600 hover:text-red-800 transition">
              Cancel Booking
            </button>
          )}
          {canReview && (
            <button onClick={onLeaveReview} className="flex items-center gap-2 text-sm font-semibold text-primary-green hover:text-primary-green-dark transition">
              <FaEdit /> Leave a Review
            </button>
          )}
          {has_been_reviewed && (
            <p className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <FaCheckCircle /> Review Submitted
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="block text-xs text-light-text">Total Amount</span>
          <strong className="text-lg text-dark-text">₹{total_amount}</strong>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;