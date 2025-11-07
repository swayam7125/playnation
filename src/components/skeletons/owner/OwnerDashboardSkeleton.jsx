import React from "react";
import Skeleton from "../../common/Skeleton";

export default function OwnerDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-7 w-1/4 mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-gray-200 py-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
