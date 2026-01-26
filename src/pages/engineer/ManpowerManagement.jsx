import React, { useState, useEffect } from 'react';
import { getManpowerStore, saveManpower, formatAadhaar } from '../../utils/manpowerStore';

const ManpowerManagement = () => {
    const [manpower, setManpower] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRole, setModalRole] = useState('Labour'); // 'Supervisor' | 'Labour'
    const [aadhaarError, setAadhaarError] = useState('');
    const [activeListTab, setActiveListTab] = useState('Supervisor'); // 'Supervisor' | 'Labour'

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"name": "Mike Wilson", "role": "engineer"}');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allData = getManpowerStore();
        setManpower(allData.filter(m => m.addedBy === currentUser.name));
    };

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
            projectId: 'PROJ-SKYL',
            projectName: 'Skyline Residential Complex',
            role: modalRole,
            name: formData.get('name'),
            mobile: formData.get('mobile'),
            aadhaarNumber: aadhaar,
            address: formData.get('address'),
            dateOfJoining: formData.get('doj'),
            addedBy: currentUser.name,
            status: 'Pending',
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
        loadData();
        setActiveListTab(modalRole);
        alert(`${modalRole} added successfully. Pending Admin approval.`);
    };

    const supervisors = manpower.filter(m => m.role === 'Supervisor');
    const labours = manpower.filter(m => m.role === 'Labour');

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manpower Management</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Register and track site supervisors and labours individually</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleOpenModal('Supervisor')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <i className="fas fa-user-tie"></i> + ADD SUPERVISOR
                    </button>
                    <button
                        onClick={() => handleOpenModal('Labour')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <i className="fas fa-users"></i> + ADD LABOUR
                    </button>
                </div>
            </div>

            {/* List Selection Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveListTab('Supervisor')}
                    className={`flex-1 md:flex-none px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeListTab === 'Supervisor' ? 'bg-blue-500 text-white shadow-2xl shadow-blue-100 scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-user-tie mr-2"></i> Supervisors List ({supervisors.length})
                </button>
                <button
                    onClick={() => setActiveListTab('Labour')}
                    className={`flex-1 md:flex-none px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeListTab === 'Labour' ? 'bg-blue-500 text-white shadow-2xl shadow-blue-100 scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-users mr-2"></i> Labours List ({labours.length})
                </button>
            </div>

            {/* Individual Lists Display */}
            <div className={`bg-white rounded-[2.5rem] border-2 shadow-2xl overflow-hidden transition-all duration-300 ${activeListTab === 'Supervisor' ? 'border-indigo-100 shadow-indigo-50/50' : 'border-blue-100 shadow-blue-50/50'}`}>
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase tracking-widest text-blue-500">
                        {activeListTab}s Directory
                    </h2>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        Total Records: {activeListTab === 'Supervisor' ? supervisors.length : labours.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Mobile</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Aadhaar (Last 4)</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">
                                    {activeListTab === 'Supervisor' ? 'Dept / Experience' : 'Skill / Work Details'}
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(activeListTab === 'Supervisor' ? supervisors : labours).map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-blue-50 text-blue-500">
                                                {m.name.charAt(0)}
                                            </div>
                                            <p className="font-black text-gray-800">{m.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-500">{m.mobile}</td>
                                    <td className="px-8 py-5 font-mono text-xs tracking-widest text-gray-400">{formatAadhaar(m.aadhaarNumber)}</td>
                                    <td className="px-8 py-5">
                                        {activeListTab === 'Supervisor' ? (
                                            <div>
                                                <p className="text-xs font-black text-gray-700">{m.department}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{m.experience} Years Exp</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs font-black text-gray-700">{m.skillType}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">₹{m.dailyWage} • {m.shift} Shift</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                            m.status === 'Rejected' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(activeListTab === 'Supervisor' ? supervisors : labours).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <i className={`fas ${activeListTab === 'Supervisor' ? 'fa-user-tie' : 'fa-users'} text-4xl mb-2`}></i>
                                            <p className="text-xs font-black uppercase tracking-widest">No {activeListTab}s registered yet</p>
                                        </div>
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
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 text-white relative flex justify-between items-center bg-blue-500">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Register {modalRole}</h2>
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-1">Manpower Onboarding</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-2xl hover:bg-white/20 flex items-center justify-center transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Project Assignment</label>
                                    <input type="text" value="Skyline Residential Complex" readOnly className="w-full bg-gray-50 border-none px-4 py-3 rounded-2xl font-black text-gray-800 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Member Name *</label>
                                    <input name="name" type="text" required placeholder="Ex: Ramesh Babu" className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Contact *</label>
                                    <input name="mobile" type="tel" required pattern="[0-9]{10}" placeholder="10 Digit Number" className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Aadhaar (12 Digits) *</label>
                                    <input
                                        name="aadhaarNumber"
                                        type="text"
                                        required
                                        onChange={handleAadhaarChange}
                                        placeholder="0000 0000 0000"
                                        className={`w-full border-2 rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-colors ${aadhaarError ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 focus:border-blue-500'}`}
                                    />
                                    {aadhaarError && <p className="text-[10px] text-red-600 font-bold mt-1 ml-1">{aadhaarError}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Aadhaar Front View *</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white group">
                                        <i className="fas fa-cloud-upload-alt text-gray-200 group-hover:text-blue-400 text-2xl mb-2 transition-colors"></i>
                                        <p className="text-[9px] font-black text-gray-400 uppercase group-hover:text-blue-500 transition-colors">Select Scan Front</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Aadhaar Back View *</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white group">
                                        <i className="fas fa-cloud-upload-alt text-gray-200 group-hover:text-blue-400 text-2xl mb-2 transition-colors"></i>
                                        <p className="text-[9px] font-black text-gray-400 uppercase group-hover:text-blue-500 transition-colors">Select Scan Back</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {modalRole === 'Labour' ? (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Skill Specialization *</label>
                                            <select name="skillType" className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none bg-white appearance-none">
                                                <option>Mason</option>
                                                <option>Helper</option>
                                                <option>Carpenter</option>
                                                <option>Electrician</option>
                                                <option>Plumber</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Daily Wage (₹) *</label>
                                            <input name="dailyWage" type="number" required placeholder="Ex: 850" className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assigned Shift *</label>
                                            <div className="flex gap-2">
                                                <label className="flex-1">
                                                    <input type="radio" name="shift" value="Day" defaultChecked className="hidden peer" />
                                                    <div className="text-center p-3 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 cursor-pointer transition-all">Day</div>
                                                </label>
                                                <label className="flex-1">
                                                    <input type="radio" name="shift" value="Night" className="hidden peer" />
                                                    <div className="text-center p-3 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 cursor-pointer transition-all">Night</div>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Domain / Dept *</label>
                                            <input name="department" type="text" required placeholder="Ex: Civil Engineering" className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Exp (Total Yrs) *</label>
                                            <input name="experience" type="number" required placeholder="Ex: 8" className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none" />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Joining Date *</label>
                                    <input name="doj" type="date" required className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none bg-white" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t mt-4 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="grow py-4 rounded-3xl font-black text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors">Discard</button>
                                <button type="submit" className="grow py-4 rounded-3xl font-black text-xs text-white shadow-2xl transition-all active:scale-95 uppercase tracking-widest bg-blue-500 shadow-blue-100 hover:bg-blue-600">
                                    Complete Onboarding
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManpowerManagement;
