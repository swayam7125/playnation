import React from 'react';

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center p-1 bg-gray-200 rounded-lg">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            value === option.value
              ? 'bg-white text-primary-green shadow'
              : 'text-gray-500 hover:bg-gray-300'
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
