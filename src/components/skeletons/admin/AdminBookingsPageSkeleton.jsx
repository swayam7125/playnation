import React from 'react';

const SkeletonStatCard = () => (
  <div className="bg-gray-200 p-4 rounded-2xl animate-pulse">
    <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
    <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
  </div>
);

const SkeletonTableRow = () => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
    </td>
  </tr>
);

const AdminBookingsPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="mb-6">
        <div className="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="w-72 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[...Array(8)].map((_, i) => (
                  <th key={i} scope="col" className="px-6 py-4">
                    <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(10)].map((_, i) => (
                <SkeletonTableRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPageSkeleton;
