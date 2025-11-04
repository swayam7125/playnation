import React from 'react';

const Loader = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-green"></div>
      {text && <p className="mt-2 text-medium-text">{text}</p>}
    </div>
  );
};

export default Loader;
