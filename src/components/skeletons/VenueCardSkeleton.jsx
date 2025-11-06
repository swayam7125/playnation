import React from "react";
import Skeleton from "../common/Skeleton";

export default function VenueCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 hover:shadow-md transition animate-fadeIn">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-lg" />
      
      {/* Venue Title */}
      <Skeleton className="h-5 w-3/4" />
      
      {/* Location */}
      <Skeleton className="h-4 w-1/2" />
      
      {/* Rating or Tags */}
      <div className="flex items-center gap-2 mt-2">
        <Skeleton className="h-4 w-10 rounded-full" />
        <Skeleton className="h-4 w-10 rounded-full" />
        <Skeleton className="h-4 w-10 rounded-full" />
      </div>
      
      {/* CTA Button */}
      <Skeleton className="h-8 w-full rounded-lg mt-3" />
    </div>
  );
}
