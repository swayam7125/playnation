import React from "react";
import Skeleton from "../common/Skeleton";

export default function MyBookingsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-8 w-1/4 mb-8" />

        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
