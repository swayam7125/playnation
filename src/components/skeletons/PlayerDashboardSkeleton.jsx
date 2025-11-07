import React from "react";
import Skeleton from "../common/Skeleton";

export default function PlayerDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <Skeleton className="h-7 w-1/4 mb-6" />
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Venues */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <Skeleton className="h-7 w-1/3 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
