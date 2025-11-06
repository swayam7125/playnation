import React from "react";
import Skeleton from "../common/Skeleton";

export default function VenueSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-fadeIn">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Banner Image */}
          <Skeleton className="h-96 w-full rounded-t-2xl" />

          {/* Venue Info */}
          <div className="p-8 space-y-6">
            <div>
              <Skeleton className="h-10 w-2/3 mb-4" />
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-5 w-1/4 mb-2" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <Skeleton className="h-5 w-3/4 mb-4" />

            <div className="flex flex-wrap gap-3 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>

          {/* Offers */}
          <div className="border-t border-gray-200 p-8">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="border-t border-gray-200 p-8">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-40 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Slots Section */}
          <div className="border-t border-gray-200 p-8">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-gray-200 p-8">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
