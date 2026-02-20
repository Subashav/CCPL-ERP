import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getManpowerStore } from '../utils/manpowerStore';

/**
 * AdminManpowerDirectory
 * A project-wise summary of manpower counts.
 * Design matched to the high-end CCPL Admin UI.
 */
const AdminManpowerDirectory = () => {
    const [summaries, setSummaries] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        loadSummaries();
    }, []);

    const loadSummaries = () => {
        const manpower = getManpowerStore();

        // Group by Project
        const projectGroups = manpower.reduce((acc, curr) => {
            const pid = curr.projectId || 'UNKNOWN';
            if (!acc[pid]) {
                acc[pid] = {
                    projectId: pid,
                    projectName: curr.projectName || 'Unnamed Project',
                    projectRefId: pid,
                    siteEngineerName: curr.addedBy || 'Not Assigned',
                    supervisorsCount: 0,
                    laboursCount: 0,
                    lastUpdatedAt: curr.createdAt,
                    status: 'ACTIVE' // Default for summary
                };
            }

            if (curr.role === 'Supervisor') acc[pid].supervisorsCount++;
            if (curr.role === 'Labour') acc[pid].laboursCount++;

            if (new Date(curr.createdAt) > new Date(acc[pid].lastUpdatedAt)) {
                acc[pid].lastUpdatedAt = curr.createdAt;
                acc[pid].siteEngineerName = curr.addedBy;
            }

            return acc;
        }, {});

        setSummaries(Object.values(projectGroups));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f8f9fa] min-h-screen font-sans animate-in fade-in duration-500">
            {/* Upper Navigation / Filters (Matched to Image) */}
            <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-12 ml-0 sm:ml-4 overflow-x-auto scrollbar-hide pb-2">
                {['ALL', 'ACTIVE', 'COMPLETED', 'ON HOLD'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black tracking-widest transition-all duration-300 whitespace-nowrap ${activeFilter === tab
                                ? 'bg-[#1a1c23] text-white shadow-xl shadow-gray-200'
                                : 'bg-white text-gray-400 hover:text-gray-600 shadow-sm border border-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {summaries.map((proj) => (
                    <div key={proj.projectId} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg font-black flex-shrink-0">
                                {proj.projectName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm leading-tight truncate">{proj.projectName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">REF-ID • {proj.projectRefId}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Site Engineer</p>
                                <p className="text-xs font-bold text-[#4451fe] truncate">{proj.siteEngineerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Workforce</p>
                                <p className="text-xs font-bold text-gray-700">{proj.supervisorsCount} Sup / {proj.laboursCount} Lab</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${proj.laboursCount > 0
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>{proj.laboursCount} Labours</span>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                    <i className="fas fa-external-link-alt text-[10px]"></i>
                                </button>
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white transition-all">
                                    <i className="fas fa-file-download text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {summaries.length === 0 && (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 opacity-40">
                        <i className="fas fa-folder-open text-4xl text-gray-400"></i>
                        <p className="text-xs font-black uppercase tracking-widest">No Project Data</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-xl sm:rounded-2xl lg:rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-300">
                                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Project Identity</th>
                                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Site Assignment</th>
                                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Supervisors</th>
                                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Labour Count</th>
                                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {summaries.map((proj) => (
                                <tr key={proj.projectId} className="group hover:bg-gray-50/40 transition-all duration-300">
                                    {/* BIO/KYC Style for Project Name */}
                                    <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                                        <div className="flex items-center gap-3 sm:gap-5">
                                            <div className="w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-base sm:text-lg font-black shadow-sm group-hover:scale-105 transition-transform">
                                                {proj.projectName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{proj.projectName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1 opacity-70">
                                                    REF-ID • {proj.projectRefId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SITE ASSIGNMENT Style for Engineer */}
                                    <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-[#4451fe] text-xs uppercase tracking-wider">{proj.siteEngineerName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 opacity-60">REF: Site Execution Head</p>
                                        </div>
                                    </td>

                                    {/* AADHAAR Card Style for Supervisor count */}
                                    <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-center">
                                        <div className="inline-flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-100/50">
                                            <i className="fas fa-user-tie text-[10px] text-gray-300"></i>
                                            <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                                COUNT: {proj.supervisorsCount}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ENTRY STATUS Style for Labour count */}
                                    <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-center">
                                        <span className={`inline-block px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${proj.laboursCount > 0
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {proj.laboursCount} LABOURS
                                        </span>
                                    </td>

                                    {/* ACTIONS Style */}
                                    <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 text-right">
                                        <div className="flex items-center justify-end gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                <i className="fas fa-external-link-alt text-[10px]"></i>
                                            </button>
                                            <button className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                <i className="fas fa-file-download text-[10px]"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {summaries.length === 0 && (
                        <div className="py-20 sm:py-40 flex flex-col items-center justify-center gap-4 opacity-20">
                            <i className="fas fa-folder-open text-4xl sm:text-6xl text-gray-400"></i>
                            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.5em]">No Project Data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Branding */}
            <div className="py-8 sm:py-16 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-10 opacity-30">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-gray-400 text-center sm:text-left">CCPL Infrastructure Dynamics v2.4</p>
                <div className="flex gap-3 sm:gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminManpowerDirectory;
