import { useState } from 'react';

const Tasks = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [assignee, setAssignee] = useState('');

    const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'

    // Add task counts to projects data for the card view
    const getProjectStats = (projectName) => {
        const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.completed];
        const projectTasks = allTasks.filter(t => t.project === projectName);
        return {
            total: projectTasks.length,
            todo: projectTasks.filter(t => tasks.todo.includes(t)).length,
            inProgress: projectTasks.filter(t => tasks.inProgress.includes(t)).length,
            completed: projectTasks.filter(t => tasks.completed.includes(t)).length
        };
    };

    const handleProjectSelect = (projectName) => {
        setSelectedProject(projectName);
        const project = projectsData.find(p => p.name === projectName);
        if (project) {
            setAssignee(project.engineer);
        }
        setViewMode('board');
    };

    const handleBackToProjects = () => {
        setViewMode('list');
        setSelectedProject('');
        setAssignee('');
    };

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const isEngineer = currentUser.role === 'engineer';

    // Simulated backend assignment
    const ENGINEER_PROJECT_MAP = {
        'engineer': 'Skyline Residential Complex' // The demo engineer is assigned this project
    };

    const allProjects = [
        { name: 'Skyline Residential Complex', engineer: 'Mike Wilson' },
        { name: 'Downtown Commercial Hub', engineer: 'Sarah Johnson' },
        { name: 'Riverside Industrial Park', engineer: 'David Lee' },
        { name: 'Green Valley Eco Park', engineer: 'Emma Davis' }
    ];

    const projectsData = isEngineer
        ? allProjects.filter(p => p.name === ENGINEER_PROJECT_MAP[currentUser.username] || p.name === 'Skyline Residential Complex') // Fallback for demo
        : allProjects;

    const handleProjectChange = (e) => {
        const projectName = e.target.value;
        setSelectedProject(projectName);
        const project = projectsData.find(p => p.name === projectName);
        if (project) {
            setAssignee(project.engineer);
        } else {
            setAssignee(''); // Clear assignee if no project or "Choose a project" is selected
        }
    };

    const [tasks, setTasks] = useState({
        todo: [
            { id: 1, title: 'Finalize Floor Plan', priority: 'high', desc: 'Confirm final changes to the floor plan for Block A.', assignee: 'Mike Wilson', due: '2 Days', project: 'Skyline Residential Complex' },
            { id: 2, title: 'Structural Safety Audit', priority: 'critical', desc: 'Perform a full safety audit on the newly erected scaffolding.', assignee: 'Sarah Johnson', due: '1 Day', project: 'Skyline Residential Complex' },
            { id: 3, title: 'Steel Reinforcement Check', priority: 'medium', desc: 'Inspect TMT bar alignment for the first-floor slab.', assignee: 'David Lee', due: '3 Days', project: 'Skyline Residential Complex' },
            { id: 10, title: 'HVAC Ducting Layout', priority: 'low', desc: 'Review electrical and HVAC ducting plans for basement.', assignee: 'Mike Wilson', due: '1 Week', project: 'Skyline Residential Complex' }
        ],
        inProgress: [
            { id: 4, title: 'Foundation Pouring', priority: 'critical', desc: 'Supervise concrete pouring for Block B - Section 1', assignee: 'Mike Wilson', due: 'Today', progress: 65, project: 'Skyline Residential Complex' },
            { id: 5, title: 'Basement Waterproofing', priority: 'high', desc: 'Application of damp-proofing membrane in the parking level.', assignee: 'Emma Davis', due: '2 Days', progress: 40, project: 'Skyline Residential Complex' },
            { id: 11, title: 'Curtain Wall Installation', priority: 'medium', desc: 'Installation of high-resistance glass panels on the facade.', assignee: 'John Smith', due: '5 Days', progress: 20, project: 'Downtown Commercial Hub' }
        ],
        completed: [
            { id: 6, title: 'Initial Site Excavation', priority: 'high', desc: 'Clearance and digging for primary foundation.', assignee: 'Sarah Johnson', due: 'Done', project: 'Skyline Residential Complex' },
            { id: 12, title: 'Material Log Setup', priority: 'low', desc: 'Set up the initial inventory tracking system.', assignee: 'Emma Davis', due: 'Done', project: 'Skyline Residential Complex' }
        ]
    });

    const handleCreateTask = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const status = formData.get('status') || 'todo';

        const newTask = {
            id: Date.now(),
            title: formData.get('title'),
            priority: formData.get('priority'),
            desc: formData.get('description'),
            assignee: formData.get('assignee'),
            due: formData.get('dueDate') || 'TBD',
            project: formData.get('project'),
            category: formData.get('category'),
            startDate: formData.get('startDate'),
            duration: formData.get('duration'),
            materials: formData.get('materials'),
            instructions: formData.get('instructions')
        };

        // Determine which category to update based on selected status
        const targetCategory =
            status === 'inProgress' ? 'inProgress' :
                status === 'completed' ? 'completed' :
                    'todo';

        setTasks(prev => ({
            ...prev,
            [targetCategory]: [...prev[targetCategory], newTask]
        }));
        setShowModal(false);
        // Reset form state

        alert('Task Created Successfully!');
    }

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleUpdateClick = (task) => {
        setSelectedTask(task);
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newStatus = formData.get('status');
        const progress = parseInt(formData.get('progress') || '0');

        // Find current status of selected task to know where to remove it from
        let currentCategory = '';
        if (tasks.todo.find(t => t.id === selectedTask.id)) currentCategory = 'todo';
        else if (tasks.inProgress.find(t => t.id === selectedTask.id)) currentCategory = 'inProgress';
        else if (tasks.completed.find(t => t.id === selectedTask.id)) currentCategory = 'completed';

        // Create updated task object
        const updatedTask = {
            ...selectedTask,
            progress: progress,
            priority: formData.get('priority') || selectedTask.priority
        };

        if (currentCategory === newStatus) {
            // Same category, just update the item
            setTasks(prev => ({
                ...prev,
                [currentCategory]: prev[currentCategory].map(t => t.id === selectedTask.id ? updatedTask : t)
            }));
        } else {
            // Move category
            setTasks(prev => ({
                ...prev,
                [currentCategory]: prev[currentCategory].filter(t => t.id !== selectedTask.id),
                [newStatus]: [...prev[newStatus], updatedTask]
            }));
        }

        setShowUpdateModal(false);
        setSelectedTask(null);
        alert('Task Updated Successfully!');
    };


    return (
        <>
            {/* Mobile-First Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                        {viewMode === 'board' && (
                            <button
                                onClick={handleBackToProjects}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
                            >
                                <i className="fas fa-arrow-left text-sm"></i>
                            </button>
                        )}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                {viewMode === 'list' ? 'Tasks' : selectedProject}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                                {viewMode === 'list'
                                    ? 'Select a project to manage tasks'
                                    : 'Manage tasks and track progress'}
                            </p>
                        </div>
                    </div>
                    {viewMode === 'board' && !isEngineer && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            <i className="fas fa-plus"></i>
                            <span>New Task</span>
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 animate-in fade-in">
                    {projectsData.map((project, idx) => {
                        const stats = getProjectStats(project.name);
                        return (
                            <div
                                key={idx}
                                onClick={() => handleProjectSelect(project.name)}
                                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border border-gray-100 group relative overflow-hidden"
                            >
                                {/* Left Accent */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                                        <i className="fas fa-building"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <i className="fas fa-user-circle"></i>
                                            <span className="truncate">{project.engineer}</span>
                                        </p>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full font-semibold flex-shrink-0">
                                        {stats.total}
                                    </span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
                                        <span>Progress</span>
                                        <span className="font-semibold">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                            style={{ width: `${(stats.completed / (stats.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Stats Row */}
                                <div className="flex gap-2 sm:gap-4 pt-3 border-t border-gray-100 text-[10px] sm:text-xs">
                                    <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-semibold">
                                        {stats.todo} To Do
                                    </span>
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-semibold">
                                        {stats.inProgress} Active
                                    </span>
                                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg font-semibold">
                                        {stats.completed} Done
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Kanban Board - Horizontal scroll on mobile */
                <div className="flex gap-3 sm:gap-4 md:gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-3 animate-in fade-in">
                    {/* To Do Column */}
                    <div className="min-w-[280px] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="border-t-4 border-indigo-500 px-3 sm:px-4 py-3 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">To Do</h3>
                                <span className="bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full">
                                    {tasks.todo.filter(t => t.project === selectedProject).length}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
                            {tasks.todo
                                .filter(t => t.project === selectedProject)
                                .map(task => (
                                    <div key={task.id} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">{task.title}</h4>
                                            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>{task.priority}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">{task.desc}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <i className="fas fa-user-circle text-gray-400"></i>
                                                <span className="truncate">{task.assignee}</span>
                                            </div>
                                            <span className="font-medium text-gray-600 flex-shrink-0">
                                                <i className="fas fa-clock mr-1"></i>{task.due}
                                            </span>
                                        </div>
                                        {isEngineer && (
                                            <button
                                                onClick={() => handleUpdateClick(task)}
                                                className="w-full mt-3 text-xs bg-blue-600 text-white px-3 py-2.5 rounded-xl hover:bg-blue-700 font-semibold transition-colors active:scale-95"
                                            >
                                                Update Progress
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {tasks.todo.filter(t => t.project === selectedProject).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    <i className="fas fa-inbox text-2xl mb-2 opacity-50"></i>
                                    <p>No tasks</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="min-w-[280px] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="border-t-4 border-orange-500 px-3 sm:px-4 py-3 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">In Progress</h3>
                                <span className="bg-orange-100 text-orange-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full">
                                    {tasks.inProgress.filter(t => t.project === selectedProject).length}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
                            {tasks.inProgress
                                .filter(t => t.project === selectedProject)
                                .map(task => (
                                    <div key={task.id} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">{task.title}</h4>
                                            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>{task.priority}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">{task.desc}</p>

                                        {/* Progress Bar */}
                                        {task.progress && (
                                            <div className="mb-3">
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all" style={{ width: `${task.progress}%` }}></div>
                                                </div>
                                                <div className="text-[10px] text-right text-gray-500 mt-1 font-semibold">{task.progress}%</div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <i className="fas fa-user-circle text-gray-400"></i>
                                                <span className="truncate">{task.assignee}</span>
                                            </div>
                                            <span className="font-medium text-gray-600 flex-shrink-0">
                                                <i className="fas fa-clock mr-1"></i>{task.due}
                                            </span>
                                        </div>
                                        {isEngineer && (
                                            <button
                                                onClick={() => handleUpdateClick(task)}
                                                className="w-full mt-3 text-xs bg-blue-600 text-white px-3 py-2.5 rounded-xl hover:bg-blue-700 font-semibold transition-colors active:scale-95"
                                            >
                                                Update Progress
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {tasks.inProgress.filter(t => t.project === selectedProject).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    <i className="fas fa-inbox text-2xl mb-2 opacity-50"></i>
                                    <p>No tasks</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="min-w-[280px] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="border-t-4 border-green-500 px-3 sm:px-4 py-3 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Completed</h3>
                                <span className="bg-green-100 text-green-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full">
                                    {tasks.completed.filter(t => t.project === selectedProject).length}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
                            {tasks.completed
                                .filter(t => t.project === selectedProject)
                                .map(task => (
                                    <div key={task.id} className="bg-gray-50/50 rounded-xl border border-gray-100 p-3 sm:p-4 opacity-75">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-500 text-sm sm:text-base line-clamp-2 line-through">{task.title}</h4>
                                            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                task.priority === 'critical' ? 'bg-red-50 text-red-400' :
                                                task.priority === 'high' ? 'bg-orange-50 text-orange-400' :
                                                task.priority === 'medium' ? 'bg-yellow-50 text-yellow-500' :
                                                'bg-gray-50 text-gray-400'
                                            }`}>{task.priority}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3">{task.desc}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <i className="fas fa-user-circle"></i>
                                                <span className="truncate">{task.assignee}</span>
                                            </div>
                                            <span className="font-semibold text-green-500 flex-shrink-0">
                                                <i className="fas fa-check mr-1"></i>Done
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            {tasks.completed.filter(t => t.project === selectedProject).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    <i className="fas fa-inbox text-2xl mb-2 opacity-50"></i>
                                    <p>No tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden"></div>
                        
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800">Add New Task</h3>
                            <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <form onSubmit={handleCreateTask} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Project *</label>
                                    <select
                                        name="project"
                                        value={selectedProject}
                                        onChange={handleProjectChange}
                                        className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white ${projectsData.length === 1 ? 'bg-gray-100' : ''}`}
                                        required
                                        disabled={projectsData.length === 1}
                                    >
                                        <option value="">Choose a project</option>
                                        {projectsData.map((proj, idx) => (
                                            <option key={idx} value={proj.name}>{proj.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Task Name *</label>
                                        <input type="text" name="title" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Foundation Excavation" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Category</label>
                                        <select name="category" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                                            <option value="">Select</option>
                                            <option value="construction">Construction</option>
                                            <option value="procurement">Procurement</option>
                                            <option value="inspection">Inspection</option>
                                            <option value="admin">Administrative</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
                                    <textarea name="description" rows="2" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Task details..."></textarea>
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Assignee *</label>
                                        <select
                                            name="assignee"
                                            value={assignee}
                                            onChange={(e) => setAssignee(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                                        >
                                            <option value="">Select</option>
                                            <option value="Mike Wilson">Mike</option>
                                            <option value="Sarah Johnson">Sarah</option>
                                            <option value="David Lee">David</option>
                                            <option value="Emma Davis">Emma</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Priority *</label>
                                        <select name="priority" className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
                                        <select name="status" className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                                            <option value="todo">To Do</option>
                                            <option value="inProgress">In Progress</option>
                                            <option value="completed">Done</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Start Date</label>
                                        <input type="date" name="startDate" className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Due Date</label>
                                        <input type="date" name="dueDate" className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-600" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Duration (Days)</label>
                                        <input type="number" name="duration" min="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="0" />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t safe-area-bottom">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-sm text-gray-700 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-lg transition-all active:scale-95">Create Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showUpdateModal && selectedTask && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md flex flex-col max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden"></div>
                        
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800">Update Progress</h3>
                            <button onClick={() => setShowUpdateModal(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <form onSubmit={handleUpdateSubmit} className="space-y-5 sm:space-y-6">
                                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Task</p>
                                    <h4 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{selectedTask.title}</h4>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-3">Progress</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            name="progress"
                                            min="0"
                                            max="100"
                                            defaultValue={selectedTask.progress || 0}
                                            className="grow h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            onChange={(e) => {
                                                const val = e.target.nextElementSibling;
                                                val.textContent = `${e.target.value}%`;
                                            }}
                                        />
                                        <span className="text-xl font-bold text-blue-600 min-w-[60px] text-right">{selectedTask.progress || 0}%</span>
                                    </div>
                                </div>

                                <div className={`grid ${isEngineer ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4`}>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
                                        <select
                                            name="status"
                                            defaultValue={
                                                tasks.todo.find(t => t.id === selectedTask.id) ? 'todo' :
                                                    tasks.inProgress.find(t => t.id === selectedTask.id) ? 'inProgress' : 'completed'
                                            }
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="inProgress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                    {!isEngineer && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Priority</label>
                                            <select name="priority" defaultValue={selectedTask.priority} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="critical">Critical</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4 border-t safe-area-bottom">
                                    <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-sm text-gray-700 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-lg transition-all active:scale-95">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tasks;
