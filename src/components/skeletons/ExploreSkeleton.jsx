// src/components/skeletons/ExploreSkeleton.jsx
import React from "react";
import Skeleton from "../common/Skeleton";

export default function ExploreSkeleton() {
  return (
    <div className="px-6 py-8 space-y-8">
      {/* Top Filters / Search Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      {/* Venue Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
