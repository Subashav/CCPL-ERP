import { useState, useEffect } from 'react';
import { 
    FileEdit, Plus, Calendar, Clock, CheckCircle2, AlertCircle,
    Users, Package, Truck, Cloud, Sun, CloudRain, Wind,
    Camera, Send, Eye, ChevronDown, MapPin, Briefcase,
    TrendingUp, Activity, Save, X
} from 'lucide-react';

const DailyUpdates = () => {
    const [showForm, setShowForm] = useState(false);
    const [updates, setUpdates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const stored = localStorage.getItem('engineer_daily_updates');
        if (stored) {
            setUpdates(JSON.parse(stored));
        } else {
            const initialUpdates = [
                {
                    id: 'UPD-001',
                    date: '2024-02-14',
                    project: 'Horizon Tower',
                    submittedBy: 'Rajesh Kumar',
                    submittedAt: '18:30',
                    weather: 'Sunny',
                    workProgress: [
                        { task: 'Column casting - Floor 5', progress: 100, status: 'Completed' },
                        { task: 'Beam formwork - Floor 6', progress: 60, status: 'In Progress' },
                        { task: 'Rebar tying - Floor 6', progress: 30, status: 'In Progress' },
                    ],
                    manpower: { skilled: 45, unskilled: 28, total: 73 },
                    materials: [
                        { item: 'Cement', received: '200 bags', used: '150 bags' },
                        { item: 'Steel', received: '5 tons', used: '3.5 tons' },
                    ],
                    equipment: ['Crane 1 - Operational', 'Crane 2 - Maintenance', 'Mixer - Operational'],
                    issues: 'Crane 2 under maintenance, expected back tomorrow',
                    tomorrowPlan: 'Complete beam formwork Floor 6, start slab work',
                    photos: 3,
                    status: 'Submitted'
                },
                {
                    id: 'UPD-002',
                    date: '2024-02-13',
                    project: 'Horizon Tower',
                    submittedBy: 'Rajesh Kumar',
                    submittedAt: '18:15',
                    weather: 'Cloudy',
                    workProgress: [
                        { task: 'Column casting - Floor 4', progress: 100, status: 'Completed' },
                        { task: 'Column formwork - Floor 5', progress: 100, status: 'Completed' },
                    ],
                    manpower: { skilled: 42, unskilled: 30, total: 72 },
                    materials: [
                        { item: 'Cement', received: '250 bags', used: '200 bags' },
                    ],
                    equipment: ['Crane 1 - Operational', 'Crane 2 - Operational'],
                    issues: 'None',
                    tomorrowPlan: 'Start Floor 5 column casting',
                    photos: 5,
                    status: 'Submitted'
                },
            ];
            setUpdates(initialUpdates);
            localStorage.setItem('engineer_daily_updates', JSON.stringify(initialUpdates));
        }
    }, []);

    const [formData, setFormData] = useState({
        weather: 'Sunny',
        workProgress: [{ task: '', progress: 0, status: 'In Progress' }],
        manpower: { skilled: 0, unskilled: 0 },
        materials: [{ item: '', received: '', used: '' }],
        equipment: [''],
        issues: '',
        tomorrowPlan: ''
    });

    const addWorkItem = () => {
        setFormData({
            ...formData,
            workProgress: [...formData.workProgress, { task: '', progress: 0, status: 'In Progress' }]
        });
    };

    const addMaterialItem = () => {
        setFormData({
            ...formData,
            materials: [...formData.materials, { item: '', received: '', used: '' }]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newUpdate = {
            id: `UPD-${String(updates.length + 1).padStart(3, '0')}`,
            date: selectedDate,
            project: 'Horizon Tower',
            submittedBy: 'Site Engineer',
            submittedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            weather: formData.weather,
            workProgress: formData.workProgress.filter(w => w.task),
            manpower: {
                skilled: parseInt(formData.manpower.skilled) || 0,
                unskilled: parseInt(formData.manpower.unskilled) || 0,
                total: (parseInt(formData.manpower.skilled) || 0) + (parseInt(formData.manpower.unskilled) || 0)
            },
            materials: formData.materials.filter(m => m.item),
            equipment: formData.equipment.filter(e => e),
            issues: formData.issues || 'None',
            tomorrowPlan: formData.tomorrowPlan,
            photos: 0,
            status: 'Submitted'
        };

        const updated = [newUpdate, ...updates];
        setUpdates(updated);
        localStorage.setItem('engineer_daily_updates', JSON.stringify(updated));
        setShowForm(false);
        setFormData({
            weather: 'Sunny',
            workProgress: [{ task: '', progress: 0, status: 'In Progress' }],
            manpower: { skilled: 0, unskilled: 0 },
            materials: [{ item: '', received: '', used: '' }],
            equipment: [''],
            issues: '',
            tomorrowPlan: ''
        });
    };

    const WeatherIcon = ({ weather }) => {
        switch(weather) {
            case 'Sunny': return <Sun size={16} className="text-amber-500" />;
            case 'Cloudy': return <Cloud size={16} className="text-gray-500" />;
            case 'Rainy': return <CloudRain size={16} className="text-blue-500" />;
            case 'Windy': return <Wind size={16} className="text-cyan-500" />;
            default: return <Sun size={16} className="text-amber-500" />;
        }
    };

    const todayUpdate = updates.find(u => u.date === new Date().toISOString().split('T')[0]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Daily Progress Updates</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Submit and track daily site progress reports</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2 text-sm shadow-lg"
                >
                    <Plus size={16} /> New Update
                </button>
            </div>

            {/* Today's Status */}
            {!showForm && (
                <div className={`mb-6 p-4 rounded-xl border ${todayUpdate ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-center gap-3">
                        {todayUpdate ? (
                            <>
                                <CheckCircle2 size={20} className="text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-800">Today's update submitted</p>
                                    <p className="text-xs text-green-600">Submitted at {todayUpdate.submittedAt} by {todayUpdate.submittedBy}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={20} className="text-amber-600" />
                                <div>
                                    <p className="font-semibold text-amber-800">Today's update pending</p>
                                    <p className="text-xs text-amber-600">Please submit your daily progress report</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* New Update Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">New Daily Update</h2>
                            <p className="text-sm text-gray-500">Fill in today's progress details</p>
                        </div>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                        {/* Date & Weather */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Weather</label>
                                <select
                                    value={formData.weather}
                                    onChange={(e) => setFormData({...formData, weather: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="Sunny">☀️ Sunny</option>
                                    <option value="Cloudy">☁️ Cloudy</option>
                                    <option value="Rainy">🌧️ Rainy</option>
                                    <option value="Windy">💨 Windy</option>
                                </select>
                            </div>
                        </div>

                        {/* Work Progress */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-gray-700">Work Progress</label>
                                <button type="button" onClick={addWorkItem} className="text-xs text-blue-600 font-medium hover:underline">+ Add Task</button>
                            </div>
                            {formData.workProgress.map((work, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Task description"
                                        value={work.task}
                                        onChange={(e) => {
                                            const updated = [...formData.workProgress];
                                            updated[idx].task = e.target.value;
                                            setFormData({...formData, workProgress: updated});
                                        }}
                                        className="col-span-6 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        placeholder="%"
                                        min="0"
                                        max="100"
                                        value={work.progress}
                                        onChange={(e) => {
                                            const updated = [...formData.workProgress];
                                            updated[idx].progress = e.target.value;
                                            setFormData({...formData, workProgress: updated});
                                        }}
                                        className="col-span-2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                    <select
                                        value={work.status}
                                        onChange={(e) => {
                                            const updated = [...formData.workProgress];
                                            updated[idx].status = e.target.value;
                                            setFormData({...formData, workProgress: updated});
                                        }}
                                        className="col-span-4 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Delayed">Delayed</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Manpower */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Manpower</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Skilled Workers</label>
                                    <input
                                        type="number"
                                        value={formData.manpower.skilled}
                                        onChange={(e) => setFormData({...formData, manpower: {...formData.manpower, skilled: e.target.value}})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Unskilled Workers</label>
                                    <input
                                        type="number"
                                        value={formData.manpower.unskilled}
                                        onChange={(e) => setFormData({...formData, manpower: {...formData.manpower, unskilled: e.target.value}})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Materials */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-gray-700">Materials Received/Used</label>
                                <button type="button" onClick={addMaterialItem} className="text-xs text-blue-600 font-medium hover:underline">+ Add Material</button>
                            </div>
                            {formData.materials.map((mat, idx) => (
                                <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Material"
                                        value={mat.item}
                                        onChange={(e) => {
                                            const updated = [...formData.materials];
                                            updated[idx].item = e.target.value;
                                            setFormData({...formData, materials: updated});
                                        }}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Received"
                                        value={mat.received}
                                        onChange={(e) => {
                                            const updated = [...formData.materials];
                                            updated[idx].received = e.target.value;
                                            setFormData({...formData, materials: updated});
                                        }}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Used"
                                        value={mat.used}
                                        onChange={(e) => {
                                            const updated = [...formData.materials];
                                            updated[idx].used = e.target.value;
                                            setFormData({...formData, materials: updated});
                                        }}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Issues & Tomorrow Plan */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Issues / Blockers</label>
                                <textarea
                                    value={formData.issues}
                                    onChange={(e) => setFormData({...formData, issues: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    rows={3}
                                    placeholder="Any issues or blockers faced"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tomorrow's Plan</label>
                                <textarea
                                    value={formData.tomorrowPlan}
                                    onChange={(e) => setFormData({...formData, tomorrowPlan: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    rows={3}
                                    placeholder="Planned activities for tomorrow"
                                />
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Photos</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-all cursor-pointer">
                                <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <Save size={16} /> Save Draft
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={16} /> Submit Update
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Updates History */}
            {!showForm && (
                <div className="space-y-4">
                    <h2 className="font-bold text-slate-900">Recent Updates</h2>
                    {updates.map(update => (
                        <div key={update.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-5">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <FileEdit size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{update.date}</h3>
                                                <WeatherIcon weather={update.weather} />
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-500">{update.project} • {update.submittedBy}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            {update.status}
                                        </span>
                                        <span className="text-xs text-gray-500">{update.submittedAt}</span>
                                    </div>
                                </div>

                                {/* Work Progress */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Work Progress</h4>
                                    <div className="space-y-2">
                                        {update.workProgress.map((work, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-700">{work.task}</span>
                                                        <span className={`font-semibold ${work.status === 'Completed' ? 'text-green-600' : work.status === 'Delayed' ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {work.progress}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${work.status === 'Completed' ? 'bg-green-500' : work.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-500'}`}
                                                            style={{ width: `${work.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users size={14} className="text-gray-400" />
                                            <span className="text-xs text-gray-500">Manpower</span>
                                        </div>
                                        <p className="font-bold text-slate-900">{update.manpower.total}</p>
                                        <p className="text-xs text-gray-400">{update.manpower.skilled}S + {update.manpower.unskilled}U</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package size={14} className="text-gray-400" />
                                            <span className="text-xs text-gray-500">Materials</span>
                                        </div>
                                        <p className="font-bold text-slate-900">{update.materials.length}</p>
                                        <p className="text-xs text-gray-400">Items tracked</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Truck size={14} className="text-gray-400" />
                                            <span className="text-xs text-gray-500">Equipment</span>
                                        </div>
                                        <p className="font-bold text-slate-900">{update.equipment.length}</p>
                                        <p className="text-xs text-gray-400">Tracked items</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Camera size={14} className="text-gray-400" />
                                            <span className="text-xs text-gray-500">Photos</span>
                                        </div>
                                        <p className="font-bold text-slate-900">{update.photos}</p>
                                        <p className="text-xs text-gray-400">Uploaded</p>
                                    </div>
                                </div>

                                {/* Issues */}
                                {update.issues && update.issues !== 'None' && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                                        <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ Issues Reported</p>
                                        <p className="text-sm text-amber-800">{update.issues}</p>
                                    </div>
                                )}

                                {/* Tomorrow Plan */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-blue-700 mb-1">📋 Tomorrow's Plan</p>
                                    <p className="text-sm text-blue-800">{update.tomorrowPlan}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
                                        <Eye size={12} /> View Full Report
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
                                        <Camera size={12} /> View Photos
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DailyUpdates;
