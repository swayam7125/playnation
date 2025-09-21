// src/components/offers/OfferCard.jsx
import React from "react";
import { FaTicketAlt } from "react-icons/fa";

const OfferCard = ({ offer }) => {
  return (
    // The main container is styled to match the banner's look and feel.
    <div className="bg-light-green-bg border border-primary-green/30 rounded-2xl p-6 h-44 flex flex-col items-center justify-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
      <FaTicketAlt className="text-primary-green text-2xl mb-3 opacity-80" />
      <h3 className="text-lg font-bold text-primary-green-dark leading-snug">
        {offer.title}
      </h3>
    </div>
  );
};

export default OfferCard;
