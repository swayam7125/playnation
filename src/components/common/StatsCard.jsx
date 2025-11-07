import React from 'react';

function StatsCard({ title, count, icon: Icon, bgColor }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ${bgColor}`}>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20">
                <Icon className="w-full h-full" />
            </div>
            <div className="relative">
                <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
                <p className="text-4xl font-bold">{count}</p>
            </div>
        </div>
    );
}

export default StatsCard;