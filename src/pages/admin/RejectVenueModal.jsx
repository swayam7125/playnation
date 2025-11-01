// src/pages/admin/RejectVenueModal.jsx
import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const RejectVenueModal = ({ venue, isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    setError("");
    setLoading(true);
    
    // Calls the handleConfirmDecline function in the parent
    await onSubmit(reason); 
    
    setLoading(false);
    onClose(); // Close the modal on success
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-color">
          <div>
            <h3 className="text-xl font-bold text-dark-text">Confirm Rejection</h3>
            <p className="mt-1 text-sm text-medium-text">
              You are rejecting: <strong>{venue.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-light-text transition hover:bg-hover-bg hover:text-dark-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <div>
              <h4 className="font-semibold text-red-800">This action is final.</h4>
              <p className="mt-1 text-sm text-red-700">
                The venue will be deleted, and a notification with your reason will be sent to the owner.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="rejection_reason"
              className="mb-2 block text-sm font-semibold text-dark-text"
            >
              Reason for Rejection *
            </label>
            <textarea
              id="rejection_reason"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Photos are unclear, address is invalid..."
              className="w-full rounded-lg border border-border-color bg-background p-3 text-sm text-dark-text focus:border-primary-green focus:ring-1 focus:ring-primary-green"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        </div>
        
        {/* Footer with Buttons */}
        <div className="flex justify-end gap-3 p-6 bg-hover-bg border-t border-border-color-light rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border-2 border-border-color px-5 py-2.5 text-sm font-semibold text-medium-text transition hover:bg-card-bg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectVenueModal;