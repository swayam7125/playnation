// src/components/offers/HeroOfferBanner.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeroOfferBanner = ({ offer }) => {
  const [isCopied, setIsCopied] = useState(false);

  const defaultImageUrl =
    "https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/sign/offer-backgrounds/default-offer-bg.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85Y2RhMjljNy1hZWQ4LTQwNWItOTM4NC1mOWI1ZjE0OTRjOTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJvZmZlci1iYWNrZ3JvdW5kcy9kZWZhdWx0LW9mZmVyLWJnLnBuZyIsImlhdCI6MTc1ODQ1OTczMywiZXhwIjoxNzg5OTk1NzMzfQ.q_GPfQRmnX92g_TUf8QgY46T5oJOEU0NiigYTfeDBks";
  const imageUrl = offer.background_image_url || defaultImageUrl;

  const copyCodeToClipboard = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(offer.offer_code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center overflow-hidden shadow-lg h-80"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 text-white flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          {offer.discount_percentage}% OFF {offer.title}
        </h2>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          {offer.description}
        </p>
        <div className="flex gap-4">
          <button
            onClick={copyCodeToClipboard}
            disabled={isCopied}
            // THE FIX: Added min-w-[180px] to prevent resizing
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 shadow-md min-w-[180px] ${
              isCopied
                ? "bg-green-600 cursor-not-allowed"
                : "bg-primary-green hover:bg-primary-green-dark"
            }`}
          >
            {isCopied ? "Copied!" : `Code: ${offer.offer_code}`}
          </button>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-lg font-bold text-lg bg-white text-dark-text hover:bg-gray-200 transition-colors duration-300 shadow-md no-underline"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroOfferBanner;
