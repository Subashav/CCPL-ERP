import { useState } from 'react';

const Tasks = () => {
    const [showModal, setShowModal] = useState(false);

    const [tasks, setTasks] = useState({
        todo: [
            { id: 1, title: 'Site Survey', priority: 'high', desc: 'Conduct initial site survey', assignee: 'Mike Wilson', due: '2 Days' },
            { id: 2, title: 'Material Order', priority: 'medium', desc: 'Order cement and steel', assignee: 'Sarah Johnson', due: '5 Days' },
            { id: 3, title: 'Update Blueprints', priority: 'low', desc: 'Incorporate client changes', assignee: 'David Lee', due: '1 Week' }
        ],
        inProgress: [
            { id: 4, title: 'Foundation Pouring', priority: 'critical', desc: 'Supervise concrete pouring', assignee: 'John Smith', due: 'Today', progress: 60 },
            { id: 5, title: 'Safety Inspection', priority: 'high', desc: 'Weekly safety audit', assignee: 'Emma Davis', due: '2 Days' }
        ],
        completed: [
            { id: 6, title: 'Client Meeting', priority: 'low', desc: 'Requirement gathering', assignee: 'Sarah Johnson', due: 'Done' }
        ]
    });

    const handleCreateTask = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTask = {
            id: Date.now(),
            title: formData.get('title'),
            priority: formData.get('priority'),
            desc: formData.get('description'),
            assignee: formData.get('assignee'),
            due: formData.get('dueDate') || 'TBD'
        };

        setTasks(prev => ({
            ...prev,
            todo: [...prev.todo, newTask]
        }));
        setShowModal(false);
        alert('Task Created Successfully!');
    }

    return (
        <>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1>Task Management</h1>
                    <p>Track and manage project tasks</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                >
                    <i className="fas fa-plus"></i> New Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 h-full">
                {/* To Do Column */}
                <div className="task-column">
                    <div className="task-column-header border-t-4 border-indigo-500">
                        <h3 className="task-column-title">To Do</h3>
                        <span className="task-count">{tasks.todo.length}</span>
                    </div>
                    <div className="task-list">
                        {tasks.todo.map(task => (
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
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="task-column">
                    <div className="task-column-header border-t-4 border-orange-500">
                        <h3 className="task-column-title">In Progress</h3>
                        <span className="task-count">{tasks.inProgress.length}</span>
                    </div>
                    <div className="task-list">
                        {tasks.inProgress.map(task => (
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
                    </div>
                </div>

                {/* Completed Column */}
                <div className="task-column">
                    <div className="task-column-header border-t-4 border-green-500">
                        <h3 className="task-column-title">Completed</h3>
                        <span className="task-count">{tasks.completed.length}</span>
                    </div>
                    <div className="task-list">
                        {tasks.completed.map(task => (
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
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-lg font-bold">Create New Task</h3>
                            <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Task Title *</label>
                                    <input type="text" name="title" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Inspect Foundation" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                                        <select name="priority" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                                        <input type="date" name="dueDate" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Assignee</label>
                                    <select name="assignee" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                                        <option value="Mike Wilson">Mike Wilson</option>
                                        <option value="Sarah Johnson">Sarah Johnson</option>
                                        <option value="David Lee">David Lee</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                    <textarea name="description" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" placeholder="Task details..."></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md">Create Task</button>
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
