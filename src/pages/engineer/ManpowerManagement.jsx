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
        <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Mobile-First Header */}
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Manpower</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Register supervisors & labours</p>
            </div>

            {/* Action Buttons - Grid on mobile */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 mb-4 sm:mb-6">
                <button
                    onClick={() => handleOpenModal('Supervisor')}
                    className="bg-blue-500 text-white px-3 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                >
                    <i className="fas fa-user-tie text-xs"></i>
                    <span>+ Supervisor</span>
                </button>
                <button
                    onClick={() => handleOpenModal('Labour')}
                    className="bg-blue-500 text-white px-3 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                >
                    <i className="fas fa-users text-xs"></i>
                    <span>+ Labour</span>
                </button>
            </div>

            {/* List Selection Tabs - Mobile optimized */}
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
                <button
                    onClick={() => setActiveListTab('Supervisor')}
                    className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest transition-all ${activeListTab === 'Supervisor' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-user-tie mr-1.5 sm:mr-2"></i>
                    <span className="hidden xs:inline">Supervisors</span>
                    <span className="xs:hidden">Sup.</span>
                    <span className="ml-1">({supervisors.length})</span>
                </button>
                <button
                    onClick={() => setActiveListTab('Labour')}
                    className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest transition-all ${activeListTab === 'Labour' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-users mr-1.5 sm:mr-2"></i>
                    <span className="hidden xs:inline">Labours</span>
                    <span className="xs:hidden">Lab.</span>
                    <span className="ml-1">({labours.length})</span>
                </button>
            </div>

            {/* Directory Card */}
            <div className={`bg-white rounded-2xl sm:rounded-3xl border shadow-lg overflow-hidden transition-all duration-300 ${activeListTab === 'Supervisor' ? 'border-indigo-100' : 'border-blue-100'}`}>
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-sm sm:text-lg font-black uppercase tracking-wide sm:tracking-widest text-blue-500">
                        {activeListTab}s
                    </h2>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full uppercase">
                        {activeListTab === 'Supervisor' ? supervisors.length : labours.length} records
                    </span>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-gray-100">
                    {(activeListTab === 'Supervisor' ? supervisors : labours).map((m) => (
                        <div key={m.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-500 flex-shrink-0">
                                    {m.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{m.name}</p>
                                            <p className="text-xs text-gray-500">{m.mobile}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${m.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            m.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {activeListTab === 'Supervisor' ? (
                                            <>
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold">{m.department}</span>
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-semibold">{m.experience} yrs exp</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold">{m.skillType}</span>
                                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold">₹{m.dailyWage}/day</span>
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-semibold">{m.shift}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(activeListTab === 'Supervisor' ? supervisors : labours).length === 0 && (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                <i className={`fas ${activeListTab === 'Supervisor' ? 'fa-user-tie' : 'fa-users'} text-3xl`}></i>
                                <p className="text-xs font-bold">No {activeListTab.toLowerCase()}s yet</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-wider opacity-80">Name</th>
                                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-wider opacity-80">Mobile</th>
                                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-wider opacity-80">Aadhaar</th>
                                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-wider opacity-80">
                                    {activeListTab === 'Supervisor' ? 'Dept / Exp' : 'Skill / Wage'}
                                </th>
                                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-wider opacity-80">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(activeListTab === 'Supervisor' ? supervisors : labours).map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-500">
                                                {m.name.charAt(0)}
                                            </div>
                                            <p className="font-bold text-gray-800 text-sm">{m.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 font-semibold text-gray-500 text-sm">{m.mobile}</td>
                                    <td className="px-4 md:px-6 py-4 font-mono text-xs text-gray-400">{formatAadhaar(m.aadhaarNumber)}</td>
                                    <td className="px-4 md:px-6 py-4">
                                        {activeListTab === 'Supervisor' ? (
                                            <div>
                                                <p className="text-xs font-bold text-gray-700">{m.department}</p>
                                                <p className="text-[10px] text-gray-400 font-semibold">{m.experience} Years</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs font-bold text-gray-700">{m.skillType}</p>
                                                <p className="text-[10px] text-gray-400 font-semibold">₹{m.dailyWage} • {m.shift}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${m.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            m.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(activeListTab === 'Supervisor' ? supervisors : labours).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-300">
                                            <i className={`fas ${activeListTab === 'Supervisor' ? 'fa-user-tie' : 'fa-users'} text-3xl`}></i>
                                            <p className="text-xs font-bold">No {activeListTab.toLowerCase()}s registered</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal - Mobile Bottom Sheet */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl relative z-10 animate-in slide-in-from-bottom sm:zoom-in-95 overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden flex-shrink-0"></div>
                        
                        <div className="px-4 sm:px-8 py-4 sm:py-6 text-white relative flex justify-between items-center bg-blue-500 flex-shrink-0">
                            <div>
                                <h2 className="text-lg sm:text-2xl font-black tracking-tight">Add {modalRole}</h2>
                                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide mt-0.5">Onboarding</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Project</label>
                                    <input type="text" value="Skyline Residential" readOnly className="w-full bg-gray-50 border-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-gray-800 text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Name *</label>
                                    <input name="name" type="text" required placeholder="Ramesh Babu" className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Mobile *</label>
                                    <input name="mobile" type="tel" required pattern="[0-9]{10}" placeholder="10 Digits" className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Aadhaar *</label>
                                    <input
                                        name="aadhaarNumber"
                                        type="text"
                                        required
                                        onChange={handleAadhaarChange}
                                        placeholder="12 Digits"
                                        className={`w-full border-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold outline-none transition-colors ${aadhaarError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-blue-500'}`}
                                    />
                                    {aadhaarError && <p className="text-[10px] text-red-600 font-semibold mt-1">{aadhaarError}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Aadhaar Front *</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white group">
                                        <i className="fas fa-camera text-gray-300 group-hover:text-blue-400 text-xl sm:text-2xl mb-1 transition-colors"></i>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Upload Front</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Aadhaar Back *</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white group">
                                        <i className="fas fa-camera text-gray-300 group-hover:text-blue-400 text-xl sm:text-2xl mb-1 transition-colors"></i>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Upload Back</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {modalRole === 'Labour' ? (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Skill *</label>
                                            <select name="skillType" className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none bg-white appearance-none">
                                                <option>Mason</option>
                                                <option>Helper</option>
                                                <option>Carpenter</option>
                                                <option>Electrician</option>
                                                <option>Plumber</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Daily Wage (₹) *</label>
                                            <input name="dailyWage" type="number" required placeholder="850" className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none" />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Shift *</label>
                                            <div className="flex gap-2">
                                                <label className="flex-1">
                                                    <input type="radio" name="shift" value="Day" defaultChecked className="hidden peer" />
                                                    <div className="text-center p-2.5 sm:p-3 border-2 border-gray-100 rounded-xl text-[10px] font-bold uppercase text-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 cursor-pointer transition-all">Day</div>
                                                </label>
                                                <label className="flex-1">
                                                    <input type="radio" name="shift" value="Night" className="hidden peer" />
                                                    <div className="text-center p-2.5 sm:p-3 border-2 border-gray-100 rounded-xl text-[10px] font-bold uppercase text-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 cursor-pointer transition-all">Night</div>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Department *</label>
                                            <input name="department" type="text" required placeholder="Civil Engineering" className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Experience (Yrs) *</label>
                                            <input name="experience" type="number" required placeholder="8" className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none" />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Joining Date *</label>
                                    <input name="doj" type="date" required className="w-full border-2 border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold focus:border-blue-500 outline-none bg-white" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 sm:pt-6 border-t mt-2 sm:mt-4 sticky bottom-0 bg-white safe-area-bottom">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs text-gray-400 uppercase hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs text-white shadow-lg transition-all active:scale-95 uppercase bg-blue-500 hover:bg-blue-600">
                                    Add {modalRole}
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
