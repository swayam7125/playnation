import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ 
  options, 
  selectedValues, 
  onChange,
  loading = false,
  placeholder = 'Select options'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id) => {
    const newSelected = selectedValues.includes(id)
      ? selectedValues.filter(item => item !== id)
      : [...selectedValues, id];
    onChange(newSelected);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length <= 3) {
      return options
        .filter(option => selectedValues.includes(option.id))
        .map(option => option.name)
        .join(', ');
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-300"
      >
        <span className="text-gray-600 font-medium">
          {getDisplayText()}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading...
            </div>
          ) : (
            <div className="p-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className="flex items-center px-3 py-2 rounded hover:bg-light-green-bg/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.name}</span>
                </div>
              ))}
              {options.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No options available
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;