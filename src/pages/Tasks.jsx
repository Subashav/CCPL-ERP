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
            { id: 1, title: 'Site Survey', priority: 'high', desc: 'Conduct initial site survey', assignee: 'Mike Wilson', due: '2 Days', project: 'Skyline Residential Complex' },
            { id: 2, title: 'Material Order', priority: 'medium', desc: 'Order cement and steel', assignee: 'Sarah Johnson', due: '5 Days', project: 'Downtown Commercial Hub' },
            { id: 3, title: 'Update Blueprints', priority: 'low', desc: 'Incorporate client changes', assignee: 'David Lee', due: '1 Week', project: 'Riverside Industrial Park' }
        ],
        inProgress: [
            { id: 4, title: 'Foundation Pouring', priority: 'critical', desc: 'Supervise concrete pouring', assignee: 'John Smith', due: 'Today', progress: 60, project: 'Skyline Residential Complex' },
            { id: 5, title: 'Safety Inspection', priority: 'high', desc: 'Weekly safety audit', assignee: 'Emma Davis', due: '2 Days', project: 'Green Valley Eco Park' }
        ],
        completed: [
            { id: 6, title: 'Client Meeting', priority: 'low', desc: 'Requirement gathering', assignee: 'Sarah Johnson', due: 'Done', project: 'Downtown Commercial Hub' }
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


    return (
        <>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {viewMode === 'list' ? 'Task Management' : selectedProject}
                    </h1>
                    <p className="text-gray-600">
                        {viewMode === 'list'
                            ? 'Select a project to manage tasks'
                            : 'Manage tasks and track progress'}
                    </p>
                </div>
                {viewMode === 'board' && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleBackToProjects}
                            className="btn btn-outline"
                        >
                            <i className="fas fa-arrow-left"></i> Back to Projects
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus"></i> New Task
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                    {projectsData.map((project, idx) => {
                        const stats = getProjectStats(project.name);
                        return (
                            <div
                                key={idx}
                                onClick={() => handleProjectSelect(project.name)}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                        <i className="fas fa-building-columns"></i>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                        {stats.total} Tasks
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <i className="fas fa-user-circle"></i> {project.engineer}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Progress</span>
                                        <span>{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                                            style={{ width: `${(stats.completed / (stats.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
                                        <span className="text-orange-600 font-medium">
                                            {stats.todo} To Do
                                        </span>
                                        <span className="text-blue-600 font-medium">
                                            {stats.inProgress} In Progress
                                        </span>
                                        <span className="text-green-600 font-medium">
                                            {stats.completed} Done
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 h-full animate-in fade-in">
                    {/* To Do Column */}
                    <div className="task-column">
                        <div className="task-column-header border-t-4 border-indigo-500">
                            <h3 className="task-column-title">To Do</h3>
                            <span className="task-count">
                                {tasks.todo.filter(t => t.project === selectedProject).length}
                            </span>
                        </div>
                        <div className="task-list">
                            {tasks.todo
                                .filter(t => t.project === selectedProject)
                                .map(task => (
                                    <div key={task.id} className="task-card">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="task-title">{task.title}</h4>
                                            <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                                        </div>
                                        <div className="task-description">{task.desc}</div>
                                        <div className="task-meta border-t pt-3 mt-3 border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-user-circle"></i> {task.assignee}
                                            </div>
                                            <div className="ml-auto font-medium text-gray-600">
                                                <i className="fas fa-clock mr-1"></i> {task.due}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {tasks.todo.filter(t => t.project === selectedProject).length === 0 && (
                                <div className="text-center p-4 text-gray-400 text-sm italic">No tasks in To Do</div>
                            )}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="task-column">
                        <div className="task-column-header border-t-4 border-orange-500">
                            <h3 className="task-column-title">In Progress</h3>
                            <span className="task-count">
                                {tasks.inProgress.filter(t => t.project === selectedProject).length}
                            </span>
                        </div>
                        <div className="task-list">
                            {tasks.inProgress
                                .filter(t => t.project === selectedProject)
                                .map(task => (
                                    <div key={task.id} className="task-card">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="task-title">{task.title}</h4>
                                            <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                                        </div>
                                        <div className="task-description">{task.desc}</div>

                                        {task.progress && (
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                                                </div>
                                                <div className="text-[10px] text-right text-gray-500">{task.progress}% Complete</div>
                                            </div>
                                        )}

                                        <div className="task-meta border-t pt-3 mt-3 border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-user-circle"></i> {task.assignee}
                                            </div>
                                            <div className="ml-auto font-medium text-gray-600">
                                                <i className="fas fa-clock mr-1"></i> {task.due}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {tasks.inProgress.filter(t => t.project === selectedProject).length === 0 && (
                                <div className="text-center p-4 text-gray-400 text-sm italic">No tasks in Progress</div>
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="task-column">
                        <div className="task-column-header border-t-4 border-green-500">
                            <h3 className="task-column-title">Completed</h3>
                            <span className="task-count">
                                {tasks.completed.filter(t => t.project === selectedProject).length}
                            </span>
                        </div>
                        <div className="task-list">
                            {tasks.completed
                                .filter(t => t.project === selectedProject)
                                .map(task => (
                                    <div key={task.id} className="task-card opacity-75">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="task-title line-through text-gray-500">{task.title}</h4>
                                            <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                                        </div>
                                        <div className="task-description text-gray-500">{task.desc}</div>
                                        <div className="task-meta border-t pt-3 mt-3 border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <i className="fas fa-user-circle"></i> {task.assignee}
                                            </div>
                                            <div className="ml-auto font-medium text-green-600">
                                                <i className="fas fa-check mr-1"></i> Done
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {tasks.completed.filter(t => t.project === selectedProject).length === 0 && (
                                <div className="text-center p-4 text-gray-400 text-sm italic">No tasks Completed</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800">Add Task to Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleCreateTask} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Project *</label>
                                    <select
                                        name="project"
                                        value={selectedProject}
                                        onChange={handleProjectChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                                        required
                                    >
                                        <option value="">Choose a project</option>
                                        {projectsData.map((proj, idx) => (
                                            <option key={idx} value={proj.name}>{proj.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Task Name *</label>
                                        <input type="text" name="title" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Foundation Excavation" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Task Category *</label>
                                        <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                                            <option value="">Select Category</option>
                                            <option value="construction">Construction</option>
                                            <option value="procurement">Procurement</option>
                                            <option value="inspection">Inspection</option>
                                            <option value="admin">Administrative</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Task Description</label>
                                    <textarea name="description" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Detailed task description..."></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Assigned To *</label>
                                        <select
                                            name="assignee"
                                            value={assignee}
                                            onChange={(e) => setAssignee(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                                        >
                                            <option value="">Select Assignee</option>
                                            <option value="Mike Wilson">Mike Wilson</option>
                                            <option value="Sarah Johnson">Sarah Johnson</option>
                                            <option value="David Lee">David Lee</option>
                                            <option value="Emma Davis">Emma Davis</option>
                                            <option value="John Smith">John Smith</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Priority *</label>
                                        <select name="priority" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                        <select name="status" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                                            <option value="todo">Not Started</option>
                                            <option value="inProgress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="onHold">On Hold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                                        <div className="relative">
                                            <input type="date" name="startDate" className="w-full border border-gray-300 rounded-lg pl-3 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                                        <div className="relative">
                                            <input type="date" name="dueDate" className="w-full border border-gray-300 rounded-lg pl-3 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Duration (Days)</label>
                                        <input type="number" name="duration" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="0" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Required Materials</label>
                                        <textarea name="materials" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="List required materials..."></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Special Instructions</label>
                                        <textarea name="instructions" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Any special instructions..."></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm text-gray-700 transition-colors">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md hover:shadow-lg transition-all">Create Task</button>
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
