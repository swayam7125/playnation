import React from 'react';

/**
 * Reusable component for displaying key performance indicators (KPIs) or summary statistics.
 * @param {object} props
 * @param {string} props.title - The title of the metric.
 * @param {number|string} props.count - The value of the metric.
 * @param {React.Component} props.icon: Icon - The React icon component to display.
 * @param {string} props.bgColor - Tailwind CSS class for the icon's background color (e.g., 'bg-yellow-500').
 * @param {string} props.textColor - Tailwind CSS class for the icon's text color (e.g., 'text-yellow-500').
 */
function StatsCard({ title, count, icon: Icon, bgColor, textColor }) {
    return (
        <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`${bgColor} p-3 rounded-xl`}>
                    <Icon className={`text-xl ${textColor}`} />
                </div>
            </div>
        </div>
    );
}

export default StatsCard;