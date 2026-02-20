import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Vendors = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('vendors'); // 'vendors' or 'contractors'
    const [allSuppliers, setAllSuppliers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('Vendor'); // 'Vendor' or 'Contractor'
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Initial Data
    const INITIAL_DATA = [
        { _id: 'v1', name: 'UltraTech Cement', code: 'VEN-001', type: 'Vendor', category: 'Cement', address: 'Plot 4, Ind. Area', contact: { mobile: '9876543210', email: 'sales@ultratech.com' }, status: 'Active', totalPurchaseValue: 450000, rating: 4.8 },
        { _id: 'v2', name: 'Tata Steel', code: 'VEN-002', type: 'Vendor', category: 'Steel', address: 'Jamshedpur', contact: { mobile: '8765432109', email: 'sales@tatasteel.com' }, status: 'Active', totalPurchaseValue: 120000, rating: 4.9 },
        { _id: 'c1', name: 'Ravi Plumbing Solutions', code: 'CON-001', type: 'Contractor', category: 'Plumbing', address: 'Main St, City', contact: { mobile: '7654321098', email: 'ravi@plumbing.com' }, status: 'Active', totalPurchaseValue: 85000, rating: 4.5, specialization: 'Commercial Layouts' },
        { _id: 'c2', name: 'Perfect Spark Electricians', code: 'CON-002', type: 'Contractor', category: 'Electrical', address: 'Power Lane', contact: { mobile: '6543210987', email: 'contact@pspark.com' }, status: 'Active', totalPurchaseValue: 62000, rating: 4.7, specialization: 'HVAC & Wiring' },
    ];

    useEffect(() => {
        const stored = localStorage.getItem('mock_vendors_contractors');
        if (stored) {
            setAllSuppliers(JSON.parse(stored));
        } else {
            setAllSuppliers(INITIAL_DATA);
            localStorage.setItem('mock_vendors_contractors', JSON.stringify(INITIAL_DATA));
        }
    }, []);

    const handleCreateSupplier = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const newEntry = {
            _id: 's' + Date.now(),
            name: data.name,
            code: data.code,
            type: formType,
            category: data.category,
            address: data.address,
            contact: {
                mobile: data.mobile,
                email: data.email
            },
            status: 'Active',
            totalPurchaseValue: 0,
            rating: 0,
            specialization: data.specialization || ''
        };

        const updated = [...allSuppliers, newEntry];
        setAllSuppliers(updated);
        localStorage.setItem('mock_vendors_contractors', JSON.stringify(updated));
        setShowForm(false);
        alert(`${formType} added successfully!`);
    };

    // Filtered Data
    const filteredData = allSuppliers.filter(item => {
        const isCorrectTab = activeTab === 'vendors' ? item.type === 'Vendor' : item.type === 'Contractor';
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase());
        return isCorrectTab && matchesSearch;
    });

    // Icons Mapping
    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Plumbing': return 'fa-pipe-section';
            case 'Electrical': return 'fa-bolt';
            case 'Cement': return 'fa-fill-drip';
            case 'Steel': return 'fa-layer-group';
            default: return 'fa-briefcase';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 lg:mb-10 gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-navy-900 tracking-tight">Suppliers & Workforce</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Manage material vendors and service contractors in one place.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => { setFormType('Vendor'); setShowForm(true); }}
                        className="flex-1 sm:flex-none bg-white text-navy-900 border-2 border-navy-900/10 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-[10px] sm:text-xs lg:text-sm"
                    >
                        <i className="fas fa-truck-loading text-primary"></i> <span className="hidden xs:inline">Add</span> Vendor
                    </button>
                    <button
                        onClick={() => { setFormType('Contractor'); setShowForm(true); }}
                        className="flex-1 sm:flex-none bg-navy-900 text-white px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-[10px] sm:text-xs lg:text-sm"
                    >
                        <i className="fas fa-user-hard-hat"></i> <span className="hidden xs:inline">Add</span> Contractor
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
                <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-navy-900/5 flex items-center gap-3 sm:gap-4 lg:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base sm:text-lg lg:text-xl">
                        <i className="fas fa-warehouse"></i>
                    </div>
                    <div>
                        <div className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Active Vendors</div>
                        <div className="text-lg sm:text-xl lg:text-2xl font-black text-navy-900">{allSuppliers.filter(s => s.type === 'Vendor').length}</div>
                    </div>
                </div>
                <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-navy-900/5 flex items-center gap-3 sm:gap-4 lg:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-base sm:text-lg lg:text-xl">
                        <i className="fas fa-tools"></i>
                    </div>
                    <div>
                        <div className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Site Contractors</div>
                        <div className="text-lg sm:text-xl lg:text-2xl font-black text-navy-900">{allSuppliers.filter(s => s.type === 'Contractor').length}</div>
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1 bg-navy-900 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4 lg:gap-5 text-white">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 flex items-center justify-center text-white text-base sm:text-lg lg:text-xl">
                        <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <div>
                        <div className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Total Payouts</div>
                        <div className="text-lg sm:text-xl lg:text-2xl font-black">₹{allSuppliers.reduce((a, b) => a + (b.totalPurchaseValue || 0), 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-navy-900/5 p-3 sm:p-4 mb-4 sm:mb-6 lg:mb-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="flex bg-gray-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl w-full md:w-fit">
                    <button
                        onClick={() => setActiveTab('vendors')}
                        className={`flex-1 md:flex-none px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs lg:text-sm font-black transition-all ${activeTab === 'vendors' ? 'bg-white text-navy-900 shadow-md' : 'text-gray-500 hover:text-navy-900'}`}
                    >
                        <span className="hidden sm:inline">MATERIAL </span>VENDORS
                    </button>
                    <button
                        onClick={() => setActiveTab('contractors')}
                        className={`flex-1 md:flex-none px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs lg:text-sm font-black transition-all ${activeTab === 'contractors' ? 'bg-white text-navy-900 shadow-md' : 'text-gray-500 hover:text-navy-900'}`}
                    >
                        <span className="hidden sm:inline">SERVICE </span>CONTRACTORS
                    </button>
                </div>
                <div className="relative w-full md:w-96">
                    <i className="fas fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredData.map(item => (
                    <div key={item._id} className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-navy-900/5 p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                        {/* Status Label */}
                        <div className="absolute top-4 sm:top-5 lg:top-6 right-4 sm:right-5 lg:right-6">
                            <span className="bg-emerald-50 text-emerald-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                                {item.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-primary text-base sm:text-lg lg:text-xl border border-gray-100 group-hover:scale-110 transition-transform">
                                <i className={`fas ${getCategoryIcon(item.category)}`}></i>
                            </div>
                            <div className="min-w-0 flex-1 pr-12 sm:pr-16">
                                <h3 className="font-black text-navy-900 text-sm sm:text-base lg:text-lg leading-tight truncate">{item.name}</h3>
                                <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{item.code}</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Category</span>
                                <span className="text-navy-900 font-black flex items-center gap-1 sm:gap-1.5">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/40"></div>
                                    {item.category}
                                </span>
                            </div>
                            {item.specialization && (
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Focus</span>
                                    <span className="text-gray-600 font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{item.specialization}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Volume (₹)</span>
                                <span className="text-navy-900 font-black tabular-nums">₹{item.totalPurchaseValue.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/vendors/${item._id}`)}
                                className="flex-1 bg-gray-50 hover:bg-navy-900 hover:text-white text-navy-900 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all uppercase tracking-widest"
                            >
                                Dashboard
                            </button>
                            <a
                                href={`tel:${item.contact.mobile}`}
                                className="w-10 sm:w-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-all"
                            >
                                <i className="fas fa-phone-alt text-sm"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-navy-900/40 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl lg:rounded-[40px] w-full sm:max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 max-h-[90vh] overflow-y-auto">
                        <div className="p-5 sm:p-6 lg:p-10">
                            <div className="flex justify-between items-center mb-6 sm:mb-8 lg:mb-10">
                                <div>
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-navy-900 tracking-tight">New {formType}</h3>
                                    <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest mt-1">Personnel Information System</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-navy-900 transition-colors">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleCreateSupplier} className="space-y-4 sm:space-y-5 lg:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Entity Name</label>
                                        <input name="name" required placeholder="e.g. Skyline Plumbing" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-xl sm:rounded-2xl outline-none font-bold placeholder:text-gray-300 text-sm sm:text-base" />
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Internal Code</label>
                                        <input name="code" required defaultValue={`${formType === 'Vendor' ? 'VEN' : 'CON'}-${Date.now().toString().slice(-4)}`} className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-100 border-none rounded-xl sm:rounded-2xl outline-none font-black text-navy-900 text-sm sm:text-base" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Domain</label>
                                        <select name="category" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-xl sm:rounded-2xl outline-none font-bold appearance-none bg-no-repeat bg-[right_1.25rem_center] text-sm sm:text-base">
                                            {formType === 'Vendor' ? (
                                                <>
                                                    <option>Cement</option><option>Steel</option><option>Hardware</option><option>Bricks</option><option>Aggregates</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option>Plumbing</option><option>Electrical</option><option>Civil</option><option>Carpentry</option><option>HVAC</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{formType === 'Vendor' ? 'Contact No.' : 'Primary Expert'}</label>
                                        <input name={formType === 'Vendor' ? 'mobile' : 'specialization'} required placeholder={formType === 'Vendor' ? '987....' : 'e.g. Industrial Wiring'} className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-xl sm:rounded-2xl outline-none font-bold text-sm sm:text-base" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Terminal</label>
                                    <input name="email" type="email" required placeholder="corp@system.com" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-xl sm:rounded-2xl outline-none font-bold text-sm sm:text-base" />
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Headquarters</label>
                                    <textarea name="address" required rows="3" placeholder="Full legal address..." className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-xl sm:rounded-2xl outline-none font-bold resize-none text-sm sm:text-base" />
                                </div>

                                <button type="submit" className="w-full bg-navy-900 text-white py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-xs sm:text-sm uppercase tracking-[2px] sm:tracking-[4px] shadow-2xl shadow-navy-900/30 hover:bg-black transition-all active:scale-[0.98] mt-2 sm:mt-4">
                                    Initialize {formType}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendors;
