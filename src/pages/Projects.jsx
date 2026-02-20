import { useState } from 'react';

const Projects = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
    const isEngineer = currentUser.role === 'engineer';

    const [projects, setProjects] = useState([
        {
            id: 'PRJ001',
            name: 'Skyline Residential Complex',
            manager: 'Sarah Johnson',
            siteEngineer: 'David Lee',
            status: 'active',
            progress: 78,
            budget: '₹5,200,000',
            dueDate: '2026-08-15'
        },
        {
            id: 'PRJ002',
            name: 'City Center Mall',
            manager: 'Sarah Johnson',
            siteEngineer: 'Mike Wilson',
            status: 'planning',
            progress: 15,
            budget: '₹12,500,000',
            dueDate: '2027-03-01'
        }
    ]);

    // Use filtered projects for display
    const displayedProjects = isEngineer
        ? projects.filter(p => p.siteEngineer === currentUser.name)
        : projects;

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
            siteEngineer: basicInfo.siteEngineer,
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
            className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors whitespace-nowrap min-w-[50px] sm:min-w-0 ${activeTab === id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
        >
            <i className={`${icon} text-base sm:text-sm`}></i>
            <span className="text-[9px] sm:text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <>
            {/* Mobile-First Hero Header */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 bg-emerald-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    {/* Top row with icon and actions */}
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl border border-white/20 shadow-lg">
                            <i className="fas fa-building-columns"></i>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                                <i className="fas fa-download text-sm sm:text-base"></i>
                            </button>
                            {!isEngineer && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500 flex items-center justify-center hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30"
                                >
                                    <i className="fas fa-plus text-sm sm:text-base"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Title section */}
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                            {isEngineer ? 'My Projects' : 'Project Hub'}
                        </h1>
                        <p className="text-sm sm:text-base text-white/70 font-medium">
                            {isEngineer ? 'Your assigned projects' : 'Construction Management'}
                        </p>
                    </div>

                    {/* Quick stats pills */}
                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs sm:text-sm font-semibold">{displayedProjects.filter(p => p.status === 'active').length} Active</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-xs sm:text-sm font-semibold">{displayedProjects.filter(p => p.status === 'planning').length} Planning</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                            <span className="text-xs sm:text-sm font-semibold">{displayedProjects.length} Total</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar - Mobile App Style */}
            <div className="flex gap-2 mb-4 sm:mb-6">
                <div className="flex-1 relative">
                    <i className="fas fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                    />
                </div>
                <button className="w-11 h-11 sm:w-12 sm:h-12 bg-white border border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                    <i className="fas fa-sliders-h text-slate-600"></i>
                </button>
            </div>

            {/* Section Title */}
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-800">All Projects</h2>
                <button className="text-xs sm:text-sm text-blue-600 font-semibold">See All</button>
            </div>

            {/* Project Cards - Mobile App Style */}
            <div className="space-y-3 sm:space-y-4">
                {displayedProjects.map((project) => (
                    <div 
                        key={project.id} 
                        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer group"
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{project.id}</span>
                                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                        project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                        project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                                        project.status === 'on-hold' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate pr-2">{project.name}</h3>
                            </div>
                            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all group-hover:bg-blue-500 group-hover:text-white">
                                <i className="fas fa-chevron-right text-xs sm:text-sm"></i>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3 sm:mb-4">
                            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">Progress</span>
                                <span className="text-xs sm:text-sm font-bold text-slate-800">{project.progress}%</span>
                            </div>
                            <div className="h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        project.progress > 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                        project.progress > 40 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    }`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Card Footer - Info Pills */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <i className="fas fa-user-tie text-[10px] sm:text-xs"></i>
                                <span className="text-[10px] sm:text-xs font-medium truncate max-w-[80px] sm:max-w-none">{project.manager}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <i className="fas fa-rupee-sign text-[10px] sm:text-xs"></i>
                                <span className="text-[10px] sm:text-xs font-medium">{project.budget}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <i className="fas fa-calendar text-[10px] sm:text-xs"></i>
                                <span className="text-[10px] sm:text-xs font-medium">{project.dueDate}</span>
                            </div>
                        </div>

                        {/* Action Buttons - Visible on hover/touch */}
                        <div className="flex gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                            <button className="flex-1 py-2 sm:py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                <i className="fas fa-eye"></i> View
                            </button>
                            <button className="flex-1 py-2 sm:py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                <i className="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {displayedProjects.length === 0 && (
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-folder-open text-2xl sm:text-3xl text-slate-400"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">No Projects Found</h3>
                    <p className="text-sm text-slate-500 mb-4">Get started by creating your first project</p>
                    {!isEngineer && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                        >
                            <i className="fas fa-plus mr-2"></i> New Project
                        </button>
                    )}
                </div>
            )}

            {/* --- CREATE PROJECT MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[85vh] sm:max-h-[95vh] flex flex-col sm:m-4">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2 sm:hidden flex-shrink-0"></div>
                        
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800">New Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
                                <i className="fas fa-times text-lg sm:text-xl"></i>
                            </button>
                        </div>

                        {/* Tabs - Scrollable on mobile */}
                        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/50 px-2 scrollbar-hide flex-shrink-0">
                            {renderTabButton('basic', 'Basic', 'fas fa-info-circle')}
                            {renderTabButton('inventory', 'Materials', 'fas fa-truck-loading')}
                            {renderTabButton('vendors', 'Vendors', 'fas fa-handshake')}
                            {renderTabButton('diagrams', 'Docs', 'fas fa-file-pdf')}
                            {renderTabButton('tasks', 'Tasks', 'fas fa-tasks')}
                            {renderTabButton('timeline', 'Timeline', 'fas fa-calendar-alt')}
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white min-h-0">

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
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
                                <button onClick={() => setShowModal(false)} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-xl sm:rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-white transition-all bg-white text-sm">
                                    Cancel
                                </button>
                                <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-xl sm:rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-all text-sm">
                                    Save as Draft
                                </button>
                                <button onClick={handleSubmit} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-xl sm:rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition-all text-sm">
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Projects;
