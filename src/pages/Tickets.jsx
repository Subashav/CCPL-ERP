import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Tickets = () => {
    // Current User & Role
    const { user } = useAuth();
    // Fallback if user is null (e.g., direct access without login in dev), though AuthContext usually handles this.
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
                date: '2023-10-28T10:30:00',
                requester: 'David Lee',
                status: 'In Progress',
                assignedTo: 'Safety Officer',
                deadline: '2023-10-29',
                remarks: 'Reinforcement team dispatched.',
                photos: []
            },
            {
                id: 'ISS-002',
                project: 'City Center Mall',
                category: 'Materials',
                title: 'Cement bags damaged due to rain',
                description: 'About 20 bags of cement were left uncovered and are now unusable.',
                priority: 'High',
                location: 'Storage Yard',
                date: '2023-10-29T09:15:00',
                requester: 'Mike Wilson',
                status: 'Pending',
                assignedTo: '',
                deadline: '',
                remarks: '',
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
        // Removing alert to make it smoother, maybe show a toast if possible, staying simple for now
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
        // Role check: Engineer sees only their own or all? Usually engineers see everything for their site.
        // For this demo, let's allow everyone to see all for simplicity unless filtered.
        // If strict owner only: if (isEngineer && t.requester !== currentUser.name) return false;

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
            case 'Critical': return 'bg-blue-600 text-white border-blue-700 shadow-sm';
            case 'High': return 'bg-blue-500 text-white border-blue-600 shadow-sm';
            case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'Pending': return 'bg-gray-100 text-gray-600';
            case 'In Progress': return 'bg-blue-100 text-blue-600 font-bold';
            case 'On Hold': return 'bg-orange-50 text-orange-600';
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-gray-800 text-white';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {isEngineer ? 'Issue Tracking & Tickets' : 'Issue Tracking & Tickets'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage warnings, safety issues, and project tickets
                    </p>
                </div>
                {isEngineer && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i> Raise Ticket
                    </button>
                )}
            </div>

            {/* Admin Filters */}
            {isAdmin && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Filter By Project</label>
                        <select className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm outline-none transition-all font-medium" value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
                            <option value="">All Projects</option>
                            {projects.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                        <select className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm outline-none transition-all font-medium" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Priority</label>
                        <select className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm outline-none transition-all font-medium" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                            <option value="">All Priorities</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-lg text-sm transition-colors" onClick={() => { setFilterProject(''); setFilterStatus(''); setFilterPriority(''); }}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Tickets Grid/List */}
            <div className="grid grid-cols-1 gap-5">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-200 mb-6">
                            <i className="fas fa-ticket-alt text-4xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No tickets found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">There are no raised issues matching your current filters.</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md relative overflow-hidden group">
                            {/* Left Border Strip */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${ticket.priority === 'Critical' ? 'bg-blue-600' : ticket.priority === 'High' ? 'bg-blue-500' : 'bg-blue-300'}`}></div>

                            <div className="pl-4">
                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-300">#{ticket.id}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                            {ticket.category}
                                        </span>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusBadge(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{ticket.description}</p>
                                </div>

                                {/* Meta Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2 gap-x-6 text-xs text-gray-500 mb-6 border-b border-gray-100 pb-6">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-building text-gray-400 w-4"></i>
                                        <span className="font-medium truncate">{ticket.project}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-gray-400 w-4"></i>
                                        <span className="font-medium">{ticket.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-user text-gray-400 w-4"></i>
                                        <span>Reported by <span className="text-gray-900 font-bold">{ticket.requester}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-clock text-gray-400 w-4"></i>
                                        <span className="font-medium">{new Date(ticket.date).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Footer / Admin Section */}
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1 w-full">
                                        {(ticket.assignedTo || ticket.deadline) ? (
                                            <div className="flex flex-wrap gap-8">
                                                {ticket.assignedTo && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Assigned To</span>
                                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                                                                <i className="fas fa-user-shield"></i>
                                                            </div>
                                                            {ticket.assignedTo}
                                                        </div>
                                                    </div>
                                                )}
                                                {ticket.deadline && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Deadline</span>
                                                        <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                                                            <i className="fas fa-hourglass-half"></i>
                                                            {ticket.deadline}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-400 italic py-2">Waiting for admin assignment...</div>
                                        )}

                                        {ticket.remarks && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Admin Remarks</span>
                                                <p className="text-sm text-gray-600 italic">{ticket.remarks}</p>
                                            </div>
                                        )}
                                    </div>

                                    {isAdmin && (
                                        <div className="pt-2">
                                            <button
                                                onClick={() => openUpdateModal(ticket)}
                                                className="whitespace-nowrap px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-700 text-xs font-bold transition-all"
                                            >
                                                <i className="fas fa-cog mr-2"></i> Update Status
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Engineer: Raise Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Raise New Issue / Ticket</h3>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleCreateTicket} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Site <span className="text-red-500">*</span></label>
                                        <select name="project" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" required>
                                            <option value="">Select Project</option>
                                            {projects.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Issue Category <span className="text-red-500">*</span></label>
                                        <select name="category" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" required>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Issue Title <span className="text-red-500">*</span></label>
                                    <input type="text" name="title" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" placeholder="Brief summary of the issue" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority Level <span className="text-red-500">*</span></label>
                                        <select name="priority" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" required>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical - Immediate Action</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specific Location <span className="text-red-500">*</span></label>
                                        <input type="text" name="location" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" placeholder="e.g. Block B, 2nd Floor" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Description <span className="text-red-500">*</span></label>
                                    <textarea name="description" rows="4" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" placeholder="Describe the issue, potential impact, and context..." required></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Attachments (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors group">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <i className="fas fa-cloud-upload-alt text-xl"></i>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">Click to upload photos</p>
                                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-xl shadow-blue-200 transition-all transform active:scale-95">Submit Ticket</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin: Update Ticket Modal */}
            {showUpdateModal && selectedTicket && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Update Ticket Status</h3>
                                <p className="text-xs font-bold text-blue-600 mt-1">#{selectedTicket.id}</p>
                            </div>
                            <button onClick={() => setShowUpdateModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleUpdateTicket} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</label>
                                    <select name="status" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all font-bold text-gray-800" defaultValue={selectedTicket.status}>
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>On Hold</option>
                                        <option>Resolved</option>
                                        <option>Closed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign Responsible Person</label>
                                    <input type="text" name="assignedTo" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" placeholder="e.g. Safety Officer" defaultValue={selectedTicket.assignedTo} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resolution Deadline</label>
                                    <input type="date" name="deadline" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-600" defaultValue={selectedTicket.deadline} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Remarks / Instructions</label>
                                    <textarea name="remarks" rows="3" className="w-full bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" placeholder="Add instructions, feedback, or approval notes..." defaultValue={selectedTicket.remarks}></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowUpdateModal(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold text-sm shadow-lg">Update Ticket</button>
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
