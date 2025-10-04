// src/components/bookings/BookingModal.jsx
import React, { useState } from "react";
import {
  FiX,
  FiUser,
  FiPhone,
  FiTag,
  FiFileText,
  FiClock,
} from "react-icons/fi";

const BookingModal = ({ slot, facility, onSave, onCancel }) => {
  const [bookingType, setBookingType] = useState("offline");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [price, setPrice] = useState(facility.hourly_rate || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingData = {
      facility_id: facility.facility_id,
      start_time: slot.start,
      end_time: slot.end,
      booking_type: bookingType,
      notes: notes,
      status: "confirmed",
      payment_status: bookingType === "offline" ? "paid" : "pending",
      total_amount: bookingType === "offline" ? parseFloat(price) : null,
      customer_name: bookingType === "offline" ? customerName : null,
      customer_phone: bookingType === "offline" ? customerPhone : null,
    };

    await onSave(bookingData);
    setIsSubmitting(false);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-border-color">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-dark-text">
              Block Slot for{" "}
              <span className="text-primary-green">{facility.name}</span>
            </h3>
            <button
              onClick={onCancel}
              className="text-light-text hover:text-dark-text"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="text-sm text-medium-text mt-2 flex items-center gap-2">
            <FiClock />
            <span>
              {formatTime(slot.start)} - {formatTime(slot.end)}
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex border border-border-color rounded-lg p-1 bg-background">
                <button
                  type="button"
                  onClick={() => setBookingType("offline")}
                  className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${
                    bookingType === "offline"
                      ? "bg-primary-green text-white shadow"
                      : "text-medium-text hover:bg-border-color-light"
                  }`}
                >
                  Offline Booking
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType("maintenance")}
                  className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${
                    bookingType === "maintenance"
                      ? "bg-yellow-500 text-white shadow"
                      : "text-medium-text hover:bg-border-color-light"
                  }`}
                >
                  Maintenance
                </button>
              </div>
            </div>
            {bookingType === "offline" ? (
              <div className="space-y-4">
                <div className="relative">
                  <FiUser className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
                <div className="relative">
                  <FiPhone className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="text"
                    placeholder="Customer Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
                <div className="relative">
                  <FiTag className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <FiFileText className="absolute top-4 left-3 text-light-text" />
                <textarea
                  placeholder="Reason for maintenance (e.g., Court cleaning)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                ></textarea>
              </div>
            )}
          </div>
          <div className="p-6 bg-background rounded-b-2xl flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-5 rounded-lg font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-5 rounded-lg font-semibold text-sm text-white disabled:opacity-50 ${
                bookingType === "offline"
                  ? "bg-primary-green hover:bg-primary-green-dark"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isSubmitting ? "Saving..." : "Confirm Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
