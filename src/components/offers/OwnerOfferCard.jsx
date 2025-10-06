import React from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaCalendarAlt, FaTag } from "react-icons/fa";

const OwnerOfferCard = ({ offer, onEdit, onDelete, onToggle }) => {
  const {
    title,
    description,
    discount_percentage,
    valid_until,
    is_active,
    venues,
    is_global,
  } = offer;

  const cardClass = is_active
    ? "bg-white border-l-4 border-primary-green"
    : "bg-gray-50 border-l-4 border-gray-300 opacity-70";
  const statusText = is_active ? "Active" : "Inactive";
  const statusColor = is_active ? "text-green-600" : "text-gray-500";

  return (
    <div className={`rounded-lg shadow-md border border-border-color-light overflow-hidden flex flex-col h-full ${cardClass}`}>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-md text-dark-text pr-2">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              title="Edit Offer"
            >
              <FaEdit />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete Offer"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <p className="text-xs text-medium-text mb-3 line-clamp-2 h-[2.5em]">{description}</p>
        
        <div className="flex items-center gap-4 text-xs text-light-text mb-3">
          <div className="flex items-center gap-1 font-semibold text-primary-green bg-green-50 px-2 py-1 rounded">
            <FaTag />
            <span>{discount_percentage}% OFF</span>
          </div>
           <div className="flex items-center gap-1">
            <FaCalendarAlt />
            <span>
              {valid_until ? `Until ${new Date(valid_until).toLocaleDateString()}` : "No expiry"}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Applies to: <span className="font-medium text-gray-600">{is_global ? "All Venues (Global)" : venues?.name || 'Venue not specified'}</span>
        </div>
      </div>

      <div className="bg-gray-50/70 px-4 py-2 border-t border-border-color-light flex justify-between items-center">
        <span className={`text-xs font-semibold ${statusColor}`}>
          {statusText}
        </span>
        <button
          onClick={onToggle}
          className={`text-xl ${statusColor} hover:opacity-70 transition-opacity`}
          title={is_active ? "Deactivate Offer" : "Activate Offer"}
        >
          {is_active ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </div>
    </div>
  );
};

export default OwnerOfferCard;
