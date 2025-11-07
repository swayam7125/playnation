
import React from 'react';

const SkeletonKpiCard = () => (
  <div className="bg-white border border-border-color rounded-2xl p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
    <div className="space-y-2">
      <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-1/4 h-3 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const SkeletonSectionCard = ({ children }) => (
  <div className="bg-white border border-border-color rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-6">
      <div className="w-1 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse"></div>
    </div>
    {children}
  </div>
);

const SkeletonActivityItem = () => (
  <div className="flex items-center gap-4 p-3">
    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    <div className="flex-1 space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/40 animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-1/4 h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="w-1/3 h-4 bg-gray-200 rounded ml-5"></div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonKpiCard key={i} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SkeletonSectionCard>
            <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
          </SkeletonSectionCard>
          <SkeletonSectionCard>
            <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
          </SkeletonSectionCard>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SkeletonSectionCard>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonActivityItem key={i} />
              ))}
            </div>
          </SkeletonSectionCard>
          <SkeletonSectionCard>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonActivityItem key={i} />
              ))}
            </div>
          </SkeletonSectionCard>
          <SkeletonSectionCard>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonActivityItem key={i} />
              ))}
            </div>
          </SkeletonSectionCard>
        </div>

        {/* Pending Venues Section */}
        <SkeletonSectionCard>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </SkeletonSectionCard>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
