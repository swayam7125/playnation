import React from "react";
import Skeleton from "../../common/Skeleton";

export default function OwnerAnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-7 w-1/4 mb-6" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>

        {/* Bookings Trend */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-7 w-1/4 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        {/* Top Venues */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-7 w-1/3 mb-6" />
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
