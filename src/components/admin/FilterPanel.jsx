// src/components/admin/FilterPanel.jsx

import React from "react";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

function FilterPanel({ filters, onFilterChange, monthOptions }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-medium-text mb-1">
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="appearance-none w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-medium-text mb-1">
            Payment Status
          </label>
          <div className="relative">
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleInputChange}
              className="appearance-none w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent cursor-pointer"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-medium-text mb-1">
            Month
          </label>
          <div className="relative">
            <select
              name="month"
              value={filters.month}
              onChange={handleInputChange}
              className="appearance-none w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent cursor-pointer"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;