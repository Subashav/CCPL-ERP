const Dashboard = () => {
    return (
        <>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome to CCPL Construction ERP System</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <i className="fas fa-project-diagram"></i>
                    </div>
                    <div className="stat-content">
                        <h3>12</h3>
                        <p>Active Projects</p>
                        <div className="stat-trend positive">
                            <i className="fas fa-arrow-up"></i> 2 new this month
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon warning">
                        <i className="fas fa-tasks"></i>
                    </div>
                    <div className="stat-content">
                        <h3>45</h3>
                        <p>Pending Tasks</p>
                        <div className="stat-trend negative">
                            <i className="fas fa-arrow-up"></i> 5 overdue
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>128</h3>
                        <p>Active Staff</p>
                        <div className="stat-trend positive">
                            <i className="fas fa-check"></i> 98% attendance
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon info">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Low</h3>
                        <p>Stock Alerts</p>
                        <div className="stat-trend warning">
                            <i className="fas fa-exclamation-triangle"></i> 3 items low
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title">Recent Activity</h3>
                        <button className="btn btn-sm btn-outline">View All</button>
                    </div>
                    <div className="card-body p-0">
                        <div className="activity-list">
                            <div className="activity-item px-6 py-4 border-b border-gray-100 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <i className="fas fa-plus"></i>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">New Project Created</div>
                                    <p className="text-sm text-gray-600">"Metro Station Phase 2" was initiated</p>
                                    <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                                </div>
                            </div>

                            <div className="activity-item px-6 py-4 border-b border-gray-100 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <i className="fas fa-check"></i>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">Task Completed</div>
                                    <p className="text-sm text-gray-600">Foundation pouring at Site A finished</p>
                                    <div className="text-xs text-gray-500 mt-1">4 hours ago</div>
                                </div>
                            </div>

                            <div className="activity-item px-6 py-4 border-b border-gray-100 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">Stock Alert</div>
                                    <p className="text-sm text-gray-600">Cement inventory running low at Site B</p>
                                    <div className="text-xs text-gray-500 mt-1">5 hours ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title">Pending Approvals</h3>
                        <span className="badge badge-warning">3 Pending</span>
                    </div>
                    <div className="card-body p-4">
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition-shadow bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <i className="fas fa-box-open"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Material Request #1023</h4>
                                        <p className="text-sm text-gray-600">500 bags of Cement for Site A</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="btn btn-sm btn-success flex-1 sm:flex-none">Approve</button>
                                    <button className="btn btn-sm btn-danger flex-1 sm:flex-none">Reject</button>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition-shadow bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <i className="fas fa-clipboard-check"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Leave Request</h4>
                                        <p className="text-sm text-gray-600">John Doe - 2 days (Sick Leave)</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="btn btn-sm btn-success flex-1 sm:flex-none">Approve</button>
                                    <button className="btn btn-sm btn-danger flex-1 sm:flex-none">Reject</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
