// src/components/admin/FilterPanel.jsx

import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const FilterPanel = ({ filters, onFiltersChange, onClear, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="bg-card-bg border border-border-color rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-text flex items-center">
                    <FaFilter className="mr-2 text-primary-green" />
                    Filters
                </h3>
                <button
                    onClick={onClear}
                    className="text-sm text-light-text hover:text-medium-text flex items-center space-x-1 hover:bg-hover-bg px-2 py-1 rounded-lg transition-all duration-200"
                >
                    <FaTimes className="text-xs" />
                    <span>Clear All</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                        className="w-full p-2.5 bg-hover-bg border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
                    >
                        <option value="">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">Payment Status</label>
                    <select
                        value={filters.paymentStatus}
                        onChange={(e) => onFiltersChange({ ...filters, paymentStatus: e.target.value })}
                        className="w-full p-2.5 bg-hover-bg border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
                    >
                        <option value="">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                        <option value="pending_refund">Pending Refund</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">Date From</label>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                        className="w-full p-2.5 bg-hover-bg border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">Date To</label>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                        className="w-full p-2.5 bg-hover-bg border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;