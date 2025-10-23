// src/components/admin/BookingDetailModal.jsx
import React from "react";
import {
  FaRedo,
  FaUndo,
  FaCalendar,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

const BookingDetailModal = ({ booking, onClose, onRefundAction }) => {
  if (!booking) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColors = {
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentColors = {
    paid: "bg-green-50 text-green-700 border-green-200",
    refunded: "bg-yellow-50 text-yellow-700 border-yellow-200",
    pending_refund: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const user = booking.users || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-dark-text">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="text-light-text hover:text-dark-text text-xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-light-green-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaMapMarkerAlt className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">
                    Venue Information
                  </h3>
                </div>
                <p className="font-bold text-dark-text">
                  {booking.facilities.venues.name}
                </p>
                <p className="text-medium-text">{booking.facilities.name}</p>
              </div>

              <div className="bg-hover-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaUser className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">
                    User Information
                  </h3>
                </div>
                <p className="font-bold text-dark-text">
                  {user.username || "N/A"}
                </p>
                <p className="text-medium-text">
                  {user.email || "User Deleted"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-hover-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaCalendar className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">Booking Time</h3>
                </div>
                <p className="font-bold text-dark-text">
                  {formatDate(booking.start_time)}
                </p>
                <p className="text-medium-text">
                  {formatTime(booking.start_time)}
                </p>
              </div>

              <div className="bg-hover-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaCreditCard className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">Payment</h3>
                </div>
                <p className="font-bold text-2xl text-primary-green">
                  ₹{booking.total_amount}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div
              className={`px-4 py-2 rounded-full border ${
                statusColors[booking.status]
              } font-semibold`}
            >
              Status:{" "}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
            <div
              className={`px-4 py-2 rounded-full border ${
                paymentColors[booking.payment_status]
              } font-semibold`}
            >
              Payment:{" "}
              {booking.payment_status
                .replace("_", " ")
                .charAt(0)
                .toUpperCase() +
                booking.payment_status.replace("_", " ").slice(1)}
            </div>
          </div>
          
          {/* --- CANCELLATION REASON IN MODAL --- */}
          {booking.status === "cancelled" && booking.cancellation_reason && (
            <div className="mb-6">
              <h3 className="font-semibold text-dark-text mb-2">
                Cancellation Reason
              </h3>
              <p className="bg-hover-bg rounded-xl p-4 text-medium-text border border-border-color-light">
                {booking.cancellation_reason}
              </p>
            </div>
          )}
          {/* --- END OF CHANGE --- */}

          <div className="flex gap-3 pt-4 border-t border-border-color-light">
            {booking.status === "cancelled" &&
              booking.payment_status === "paid" && (
                <button
                  onClick={() => onRefundAction(booking.booking_id, "refunded")}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-green text-white rounded-xl hover:bg-primary-green-dark transition-all duration-200 font-medium"
                >
                  <FaRedo /> Approve Refund
                </button>
              )}
            {booking.payment_status === "refunded" && (
              <button
                onClick={() => onRefundAction(booking.booking_id, "paid")}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 font-medium"
              >
                <FaUndo /> Revert Refund
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-border-color text-medium-text rounded-xl hover:bg-border-color-light transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;