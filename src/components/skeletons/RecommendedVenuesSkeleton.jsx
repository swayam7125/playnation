import React from "react";
import Skeleton from "../common/Skeleton";

export default function RecommendedVenuesSkeleton({ cards = 3 }) {
  return (
    <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
