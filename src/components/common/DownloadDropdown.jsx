import React, { useState, useRef, useEffect } from 'react';
import { FaDownload, FaFilePdf, FaFileCsv } from 'react-icons/fa';

const DownloadDropdown = ({ onSelect, isDownloading }) => {
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

  const handleSelect = (format) => {
    setIsOpen(false);
    onSelect(format);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-green/30 hover:-translate-y-0.5 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <FaDownload />
        <span>{isDownloading ? 'Downloading...' : 'Download Report'}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-border-color-light">
          <div className="p-2">
            <button
              onClick={() => handleSelect('pdf')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-dark-text hover:bg-hover-bg rounded-md"
            >
              <FaFilePdf className="text-red-500" />
              <span>Download as PDF</span>
            </button>
            <button
              onClick={() => handleSelect('csv')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-dark-text hover:bg-hover-bg rounded-md"
            >
              <FaFileCsv className="text-green-500" />
              <span>Download as CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;
