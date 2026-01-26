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
        }
    ]);

    // --- Form States ---
    const [basicInfo, setBasicInfo] = useState({
        name: '', id: `PRJ${Date.now()}`, description: '', type: '', priority: '', status: 'Planning Phase',
        location: '', client: '', manager: '', siteEngineer: ''
    });

    const [inventoryItems, setInventoryItems] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [projectTasks, setProjectTasks] = useState([]);
    const [timeline, setTimeline] = useState({
        startDate: '', completionDate: '', totalBudget: '', materialBudget: '', laborBudget: '',
        phases: '', notes: ''
    });

    // --- Handlers ---
    const handleBasicChange = (e) => setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    const handleTimelineChange = (e) => setTimeline({ ...timeline, [e.target.name]: e.target.value });

    // Inventory Handlers
    const addInventoryItem = () => {
        setInventoryItems([...inventoryItems, { id: Date.now(), name: '', category: 'Raw Materials', quantity: 0, unit: 'Kilograms' }]);
    };
    const removeInventoryItem = (id) => {
        setInventoryItems(inventoryItems.filter(item => item.id !== id));
    };
    const updateInventoryItem = (id, field, value) => {
        setInventoryItems(inventoryItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    // Vendor Handlers
    const addVendor = () => {
        setVendors([...vendors, { id: Date.now(), name: '', type: 'Material Supplier', contact: '', phone: '', email: '', cost: 0 }]);
    };
    const removeVendor = (id) => {
        setVendors(vendors.filter(v => v.id !== id));
    };
    const updateVendor = (id, field, value) => {
        setVendors(vendors.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    // Task Handlers
    const addTask = () => {
        setProjectTasks([...projectTasks, { id: Date.now(), name: '', category: 'Site Preparation', assignedTo: '', priority: 'Medium', startDate: '', duration: 0 }]);
    };
    const removeTask = (id) => {
        setProjectTasks(projectTasks.filter(t => t.id !== id));
    };
    const updateTask = (id, field, value) => {
        setProjectTasks(projectTasks.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProject = {
            id: basicInfo.id,
            name: basicInfo.name,
            manager: basicInfo.manager,
            status: basicInfo.status === 'Planning Phase' ? 'planning' : 'active',
            progress: 0,
            budget: `₹${timeline.totalBudget}`,
            dueDate: timeline.completionDate
        };
        setProjects([...projects, newProject]);
        setShowModal(false);
        alert('Project Created Successfully!');
    };

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
            {/* (Keeping existing Header & Table code identical to previous version...) */}
            <div className="modern-page-header bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg mb-8 relative overflow-hidden">
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

            {/* --- CREATE PROJECT MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Create Comprehensive Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/50 px-2">
                            {renderTabButton('basic', 'Basic Info', 'fas fa-info-circle')}
                            {renderTabButton('inventory', 'Inventory & Materials', 'fas fa-truck-loading')}
                            {renderTabButton('vendors', 'Vendors & Contractors', 'fas fa-handshake')}
                            {renderTabButton('diagrams', 'Diagrams & Documents', 'fas fa-file-pdf')}
                            {renderTabButton('tasks', 'Project Tasks', 'fas fa-tasks')}
                            {renderTabButton('timeline', 'Timeline & Budget', 'fas fa-calendar-alt')}
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white">

                            {/* 1. Basic Info Tab */}
                            {activeTab === 'basic' && (
                                <div className="space-y-6 animate-in">
                                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-building text-gray-700"></i> Basic Project Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Name *</label>
                                            <input type="text" name="name" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Skyline Residential Complex" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project ID</label>
                                            <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" value={basicInfo.id} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Description *</label>
                                        <textarea name="description" onChange={handleBasicChange} rows="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Detailed project description..."></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Type *</label>
                                            <select name="type" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                <option value="">Select Type</option>
                                                <option value="residential">Residential</option>
                                                <option value="commercial">Commercial</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Priority Level *</label>
                                            <select name="priority" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="critical">Critical</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Status *</label>
                                            <select name="status" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                <option value="Planning Phase">Planning Phase</option>
                                                <option value="In Progress">In Progress</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Location/Address *</label>
                                            <input type="text" name="location" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Complete project address" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Client/Owner *</label>
                                            <input type="text" name="client" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Client name or organization" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Manager *</label>
                                            <select name="manager" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                <option value="">Select Manager</option>
                                                <option value="Sarah Johnson">Sarah Johnson</option>
                                                <option value="Mike Wilson">Mike Wilson</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Site Engineer *</label>
                                            <select name="siteEngineer" onChange={handleBasicChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                                <option value="">Select Engineer</option>
                                                <option value="David Lee">David Lee</option>
                                                <option value="Emma Davis">Emma Davis</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Inventory Tab */}
                            {activeTab === 'inventory' && (
                                <div className="space-y-6 animate-in">
                                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-boxes text-gray-700"></i> Required Materials & Inventory</h4>
                                    <button onClick={addInventoryItem} className="btn btn-sm btn-outline mb-4"><i className="fas fa-plus"></i> Add Material Item</button>

                                    {inventoryItems.length === 0 ? (
                                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                                            No materials added. Click "Add Material Item" to start.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {inventoryItems.map((item) => (
                                                <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                    <div className="md:col-span-4">
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Material Name</label>
                                                        <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Steel Reinforcement" value={item.name} onChange={(e) => updateInventoryItem(item.id, 'name', e.target.value)} />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                                                        <select className="w-full px-3 py-2 border rounded-lg bg-white" value={item.category} onChange={(e) => updateInventoryItem(item.id, 'category', e.target.value)}>
                                                            <option>Raw Materials</option>
                                                            <option>Finishing</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Qty</label>
                                                        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={item.quantity} onChange={(e) => updateInventoryItem(item.id, 'quantity', e.target.value)} />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
                                                        <select className="w-full px-3 py-2 border rounded-lg bg-white" value={item.unit} onChange={(e) => updateInventoryItem(item.id, 'unit', e.target.value)}>
                                                            <option>Kilograms</option>
                                                            <option>Tons</option>
                                                            <option>Pieces</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-end">
                                                        <button onClick={() => removeInventoryItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash-alt"></i></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 3. Vendors Tab */}
                            {activeTab === 'vendors' && (
                                <div className="space-y-6 animate-in">
                                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-handshake text-gray-700"></i> Vendors & Contractors</h4>
                                    <button onClick={addVendor} className="btn btn-sm btn-outline mb-4"><i className="fas fa-plus"></i> Add Vendor/Contractor</button>

                                    {vendors.length === 0 ? (
                                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                                            No vendors added.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {vendors.map((v) => (
                                                <div key={v.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative">
                                                    <button onClick={() => removeVendor(v.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"><i className="fas fa-trash-alt"></i></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
                                                            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Vendor Name" value={v.name} onChange={(e) => updateVendor(v.id, 'name', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Service Type</label>
                                                            <select className="w-full px-3 py-2 border rounded-lg bg-white" value={v.type} onChange={(e) => updateVendor(v.id, 'type', e.target.value)}>
                                                                <option>Material Supplier</option>
                                                                <option>Labor Contractor</option>
                                                                <option>Consultant</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person</label>
                                                            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Contact Name" value={v.contact} onChange={(e) => updateVendor(v.id, 'contact', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                                                            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Number" value={v.phone} onChange={(e) => updateVendor(v.id, 'phone', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                                                            <input type="email" className="w-full px-3 py-2 border rounded-lg" placeholder="Email Address" value={v.email} onChange={(e) => updateVendor(v.id, 'email', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Cost (₹)</label>
                                                            <input type="number" className="w-full px-3 py-2 border rounded-lg" value={v.cost} onChange={(e) => updateVendor(v.id, 'cost', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 4. Documents Tab */}
                            {activeTab === 'diagrams' && (
                                <div className="space-y-6 animate-in">
                                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-file-pdf text-gray-700"></i> Diagrams & Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Architectural Plans', desc: 'Upload floor plans, elevations, sections' },
                                                { title: 'MEP Drawings', desc: 'Mechanical, Electrical, Plumbing plans' },
                                                { title: 'Permits & Approvals', desc: 'Government permits, NOCs' }
                                            ].map((doc, idx) => (
                                                <div key={idx} className="bg-white">
                                                    <label className="block font-bold text-gray-800 mb-2">{doc.title}</label>
                                                    <div className="border border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-3">
                                                        <button className="px-3 py-1 border rounded bg-gray-50 text-sm hover:bg-gray-100">Choose Files</button>
                                                        <span className="text-sm text-gray-500">No file chosen</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{doc.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Structural Drawings', desc: 'Upload structural plans and details' },
                                                { title: 'Site Survey Reports', desc: 'Soil tests, survey reports' },
                                                { title: 'Other Documents', desc: 'Contracts, specifications, etc.' }
                                            ].map((doc, idx) => (
                                                <div key={idx} className="bg-white">
                                                    <label className="block font-bold text-gray-800 mb-2">{doc.title}</label>
                                                    <div className="border border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-3">
                                                        <button className="px-3 py-1 border rounded bg-gray-50 text-sm hover:bg-gray-100">Choose Files</button>
                                                        <span className="text-sm text-gray-500">No file chosen</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{doc.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5. Tasks Tab */}
                            {activeTab === 'tasks' && (
                                <div className="space-y-6 animate-in">
                                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-tasks text-gray-700"></i> Initial Project Tasks</h4>
                                    <button onClick={addTask} className="btn btn-sm btn-outline mb-4"><i className="fas fa-plus"></i> Add Task</button>

                                    {projectTasks.length === 0 ? (
                                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                                            No tasks added.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {projectTasks.map((task) => (
                                                <div key={task.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative">
                                                    <button onClick={() => removeTask(task.id)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"><i className="fas fa-times"></i></button>
                                                    <div className="md:col-span-12 grid grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Task Name</label>
                                                            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Site Preparation" value={task.name} onChange={(e) => updateTask(task.id, 'name', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Task Category</label>
                                                            <select className="w-full px-3 py-2 border rounded-lg bg-white" value={task.category} onChange={(e) => updateTask(task.id, 'category', e.target.value)}>
                                                                <option>Site Preparation</option>
                                                                <option>Foundation</option>
                                                                <option>Structure</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Assigned To</label>
                                                            <select className="w-full px-3 py-2 border rounded-lg bg-white" value={task.assignedTo} onChange={(e) => updateTask(task.id, 'assignedTo', e.target.value)}>
                                                                <option value="">Assign Later</option>
                                                                <option>Mike Wilson</option>
                                                                <option>Sarah Johnson</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-12 grid grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                                                            <select className="w-full px-3 py-2 border rounded-lg bg-white" value={task.priority} onChange={(e) => updateTask(task.id, 'priority', e.target.value)}>
                                                                <option>Medium</option>
                                                                <option>High</option>
                                                                <option>Critical</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                                                            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={task.startDate} onChange={(e) => updateTask(task.id, 'startDate', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Days)</label>
                                                            <input type="number" className="w-full px-3 py-2 border rounded-lg" value={task.duration} onChange={(e) => updateTask(task.id, 'duration', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 6. Timeline Tab */}
                            {activeTab === 'timeline' && (
                                <div className="space-y-6 animate-in">
                                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-calendar-alt text-gray-700"></i> Project Timeline & Budget</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Start Date *</label>
                                            <input type="date" name="startDate" onChange={handleTimelineChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Expected Completion Date *</label>
                                            <input type="date" name="completionDate" onChange={handleTimelineChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Total Budget (₹) *</label>
                                            <input type="number" name="totalBudget" onChange={handleTimelineChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Material Budget (₹)</label>
                                            <input type="number" name="materialBudget" onChange={handleTimelineChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="0" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Labor Budget (₹)</label>
                                            <input type="number" name="laborBudget" onChange={handleTimelineChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="0" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Project Phases</label>
                                        <textarea name="phases" onChange={handleTimelineChange} rows="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Define major project phases and milestones..."></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Special Requirements/Notes</label>
                                        <textarea name="notes" onChange={handleTimelineChange} rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white transition-all bg-white text-sm">Cancel</button>
                            <button className="px-6 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all border border-transparent text-sm">Save as Draft</button>
                            <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition-all border border-transparent text-sm">Create Project</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Projects;
