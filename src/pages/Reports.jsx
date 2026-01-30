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
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Reports</h1>
                    <p className="text-gray-500 mt-1">Comprehensive analysis and automated reporting</p>
                </div>
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                    {['This Week', 'This Month', 'This Quarter', 'Last Year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${dateRange === range
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpiStats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <i className={stat.icon}></i>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' :
                                    stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                <i className={`fas fa-arrow-${stat.trend === 'neutral' ? 'right' : stat.trend} mr-1`}></i>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Visual Chart Placeholder - Financial Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Distribution</h3>
                    <div className="flex flex-col gap-6">
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

                    <button className="w-full mt-8 py-3 rounded-xl border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold text-xs uppercase tracking-wider transition-all">
                        View Detailed Financials
                    </button>
                </div>

                {/* Project Health Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Project Health Monitoring</h3>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">View All Projects</button>
                    </div>
                    <div className="overflow-x-auto">
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
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Available Reports</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20">
                            <i className="fas fa-plus mr-2"></i> Generate New
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
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
