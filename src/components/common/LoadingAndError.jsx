import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

// Error Component
export const ErrorState = ({ error, onRetry }) => (
    <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Bookings</h2>
            <p className="text-red-600 mb-4 text-sm">{error}</p>
            <div className="space-y-2">
                <button
                    onClick={onRetry}
                    className="w-full px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors duration-200"
                >
                    Retry Loading
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    </div>
);