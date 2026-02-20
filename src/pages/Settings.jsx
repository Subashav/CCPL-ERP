import { useState } from 'react';
import { 
    Settings as SettingsIcon, User, Bell, Lock, Palette, Globe,
    Building2, Mail, Phone, Save, Camera, Shield, Key, 
    ToggleLeft, ToggleRight, ChevronRight, Moon, Sun, 
    Smartphone, Monitor, Volume2, VolumeX
} from 'lucide-react';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        projectUpdates: true,
        taskReminders: true,
        billing: true,
        marketing: false
    });
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@ccpl.com',
        phone: '+91 98765 43210',
        role: 'Super Admin',
        company: 'CCPL Construction Pvt Ltd',
        address: 'Sector 15, Gurgaon, Haryana',
        timezone: 'Asia/Kolkata'
    });

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'company', label: 'Company', icon: Building2 },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    ];

    const Toggle = ({ enabled, onChange }) => (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
            <span 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 font-medium text-sm sm:text-base">Manage your account and application preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {sections.map(section => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                                        activeSection === section.id 
                                            ? 'bg-slate-800 text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium text-sm">{section.label}</span>
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                                <p className="text-sm text-gray-500">Update your personal details</p>
                            </div>
                            <div className="p-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                            {profile.name.charAt(0)}
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all">
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{profile.name}</h3>
                                        <p className="text-sm text-gray-500">{profile.role}</p>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                            <input
                                                type="text"
                                                value={profile.role}
                                                disabled
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                                <p className="text-sm text-gray-500">Choose how you want to be notified</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Channels */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Notification Channels</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Mail size={18} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Email Notifications</p>
                                                    <p className="text-xs text-gray-500">Receive updates via email</p>
                                                </div>
                                            </div>
                                            <Toggle 
                                                enabled={notifications.email} 
                                                onChange={() => setNotifications({...notifications, email: !notifications.email})} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <Smartphone size={18} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Push Notifications</p>
                                                    <p className="text-xs text-gray-500">Browser and mobile push alerts</p>
                                                </div>
                                            </div>
                                            <Toggle 
                                                enabled={notifications.push} 
                                                onChange={() => setNotifications({...notifications, push: !notifications.push})} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Phone size={18} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">SMS Notifications</p>
                                                    <p className="text-xs text-gray-500">Critical alerts via SMS</p>
                                                </div>
                                            </div>
                                            <Toggle 
                                                enabled={notifications.sms} 
                                                onChange={() => setNotifications({...notifications, sms: !notifications.sms})} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Types */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Notification Types</h3>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'projectUpdates', label: 'Project Updates', desc: 'Status changes and milestones' },
                                            { key: 'taskReminders', label: 'Task Reminders', desc: 'Deadline and assignment alerts' },
                                            { key: 'billing', label: 'Billing & Payments', desc: 'Invoice and payment notifications' },
                                            { key: 'marketing', label: 'Marketing', desc: 'Product updates and newsletters' },
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                                </div>
                                                <Toggle 
                                                    enabled={notifications[item.key]} 
                                                    onChange={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-slate-900">Password</h2>
                                    <p className="text-sm text-gray-500">Update your password regularly for security</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
                                        <Key size={16} /> Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-slate-900">Two-Factor Authentication</h2>
                                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Shield size={18} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-800">2FA is Enabled</p>
                                                <p className="text-xs text-green-600">Your account is protected</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition-all">
                                            Configure
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-slate-900">Active Sessions</h2>
                                    <p className="text-sm text-gray-500">Manage your active login sessions</p>
                                </div>
                                <div className="p-6 space-y-3">
                                    {[
                                        { device: 'Windows PC - Chrome', location: 'Gurgaon, India', time: 'Active now', current: true },
                                        { device: 'iPhone 14 Pro - Safari', location: 'Delhi, India', time: '2 hours ago', current: false },
                                    ].map((session, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Monitor size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{session.device}</p>
                                                    <p className="text-xs text-gray-500">{session.location} • {session.time}</p>
                                                </div>
                                            </div>
                                            {session.current ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Current</span>
                                            ) : (
                                                <button className="text-red-600 text-sm font-medium hover:underline">Revoke</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Section */}
                    {activeSection === 'appearance' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-slate-900">Appearance</h2>
                                <p className="text-sm text-gray-500">Customize the look and feel</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Theme */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Theme</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button 
                                            onClick={() => setIsDarkMode(false)}
                                            className={`p-4 rounded-xl border-2 transition-all ${!isDarkMode ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <Sun size={24} className={`mx-auto mb-2 ${!isDarkMode ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <p className="text-sm font-medium text-center">Light</p>
                                        </button>
                                        <button 
                                            onClick={() => setIsDarkMode(true)}
                                            className={`p-4 rounded-xl border-2 transition-all ${isDarkMode ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <Moon size={24} className={`mx-auto mb-2 ${isDarkMode ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <p className="text-sm font-medium text-center">Dark</p>
                                        </button>
                                        <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all">
                                            <Monitor size={24} className="mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm font-medium text-center">System</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Accent Color */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Accent Color</h3>
                                    <div className="flex gap-3">
                                        {['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600', 'bg-red-600', 'bg-slate-800'].map(color => (
                                            <button key={color} className={`w-10 h-10 ${color} rounded-xl hover:scale-110 transition-transform ring-2 ring-offset-2 ring-transparent hover:ring-gray-300`} />
                                        ))}
                                    </div>
                                </div>

                                {/* Font Size */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Font Size</h3>
                                    <div className="flex gap-3">
                                        {['Small', 'Medium', 'Large'].map((size, idx) => (
                                            <button 
                                                key={size} 
                                                className={`px-4 py-2 rounded-xl border-2 transition-all ${idx === 1 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                                            >
                                                <span className={`font-medium ${idx === 0 ? 'text-sm' : idx === 2 ? 'text-lg' : ''}`}>{size}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company Section */}
                    {activeSection === 'company' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-slate-900">Company Settings</h2>
                                <p className="text-sm text-gray-500">Manage your organization details</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        defaultValue={profile.company}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
                                        <input
                                            type="text"
                                            defaultValue="07AAACR1718Q1ZV"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                                        <input
                                            type="text"
                                            defaultValue="AAACR1718Q"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Registered Address</label>
                                    <textarea
                                        defaultValue="Plot No. 45, Sector 15, Gurgaon, Haryana - 122001"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
                                        <Save size={16} /> Save Company Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Section */}
                    {activeSection === 'preferences' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-slate-900">Preferences</h2>
                                <p className="text-sm text-gray-500">Configure application behavior</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Regional Settings</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Timezone</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                                <option>Asia/Kolkata (IST)</option>
                                                <option>UTC</option>
                                                <option>America/New_York (EST)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                                <option>INR (₹)</option>
                                                <option>USD ($)</option>
                                                <option>EUR (€)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4">Default Views</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Dashboard Layout</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                                <option>Compact</option>
                                                <option>Standard</option>
                                                <option>Detailed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Items per Page</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                                <option>10</option>
                                                <option>25</option>
                                                <option>50</option>
                                                <option>100</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
                                        <Save size={16} /> Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
