import { useState, useEffect } from 'react';
import { 
    Users, Plus, Search, Filter, Calendar, Clock, IndianRupee, 
    UserCheck, UserX, TrendingUp, Download, ChevronDown, Edit2, 
    Trash2, Eye, MapPin, Phone, Award, Briefcase
} from 'lucide-react';

const Labour = () => {
    const [activeTab, setActiveTab] = useState('workers');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [workers, setWorkers] = useState([]);
    const [attendance, setAttendance] = useState({});

    // Initialize mock data
    useEffect(() => {
        const stored = localStorage.getItem('labour_workers');
        if (stored) {
            setWorkers(JSON.parse(stored));
        } else {
            const initialWorkers = [
                { id: 'W001', name: 'Ramesh Kumar', category: 'Mason', phone: '9876543210', address: 'Village Rampur', dailyWage: 850, status: 'Active', joiningDate: '2024-01-15', skills: ['Brick Work', 'Plastering'], project: 'Horizon Tower' },
                { id: 'W002', name: 'Suresh Singh', category: 'Helper', phone: '9876543211', address: 'Sector 12', dailyWage: 550, status: 'Active', joiningDate: '2024-02-20', skills: ['Material Handling'], project: 'Horizon Tower' },
                { id: 'W003', name: 'Ajay Sharma', category: 'Carpenter', phone: '9876543212', address: 'Old City', dailyWage: 900, status: 'Active', joiningDate: '2023-11-10', skills: ['Formwork', 'Shuttering'], project: 'Green Valley' },
                { id: 'W004', name: 'Vikram Yadav', category: 'Electrician', phone: '9876543213', address: 'New Colony', dailyWage: 950, status: 'Inactive', joiningDate: '2023-09-05', skills: ['Wiring', 'Panel Installation'], project: '' },
                { id: 'W005', name: 'Deepak Gupta', category: 'Plumber', phone: '9876543214', address: 'Indira Nagar', dailyWage: 900, status: 'Active', joiningDate: '2024-03-01', skills: ['Pipe Fitting', 'Drainage'], project: 'Metro Complex' },
                { id: 'W006', name: 'Mohan Verma', category: 'Welder', phone: '9876543215', address: 'Sector 8', dailyWage: 1000, status: 'Active', joiningDate: '2023-08-12', skills: ['Arc Welding', 'Gas Cutting'], project: 'Horizon Tower' },
                { id: 'W007', name: 'Rajesh Tiwari', category: 'Mason', phone: '9876543216', address: 'Gandhi Nagar', dailyWage: 800, status: 'Active', joiningDate: '2024-01-25', skills: ['Brick Work', 'Tile Work'], project: 'Green Valley' },
                { id: 'W008', name: 'Sanjay Patel', category: 'Painter', phone: '9876543217', address: 'MG Road', dailyWage: 750, status: 'Active', joiningDate: '2024-02-10', skills: ['Interior Paint', 'POP Work'], project: 'Metro Complex' },
            ];
            setWorkers(initialWorkers);
            localStorage.setItem('labour_workers', JSON.stringify(initialWorkers));
        }

        const storedAttendance = localStorage.getItem('labour_attendance');
        if (storedAttendance) {
            setAttendance(JSON.parse(storedAttendance));
        }
    }, []);

    const categories = ['all', 'Mason', 'Helper', 'Carpenter', 'Electrician', 'Plumber', 'Welder', 'Painter'];

    const filteredWorkers = workers.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              w.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        totalWorkers: workers.length,
        activeWorkers: workers.filter(w => w.status === 'Active').length,
        presentToday: Object.values(attendance).filter(a => a.status === 'Present').length,
        totalWages: workers.filter(w => w.status === 'Active').reduce((sum, w) => sum + w.dailyWage, 0)
    };

    const handleAddWorker = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const newWorker = {
            id: 'W' + String(workers.length + 1).padStart(3, '0'),
            name: data.name,
            category: data.category,
            phone: data.phone,
            address: data.address,
            dailyWage: parseInt(data.dailyWage),
            status: 'Active',
            joiningDate: new Date().toISOString().split('T')[0],
            skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
            project: data.project || ''
        };

        const updated = [...workers, newWorker];
        setWorkers(updated);
        localStorage.setItem('labour_workers', JSON.stringify(updated));
        setShowAddModal(false);
        e.target.reset();
    };

    const markAttendance = (workerId, status) => {
        const today = new Date().toISOString().split('T')[0];
        const updated = {
            ...attendance,
            [`${workerId}_${today}`]: { status, time: new Date().toLocaleTimeString() }
        };
        setAttendance(updated);
        localStorage.setItem('labour_attendance', JSON.stringify(updated));
    };

    const getCategoryColor = (cat) => {
        const colors = {
            Mason: 'bg-orange-100 text-orange-700',
            Helper: 'bg-gray-100 text-gray-700',
            Carpenter: 'bg-amber-100 text-amber-700',
            Electrician: 'bg-yellow-100 text-yellow-700',
            Plumber: 'bg-blue-100 text-blue-700',
            Welder: 'bg-red-100 text-red-700',
            Painter: 'bg-purple-100 text-purple-700'
        };
        return colors[cat] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Labour Management</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Manage workers, attendance, and wage payments</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                        <Download size={16} /> Export
                    </button>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                    >
                        <Plus size={16} /> Add Worker
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Total Workers</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users size={16} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalWorkers}</p>
                    <p className="text-xs text-gray-400 mt-1">Registered workforce</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Active Today</span>
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <UserCheck size={16} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats.activeWorkers}</p>
                    <p className="text-xs text-green-500 mt-1">Currently employed</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Present Today</span>
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Clock size={16} className="text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats.presentToday}</p>
                    <p className="text-xs text-gray-400 mt-1">Marked attendance</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Daily Wages</span>
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <IndianRupee size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">₹{stats.totalWages.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Total daily cost</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4 overflow-x-auto">
                {['workers', 'attendance', 'payments'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize whitespace-nowrap transition-all ${
                            activeTab === tab 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search workers by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                </select>
            </div>

            {/* Workers List */}
            {activeTab === 'workers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorkers.map(worker => (
                        <div key={worker.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                            {worker.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{worker.name}</h3>
                                            <p className="text-xs text-gray-500">{worker.id}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {worker.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Briefcase size={14} className="text-gray-400" />
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(worker.category)}`}>
                                            {worker.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} className="text-gray-400" />
                                        <span>{worker.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span className="truncate">{worker.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <IndianRupee size={14} className="text-gray-400" />
                                        <span className="font-semibold text-slate-900">₹{worker.dailyWage}/day</span>
                                    </div>
                                </div>

                                {worker.project && (
                                    <div className="bg-blue-50 px-3 py-2 rounded-lg mb-3">
                                        <p className="text-xs text-blue-600 font-medium">Assigned to: {worker.project}</p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
                                        <Eye size={12} /> View
                                    </button>
                                    <button className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-1">
                                        <Edit2 size={12} /> Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-slate-900">Today's Attendance - {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredWorkers.filter(w => w.status === 'Active').map(worker => {
                            const today = new Date().toISOString().split('T')[0];
                            const att = attendance[`${worker.id}_${today}`];
                            return (
                                <div key={worker.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
                                            {worker.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{worker.name}</h4>
                                            <p className="text-xs text-gray-500">{worker.category} • {worker.project || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {att ? (
                                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                                att.status === 'Present' ? 'bg-green-100 text-green-700' : 
                                                att.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {att.status} at {att.time}
                                            </span>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => markAttendance(worker.id, 'Present')}
                                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all"
                                                >
                                                    Present
                                                </button>
                                                <button 
                                                    onClick={() => markAttendance(worker.id, 'Absent')}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all"
                                                >
                                                    Absent
                                                </button>
                                                <button 
                                                    onClick={() => markAttendance(worker.id, 'Half Day')}
                                                    className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-all"
                                                >
                                                    Half
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Wage Payments</h3>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-2">
                            <IndianRupee size={14} /> Process Payments
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Worker</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Days Worked</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Daily Rate</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Due</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredWorkers.filter(w => w.status === 'Active').map(worker => {
                                    const daysWorked = Math.floor(Math.random() * 26) + 5; // Mock data
                                    const totalDue = daysWorked * worker.dailyWage;
                                    return (
                                        <tr key={worker.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                        {worker.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-900">{worker.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(worker.category)}`}>
                                                    {worker.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-700">{daysWorked} days</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-700">₹{worker.dailyWage}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-slate-900">₹{totalDue.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Pending</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Worker Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Add New Worker</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleAddWorker} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Enter worker name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        {categories.filter(c => c !== 'all').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Daily Wage (₹) *</label>
                                    <input
                                        name="dailyWage"
                                        type="number"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="850"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                <input
                                    name="address"
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Village/Sector, City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Skills (comma separated)</label>
                                <input
                                    name="skills"
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Brick Work, Plastering"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Assign to Project</label>
                                <select
                                    name="project"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="">Unassigned</option>
                                    <option value="Horizon Tower">Horizon Tower</option>
                                    <option value="Green Valley">Green Valley</option>
                                    <option value="Metro Complex">Metro Complex</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
                                >
                                    Add Worker
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Labour;
