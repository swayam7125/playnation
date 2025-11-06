import React from "react";
import Skeleton from "../common/Skeleton";

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header/Title Area */}
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />

        {/* Filter/Controls Area */}
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>

        {/* Pagination/Footer Area */}
        <div className="flex justify-center mt-10">
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
