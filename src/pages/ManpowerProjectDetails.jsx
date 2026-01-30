import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getManpowerStore, saveManpower, formatAadhaar } from '../utils/manpowerStore';
import { useAuth } from '../context/AuthContext';

const ManpowerProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [projectData, setProjectData] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [activeTab, setActiveTab] = useState('Supervisor'); // 'Supervisor' | 'Labour'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRole, setModalRole] = useState('Labour');
    const [aadhaarError, setAadhaarError] = useState('');

    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    const loadProjectData = () => {
        const allData = getManpowerStore();
        const filtered = allData.filter(m => m.projectId === projectId);
        setProjectData(filtered);

        if (filtered.length > 0) {
            setProjectName(filtered[0].projectName);
        } else {
            setProjectName('Unknown Project');
        }
    };

    const supervisors = projectData.filter(m => m.role === 'Supervisor');
    const labours = projectData.filter(m => m.role === 'Labour');

    const handleOpenModal = (role) => {
        setModalRole(role);
        setAadhaarError('');
        setIsModalOpen(true);
    };

    const handleAadhaarChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
        e.target.value = val;
        if (val.length > 0 && val.length < 12) {
            setAadhaarError('Aadhaar must be exactly 12 digits');
        } else {
            setAadhaarError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const aadhaar = formData.get('aadhaarNumber');

        if (aadhaar.length !== 12) {
            setAadhaarError('Aadhaar must be exactly 12 digits');
            return;
        }

        const newPerson = {
            projectId: projectId,
            projectName: projectName,
            role: modalRole,
            name: formData.get('name'),
            mobile: formData.get('mobile'),
            aadhaarNumber: aadhaar,
            address: formData.get('address'),
            dateOfJoining: formData.get('doj'),
            addedBy: user?.name || 'Admin',
            status: 'Approved',
            ...(modalRole === 'Labour' ? {
                skillType: formData.get('skillType'),
                dailyWage: formData.get('dailyWage'),
                shift: formData.get('shift')
            } : {
                department: formData.get('department'),
                experience: formData.get('experience')
            })
        };

        saveManpower(newPerson);
        setIsModalOpen(false);
        loadProjectData();
        alert(`${modalRole} added successfully.`);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 mb-2 text-sm flex items-center gap-1 transition-colors">
                        <i className="fas fa-arrow-left"></i> Back to Summary
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{projectName}</h1>
                    <p className="text-gray-500 mt-1">Project ID: {projectId}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleOpenModal('Supervisor')}
                        className="btn btn-outline bg-white hover:bg-blue-50 text-blue-700 border-blue-200"
                    >
                        <i className="fas fa-user-tie mr-2"></i> Add Supervisor
                    </button>
                    <button
                        onClick={() => handleOpenModal('Labour')}
                        className="btn btn-primary shadow-lg shadow-blue-600/20"
                    >
                        <i className="fas fa-users mr-2"></i> Add Labour
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('Supervisor')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'Supervisor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Supervisors ({supervisors.length})
                </button>
                <button
                    onClick={() => setActiveTab('Labour')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'Labour' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Labours ({labours.length})
                </button>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider opacity-70">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider opacity-70">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider opacity-70">Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider opacity-70 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(activeTab === 'Supervisor' ? supervisors : labours).map((m) => (
                                <tr key={m.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-600">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{m.name}</p>
                                                <p className="text-xs text-gray-400 font-mono">ID: {m.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-700">{m.mobile}</p>
                                        <p className="text-xs text-gray-400 font-mono">UID: {formatAadhaar(m.aadhaarNumber)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {activeTab === 'Supervisor' ? (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{m.department}</p>
                                                <p className="text-xs text-gray-400">{m.experience} Years Exp.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{m.skillType}</p>
                                                <p className="text-xs text-gray-400">₹{m.dailyWage}/day • {m.shift}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            m.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(activeTab === 'Supervisor' ? supervisors : labours).length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i className="fas fa-folder-open text-gray-300 text-lg"></i>
                                        </div>
                                        <p className="text-sm font-medium">No records found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Onboard New {modalRole}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Project</span>
                                    <span className="text-xs text-gray-500 font-medium">{projectName}</span>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto">
                            {/* Personal Information Section */}
                            <div className="mb-8">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <i className="fas fa-user-circle"></i> Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Ex: Rajesh Kumar"
                                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                                        <input
                                            name="mobile"
                                            type="tel"
                                            required
                                            pattern="[0-9]{10}"
                                            placeholder="10-digit number"
                                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Number <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                name="aadhaarNumber"
                                                type="text"
                                                required
                                                onChange={handleAadhaarChange}
                                                placeholder="0000 0000 0000"
                                                className={`w-full bg-gray-50 border border-transparent focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 font-mono ${aadhaarError ? 'border-red-300 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                                            />
                                            <i className="fas fa-id-card absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        </div>
                                        {aadhaarError && <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"><i className="fas fa-exclamation-circle"></i> {aadhaarError}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Permanent Address</label>
                                        <textarea
                                            name="address"
                                            rows="2"
                                            placeholder="Enter full address details"
                                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-8" />

                            {/* Job Details Section */}
                            <div className="mb-2">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <i className="fas fa-briefcase"></i> Employment Details
                                </h4>

                                {modalRole === 'Labour' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Skill Set <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select name="skillType" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer">
                                                    <option>Mason</option>
                                                    <option>Helper</option>
                                                    <option>Carpenter</option>
                                                    <option>Electrician</option>
                                                    <option>Plumber</option>
                                                    <option>Painter</option>
                                                    <option>Welder</option>
                                                </select>
                                                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Wage (₹) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                                <input
                                                    name="dailyWage"
                                                    type="number"
                                                    required
                                                    placeholder="0.00"
                                                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl pl-8 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Shift <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select name="shift" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer">
                                                    <option>Day Shift</option>
                                                    <option>Night Shift</option>
                                                </select>
                                                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department <span className="text-red-500">*</span></label>
                                            <input
                                                name="department"
                                                type="text"
                                                required
                                                placeholder="Ex: Civil, Electrical"
                                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years) <span className="text-red-500">*</span></label>
                                            <input
                                                name="experience"
                                                type="number"
                                                required
                                                placeholder="Ex: 5"
                                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Joining <span className="text-red-500">*</span></label>
                                    <input
                                        name="doj"
                                        type="date"
                                        required
                                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-4 pt-6 mt-8 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 transition-all uppercase tracking-wide"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-check-circle"></i> Add {modalRole}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManpowerProjectDetails;
