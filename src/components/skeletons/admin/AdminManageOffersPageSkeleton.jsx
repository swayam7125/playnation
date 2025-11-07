import React from 'react';

const SkeletonOfferCard = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
    <div className="w-3/4 h-6 bg-gray-300 rounded mb-4"></div>
    <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
    <div className="w-1/3 h-4 bg-gray-300 rounded mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="w-24 h-8 bg-gray-300 rounded-lg"></div>
      <div className="flex gap-2">
        <div className="w-16 h-8 bg-gray-300 rounded-lg"></div>
        <div className="w-16 h-8 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const AdminManageOffersPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 animate-pulse">
      <div className="mb-4">
        <div className="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="w-64 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-40 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonOfferCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default AdminManageOffersPageSkeleton;
