import React from "react";
import Skeleton from "../../common/Skeleton";

export default function ReportPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-40 rounded-lg" />
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md space-y-3"
            >
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>

        {/* Report Table */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
          <Skeleton className="h-7 w-1/3 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 border-b border-gray-100 py-3"
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
