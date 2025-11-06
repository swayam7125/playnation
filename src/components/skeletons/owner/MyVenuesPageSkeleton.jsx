import React from "react";
import Skeleton from "../../common/Skeleton";

export default function MyVenuesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-sm space-y-3 hover:shadow-md transition"
            >
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex justify-between mt-3">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
