import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Tickets = () => {
    // Current User & Role using AuthContext
    const { user } = useAuth();
    const isEngineer = user?.role === 'SITE_ENGINEER';
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

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
                date: '2023-10-28T10:30',
                requester: 'Site Engineer', // Matching default mock name for SE
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
                date: '2023-10-29T09:15',
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
            id: `ISS-${Date.now().toString().slice(-4)}`,
            project: formData.get('project'),
            category: formData.get('category'),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            location: formData.get('location'),
            date: new Date().toISOString(), // Capture precise reporting time
            requester: user?.name || 'Unknown',
            status: 'Pending',
            assignedTo: '',
            deadline: '',
            remarks: '',
            photos: [] // Mock
        };

        const updatedTickets = [newTicket, ...tickets];
        setTickets(updatedTickets);
        localStorage.setItem('siteTickets', JSON.stringify(updatedTickets));
        setShowModal(false);
        alert('Ticket Raised Successfully!');
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
        alert('Ticket Updated Successfully!');
    };

    const openUpdateModal = (ticket) => {
        setSelectedTicket(ticket);
        setShowUpdateModal(true);
    };

    // --- Derived Data ---

    const filteredTickets = tickets.filter(t => {
        // Role check: Engineers only see their own tickets
        if (isEngineer && t.requester !== user?.name) return false;

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
        <>
            <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEngineer ? 'My Tickets & Issues' : 'Issue Tracking & Tickets'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEngineer ? 'Report and track on-site issues' : 'Manage warnings, safety issues, and project tickets'}
                    </p>
                </div>
                {isEngineer && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn bg-blue-500 text-white hover:bg-blue-600 px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                        <i className="fas fa-exclamation-circle"></i> Raise Ticket
                    </button>
                )}
            </div>

            {/* Admin Filters */}
            {isAdmin && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Filter By Project</label>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm" value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
                            <option value="">All Projects</option>
                            {projects.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Status</label>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Priority</label>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                            <option value="">All Priorities</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => { setFilterProject(''); setFilterStatus(''); setFilterPriority(''); }}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Tickets Grid/List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                            <i className="fas fa-ticket-alt text-gray-300 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-1">There are no raised issues matching your current filters.</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Priority Strip */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${ticket.priority === 'Critical' ? 'bg-blue-700' : ticket.priority === 'High' ? 'bg-blue-500' : 'bg-blue-300'}`}></div>

                            <div className="flex flex-col md:flex-row gap-6 pl-3">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-400 tracking-wider">#{ticket.id}</span>
                                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityBadge(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {ticket.category}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-1 leading-snug">{ticket.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ticket.description}</p>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-building text-gray-400"></i> {ticket.project}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-map-marker-alt text-gray-400"></i> {ticket.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-user text-gray-400"></i> Reported by <span className="font-medium text-gray-700">{ticket.requester}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-clock text-gray-400"></i> {new Date(ticket.date).toLocaleString()}
                                        </div>
                                    </div>

                                    {(ticket.assignedTo || ticket.remarks) && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-5 -mb-5 px-5 py-3 flex flex-wrap gap-4 text-sm mt-auto">
                                            {ticket.assignedTo && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 font-medium text-xs uppercase">Assigned To:</span>
                                                    <span className="text-gray-800 font-semibold"><i className="fas fa-user-shield text-blue-500 mr-1"></i> {ticket.assignedTo}</span>
                                                </div>
                                            )}
                                            {ticket.deadline && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 font-medium text-xs uppercase">Deadline:</span>
                                                    <span className="text-red-600 font-semibold"><i className="fas fa-hourglass-half mr-1"></i> {ticket.deadline}</span>
                                                </div>
                                            )}
                                            {ticket.remarks && (
                                                <div className="w-full mt-1">
                                                    <span className="text-gray-500 font-medium text-xs uppercase block mb-1">Admin Remarks:</span>
                                                    <p className="text-gray-700 italic border-l-2 border-gray-300 pl-3">{ticket.remarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {isAdmin && (
                                    <div className="flex items-start">
                                        <button
                                            onClick={() => openUpdateModal(ticket)}
                                            className="btn btn-sm btn-outline text-blue-600 border-blue-200 hover:bg-blue-50 whitespace-nowrap"
                                        >
                                            <i className="fas fa-cog"></i> Manage
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Engineer: Raise Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800">Raise New Issue / Ticket</h3>
                            <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleCreateTicket} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Project Site *</label>
                                        <select name="project" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                                            <option value="">Select Project</option>
                                            {projects.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Issue Category *</label>
                                        <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Issue Title *</label>
                                    <input type="text" name="title" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief summary of the issue" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Priority Level *</label>
                                        <select name="priority" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical - Immediate Action</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Specific Location *</label>
                                        <input type="text" name="location" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Block B, 2nd Floor" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description *</label>
                                    <textarea name="description" rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the issue, potential impact, and context..." required></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Attachments (Optional)</label>
                                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 hover:bg-gray-50 cursor-pointer">
                                        <i className="fas fa-paperclip mr-2"></i> Add photos or documents
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm shadow-md">Submit Ticket</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin: Update Ticket Modal */}
            {showUpdateModal && selectedTicket && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Manage Ticket #{selectedTicket.id}</h3>
                                <p className="text-xs text-gray-500">{selectedTicket.title}</p>
                            </div>
                            <button onClick={() => setShowUpdateModal(false)}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleUpdateTicket} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Update Status</label>
                                    <select name="status" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" defaultValue={selectedTicket.status}>
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>On Hold</option>
                                        <option>Resolved</option>
                                        <option>Closed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Assign Responsible Person</label>
                                    <input type="text" name="assignedTo" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Safety Officer" defaultValue={selectedTicket.assignedTo} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Resolution Deadline</label>
                                    <input type="date" name="deadline" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={selectedTicket.deadline} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Admin Remarks / Instructions</label>
                                    <textarea name="remarks" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Add instructions or feedback..." defaultValue={selectedTicket.remarks}></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowUpdateModal(false)} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md">Update Ticket</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tickets;
