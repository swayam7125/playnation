// src/components/admin/VenueDetailsModal.jsx
import React from "react";
import {
  FaTimes,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const VenueDetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3 border-b border-border-color-light">
    <Icon className="text-primary-green mt-1.5" />
    <div>
      <p className="text-sm text-medium-text">{label}</p>
      <p className="text-dark-text font-medium">{value}</p>
    </div>
  </div>
);

const VenueDetailsModal = ({ venue, onClose }) => {
  if (!venue) return null;

  const owner = venue.owner_id;
  const isApproved = venue.is_approved;
  const isDeclined = !isApproved && venue.rejection_reason;

  const statusConfig = isApproved
    ? {
        color: "text-primary-green-dark",
        text: "Approved",
        icon: FaCheckCircle,
      }
    : isDeclined
    ? { color: "text-red-700", text: "Restricted", icon: FaTimesCircle }
    : { color: "text-yellow-700", text: "Pending Review", icon: FaClock };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-color-light sticky top-0 bg-card-bg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-dark-text">Venue Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-hover-bg transition-colors"
            >
              <FaTimes className="text-medium-text" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-dark-text mb-2">
              {venue.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-medium-text">
              <FaMapMarkerAlt className="text-xs" />
              <span>
                {venue.address}, {venue.city}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 md:col-span-2">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  isApproved
                    ? "bg-light-green-bg border-primary-green/20"
                    : isDeclined
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <StatusIcon className={`text-2xl ${statusConfig.color}`} />
                <div>
                  <p className={`font-semibold ${statusConfig.color}`}>
                    {statusConfig.text}
                  </p>
                  <p className="text-sm text-medium-text">
                    Current status of the venue
                  </p>
                </div>
              </div>
            </div>

            <VenueDetailRow
              icon={FaBuilding}
              label="Venue ID"
              value={venue.venue_id}
            />
            <VenueDetailRow
              icon={FaUser}
              label="Owner"
              value={owner?.username || owner?.email}
            />
            <VenueDetailRow
              icon={FaClock}
              label="Date Added"
              value={new Date(venue.created_at).toLocaleString()}
            />
            <VenueDetailRow
              icon={FaMapMarkerAlt}
              label="Category"
              value={venue.category || "Not specified"}
            />

            {isDeclined && (
              <div className="md:col-span-2 mt-2">
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Restriction Reason:
                  </p>
                  <p className="text-sm text-red-700">
                    {venue.rejection_reason}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t border-border-color-light sticky bottom-0 bg-card-bg z-10">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary-green hover:bg-primary-green-dark text-white font-medium rounded-xl transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsModal;
