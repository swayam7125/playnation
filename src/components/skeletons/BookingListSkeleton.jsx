import React from "react";
import Skeleton from "../common/Skeleton";

export default function BookingListSkeleton({ rows = 3 }) {
  return (
    <div className="animate-fadeIn space-y-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-200 pb-4"
        >
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
  );
}
