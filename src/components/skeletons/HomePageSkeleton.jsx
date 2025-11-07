// src/components/skeletons/HomePageSkeleton.jsx
import React from "react";
import Skeleton from "../common/Skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="bg-background px-6 py-10 space-y-16 animate-fadeIn">
      {/* Hero Section Placeholder */}
      <section className="text-center py-12 space-y-4">
        <Skeleton className="h-10 w-1/3 mx-auto rounded-lg" />
        <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
        <div className="flex justify-center gap-4 mt-6">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Venues Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-56 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border border-gray-100 shadow-sm">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-5 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
