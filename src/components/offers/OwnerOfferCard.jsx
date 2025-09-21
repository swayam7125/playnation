// src/components/offers/OwnerOfferCard.jsx
import React from "react";
import {
  FaEdit,
  FaTrash,
  FaTag,
  FaCalendarCheck,
  FaCalendarTimes,
  FaClock,
  FaInfinity,
  FaGlobe,
} from "react-icons/fa";

const OfferStatus = ({ from, until }) => {
  const now = new Date();
  const startDate = new Date(from);
  const endDate = until ? new Date(until) : null;

  let status = {
    text: "Expired",
    color: "bg-red-100 text-red-700",
    icon: <FaCalendarTimes />,
  };
  if (endDate && now > endDate) {
    status = {
      text: "Expired",
      color: "bg-red-100 text-red-700",
      icon: <FaCalendarTimes />,
    };
  } else if (now < startDate) {
    status = {
      text: "Scheduled",
      color: "bg-blue-100 text-blue-700",
      icon: <FaClock />,
    };
  } else {
    status = {
      text: "Active",
      color: "bg-green-100 text-green-700",
      icon: <FaCalendarCheck />,
    };
  }

  return (
    <div
      className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${status.color}`}
    >
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
};

const OwnerOfferCard = ({ offer, onEdit, onDelete, profile }) => {
  const applicableSports = offer.applies_to_all_sports
    ? [{ name: "All Sports", icon: <FaInfinity className="text-blue-500" /> }]
    : offer.offer_sports.map((os) => ({ name: os.sports.name, icon: null }));

  // --- PERMISSION LOGIC ---
  // A user can manage an offer if:
  // 1. They are an admin AND the offer is global (no venue_id).
  // 2. They are a venue owner (the page logic already ensures they only see their own offers).
  const canManage =
    (profile?.role === "admin" && !offer.venue_id) ||
    profile?.role === "venue_owner";

  return (
    <div className="bg-card-bg border border-border-color rounded-xl shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <OfferStatus from={offer.valid_from} until={offer.valid_until} />
          {/* --- CONDITIONAL BUTTONS --- */}
          {canManage && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(offer)}
                className="p-2 text-medium-text hover:text-blue-500 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(offer.offer_id)}
                className="p-2 text-medium-text hover:text-red-500 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-dark-text">{offer.title}</h3>
        <p className="text-2xl font-bold text-primary-green my-2">
          {offer.discount_percentage}% OFF
        </p>
        <p className="text-medium-text text-sm mb-4 min-h-[40px]">
          {offer.description}
        </p>

        <div>
          <h4 className="text-xs font-bold text-light-text mb-2">
            APPLIES TO:
          </h4>
          <div className="flex flex-wrap gap-2">
            {applicableSports.map((sport, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background text-xs text-medium-text font-semibold px-3 py-1 rounded-full border border-border-color"
              >
                {sport.icon}
                <span>{sport.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border-color pt-4 mt-4">
        {offer.is_global ? (
          <p className="flex items-center gap-2 text-xs text-light-text">
            <FaGlobe className="text-blue-500" />
            <strong>Global Offer (Admin)</strong>
          </p>
        ) : (
          offer.venues && (
            <p className="text-xs text-light-text">
              <strong>Venue:</strong> {offer.venues.name}
            </p>
          )
        )}
        {offer.offer_code && (
          <p className="text-xs text-light-text mt-1">
            <strong>Code:</strong> {offer.offer_code}
          </p>
        )}
        <p className="text-xs text-light-text mt-1">
          <strong>Active:</strong>{" "}
          {new Date(offer.valid_from).toLocaleDateString()} to{" "}
          {offer.valid_until
            ? new Date(offer.valid_until).toLocaleDateString()
            : "No expiry"}
        </p>
      </div>
    </div>
  );
};

export default OwnerOfferCard;
