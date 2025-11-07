import React from 'react';

const SkeletonStatsCard = () => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-2">
        <div className="w-2/3 h-5 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
      </div>
      <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

const SkeletonVenueCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 space-y-3">
        <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-28 h-7 bg-gray-300 rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="px-6 py-4 mt-4 bg-gray-100 border-t border-gray-200">
        <div className="flex gap-3">
            <div className="w-full h-11 bg-gray-300 rounded-xl"></div>
            <div className="w-16 h-11 bg-gray-300 rounded-xl"></div>
        </div>
    </div>
  </div>
);

const AdminVenueManagementPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="w-1/3 h-10 bg-gray-300 rounded mb-3"></div>
          <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <SkeletonStatsCard key={i} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full max-w-md h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-40 h-6 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonVenueCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminVenueManagementPageSkeleton;
