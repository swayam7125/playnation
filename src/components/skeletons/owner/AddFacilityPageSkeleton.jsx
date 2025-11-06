import React from "react";
import Skeleton from "../../common/Skeleton";

export default function AddFacilityPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/3 mb-10" />

        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}

          {/* Amenities Section */}
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
