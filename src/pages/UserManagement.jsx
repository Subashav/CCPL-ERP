import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { user, registerAdmin, registerSiteEngineer } = useAuth();
    if (!user) return <div>Access Denied</div>;

    const [activeTab, setActiveTab] = useState(user.role === 'SUPER_ADMIN' ? 'admins' : 'engineers');
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // New state for form tabs
    const [formTab, setFormTab] = useState('basic');

    useEffect(() => {
        if (user.role === 'SUPER_ADMIN' && activeTab === 'admins') {
            fetchAdmins();
        } else if (user.role === 'ADMIN' && activeTab === 'engineers') {
            fetchEngineers();
        }
    }, [user, activeTab]);

    const fetchAdmins = async () => {
        setLoading(true);
        // Mock fetch
        const stored = JSON.parse(localStorage.getItem('mock_admins') || '[]');
        if (stored.length === 0) {
            const initial = [{ _id: 'a1', name: 'Default Admin', email: 'admin@ccpl.com', role: 'ADMIN', status: 'Active' }];
            localStorage.setItem('mock_admins', JSON.stringify(initial));
            setUsers(initial);
        } else {
            setUsers(stored);
        }
        setLoading(false);
    };

    const fetchEngineers = async () => {
        setLoading(true);
        // Mock fetch
        const stored = JSON.parse(localStorage.getItem('mock_engineers') || '[]');
        if (stored.length === 0) {
            const initial = [{ _id: 'e1', name: 'Site Eng 1', email: 'eng1@ccpl.com', role: 'SITE_ENGINEER', status: 'Active' }];
            localStorage.setItem('mock_engineers', JSON.stringify(initial));
            setUsers(initial);
        } else {
            setUsers(stored);
        }
        setLoading(false);
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const res = await registerAdmin(data, user.token);
        if (res.success) {
            const newAdmin = { ...data, _id: 'a' + Date.now(), role: 'ADMIN', status: 'Active' };
            const admins = JSON.parse(localStorage.getItem('mock_admins') || '[]');
            localStorage.setItem('mock_admins', JSON.stringify([...admins, newAdmin]));

            setMessage('Admin created successfully!');
            setShowForm(false);
            fetchAdmins();
        } else {
            setMessage('Error: ' + res.message);
        }
    };

    const handleEngineerSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const raw = Object.fromEntries(formData.entries());

        const fullData = {
            ...raw,
            permissions: {
                attendanceSubmit: form.attendanceSubmit?.checked || false,
                dailyProgressUpdate: form.dailyProgressUpdate?.checked || false,
                materialRequest: form.materialRequest?.checked || false,
                issueReporting: form.issueReporting?.checked || false
            },
            address: { current: raw.currentAddress, permanent: raw.permanentAddress },
            attendanceConfig: {
                type: raw.attendanceType,
                allowedSites: raw.allowedSites?.split(',') || [],
                workingDays: raw.workingDays?.split(',') || [],
                overtimeApplicable: raw.overtimeApplicable === 'Yes'
            },
            documents: {
                idProof: raw.idProof,
                qualificationCertificate: raw.qualificationCertificate,
                experienceCertificate: raw.experienceCertificate,
                joiningLetter: raw.joiningLetter
            },
            bankDetails: {
                bankName: raw.bankName,
                accountNumber: raw.accountNumber,
                ifscCode: raw.ifscCode,
                upiId: raw.upiId
            }
        };

        const res = await registerSiteEngineer(fullData, user.token);
        if (res.success) {
            const newEng = { ...fullData, _id: 'e' + Date.now(), name: fullData.name, email: fullData.email, role: 'SITE_ENGINEER', status: 'Active' };
            const engs = JSON.parse(localStorage.getItem('mock_engineers') || '[]');
            localStorage.setItem('mock_engineers', JSON.stringify([...engs, newEng]));

            setMessage('Site Engineer created successfully!');
            setShowForm(false);
            fetchEngineers();
        } else {
            setMessage('Error: ' + res.message);
        }
    };

    // UI Helper Components
    const inputClass = "w-full bg-white border border-gray-200 focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-300";
    const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1";

    const TabButton = ({ id, label, icon }) => (
        <button
            type="button"
            onClick={() => setFormTab(id)}
            className={`flex items-center gap-2 px-5 py-4 text-xs font-bold border-b-2 transition-all ${formTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
        >
            <i className={`fas ${icon} text-sm`}></i> {label}
        </button>
    );

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
                {/* Mobile-First Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Users</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">Manage access and profiles</p>
                    </div>
                    {message && (
                        <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-bold border border-blue-100 animate-in slide-in-from-top-2">
                            {message}
                        </div>
                    )}
                </div>

                {/* Mobile-Friendly Tab Selector */}
                <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8 bg-gray-100 sm:bg-white p-1 rounded-xl sm:border sm:border-gray-200 w-full sm:w-fit shadow-sm overflow-x-auto">
                    {user.role === 'SUPER_ADMIN' && (
                        <button
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'admins' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            onClick={() => { setActiveTab('admins'); setShowForm(false); }}
                        >
                            Admins
                        </button>
                    )}
                    {user.role === 'ADMIN' && (
                        <button
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'engineers' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            onClick={() => { setActiveTab('engineers'); setShowForm(false); }}
                        >
                            Engineers
                        </button>
                    )}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                            {activeTab === 'admins' ? 'Administrators' : 'Site Engineers'}
                        </h2>
                        <button
                            onClick={() => { setShowForm(true); setFormTab('basic'); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <i className="fas fa-plus text-xs"></i>
                            <span className="hidden xs:inline">Add</span> New
                        </button>
                    </div>

                    {/* Mobile Card View for Users */}
                    <div className="space-y-3 sm:hidden">
                        {users.map(u => (
                            <div key={u._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {u.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">{u.role}</span>
                                            <button className="ml-auto text-gray-400 hover:text-blue-600 p-1">
                                                <i className="fas fa-ellipsis-h text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
                                No users found. Tap 'Add New' to start.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="px-4 md:px-6 py-4">User Details</th>
                                    <th className="px-4 md:px-6 py-4">Access Role</th>
                                    <th className="px-4 md:px-6 py-4">Status</th>
                                    <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                <i className="fas fa-ellipsis-h"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">No users found. Click 'Add New' to get started.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal - Mobile Bottom Sheet Style */}
            {showForm && (
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-5xl rounded-t-3xl sm:rounded-xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 overflow-hidden ring-1 ring-gray-200">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden flex-shrink-0"></div>
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100 bg-white flex-shrink-0">
                            <h2 className="text-base sm:text-lg font-bold text-gray-800">
                                New {activeTab === 'admins' ? 'Admin' : 'Engineer'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {activeTab === 'engineers' ? (
                            <form onSubmit={handleEngineerSubmit} className="flex flex-col h-full overflow-hidden">
                                {/* Form Tabs - Horizontally scrollable on mobile */}
                                <div className="flex overflow-x-auto border-b border-gray-100 px-3 sm:px-6 bg-white sticky top-0 z-10 gap-0 sm:gap-2 flex-shrink-0 scrollbar-hide">
                                    <TabButton id="basic" label="Basic" icon="fa-user" />
                                    <TabButton id="job" label="Job" icon="fa-briefcase" />
                                    <TabButton id="access" label="Access" icon="fa-shield-alt" />
                                    <TabButton id="bank" label="Bank" icon="fa-university" />
                                    <TabButton id="docs" label="Docs" icon="fa-file-alt" />
                                </div>

                                {/* Form Content */}
                                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-white">
                                    {formTab === 'basic' && (
                                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                <div><label className={labelClass}>Full Name <span className="text-red-500">*</span></label><input name="name" required placeholder="e.g. Rahul Sharma" className={inputClass} /></div>
                                                <div><label className={labelClass}>Employee ID <span className="text-red-500">*</span></label><input name="empId" required placeholder="e.g. EMP-2024-001" className={inputClass} /></div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div><label className={labelClass}>Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required placeholder="email@company.com" className={inputClass} /></div>
                                                <div><label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label><input name="mobile" required placeholder="10-digit number" className={inputClass} /></div>
                                                <div><label className={labelClass}>Date of Birth</label><input name="dob" type="date" className={`${inputClass} text-gray-500`} /></div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div><label className={labelClass}>Gender</label>
                                                    <div className="relative">
                                                        <select name="gender" className={`${inputClass} appearance-none`}>
                                                            <option>Male</option><option>Female</option><option>Other</option>
                                                        </select>
                                                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div><label className={labelClass}>Residential Address</label><textarea name="currentAddress" placeholder="Full address details..." className={`${inputClass} resize-none`} rows="3" /></div>
                                        </div>
                                    )}

                                    {formTab === 'job' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div><label className={labelClass}>Designation</label><input name="designation" placeholder="e.g. Senior Site Engineer" className={inputClass} /></div>
                                                <div><label className={labelClass}>Department</label><input name="department" placeholder="e.g. Civil / Electrical" className={inputClass} /></div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div><label className={labelClass}>Assigned Site</label><input name="siteLocation" placeholder="Project Name" className={inputClass} /></div>
                                                <div><label className={labelClass}>Joining Date</label><input name="joiningDate" type="date" className={`${inputClass} text-gray-500`} /></div>
                                                <div><label className={labelClass}>Work Type</label>
                                                    <div className="relative">
                                                        <select name="workType" className={`${inputClass} appearance-none`}>
                                                            <option>Full-time</option><option>Contract</option>
                                                        </select>
                                                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div><label className={labelClass}>Shift Timing</label><input name="shiftTiming" placeholder="e.g. 9:00 AM - 6:00 PM" className={inputClass} /></div>
                                        </div>
                                    )}

                                    {formTab === 'access' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Login Credentials</h4>
                                                <div className="max-w-md">
                                                    <label className={labelClass}>Set Password <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <input
                                                            name="password"
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                            placeholder="Minimum 8 characters"
                                                            className={inputClass}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">System Permissions</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'attendanceSubmit', label: 'Submit Attendance', desc: 'Allow user to mark attendance for team' },
                                                        { id: 'dailyProgressUpdate', label: 'Daily Progress Update', desc: 'Allow submitting daily site reports' },
                                                        { id: 'materialRequest', label: 'Material Request', desc: 'Allow creating new material requisitions' },
                                                        { id: 'issueReporting', label: 'Issue Reporting', desc: 'Allow raising safety and quality issues' }
                                                    ].map(perm => (
                                                        <label key={perm.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-white hover:border-blue-300 transition-all shadow-sm group">
                                                            <input type="checkbox" name={perm.id} className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                                                            <div>
                                                                <span className="block text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{perm.label}</span>
                                                                <span className="block text-xs text-gray-400 mt-0.5">{perm.desc}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formTab === 'bank' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="max-w-2xl">
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div><label className={labelClass}>Bank Name</label><input name="bankName" placeholder="e.g. HDFC Bank" className={inputClass} /></div>
                                                    <div><label className={labelClass}>Account Number</label><input name="accountNumber" placeholder="e.g. 1234567890" className={inputClass} /></div>
                                                    <div><label className={labelClass}>IFSC Code</label><input name="ifscCode" placeholder="e.g. HDFC0001234" className={inputClass} /></div>
                                                    <div><label className={labelClass}>UPI ID (Optional)</label><input name="upiId" placeholder="e.g. user@okhdfcbank" className={inputClass} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formTab === 'docs' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div><label className={labelClass}>ID Proof URL</label><input name="idProof" placeholder="https://..." className={inputClass} /></div>
                                                <div><label className={labelClass}>Qualification Certificate URL</label><input name="qualificationCertificate" placeholder="https://..." className={inputClass} /></div>
                                                <div><label className={labelClass}>Experience Certificate URL</label><input name="experienceCertificate" placeholder="https://..." className={inputClass} /></div>
                                                <div><label className={labelClass}>Joining Letter URL</label><input name="joiningLetter" placeholder="https://..." className={inputClass} /></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Form Footer */}
                                <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80 backdrop-blur-sm">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors uppercase tracking-wider">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-bold text-xs shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all flex items-center gap-2 uppercase tracking-wider">
                                        <i className="fas fa-check"></i> Create User
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleAdminSubmit} className="p-8">
                                <div className="space-y-6 max-w-lg mx-auto">
                                    <div><label className={labelClass}>Admin Name</label><input name="name" type="text" required placeholder="Ex: John Doe" className={inputClass} /></div>
                                    <div><label className={labelClass}>Email Address</label><input name="email" type="email" required placeholder="admin@company.com" className={inputClass} /></div>
                                    <div><label className={labelClass}>Password</label>
                                        <div className="relative">
                                            <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className={inputClass} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-4">
                                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors">Cancel</button>
                                        <button type="submit" className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-gray-800 transition-colors">Create Admin</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default UserManagement;
