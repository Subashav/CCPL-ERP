import { useNavigate } from 'react-router-dom';

const EngineerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-in fade-in">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Site Execution Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, Site Engineer. Here is your daily overview.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-gray-500">Current Project</p>
                    <p className="text-lg font-bold text-blue-600">Skyline Residential Complex</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl">
                            <i className="fas fa-clipboard-list"></i>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">Today</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">12</h3>
                    <p className="text-gray-500 text-sm">Pending Tasks</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg text-xl">
                            <i className="fas fa-hard-hat"></i>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Active</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">45</h3>
                    <p className="text-gray-500 text-sm">Labour On Site</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xl">
                            <i className="fas fa-exclamation-circle"></i>
                        </div>
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">Urgent</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">3</h3>
                    <p className="text-gray-500 text-sm">Open Issues</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg text-xl">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">This Week</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">85%</h3>
                    <p className="text-gray-500 text-sm">Target Completion</p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button
                    onClick={() => navigate('/engineer/updates')}
                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all group"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl group-hover:bg-white/30 transition-colors">
                        <i className="fas fa-edit"></i>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-lg">Update Progress</h4>
                        <p className="text-blue-100 text-sm">Submit daily task logs</p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/engineer/photos')}
                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all group"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl group-hover:bg-white/30 transition-colors">
                        <i className="fas fa-camera"></i>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-lg">Upload Photos</h4>
                        <p className="text-purple-100 text-sm">Site & work proofs</p>
                    </div>
                </button>

                <button className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all group">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl group-hover:bg-white/30 transition-colors">
                        <i className="fas fa-user-clock"></i>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-lg">Labour Entry</h4>
                        <p className="text-emerald-100 text-sm">Daily attendance</p>
                    </div>
                </button>
            </div>

            {/* Recent Activity / Tasks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Assigned Tasks (Today)</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="p-4 font-semibold">Task Name</th>
                                <th className="p-4 font-semibold">Priority</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Due Time</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-semibold text-gray-800">Foundation Pouring - Block A</p>
                                    <p className="text-xs text-gray-500">Concrete Works</p>
                                </td>
                                <td className="p-4">
                                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">CRITICAL</span>
                                </td>
                                <td className="p-4">
                                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">In Progress</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <i className="fas fa-clock mr-1"></i> 4:00 PM
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-semibold text-gray-800">Safety Compliance Check</p>
                                    <p className="text-xs text-gray-500">Inspection</p>
                                </td>
                                <td className="p-4">
                                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">HIGH</span>
                                </td>
                                <td className="p-4">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">Pending</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <i className="fas fa-clock mr-1"></i> 11:00 AM
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-semibold text-gray-800">Unload Steel Delivery</p>
                                    <p className="text-xs text-gray-500">Material Handling</p>
                                </td>
                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-bold">MEDIUM</span>
                                </td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-bold">Completed</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <i className="fas fa-check mr-1 text-green-500"></i> Done
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EngineerDashboard;
