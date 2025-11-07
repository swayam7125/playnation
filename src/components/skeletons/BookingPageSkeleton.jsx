import React from "react";
import Skeleton from "../common/Skeleton";

export default function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-8">
        {/* Title */}
        <div>
          <Skeleton className="h-8 w-1/3 mb-3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        {/* Venue & Facility Info */}
        <div className="flex items-center gap-6">
          <Skeleton className="h-28 w-28 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        {/* Payment Section */}
        <div className="border-t pt-6">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg mt-3" />
        </div>
      </div>
    </div>
  );
}
