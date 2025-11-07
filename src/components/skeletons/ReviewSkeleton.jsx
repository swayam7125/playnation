import React from "react";
import Skeleton from "../common/Skeleton";

export default function ReviewSkeleton() {
  return (
    <div className="animate-fadeIn space-y-6">
      <Skeleton className="h-8 w-1/3 mb-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 border-b border-gray-200 pb-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      ))}
    </div>
  );
}
