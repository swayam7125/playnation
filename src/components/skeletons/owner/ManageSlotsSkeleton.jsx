import React from "react";
import Skeleton from "../../common/Skeleton";

export default function ManageSlotsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-8 w-1/3 mb-8" />
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Filter controls */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>

          {/* Slot grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
