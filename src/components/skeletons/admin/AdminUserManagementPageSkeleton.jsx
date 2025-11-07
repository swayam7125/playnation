import React from 'react';

const SkeletonStatsCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-pulse">
    <div className="w-1/2 h-5 bg-gray-300 rounded mb-3"></div>
    <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
  </div>
);

const SkeletonUserCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="space-y-2">
          <div className="w-32 h-5 bg-gray-300 rounded"></div>
          <div className="w-48 h-4 bg-gray-300 rounded"></div>
          <div className="w-40 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="space-y-2 items-end flex flex-col">
        <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
        <div className="w-20 h-5 bg-gray-300 rounded-full"></div>
      </div>
    </div>
    <div className="flex gap-3 mt-6">
        <div className="w-full h-11 bg-gray-300 rounded-xl"></div>
        <div className="w-16 h-11 bg-gray-300 rounded-xl"></div>
    </div>
  </div>
);

const AdminUserManagementPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="w-1/3 h-10 bg-gray-300 rounded mb-3"></div>
          <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <SkeletonStatsCard key={i} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full max-w-lg h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
              <div className="w-24 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-32 h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonUserCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPageSkeleton;
