import React from "react";
import VenueCardSkeleton from "./VenueCardSkeleton";

export default function FeaturedVenuesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
      {Array.from({ length: 4 }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  );
}