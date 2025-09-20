import React from "react";
import { FaTicketAlt } from "react-icons/fa";

function OfferCard({ offer }) {
  const { title, description, discount_percentage } = offer;

  return (
    <div className="bg-light-green-bg border-2 border-dashed border-primary-green rounded-2xl p-6 flex items-center gap-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="text-primary-green">
        <FaTicketAlt size={48} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-dark-text">{title}</h3>
        {description && <p className="text-medium-text mt-1">{description}</p>}
      </div>
      {discount_percentage && (
        <div className="text-right">
          <p className="text-4xl font-bold text-primary-green-dark">
            {discount_percentage}%
          </p>
          <p className="font-semibold text-primary-green">OFF</p>
        </div>
      )}
    </div>
  );
}

export default OfferCard;
