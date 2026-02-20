import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", className = "" }) => {
    // Enhanced color mapping with gradients and softer backgrounds
    const colorStyles = {
        blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
        green: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
        yellow: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
        red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
        navy: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200" },
        purple: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" }
    };

    const currentStyle = colorStyles[color] || colorStyles.blue;

    return (
        <div className={`bg-white rounded-xl p-4 md:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.12)] transition-all duration-300 border border-slate-100 group relative overflow-hidden ${className}`}>
            {/* Decorative background element */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 ${currentStyle.bg.replace('50', '500')}`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-slate-500 mb-1 md:mb-2 tracking-wide uppercase truncate">{title}</p>
                    <h3 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className={`p-2 md:p-3.5 rounded-lg md:rounded-xl ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} border shadow-sm group-hover:scale-110 transition-transform duration-300 ml-2 shrink-0`}>
                    {Icon && <Icon size={18} className="md:w-[22px] md:h-[22px]" strokeWidth={2} />}
                </div>
            </div>

            {trend && (
                <div className="mt-2 md:mt-4 flex items-center text-xs md:text-sm font-medium">
                    <span className={`flex items-center gap-1 px-1.5 md:px-2 py-0.5 rounded-md ${trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight size={12} className="md:w-[14px] md:h-[14px]" /> : <ArrowDownRight size={12} className="md:w-[14px] md:h-[14px]" />}
                        {trendValue}
                    </span>
                    <span className="text-slate-400 ml-1 md:ml-2 text-[10px] md:text-xs hidden sm:inline">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
