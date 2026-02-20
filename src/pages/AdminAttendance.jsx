// Administrative Attendance Records Directory
import React, { useState, useEffect } from 'react';
import { getAttendanceStore, deleteAttendanceRecord } from '../utils/attendanceStore';
import { formatAadhaar } from '../utils/manpowerStore';

const AdminAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [filterRole, setFilterRole] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [attendance, setAttendance] = useState([]);

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"role": "superadmin"}');

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = () => {
        const allLogs = getAttendanceStore();
        setAttendance(allLogs.filter(r => r.date === selectedDate));
    };

    const handleDelete = (id) => {
        if (window.confirm('PERMANENTLY DELETE this attendance record? This action is irreversible.')) {
            deleteAttendanceRecord(id);
            loadData();
        }
    };

    const filteredData = attendance.filter(r => {
        const roleMatch = filterRole === 'All' || r.role === filterRole;
        const nameMatch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        return roleMatch && nameMatch;
    });

    const supervisors = filteredData.filter(r => r.role === 'Supervisor');
    const labours = filteredData.filter(r => r.role === 'Labour');

    const AttendanceSummary = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {[
                { label: 'Total Present', val: filteredData.filter(r => r.status === 'Present').length, color: 'emerald', icon: 'fa-check-circle' },
                { label: 'Half Days', val: filteredData.filter(r => r.status === 'Half Day').length, color: 'amber', icon: 'fa-adjust' },
                { label: 'Total Absent', val: filteredData.filter(r => r.status === 'Absent').length, color: 'rose', icon: 'fa-times-circle' },
                { label: 'Records Logged', val: filteredData.length, color: 'blue', icon: 'fa-list-ul' },
            ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-800">{stat.val}</p>
                    </div>
                    <div className={`text-${stat.color}-500 text-lg sm:text-xl opacity-20`}>
                        <i className={`fas ${stat.icon}`}></i>
                    </div>
                </div>
            ))}
        </div>
    );

    const RecordsTable = ({ data, title }) => (
        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm mb-6 sm:mb-10 overflow-hidden">
            <div className="bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider m-0">{title}</h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase">Count: {data.length}</span>
            </div>
            
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-slate-100">
                {data.map((r) => (
                    <div key={r.id} className="p-3 sm:p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 leading-tight text-sm truncate">{r.name}</p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 tracking-tighter truncate">{r.projectName}</p>
                            </div>
                            <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${r.status === 'Present' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                r.status === 'Absent' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                    'bg-amber-50 border-amber-100 text-amber-700'
                            }`}>
                                {r.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <i className="fas fa-clock text-[10px] text-slate-400"></i>
                                <span>{r.inTime || '--:--'}</span>
                                <span className="text-slate-300 text-[9px]">-</span>
                                <span>{r.outTime || '--:--'}</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                                <i className="fas fa-fingerprint text-[9px]"></i>
                                {formatAadhaar(r.aadhaarNumber)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>By: {r.markedBy}</span>
                            <span>{new Date(r.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                        {r.remarks && <p className="text-[10px] text-slate-400 italic line-clamp-1">"{r.remarks}"</p>}
                        {currentUser.role === 'superadmin' && (
                            <button
                                onClick={() => handleDelete(r.id)}
                                className="w-full mt-2 px-3 py-2 text-rose-500 bg-rose-50 border border-rose-100 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                            >
                                <i className="fas fa-trash-alt"></i> Delete Record
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-4 lg:px-6 py-3 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px] tracking-widest">Worker Details</th>
                            <th className="px-4 lg:px-6 py-3 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px] tracking-widest text-center">Status</th>
                            <th className="px-4 lg:px-6 py-3 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px] tracking-widest">In/Out Time</th>
                            <th className="px-4 lg:px-6 py-3 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px] tracking-widest">Identity (Aadhaar)</th>
                            <th className="px-4 lg:px-6 py-3 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px] tracking-widest">Logging Details</th>
                            {currentUser.role === 'superadmin' && <th className="px-4 lg:px-6 py-3 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px] tracking-widest text-right">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-4 lg:px-6 py-4">
                                    <p className="font-semibold text-slate-800 leading-tight">{r.name}</p>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 tracking-tighter">{r.projectName}</p>
                                </td>
                                <td className="px-4 lg:px-6 py-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${r.status === 'Present' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                        r.status === 'Absent' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                            'bg-amber-50 border-amber-100 text-amber-700'
                                    }`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-4 lg:px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <span className="text-xs">{r.inTime || '--:--'}</span>
                                        <span className="text-slate-300 text-[10px] tracking-tighter">TO</span>
                                        <span className="text-xs">{r.outTime || '--:--'}</span>
                                    </div>
                                    {r.remarks && <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1">"{r.remarks}"</p>}
                                </td>
                                <td className="px-4 lg:px-6 py-4 font-mono text-xs text-slate-400">
                                    <div className="flex items-center gap-1.5 opacity-60">
                                        <i className="fas fa-fingerprint text-[10px]"></i>
                                        {formatAadhaar(r.aadhaarNumber)}
                                    </div>
                                </td>
                                <td className="px-4 lg:px-6 py-4">
                                    <p className="text-xs text-slate-500"><span className="font-semibold uppercase text-[9px] text-slate-400">By:</span> {r.markedBy}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{new Date(r.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                </td>
                                {currentUser.role === 'superadmin' && (
                                    <td className="px-4 lg:px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-all active:scale-95 group-hover:opacity-100 opacity-20"
                                            title="Delete Record"
                                        >
                                            <i className="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto bg-slate-50 min-h-screen font-sans animate-in slide-in-from-bottom-5 duration-700">
            {/* Header / Filter Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 m-0 tracking-tight">Workforce Attendance Log</h1>
                        <p className="text-slate-500 text-[10px] sm:text-xs tracking-normal">Corporate oversight for daily project-wise attendance logs</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                        <div className="flex flex-col min-w-[130px] sm:min-w-0">
                            <label className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Report Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col min-w-[120px] sm:min-w-[160px]">
                            <label className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Role Type</label>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm outline-none appearance-none"
                            >
                                <option value="All">All Workers</option>
                                <option value="Supervisor">Supervisors Only</option>
                                <option value="Labour">Labours Only</option>
                            </select>
                        </div>
                        <div className="flex flex-col grow min-w-[150px] sm:min-w-[200px]">
                            <label className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Quick Search</label>
                            <div className="relative">
                                <i className="fas fa-search absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] sm:text-xs"></i>
                                <input
                                    type="text"
                                    placeholder="Employee name or project..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 px-7 sm:px-9 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AttendanceSummary />

            {(filterRole === 'All' || filterRole === 'Supervisor') && (
                <RecordsTable data={supervisors} title="Supervisors Daily Sheet" />
            )}

            {(filterRole === 'All' || filterRole === 'Labour') && (
                <RecordsTable data={labours} title="Skilled & Unskilled Labours Daily Sheet" />
            )}

            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 sm:py-40 bg-white border border-slate-200 border-dashed rounded-xl sm:rounded-2xl">
                    <i className="fas fa-calendar-times text-slate-100 text-4xl sm:text-6xl mb-3 sm:mb-4"></i>
                    <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest text-center px-4">No matching logs found for {selectedDate}</p>
                </div>
            )}

            <div className="pb-6 sm:pb-10"></div>
        </div>
    );
};

export default AdminAttendance;
