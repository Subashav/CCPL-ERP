import { useState } from 'react';

const Projects = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [projects, setProjects] = useState([
        {
            id: 'PRJ001',
            name: 'Skyline Residential Complex',
            manager: 'Sarah Johnson',
            status: 'active',
            progress: 78,
            budget: '₹5,200,000',
            dueDate: '2026-08-15'
        },
        // ... other projects can be added here
    ]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        id: `PRJ${Date.now()}`,
        description: '',
        type: '',
        priority: '',
        status: 'planning',
        location: '',
        client: '',
        manager: '',
        siteEngineer: '', // Added field
        startDate: '',
        endDate: '',
        budget: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProject = {
            id: formData.id,
            name: formData.name,
            manager: formData.manager,
            status: formData.status === 'Planning Phase' ? 'planning' : 'active',
            progress: 0,
            budget: `₹${formData.budget}`,
            dueDate: formData.endDate
        };
        setProjects([...projects, newProject]);
        setShowModal(false);
        alert('Project Created Successfully!');
    };

    const handleDraft = (e) => {
        e.preventDefault();
        setShowModal(false);
        alert('Project Saved as Draft!');
    }

    // Helper to render tabs
    const renderTabButton = (id, label, icon) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-sm font-medium ${activeTab === id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
        >
            <i className={icon}></i>
            {label}
        </button>
    );

    return (
        <>
            <div className="modern-page-header bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg mb-8 relative overflow-hidden">
                {/* Header Content ... */}
                <div className="header-content relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-3xl border border-white/10">
                                <i className="fas fa-building-columns"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-1">Project Hub</h1>
                                <p className="text-lg opacity-90">Comprehensive Construction Project Management Center</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                                <i className="fas fa-download"></i>
                                <span>Export Data</span>
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn bg-gradient-to-r from-pink-500 to-teal-400 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all border-none"
                            >
                                <i className="fas fa-plus-circle"></i>
                                <span>Create New Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Table same as before ... */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Projects</h3>
                </div>
                <div className="card-body p-0">
                    <div className="table-container">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Project ID</th>
                                    <th>Name</th>
                                    <th>Manager</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th>Budget</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50">
                                        <td className="font-medium text-sm">{project.id}</td>
                                        <td className="font-medium text-gray-800">{project.name}</td>
                                        <td className="text-gray-600">{project.manager}</td>
                                        <td>
                                            <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                                    project.status === 'planning' ? 'badge-primary' :
                                                        project.status === 'on-hold' ? 'badge-warning' : 'badge-secondary'
                                                }`}>
                                                {project.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="w-1/6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${project.progress > 75 ? 'bg-green-500' :
                                                                project.progress > 40 ? 'bg-blue-500' : 'bg-orange-500'
                                                            }`}
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="text-gray-700">{project.budget}</td>
                                        <td className="text-gray-600">{project.dueDate}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-sm btn-outline text-blue-600 border-blue-200 hover:bg-blue-50">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline text-gray-600 border-gray-200 hover:bg-gray-50">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Create Comprehensive Project</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/50 px-2">
                            {renderTabButton('basic', 'Basic Info', 'fas fa-info-circle')}
                            {renderTabButton('inventory', 'Inventory & Materials', 'fas fa-boxes')}
                            {renderTabButton('vendors', 'Vendors & Contractors', 'fas fa-handshake')}
                            {renderTabButton('diagrams', 'Diagrams & Documents', 'fas fa-file-pdf')}
                            {renderTabButton('tasks', 'Project Tasks', 'fas fa-tasks')}
                            {renderTabButton('timeline', 'Timeline & Budget', 'fas fa-calendar')}
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <form id="projectForm" onSubmit={handleSubmit} className="space-y-6">

                                {/* Basic Info Tab */}
                                {activeTab === 'basic' && (
                                    <div className="space-y-6 animate-in">
                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
                                            <i className="fas fa-building text-gray-700"></i> Basic Project Information
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="e.g., Skyline Residential Complex"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project ID</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-mono"
                                                    value={formData.id}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Description *</label>
                                            <textarea
                                                name="description"
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="Detailed project description..."
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Type *</label>
                                                <select name="type" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                    <option value="">Select Type</option>
                                                    <option value="residential">Residential Building</option>
                                                    <option value="commercial">Commercial Complex</option>
                                                    <option value="industrial">Industrial Facility</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Priority Level *</label>
                                                <select name="priority" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                    <option value="">Select Priority</option>
                                                    <option value="critical">Critical</option>
                                                    <option value="high">High</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="low">Low</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Status *</label>
                                                <select name="status" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                    <option value="Planning Phase">Planning Phase</option>
                                                    <option value="Design Phase">Design Phase</option>
                                                    <option value="Pre-Construction">Pre-Construction</option>
                                                    <option value="Under Construction">Under Construction</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Location/Address *</label>
                                                <input type="text" name="location" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Complete project address" />
                                            </div>
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Client/Owner *</label>
                                                <input type="text" name="client" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Client name or organization" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Manager *</label>
                                                <select name="manager" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                                                    <option value="">Select Manager</option>
                                                    <option value="Sarah Johnson">Sarah Johnson</option>
                                                    <option value="Mike Wilson">Mike Wilson</option>
                                                    <option value="John Smith">John Smith</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Site Engineer *</label>
                                                <select name="siteEngineer" onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                                                    <option value="">Select Engineer</option>
                                                    <option value="Mike Wilson">Mike Wilson</option>
                                                    <option value="David Lee">David Lee</option>
                                                    <option value="Emma Davis">Emma Davis</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Other tabs would go here similarly... */}
                                {/* Inventory Tab */}
                                {activeTab === 'inventory' && (
                                    <div className="space-y-6 animate-in">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-semibold text-gray-800"><i className="fas fa-boxes text-blue-600"></i> Required Materials</h4>
                                            <button type="button" className="btn btn-sm btn-outline"><i className="fas fa-plus"></i> Add Material Item</button>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
                                            <i className="fas fa-box-open text-4xl mb-3 text-gray-300"></i>
                                            <p>No materials added yet. Click "Add Material Item" to start.</p>
                                        </div>
                                    </div>
                                )}
                                {/* ... Timeline Tab Placeholder ... */}
                                {activeTab === 'timeline' && (
                                    <div className="space-y-6 animate-in text-center p-8 text-gray-500">
                                        Timeline settings content...
                                    </div>
                                )}
                                {/* ... Vendors Tab Placeholder ... */}
                                {activeTab === 'vendors' && (
                                    <div className="space-y-6 animate-in text-center p-8 text-gray-500">
                                        Vendors & Contractors content...
                                    </div>
                                )}
                                {/* ... Diagrams Tab Placeholder ... */}
                                {activeTab === 'diagrams' && (
                                    <div className="space-y-6 animate-in text-center p-8 text-gray-500">
                                        Documents upload area...
                                    </div>
                                )}
                                {/* ... Tasks Tab Placeholder ... */}
                                {activeTab === 'tasks' && (
                                    <div className="space-y-6 animate-in text-center p-8 text-gray-500">
                                        Project initial tasks setup...
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 fs-sm font-medium hover:bg-white transition-all bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDraft}
                                className="px-6 py-2 rounded-lg bg-gray-600 text-white fs-sm font-medium hover:bg-gray-700 transition-all border border-transparent"
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white fs-sm font-medium hover:bg-blue-700 shadow-md transition-all border border-transparent"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Projects;
