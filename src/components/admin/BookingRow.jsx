// src/components/admin/BookingRow.jsx

import React from 'react';
import { 
    FaUser, 
    FaEye,
    FaChevronDown,
    FaChevronUp,
    FaRedo,
    FaUndo
} from 'react-icons/fa';

const BookingRow = ({
  booking,
  onRefundAction,
  onViewDetails,
  isExpanded,
  onToggleExpand,
}) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusClasses = {
    confirmed: "bg-blue-100 text-blue-800 border border-blue-200",
    completed: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
  };

  const paymentStatusClasses = {
    paid: "bg-green-100 text-green-800 border border-green-200",
    refunded: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    pending_refund: "bg-orange-100 text-orange-800 border border-orange-200",
  };

  const user = booking.users || {};

  return (
    <>
      <tr className="border-b border-border-color-light hover:bg-light-green-bg transition-all duration-200 group">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleExpand(booking.booking_id)}
              className="text-light-text hover:text-primary-green transition-colors"
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div>
              <div className="text-sm font-bold text-dark-text">
                {booking.facilities.venues.name}
              </div>
              <div className="text-xs text-medium-text bg-hover-bg px-2 py-1 rounded-md inline-block mt-1">
                {booking.facilities.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-green-light rounded-full flex items-center justify-center">
              <FaUser className="text-primary-green text-xs" />
            </div>
            <div>
              <div className="text-sm font-semibold text-dark-text">
                {user.username || "-"}
              </div>
              <div className="text-xs text-light-text">
                {user.email || "User Deleted"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="bg-hover-bg rounded-lg p-2 text-center">
            <div className="text-sm font-semibold text-dark-text">
              {formatDate(booking.start_time)}
            </div>
            <div className="text-xs text-medium-text">
              {formatTime(booking.start_time)}
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-lg font-bold text-primary-green">
            ₹{booking.total_amount}
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${
              statusClasses[booking.status]
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${
              paymentStatusClasses[booking.payment_status]
            }`}
          >
            {booking.payment_status.replace("_", " ").charAt(0).toUpperCase() +
              booking.payment_status.replace("_", " ").slice(1)}
          </span>
        </td>

        {/* --- CANCELLATION REASON CELL --- */}
        <td className="px-6 py-4">
          <div
            className="max-w-xs truncate text-sm text-medium-text"
            title={booking.cancellation_reason}
          >
            {booking.status === "cancelled"
              ? booking.cancellation_reason || "-"
              : "-"}
          </div>
        </td>
        {/* --- END OF CHANGE --- */}

        <td className="px-6 py-4 text-right">
          <div className="flex items-center gap-2 justify-end transition-opacity duration-200">
            <button
              onClick={() => onViewDetails(booking)}
              className="p-2 text-primary-green hover:bg-primary-green hover:text-white rounded-lg transition-all duration-200"
              title="View Details"
            >
              <FaEye />
            </button>
            {booking.status === "cancelled" &&
              booking.payment_status === "paid" && (
                <button
                  onClick={() => onRefundAction(booking.booking_id, "refunded")}
                  className="p-2 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all duration-200"
                  title="Approve Refund"
                >
                  <FaRedo />
                </button>
              )}
            {booking.payment_status === "refunded" && (
              <button
                onClick={() => onRefundAction(booking.booking_id, "paid")}
                className="p-2 text-yellow-600 hover:bg-yellow-600 hover:text-white rounded-lg transition-all duration-200"
                title="Revert Refund"
              >
                <FaUndo />
              </button>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-light-green-bg">
          <td colSpan="8" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-light-text">Booking ID:</span>
                <span className="ml-2 font-mono bg-hover-bg px-2 py-1 rounded">
                  {booking.booking_id}
                </span>
              </div>
              <div>
                <span className="text-light-text">Created:</span>
                <span className="ml-2 text-medium-text">
                  {new Date(booking.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="md:text-right">
                <button
                  onClick={() => onViewDetails(booking)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-all duration-200"
                >
                  <FaEye /> View Full Details
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default BookingRow;