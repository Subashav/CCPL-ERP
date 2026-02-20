import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendanceLogs, deleteAttendanceLog } from '../utils/attendanceStore';

const AdminAttendanceRecords = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"role": "admin"}');

    useEffect(() => {
        setLogs(getAttendanceLogs());
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('PERMANENTLY DELETE this entire attendance group? This action is irreversible.')) {
            deleteAttendanceLog(id);
            setLogs(getAttendanceLogs());
        }
    };

    const filteredLogs = logs.filter(log => {
        const dateMatch = !filterDate || log.date === filterDate;
        const searchMatch =
            log.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.siteEngineerName.toLowerCase().includes(searchQuery.toLowerCase());
        return dateMatch && searchMatch;
    });

    const totalPresent = logs.reduce((acc, curr) => acc + curr.summary.present, 0);
    const totalAbsent = logs.reduce((acc, curr) => acc + curr.summary.absent, 0);
    const totalRecords = logs.length;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Project Attendance Records</h1>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Audit daily manpower attendance submissions</p>
                </div>
                <div className="flex gap-3 sm:gap-4">
                    <div className="bg-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submissions</span>
                        <span className="text-lg sm:text-xl font-black text-gray-800">{totalRecords}</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 mb-6 sm:mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto flex-1 overflow-x-auto scrollbar-hide">
                    <div className="relative w-full sm:max-w-sm">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm"></i>
                        <input
                            type="text"
                            placeholder="Search by project or engineer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                    <div className="bg-gray-100 h-8 w-px mx-2 hidden md:block"></div>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    onClick={() => { setFilterDate(''); setSearchQuery(''); }}
                    className="text-gray-400 hover:text-gray-600 font-bold text-[10px] sm:text-xs uppercase tracking-wide transition-colors px-3 sm:px-4 py-2 sm:py-2.5"
                >
                    <i className="fas fa-undo mr-1"></i> Reset Filters
                </button>
            </div>

            {/* Records List - Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {filteredLogs.map(log => (
                    <div
                        key={log.attendanceId}
                        className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm active:bg-blue-50/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/attendance/${log.attendanceId}`)}
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5 text-center min-w-[50px] shrink-0">
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                    {new Date(log.date).toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                                <div className="text-lg font-black text-gray-800 leading-none mt-0.5">
                                    {new Date(log.date).getDate()}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm line-clamp-1">{log.projectName}</p>
                                <p className="text-[10px] text-gray-400 font-mono">Ref: {log.attendanceId.split('-')[1]}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-[10px]">
                                        {log.siteEngineerName.charAt(0)}
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 truncate">{log.siteEngineerName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <span className="text-base font-black text-emerald-600 leading-none">{log.summary.present}</span>
                                    <span className="text-[8px] font-bold text-emerald-700/60 uppercase">Present</span>
                                </div>
                                <div className="flex flex-col items-center px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100">
                                    <span className="text-base font-black text-rose-600 leading-none">{log.summary.absent}</span>
                                    <span className="text-[8px] font-bold text-rose-700/60 uppercase">Absent</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="text-blue-600 font-bold text-[10px] uppercase tracking-wide flex items-center gap-1 px-2 py-1"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/attendance/${log.attendanceId}`); }}
                                >
                                    Details <i className="fas fa-arrow-right"></i>
                                </button>
                                {currentUser.role === 'SUPER_ADMIN' && (
                                    <button
                                        onClick={(e) => handleDelete(e, log.attendanceId)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-rose-100 text-rose-400 active:bg-rose-50 transition-all"
                                        title="Delete Record"
                                    >
                                        <i className="fas fa-trash-alt text-[10px]"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredLogs.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-xl">
                                <i className="fas fa-clipboard-check"></i>
                            </div>
                            <div>
                                <p className="text-gray-900 font-bold text-sm">No attendance records found</p>
                                <p className="text-gray-500 text-xs mt-1">Try adjusting your filters or search.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Records List - Desktop Table View */}
            <div className="hidden sm:block bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Date & Project</th>
                                <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Site Engineer</th>
                                <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Attendance Summary</th>
                                <th className="px-4 lg:px-6 py-4 lg:py-5 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLogs.map(log => (
                                <tr
                                    key={log.attendanceId}
                                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/admin/attendance/${log.attendanceId}`)}
                                >
                                    <td className="px-4 lg:px-6 py-4 lg:py-5 align-top">
                                        <div className="flex gap-3 lg:gap-4">
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 lg:px-3 py-1.5 lg:py-2 text-center min-w-[50px] lg:min-w-[60px]">
                                                <div className="text-[10px] lg:text-xs font-bold text-blue-600 uppercase tracking-wider">
                                                    {new Date(log.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                                <div className="text-lg lg:text-xl font-black text-gray-800 leading-none mt-0.5">
                                                    {new Date(log.date).getDate()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm line-clamp-1">{log.projectName}</p>
                                                <p className="text-[10px] lg:text-xs text-gray-400 font-mono mt-1">Ref: {log.attendanceId.split('-')[1]}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle">
                                        <div className="flex items-center gap-2.5 lg:gap-3">
                                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xs lg:text-sm">
                                                {log.siteEngineerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs lg:text-sm font-bold text-gray-800">{log.siteEngineerName}</p>
                                                <p className="text-[9px] lg:text-[10px] text-gray-400 font-medium">
                                                    Submitted: {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex flex-col items-center px-3 lg:px-4 py-1.5 lg:py-2 bg-emerald-50 rounded-lg border border-emerald-100 min-w-[60px] lg:min-w-[70px]">
                                                <span className="text-base lg:text-lg font-black text-emerald-600 leading-none">{log.summary.present}</span>
                                                <span className="text-[8px] lg:text-[9px] font-bold text-emerald-700/60 uppercase mt-0.5 lg:mt-1">Present</span>
                                            </div>
                                            <div className="flex flex-col items-center px-3 lg:px-4 py-1.5 lg:py-2 bg-rose-50 rounded-lg border border-rose-100 min-w-[60px] lg:min-w-[70px]">
                                                <span className="text-base lg:text-lg font-black text-rose-600 leading-none">{log.summary.absent}</span>
                                                <span className="text-[8px] lg:text-[9px] font-bold text-rose-700/60 uppercase mt-0.5 lg:mt-1">Absent</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2 lg:gap-3">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 font-bold text-[10px] sm:text-xs uppercase tracking-wide hover:underline opacity-80 group-hover:opacity-100 transition-all flex items-center gap-1"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/attendance/${log.attendanceId}`); }}
                                            >
                                                Details <i className="fas fa-arrow-right"></i>
                                            </button>
                                            {currentUser.role === 'SUPER_ADMIN' && (
                                                <button
                                                    onClick={(e) => handleDelete(e, log.attendanceId)}
                                                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg bg-white border border-rose-100 text-rose-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all shadow-sm"
                                                    title="Delete Record"
                                                >
                                                    <i className="fas fa-trash-alt text-[10px] lg:text-xs"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-4 lg:px-6 py-12 lg:py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 lg:gap-4">
                                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-xl lg:text-2xl">
                                                <i className="fas fa-clipboard-check"></i>
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold text-sm lg:text-base">No attendance records found</p>
                                                <p className="text-gray-500 text-xs lg:text-sm mt-1">Try adjusting your filters or search.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAttendanceRecords;
