import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Users, ClipboardList, AlertTriangle, Package,
    MapPin, Cloud, Sun, CheckCircle, Clock, PlusCircle, FileText
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';

const EngineerDashboard = () => {
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Mock Data
    const taskData = [
        { day: 'Mon', completed: 12, pending: 4 },
        { day: 'Tue', completed: 18, pending: 2 },
        { day: 'Wed', completed: 15, pending: 5 },
        { day: 'Thu', completed: 10, pending: 8 },
        { day: 'Fri', completed: 22, pending: 0 },
        { day: 'Sat', completed: 9, pending: 1 },
        { day: 'Sun', completed: 5, pending: 0 },
    ];

    const upcomingTasks = [
        { time: '09:00 AM', title: 'Daily Tool-box Talk', loc: 'Gathering Area', status: 'done' },
        { time: '10:30 AM', title: 'Steel Reinforcement Inspection', loc: 'Block B - 4th Floor', status: 'pending' },
        { time: '01:30 PM', title: 'Concrete Cube Testing', loc: 'Lab Area', status: 'pending' },
        { time: '03:00 PM', title: 'Electrical Conduit Verification', loc: 'Block A - Ground Floor', status: 'pending' },
        { time: '05:00 PM', title: 'Site Cleanup & Safety Walk', loc: 'Entire Site', status: 'pending' },
    ];

    const milestones = [
        { name: 'Foundation Work', progress: 100, date: 'Oct 2023' },
        { name: 'Ground Floor Slab', progress: 100, date: 'Dec 2023' },
        { name: 'Structural Frame', progress: 45, date: 'Est. April 2024' },
        { name: 'Finishing Works', progress: 0, date: 'Est. Aug 2024' },
    ];

    const recentActivity = [
        { user: "Rajesh Kumar", action: "submitted attendance for 28 workers", time: "15 mins ago", icon: Users, color: "text-blue-600" },
        { user: "System", action: "generated Weekly Progress Report", time: "2 hours ago", icon: FileText, color: "text-green-600" },
        { user: "Mike Wilson", action: "reported issue: Scaffolding Loose in Block C", time: "4 hours ago", icon: AlertTriangle, color: "text-red-600" },
    ];

    const quickActions = [
        { label: "Attendance", icon: Users, color: "bg-blue-600", path: "/engineer/attendance-log" },
        { label: "Work Logs", icon: FileText, color: "bg-emerald-600", path: "/engineer/updates" },
        { label: "Issues", icon: AlertTriangle, color: "bg-rose-600", path: "/engineer/tickets" },
        { label: "Materials", icon: Package, color: "bg-amber-500", path: "/engineer/stock" },
    ];

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20 p-3 sm:p-4 md:p-6 bg-slate-50/50">

            {/* Hero / Welcome Section */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-navy-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-4 md:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-white/10 backdrop-blur-md px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-2 border border-white/20 shadow-inner">
                                <MapPin size={12} className="text-blue-300" /> <span className="truncate max-w-[150px] sm:max-w-none">Skyline Residential</span>
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md border border-emerald-400/30">
                                🟢 Live
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black mb-1 sm:mb-2 tracking-tight">Welcome, <span className="text-blue-300">Mike</span> 👋</h1>
                            <p className="text-blue-100/80 font-medium text-sm sm:text-base md:text-lg italic">{today}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6 bg-white/5 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-3xl border border-white/10 shadow-2xl w-fit">
                        <div className="p-2 sm:p-4 bg-amber-400/20 rounded-xl sm:rounded-2xl text-amber-300">
                            <Sun size={24} className="sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-3xl font-black leading-none mb-0.5 sm:mb-1">28°C</p>
                            <p className="text-[10px] sm:text-xs font-bold text-blue-200 uppercase tracking-wider">Clear • Wind 12km/h</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 sm:w-96 h-48 sm:h-96 bg-blue-400/10 rounded-full blur-[100px] group-hover:bg-blue-400/20 transition-all duration-700"></div>
                <div className="absolute -bottom-24 -left-24 w-36 sm:w-72 h-36 sm:h-72 bg-navy-900/40 rounded-full blur-[80px]"></div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {quickActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(action.path)}
                        className="bg-white p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left border border-slate-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-5"
                    >
                        <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-300 shrink-0`}>
                            <action.icon size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="text-center sm:text-left">
                            <span className="block font-bold sm:font-black text-slate-800 text-xs sm:text-sm tracking-tight">
                                {action.label}
                            </span>
                            <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wide hidden sm:block">Launch</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                <StatCard title="Labour" value="28" icon={Users} color="blue" trend="up" trendValue="100%" />
                <StatCard title="Progress" value="84%" icon={ClipboardList} color="navy" trend="up" trendValue="5%" />
                <StatCard title="Issues" value="2" icon={AlertTriangle} color="red" trend="down" trendValue="1" />
                <StatCard title="Material" value="15t" icon={Package} color="yellow" trend="up" trendValue="2.4t" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">

                {/* Weekly Progress Chart */}
                <ChartCard title="Task Velocity" className="lg:col-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="h-[180px] sm:h-[220px] md:h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={30} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 8 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)', padding: '8px 12px', fontSize: '12px' }}
                                />
                                <Bar dataKey="completed" fill="#2563EB" radius={[4, 4, 4, 4]} barSize={16} name="Done" />
                                <Bar dataKey="pending" fill="#cbd5e1" radius={[4, 4, 4, 4]} barSize={16} name="Left" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Schedule Timeline */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                    <div className="p-3 sm:p-4 md:p-6 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold sm:font-black text-slate-800 tracking-tight text-sm sm:text-base">Timeline</h3>
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 sm:mt-1">Phase 2</p>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-tight border border-blue-100 shadow-sm">4 Goals</span>
                    </div>
                    <div className="p-3 sm:p-5 md:p-6 flex-1 overflow-y-auto max-h-[280px] sm:max-h-none">
                        <div className="space-y-0 relative border-l-2 border-slate-100 ml-1 sm:ml-2">
                            {upcomingTasks.map((task, idx) => (
                                <div key={idx} className="relative pl-4 sm:pl-6 pb-4 sm:pb-6 last:pb-0 group">
                                    <div className={`absolute -left-[5px] sm:-left-[7px] top-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 bg-white transition-all duration-300
                                        ${task.status === 'done' ? 'border-emerald-400 bg-emerald-500' : 'border-blue-300 bg-blue-500 group-hover:scale-125'}
                                    `}></div>
                                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                        <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${task.status === 'done' ? 'text-emerald-500' : 'text-blue-500'}`}>{task.time}</p>
                                        {task.status === 'done' && <CheckCircle size={12} className="text-emerald-500" />}
                                    </div>
                                    <h4 className={`text-[11px] sm:text-xs md:text-sm font-semibold tracking-tight leading-tight ${task.status === 'done' ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                                        {task.title}
                                    </h4>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 sm:mt-1 font-medium">
                                        <MapPin size={9} className="text-slate-300" /> <span className="truncate">{task.loc}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 sm:p-5 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl sm:rounded-b-3xl text-center">
                        <button className="text-[10px] sm:text-xs text-blue-600 font-black uppercase tracking-wider hover:text-blue-700 transition-colors flex items-center justify-center w-full gap-1 sm:gap-2">
                            View Planner <PlusCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                        </button>
                    </div>
                </div>

                {/* Milestones & Activity */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {/* Project Milestones */}
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                            <h3 className="font-bold sm:font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                                <ClipboardList className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" /> Milestones
                            </h3>
                            <button className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wide hover:text-blue-600 transition-colors">Edit</button>
                        </div>
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {milestones.map((m, i) => (
                                <div key={i} className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800">{m.name}</p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wide">{m.date}</p>
                                        </div>
                                        <p className="text-xs sm:text-sm font-black text-blue-600">{m.progress}%</p>
                                    </div>
                                    <div className="h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg transition-all duration-1000"
                                            style={{ width: `${m.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Site Activity */}
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold sm:font-black text-slate-800 tracking-tight mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <Clock className="text-amber-500 w-4 h-4 sm:w-5 sm:h-5" /> Activity
                        </h3>
                        <div className="space-y-3 sm:space-y-4 md:space-y-6">
                            {recentActivity.map((act, i) => (
                                <div key={i} className="flex items-start gap-3 sm:gap-4 md:gap-5 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-colors group">
                                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 ${act.color} group-hover:scale-105 transition-transform shadow-inner shrink-0`}>
                                        <act.icon size={16} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-slate-600 line-clamp-2">
                                            <span className="font-black text-slate-900">{act.user}</span> {act.action}
                                        </p>
                                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-0.5 sm:mt-1 tracking-wide">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EngineerDashboard;
