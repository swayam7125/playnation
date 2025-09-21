import React from 'react';
import { FaUsers, FaUserCircle, FaUserCog, FaUserShield, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Reusable component for displaying key performance indicators (KPIs) or summary statistics.
 * @param {object} props
 * @param {string} props.title - The title of the metric.
 * @param {number|string} props.count - The value of the metric.
 * @param {React.Component} props.icon: Icon - The React icon component to display.
 * @param {string} props.color - Tailwind CSS class for the icon's background/text color (e.g., 'bg-yellow-500').
 * @param {string} [props.bgColor] - Tailwind CSS class for the card's background color (default to 'bg-white').
 */
function StatsCard({ title, count, icon: Icon, color, bgColor = 'bg-white' }) {
    return (
        <div className={`${bgColor} rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`${color} p-3 rounded-xl`}>
                    <Icon className="text-xl text-white" />
                </div>
            </div>
        </div>
    );
}

export default StatsCard;