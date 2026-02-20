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
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Manpower Management</h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Overview of workforce allocation across all active sites</p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={handleExport}
                        className="btn btn-outline bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs"
                    >
                        <i className="fas fa-download mr-1 sm:mr-2"></i> <span className="hidden sm:inline">Export Report</span><span className="sm:hidden">Export</span>
                    </button>
                    <button
                        onClick={handleAddRequest}
                        className="btn btn-primary shadow-lg shadow-blue-600/20 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs"
                    >
                        <i className="fas fa-plus mr-1 sm:mr-2"></i> <span className="hidden sm:inline">Add Onboarding Request</span><span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
                    <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-building text-3xl sm:text-4xl lg:text-6xl text-blue-600"></i>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Projects</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalProjects}</h3>
                    <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-xs text-green-600 font-medium">
                        <i className="fas fa-arrow-up mr-1"></i> <span className="hidden sm:inline">Running efficiently</span><span className="sm:hidden">Active</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                    <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-users text-3xl sm:text-4xl lg:text-6xl text-purple-600"></i>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Workforce</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalWorkforce}</h3>
                    <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-xs text-purple-600 font-medium">
                        <span className="bg-purple-50 px-1.5 sm:px-2 py-0.5 rounded-full"><span className="hidden sm:inline">Deployed on site</span><span className="sm:hidden">Deployed</span></span>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
                    <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-user-tie text-3xl sm:text-4xl lg:text-6xl text-orange-600"></i>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Supervisors</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalSupervisors}</h3>
                    <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-xs text-gray-500">
                        <span className="hidden sm:inline">Managing operations</span><span className="sm:hidden">Managing</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
                    <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fas fa-hard-hat text-3xl sm:text-4xl lg:text-6xl text-emerald-600"></i>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Labours</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalLabours}</h3>
                    <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-xs text-gray-500">
                        Skilled & Unskilled
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-tl-xl rounded-tr-xl sm:rounded-tl-2xl sm:rounded-tr-2xl border border-gray-200 border-b-0 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                <div className="relative w-full sm:max-w-md">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-filter text-sm"></i>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-sort-amount-down text-sm"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 mb-8">
                {filteredSummaries.map((proj) => (
                    <div key={proj.projectId} onClick={() => navigateToProject(proj.projectId)} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm cursor-pointer active:bg-blue-50">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                {proj.projectName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{proj.projectName}</p>
                                <p className="text-[10px] text-gray-500 font-mono">#{proj.projectId}</p>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 flex-shrink-0">
                                <span className="w-1 h-1 rounded-full bg-green-600 mr-1 animate-pulse"></span>
                                Live
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                            <div className="bg-gray-50 rounded-lg py-2">
                                <p className="text-lg font-bold text-gray-800">{proj.supervisorsCount}</p>
                                <p className="text-[9px] text-gray-400 uppercase">Supervisors</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg py-2">
                                <p className="text-lg font-bold text-gray-800">{proj.laboursCount}</p>
                                <p className="text-[9px] text-gray-400 uppercase">Labours</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg py-2">
                                <p className="text-lg font-bold text-gray-800">{proj.supervisorsCount + proj.laboursCount}</p>
                                <p className="text-[9px] text-gray-400 uppercase">Total</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                    {proj.siteEngineerName.charAt(0)}
                                </div>
                                <span className="text-xs text-gray-600 truncate max-w-[120px]">{proj.siteEngineerName}</span>
                            </div>
                            <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                        </div>
                    </div>
                ))}
                {filteredSummaries.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-search text-gray-300 text-lg"></i>
                        </div>
                        <p className="font-medium text-sm">No projects found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white border border-gray-200 rounded-bl-xl rounded-br-xl sm:rounded-bl-2xl sm:rounded-br-2xl shadow-sm overflow-hidden mb-8 sm:mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Project Details</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Site Engineer</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Supervisors</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Labours</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSummaries.map((proj) => (
                                <tr key={proj.projectId} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => navigateToProject(proj.projectId)}>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base sm:text-lg">
                                                {proj.projectName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm sm:text-base">{proj.projectName}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5">#{proj.projectId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-600">
                                                {proj.siteEngineerName.charAt(0)}
                                            </div>
                                            <span className="text-xs sm:text-sm font-medium text-gray-700">{proj.siteEngineerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-base sm:text-lg font-bold text-gray-800">{proj.supervisorsCount}</span>
                                            <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-base sm:text-lg font-bold text-gray-800">{proj.laboursCount}</span>
                                            <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                                            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-600 mr-1 sm:mr-1.5 animate-pulse"></span>
                                            Live
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigateToProject(proj.projectId); }}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                        >
                                            <span className="hidden sm:inline">View Details</span><span className="sm:hidden">View</span> <i className="fas fa-arrow-right text-[10px] sm:text-xs"></i>
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
                <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowProjectModal(false)}></div>
                    <div className="bg-white rounded-t-3xl sm:rounded-xl shadow-xl w-full sm:max-w-md relative z-10 p-4 sm:p-6 animate-in slide-in-from-bottom sm:zoom-in-95 max-h-[85vh] flex flex-col">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4">Select Project</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">Choose a project to add manpower to:</p>
                        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                            {summaries.map(p => (
                                <button
                                    key={p.projectId}
                                    onClick={() => navigateToProject(p.projectId)}
                                    className="text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 text-sm flex justify-between items-center group"
                                >
                                    {p.projectName}
                                    <i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowProjectModal(false)}
                            className="mt-4 sm:mt-6 w-full py-2.5 sm:py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold text-sm"
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
