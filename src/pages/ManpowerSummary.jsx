import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getManpowerStore } from '../utils/manpowerStore';
import { useAuth } from '../context/AuthContext';

/**
 * ManpowerSummary
 * Project-wise summary of manpower counts with a premium, dashboard-style layout.
 * Restricted to Admin and Super Admin roles.
 */
const ManpowerSummary = () => {
    const [summaries, setSummaries] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showProjectModal, setShowProjectModal] = useState(false);

    // Access Control
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
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
                    siteEngineerName: curr.addedBy || 'System',
                    supervisorsCount: 0,
                    laboursCount: 0
                };
            }

            if (curr.role === 'Supervisor') acc[pid].supervisorsCount++;
            if (curr.role === 'Labour') acc[pid].laboursCount++;

            return acc;
        }, {});

        setSummaries(Object.values(projectGroups));
    };

    // Calculate totals for top cards
    const totalProjects = summaries.length;
    const totalSupervisors = summaries.reduce((acc, curr) => acc + curr.supervisorsCount, 0);
    const totalLabours = summaries.reduce((acc, curr) => acc + curr.laboursCount, 0);
    const totalWorkforce = totalSupervisors + totalLabours;

    const filteredSummaries = summaries.filter(s =>
        s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.projectId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        if (summaries.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = ["Project Name", "Project ID", "Site Engineer", "Supervisors Count", "Labours Count"];
        const rows = summaries.map(s => [
            s.projectName,
            s.projectId,
            s.siteEngineerName,
            s.supervisorsCount,
            s.laboursCount
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `manpower_summary_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddRequest = () => {
        // Since adding involves selecting a project first, let's open a mini modal or just scroll to the list 
        // asking them to pick a project to add to.
        // Better UX: Show a modal with list of projects to "Select Project to Add Manpower".
        setShowProjectModal(true);
    };

    const navigateToProject = (projectId) => {
        navigate(`/admin/manpower/project/${projectId}`);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manpower Management</h1>
                    <p className="text-gray-500 mt-1">Overview of workforce allocation across all active sites</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="btn btn-outline bg-white hover:bg-gray-50 text-gray-700"
                    >
                        <i className="fas fa-download mr-2"></i> Export Report
                    </button>
                    <button
                        onClick={handleAddRequest}
                        className="btn btn-primary shadow-lg shadow-blue-600/20"
                    >
                        <i className="fas fa-plus mr-2"></i> Add Onboarding Request
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-building text-6xl text-blue-600"></i>
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Projects</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalProjects}</h3>
                    <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                        <i className="fas fa-arrow-up mr-1"></i> Running efficiently
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-users text-6xl text-purple-600"></i>
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Workforce</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalWorkforce}</h3>
                    <div className="mt-4 flex items-center text-xs text-purple-600 font-medium">
                        <span className="bg-purple-50 px-2 py-0.5 rounded-full">Deployed on site</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-user-tie text-6xl text-orange-600"></i>
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Supervisors</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalSupervisors}</h3>
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                        Managing operations
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-hard-hat text-6xl text-emerald-600"></i>
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Labours</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalLabours}</h3>
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                        Skilled & Unskilled
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-tl-xl rounded-tr-xl border border-gray-200 border-b-0 p-4 flex items-center justify-between">
                <div className="relative w-full max-w-md">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Search projects or site engineers..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-filter"></i>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-sort-amount-down"></i>
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white border border-gray-200 rounded-bl-xl rounded-br-xl shadow-sm overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Project Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Site Engineer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Supervisors</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Labours</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSummaries.map((proj) => (
                                <tr key={proj.projectId} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => navigateToProject(proj.projectId)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                {proj.projectName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{proj.projectName}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">#{proj.projectId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {proj.siteEngineerName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{proj.siteEngineerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-lg font-bold text-gray-800">{proj.supervisorsCount}</span>
                                            <span className="text-[10px] text-gray-400 uppercase">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-lg font-bold text-gray-800">{proj.laboursCount}</span>
                                            <span className="text-[10px] text-gray-400 uppercase">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-pulse"></span>
                                            Live
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigateToProject(proj.projectId); }}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                        >
                                            View Details <i className="fas fa-arrow-right text-xs"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredSummaries.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <i className="fas fa-search text-gray-300 text-xl"></i>
                                        </div>
                                        <p className="font-medium">No projects found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Select Project Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowProjectModal(false)}></div>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Project</h3>
                        <p className="text-gray-500 text-sm mb-4">Choose a project to add manpower to:</p>
                        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                            {summaries.map(p => (
                                <button
                                    key={p.projectId}
                                    onClick={() => navigateToProject(p.projectId)}
                                    className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 flex justify-between items-center group"
                                >
                                    {p.projectName}
                                    <i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowProjectModal(false)}
                            className="mt-6 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManpowerSummary;
