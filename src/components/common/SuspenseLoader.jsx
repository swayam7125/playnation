import React from 'react';

const SuspenseLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary-green"></div>
    </div>
  );
};

export default SuspenseLoader;
