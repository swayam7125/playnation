import React from "react";

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center p-1 bg-hover-bg rounded-xl border border-border-color-light">
      {options.map((option) => (
        <button
          key={option.value}
          type="button" // Add type="button" to prevent form submission
          onClick={() => onChange(option.value)}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            value === option.value
              ? "bg-white text-primary-green shadow-md"
              : "text-medium-text hover:bg-white/60"
          }`}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
