import React from "react";
import { useNavigate } from "react-router-dom";

// Use a default export again to match the corrected import in HomePage.jsx
export default function CategoryCard({ category }) { // Changed to default export for consistency
  const navigate = useNavigate();

  // This function will navigate to the explore page with the sport ID as a URL parameter
  const handleCategoryClick = () => {
    navigate(`/explore?sportId=${category?.sport_id}`);
  };

  if (!category) {
    return null;
  }

  return (
    <div
      className="sport-card flex flex-col items-center gap-3 p-6 border border-border-color rounded-xl bg-card-bg cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary-green"
      onClick={handleCategoryClick}
    >
      <div className="w-16 h-16 rounded-lg bg-light-green-bg flex items-center justify-center">
        <img
          src={category.image || "https://via.placeholder.com/40"}
          alt={`${category.name} icon`}
          className="w-8 h-8 object-contain"
        />
      </div>
      <span className="font-semibold text-sm text-medium-text text-center">
        {category.name}
      </span>
    </div>
  );
}