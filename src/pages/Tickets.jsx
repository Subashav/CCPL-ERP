import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Tickets = () => {
    // Current User & Role using AuthContext
    const { user } = useAuth();
    const currentUser = user || JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const isEngineer = currentUser.role === 'engineer' || currentUser.role === 'SITE_ENGINEER';
    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN';

    // Mock Projects
    const projects = ['Skyline Residential Complex', 'City Center Mall', 'Highway Bridge Project'];

    // Categories
    const categories = ['Safety', 'Materials', 'Equipment', 'Labour', 'Quality', 'Delay', 'Electrical', 'Plumbing', 'Design Issue', 'Other'];

    // State
    const [tickets, setTickets] = useState(() => {
        const saved = localStorage.getItem('siteTickets');
        return saved ? JSON.parse(saved) : [
            {
                id: 'ISS-001',
                project: 'Skyline Residential Complex',
                category: 'Safety',
                title: 'Scaffolding instability on 4th floor',
                description: 'The scaffolding near the east wing feels loose and unsafe for workers.',
                priority: 'Critical',
                location: 'Block A, East Wing',
                date: '2024-01-28T10:30:00',
                requester: 'David Lee',
                status: 'In Progress',
                assignedTo: 'Safety Officer',
                deadline: '2024-01-29',
                remarks: 'Reinforcement team dispatched.',
                photos: []
            },
            {
                id: 'ISS-002',
                project: 'City Center Mall',
                category: 'Materials',
                title: 'Cement bags damaged due to rain',
                description: 'About 20 bags of cement were left uncovered and are now unusable after last night\'s rain.',
                priority: 'High',
                location: 'Storage Yard',
                date: '2024-01-29T09:15:00',
                requester: 'Mike Wilson',
                status: 'Pending',
                assignedTo: '',
                deadline: '',
                remarks: '',
                photos: []
            },
            {
                id: 'ISS-003',
                project: 'Skyline Residential Complex',
                category: 'Materials',
                title: 'Shortage of TMT Steel Bars',
                description: 'Inventory levels for 12mm TMT bars have reached critical low levels. Immediate procurement needed.',
                priority: 'High',
                location: 'Material Store',
                date: '2024-01-30T14:20:00',
                requester: 'David Lee',
                status: 'Pending',
                assignedTo: 'Procurement Manager',
                deadline: '2024-02-02',
                remarks: '',
                photos: []
            },
            {
                id: 'ISS-004',
                project: 'Highway Bridge Project',
                category: 'Labour',
                title: 'Skilled Labour Shortage',
                description: 'Contractor has failed to provide required number of skilled masons for the pier work.',
                priority: 'Medium',
                location: 'Pier 04 / Section C',
                date: '2024-01-31T08:00:00',
                requester: 'John Smith',
                status: 'In Progress',
                assignedTo: 'Labour Contractor',
                deadline: '2024-02-10',
                remarks: 'Contractor warned about penalty clauses.',
                photos: []
            },
            {
                id: 'ISS-005',
                project: 'City Center Mall',
                category: 'Equipment',
                title: 'Tower Crane Breakdown',
                description: 'The main tower crane has developed a hydraulic leak. Lifting operations suspended.',
                priority: 'Critical',
                location: 'Crane Base - Core A',
                date: '2024-01-31T11:45:00',
                requester: 'Mike Wilson',
                status: 'Open',
                assignedTo: 'Maintenance Team',
                deadline: '2024-01-31',
                remarks: 'Technician on the way.',
                photos: []
            },
            {
                id: 'ISS-006',
                project: 'Skyline Residential Complex',
                category: 'Electrical',
                title: 'Main Panel board short circuit',
                description: 'Sparks observed in the main distribution board on ground floor. Temporary power cut.',
                priority: 'Critical',
                location: 'Ground Floor Electrical Room',
                date: '2024-01-31T15:10:00',
                requester: 'David Lee',
                status: 'Resolved',
                assignedTo: 'Electrician Team',
                deadline: '2024-01-31',
                remarks: 'Panel repaired and tested. Power restored.',
                photos: []
            },
            {
                id: 'ISS-007',
                project: 'Highway Bridge Project',
                category: 'Quality',
                title: 'Concrete Test Failure',
                description: '7-day compressive strength test for Pier 02 foundation concrete failed to meet specifications.',
                priority: 'High',
                location: 'Pier 02 Foundation',
                date: '2024-01-25T10:00:00',
                requester: 'John Smith',
                status: 'Resolved',
                assignedTo: 'Quality Control',
                deadline: '2024-01-30',
                remarks: 'Core test performed; results were acceptable. Structral engineer approved.',
                photos: []
            }
        ];
    });

    const [showModal, setShowModal] = useState(false); // Create Ticket (Engineer)
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Update Ticket (Admin)
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Filter States (Admin)
    const [filterProject, setFilterProject] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

    // --- Actions ---

    const handleCreateTicket = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newTicket = {
            id: `ISS-${Math.floor(100 + Math.random() * 900)}`, // Simple 3 digit random ID
            project: formData.get('project'),
            category: formData.get('category'),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            location: formData.get('location'),
            date: new Date().toISOString(),
            requester: currentUser.name || 'Site Engineer',
            status: 'Pending',
            assignedTo: '',
            deadline: '',
            remarks: '',
            photos: []
        };

        const updatedTickets = [newTicket, ...tickets];
        setTickets(updatedTickets);
        localStorage.setItem('siteTickets', JSON.stringify(updatedTickets));
        setShowModal(false);
    };

    const handleUpdateTicket = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const updatedList = tickets.map(t => {
            if (t.id === selectedTicket.id) {
                return {
                    ...t,
                    status: formData.get('status'),
                    assignedTo: formData.get('assignedTo'),
                    deadline: formData.get('deadline'),
                    remarks: formData.get('remarks')
                };
            }
            return t;
        });

        setTickets(updatedList);
        localStorage.setItem('siteTickets', JSON.stringify(updatedList));
        setShowUpdateModal(false);
        setSelectedTicket(null);
    };

    const openUpdateModal = (ticket) => {
        setSelectedTicket(ticket);
        setShowUpdateModal(true);
    };

    // --- Derived Data ---

    const filteredTickets = tickets.filter(t => {
        // Role check: Engineers only see their own tickets
        if (isEngineer && t.requester !== currentUser.name) return false;

        // Admin Filters
        if (isAdmin) {
            if (filterProject && t.project !== filterProject) return false;
            if (filterStatus && t.status !== filterStatus) return false;
            if (filterPriority && t.priority !== filterPriority) return false;
        }

        return true;
    });

    const getPriorityBadge = (p) => {
        switch (p) {
            case 'Critical': return 'bg-red-600 text-white border-red-700';
            case 'High': return 'bg-orange-500 text-white border-orange-600';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'Pending': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'On Hold': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Closed': return 'bg-navy-900 text-white border-navy-950';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="animate-in fade-in duration-500 p-0">
            {/* Mobile App Style Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-start gap-3 mb-3 sm:mb-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                            {isEngineer ? 'My Tickets' : 'Issue Tickets'}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                            {isEngineer ? 'Track your reported issues' : 'Manage site issues & warnings'}
                        </p>
                    </div>
                    {isEngineer && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <i className="fas fa-plus text-xs"></i> <span className="hidden xs:inline">Raise</span> Ticket
                        </button>
                    )}
                </div>

                {/* Quick Stats Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {filteredTickets.filter(t => t.priority === 'Critical').length} Critical
                    </div>
                    <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-amber-100">
                        {filteredTickets.filter(t => t.status === 'Pending').length} Pending
                    </div>
                    <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-100">
                        {filteredTickets.filter(t => t.status === 'In Progress').length} In Progress
                    </div>
                </div>
            </div>

            {/* Admin Filters - Mobile Optimized */}
            {isAdmin && (
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Filters</span>
                        <button 
                            className="text-xs text-blue-600 font-semibold" 
                            onClick={() => { setFilterProject(''); setFilterStatus(''); setFilterPriority(''); }}
                        >
                            Reset
                        </button>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all font-medium" 
                            value={filterProject} 
                            onChange={(e) => setFilterProject(e.target.value)}
                        >
                            <option value="">All Projects</option>
                            {projects.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all font-medium" 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                        </select>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all font-medium" 
                            value={filterPriority} 
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="">All Priority</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Tickets Grid/List - Mobile App Cards */}
            <div className="space-y-3 sm:space-y-4">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border border-gray-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 text-gray-400 mb-4 sm:mb-6">
                            <i className="fas fa-ticket-alt text-2xl sm:text-4xl"></i>
                        </div>
                        <h3 className="text-base sm:text-xl font-bold text-gray-900">No tickets found</h3>
                        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mt-2 px-4">No tickets match your filters or role access.</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md active:scale-[0.99] cursor-pointer group"
                        >
                            {/* Card Header with Priority Strip */}
                            <div className={`h-1.5 sm:h-2 ${ticket.priority === 'Critical' ? 'bg-gradient-to-r from-red-600 to-red-500' : ticket.priority === 'High' ? 'bg-gradient-to-r from-orange-500 to-amber-500' : ticket.priority === 'Medium' ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : 'bg-gradient-to-r from-blue-400 to-blue-300'}`}></div>
                            
                            <div className="p-4 sm:p-5 md:p-6">
                                {/* Top Row: ID, Priority, Status */}
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs sm:text-sm font-bold text-gray-400">#{ticket.id}</span>
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wide border ${getPriorityBadge(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
                                            {ticket.category}
                                        </span>
                                    </div>
                                    <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-tight ${getStatusBadge(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <div className="mb-4">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">{ticket.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                                </div>

                                {/* Info Grid - Compact Mobile Layout */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <i className="fas fa-building text-[10px] sm:text-xs"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-400 uppercase text-[8px] sm:text-[9px]">Project</p>
                                            <span className="font-bold text-gray-900 text-[10px] sm:text-xs truncate block">{ticket.project}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <i className="fas fa-map-marker-alt text-[10px] sm:text-xs"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-400 uppercase text-[8px] sm:text-[9px]">Location</p>
                                            <span className="font-bold text-gray-900 text-[10px] sm:text-xs truncate block">{ticket.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <i className="fas fa-user-circle text-[10px] sm:text-xs"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-400 uppercase text-[8px] sm:text-[9px]">Reported By</p>
                                            <span className="font-bold text-gray-900 text-[10px] sm:text-xs truncate block">{ticket.requester}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <i className="fas fa-calendar-alt text-[10px] sm:text-xs"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-400 uppercase text-[8px] sm:text-[9px]">Logged</p>
                                            <span className="font-bold text-gray-900 text-[10px] sm:text-xs">{new Date(ticket.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignment Status */}
                                {(ticket.assignedTo || ticket.deadline) ? (
                                    <div className="flex flex-wrap gap-4 sm:gap-6 mb-3">
                                        {ticket.assignedTo && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                                                    <i className="fas fa-user-shield"></i>
                                                </div>
                                                <span className="text-xs sm:text-sm font-semibold text-gray-700">{ticket.assignedTo}</span>
                                            </div>
                                        )}
                                        {ticket.deadline && (
                                            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-600">
                                                <i className="fas fa-clock text-xs"></i>
                                                Due: {new Date(ticket.deadline).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl inline-flex items-center gap-2 mb-3">
                                        <i className="fas fa-info-circle"></i>
                                        Awaiting review & assignment
                                    </div>
                                )}

                                {/* Remarks if any */}
                                {ticket.remarks && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
                                        <p className="text-xs sm:text-sm text-blue-800 italic line-clamp-2">
                                            <i className="fas fa-comment-dots mr-2 text-blue-400"></i>
                                            {ticket.remarks}
                                        </p>
                                    </div>
                                )}

                                {/* Admin Action Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => openUpdateModal(ticket)}
                                        className="w-full sm:w-auto mt-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-edit"></i> Update Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Engineer: Raise Ticket Modal - Mobile Bottom Sheet Style */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-navy-900/60 backdrop-blur-md sm:p-4 overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden"></div>
                        
                        <div className="flex justify-between items-center px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50 sm:rounded-t-3xl">
                            <div>
                                <h3 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">Raise New Issue</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-bold tracking-widest">Site Operations</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 sm:hover:bg-white flex items-center justify-center text-gray-500 sm:hover:text-gray-900 transition-all">
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
                            <form onSubmit={handleCreateTicket} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Project Site <span className="text-red-500">*</span></label>
                                        <select name="project" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-semibold text-gray-800" required>
                                            <option value="">Select Target Site</option>
                                            {projects.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Category <span className="text-red-500">*</span></label>
                                        <select name="category" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-semibold text-gray-800" required>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Issue Title <span className="text-red-500">*</span></label>
                                    <input type="text" name="title" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-semibold" placeholder="e.g. Crane Operator Missing" required />
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Priority <span className="text-red-500">*</span></label>
                                        <select name="priority" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-bold text-gray-800" required>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Location <span className="text-red-500">*</span></label>
                                        <input type="text" name="location" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-semibold" placeholder="e.g. Block B" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Description <span className="text-red-500">*</span></label>
                                    <textarea name="description" rows="3" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all font-medium leading-relaxed" placeholder="Describe the issue..." required></textarea>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Attach Photo (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:bg-primary-pale/30 border-primary-pale group cursor-pointer transition-all">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-pale text-primary flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                            <i className="fas fa-camera text-lg sm:text-xl"></i>
                                        </div>
                                        <p className="text-xs font-bold text-gray-600">Tap to Upload</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Max 10MB</p>
                                    </div>
                                </div>

                                <div className="pt-4 sm:pt-6 flex gap-3 border-t border-gray-100 safe-area-bottom">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wide hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-3.5 bg-primary text-white rounded-xl sm:rounded-2xl hover:bg-primary-dark font-bold text-xs uppercase tracking-wide shadow-xl shadow-primary/20 transition-all active:scale-95">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin: Update Ticket Modal - Mobile Bottom Sheet */}
            {showUpdateModal && selectedTicket && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-navy-900/60 backdrop-blur-md sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden"></div>
                        
                        <div className="flex justify-between items-center px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50 sm:rounded-t-3xl">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Update Ticket</h3>
                                <p className="text-[10px] font-bold text-primary mt-0.5 uppercase tracking-widest">{selectedTicket.id}</p>
                            </div>
                            <button onClick={() => setShowUpdateModal(false)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 sm:hover:bg-white flex items-center justify-center text-gray-500 sm:hover:text-gray-900 transition-all">
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
                            <form onSubmit={handleUpdateTicket} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Status</label>
                                        <select name="status" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-bold text-gray-800" defaultValue={selectedTicket.status}>
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>On Hold</option>
                                            <option>Resolved</option>
                                            <option>Closed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Deadline</label>
                                        <input type="date" name="deadline" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition-all text-gray-600 font-bold" defaultValue={selectedTicket.deadline} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Assign To</label>
                                    <div className="relative">
                                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-primary opacity-40">
                                            <i className="fas fa-user text-xs sm:text-sm"></i>
                                        </div>
                                        <input type="text" name="assignedTo" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl pl-9 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-3.5 text-sm outline-none transition-all font-bold text-gray-800" placeholder="e.g. HSE Manager" defaultValue={selectedTicket.assignedTo} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 px-1">Remarks</label>
                                    <textarea name="remarks" rows="3" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all font-medium leading-relaxed" placeholder="Actions taken..." defaultValue={selectedTicket.remarks}></textarea>
                                </div>

                                <div className="pt-4 sm:pt-6 flex gap-3 border-t border-gray-100 safe-area-bottom">
                                    <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wide hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-3.5 bg-navy-900 text-white rounded-xl sm:rounded-2xl hover:bg-navy-800 font-bold text-xs uppercase tracking-wide shadow-xl shadow-navy-900/20 transition-all active:scale-95">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tickets;
