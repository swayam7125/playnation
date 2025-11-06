import React from "react";
import Skeleton from "../../common/Skeleton";

export default function ManageBookingsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-1/3 mb-8" />
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header filters */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>

          {/* Table headers */}
          <div className="grid grid-cols-5 gap-4 border-b border-gray-200 pb-4 mb-4">
            {["Venue", "Date", "Slot", "User", "Price"].map((_, i) => (
              <Skeleton key={i} className="h-5 w-20" />
            ))}
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100"
            >
              {Array.from({ length: 5 }).map((__, j) => (
                <Skeleton key={j} className="h-4 w-20" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
