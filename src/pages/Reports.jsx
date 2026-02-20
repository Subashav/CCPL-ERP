import React, { useState } from 'react';

const Reports = () => {
    const [dateRange, setDateRange] = useState('This Month');

    // Dummy Data
    const kpiStats = [
        { label: 'Total Expenditure', value: '₹ 1.2 Cr', change: '+12%', trend: 'up', icon: 'fas fa-wallet', color: 'blue' },
        { label: 'Active Projects', value: '8', change: '0%', trend: 'neutral', icon: 'fas fa-building', color: 'purple' },
        { label: 'Manpower Deployed', value: '142', change: '+8%', trend: 'up', icon: 'fas fa-hard-hat', color: 'orange' },
        { label: 'Pending Safety Issues', value: '3', change: '-2', trend: 'down', icon: 'fas fa-exclamation-triangle', color: 'red' }
    ];

    const generatedReports = [
        { id: 'RPT-001', name: 'Monthly Financial Summary - Jan 2026', type: 'Financial', date: 'Jan 31, 2026', format: 'PDF', size: '2.4 MB' },
        { id: 'RPT-002', name: 'Weekly Site Progress Report - Week 4', type: 'Operational', date: 'Jan 28, 2026', format: 'PDF', size: '1.8 MB' },
        { id: 'RPT-003', name: 'Material Inventory Audit', type: 'Inventory', date: 'Jan 25, 2026', format: 'XLSX', size: '850 KB' },
        { id: 'RPT-004', name: 'Manpower Attendance Log', type: 'HR', date: 'Jan 24, 2026', format: 'CSV', size: '420 KB' },
        { id: 'RPT-005', name: 'Safety Inspection Certificate', type: 'Safety', date: 'Jan 20, 2026', format: 'PDF', size: '3.1 MB' },
    ];

    const projectHealth = [
        { name: 'Skyline Residential Complex', progress: 75, status: 'On Track', budget: 82 },
        { name: 'Highway Extension - Phase 2', progress: 45, status: 'Delayed', budget: 55 },
        { name: 'Green Valley Mall', progress: 20, status: 'On Track', budget: 18 },
        { name: 'City Hospital Wing', progress: 90, status: 'Completed', budget: 95 },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-10">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Executive Reports</h1>
                <p className="text-gray-500 mt-0.5 sm:mt-1 text-sm">Comprehensive analysis and automated reporting</p>
            </div>
            
            {/* Date Range Tabs - Horizontal scroll on mobile */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 w-fit min-w-full sm:min-w-0 sm:w-auto">
                    {['This Week', 'This Month', 'This Quarter', 'Last Year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider transition-all whitespace-nowrap flex-1 sm:flex-none ${dateRange === range
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Grid - 2 columns on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                {kpiStats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-2 sm:mb-4">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg lg:text-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <i className={stat.icon}></i>
                            </div>
                            <span className={`text-[9px] sm:text-[10px] lg:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' :
                                    stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                <i className={`fas fa-arrow-${stat.trend === 'neutral' ? 'right' : stat.trend} mr-0.5 sm:mr-1`}></i>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-3xl font-black text-gray-900 mb-0.5 sm:mb-1">{stat.value}</h3>
                        <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500 leading-tight">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
                {/* Visual Chart Placeholder - Financial Distribution */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:col-span-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Budget Distribution</h3>
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Simple visual representation of budget breakdown */}
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                <span>Material Cost</span>
                                <span>45%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full w-[45%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                <span>Manpower</span>
                                <span>30%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full w-[30%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                <span>Equip. Rental</span>
                                <span>15%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full w-[15%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                <span>Overheads</span>
                                <span>10%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full w-[10%]"></div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-4 sm:mt-6 lg:mt-8 py-2.5 sm:py-3 rounded-xl border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all">
                        View Detailed Financials
                    </button>
                </div>

                {/* Project Health Table */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Project Health</h3>
                        <button className="text-blue-600 hover:text-blue-800 text-[10px] sm:text-xs font-bold uppercase">View All</button>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-3">
                        {projectHealth.map((proj, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-bold text-gray-800 leading-tight flex-1 pr-2">{proj.name}</p>
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase flex-shrink-0 ${proj.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            proj.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {proj.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div className={`h-full rounded-full ${proj.progress > 80 ? 'bg-green-500' : proj.progress < 50 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${proj.progress}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">{proj.progress}%</span>
                                </div>
                                <p className="text-[10px] text-gray-400">Budget: <span className="font-semibold text-gray-600">{proj.budget}%</span> used</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-4">Project Name</th>
                                    <th className="pb-4">Timeline</th>
                                    <th className="pb-4">Budget Utilized</th>
                                    <th className="pb-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {projectHealth.map((proj, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pr-4">
                                            <p className="text-sm font-bold text-gray-800">{proj.name}</p>
                                        </td>
                                        <td className="py-4 pr-4 w-1/3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div className={`h-full rounded-full ${proj.progress > 80 ? 'bg-green-500' : proj.progress < 50 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${proj.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 w-8">{proj.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 w-1/4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-600">{proj.budget}%</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Used</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${proj.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    proj.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {proj.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Generated Reports List */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Available Reports</h3>
                    <button className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20">
                        <i className="fas fa-plus mr-1 sm:mr-2"></i><span className="hidden xs:inline">Generate</span><span className="xs:hidden">New</span>
                    </button>
                </div>
                
                {/* Mobile Card View for Reports */}
                <div className="sm:hidden divide-y divide-gray-100">
                    {generatedReports.map((rpt) => (
                        <div key={rpt.id} className="p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${rpt.format === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                <i className={`fas ${rpt.format === 'PDF' ? 'fa-file-pdf' : 'fa-file-excel'}`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{rpt.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">{rpt.type}</span>
                                    <span className="text-[10px] text-gray-400">{rpt.date}</span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600 p-2">
                                <i className="fas fa-download"></i>
                            </button>
                        </div>
                    ))}
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Report Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {generatedReports.map((rpt) => (
                                <tr key={rpt.id} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-xl">
                                                <i className={`fas ${rpt.format === 'PDF' ? 'fa-file-pdf' : rpt.format === 'XLSX' || rpt.format === 'CSV' ? 'fa-file-excel text-green-500 bg-green-50' : 'fa-file-alt'}`}></i>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{rpt.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{rpt.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                                            {rpt.type}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-400 font-medium">{rpt.size}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        {rpt.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                                            <i className="fas fa-download text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
