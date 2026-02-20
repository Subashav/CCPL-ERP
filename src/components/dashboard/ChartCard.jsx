import React from 'react';

const ChartCard = ({ title, children, action, className = "" }) => {
    return (
        <div className={`bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.12)] transition-shadow duration-300 ${className}`}>
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-slate-50">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
                {action && <div>{action}</div>}
            </div>
            <div className="p-3 sm:p-4 md:p-6 flex-1 flex items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
