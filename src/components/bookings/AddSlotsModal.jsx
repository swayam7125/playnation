// src/components/bookings/AddSlotsModal.jsx
import React, { useState } from "react";
import { FiX, FiClock, FiCalendar, FiPlus } from "react-icons/fi";
import { format, addDays } from "date-fns";

const AddSlotsModal = ({ facility, onSave, onCancel }) => {
  const [isBulk, setIsBulk] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(
    format(addDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("21:00");
  const [slotDuration, setSlotDuration] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      isBulk,
      date,
      startDate,
      endDate,
      startTime,
      endTime,
      slotDuration,
    });
    setIsSubmitting(false);
  };

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-border-color">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-dark-text">
              Add Slots for{" "}
              <span className="text-primary-green">{facility.name}</span>
            </h3>
            <button
              onClick={onCancel}
              className="text-light-text hover:text-dark-text"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="flex border border-border-color rounded-lg p-1 bg-background">
              <button
                type="button"
                onClick={() => setIsBulk(false)}
                className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${
                  !isBulk
                    ? "bg-primary-green text-white shadow"
                    : "text-medium-text hover:bg-border-color-light"
                }`}
              >
                Single Day
              </button>
              <button
                type="button"
                onClick={() => setIsBulk(true)}
                className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isBulk
                    ? "bg-primary-green text-white shadow"
                    : "text-medium-text hover:bg-border-color-light"
                }`}
              >
                Date Range (Bulk)
              </button>
            </div>

            {isBulk ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medium-text mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medium-text mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-medium-text mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-medium-text mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  step="3600"
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-medium-text mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  step="3600"
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                />
              </div>
            </div>
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
              className="py-2 px-5 rounded-lg font-semibold text-sm text-white bg-primary-green hover:bg-primary-green-dark disabled:opacity-50 flex items-center gap-2"
            >
              <FiPlus />
              {isSubmitting ? "Adding..." : "Add Slots"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSlotsModal;
