import { useState, useEffect } from 'react';
import { 
    ShoppingCart, Plus, Search, Filter, Package, Truck, CheckCircle2, 
    Clock, AlertCircle, FileText, IndianRupee, Calendar, Building2,
    ChevronDown, Eye, Edit2, Download, MoreVertical, ArrowRight
} from 'lucide-react';

const Procurement = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [requisitions, setRequisitions] = useState([]);

    useEffect(() => {
        const storedPO = localStorage.getItem('procurement_orders');
        const storedReq = localStorage.getItem('procurement_requisitions');
        
        if (storedPO) {
            setPurchaseOrders(JSON.parse(storedPO));
        } else {
            const initialPO = [
                { id: 'PO-2024-001', vendor: 'UltraTech Cement', items: ['Portland Cement - 500 bags'], totalAmount: 250000, status: 'Delivered', createdDate: '2024-02-01', deliveryDate: '2024-02-05', project: 'Horizon Tower', requestedBy: 'Rajesh Kumar' },
                { id: 'PO-2024-002', vendor: 'Tata Steel', items: ['TMT Steel Bars 12mm - 10 tons', 'TMT Steel Bars 16mm - 5 tons'], totalAmount: 875000, status: 'In Transit', createdDate: '2024-02-10', deliveryDate: '2024-02-15', project: 'Green Valley', requestedBy: 'Suresh Singh' },
                { id: 'PO-2024-003', vendor: 'ACC Limited', items: ['Ready Mix Concrete M25 - 100 cu.m'], totalAmount: 450000, status: 'Approved', createdDate: '2024-02-12', deliveryDate: '2024-02-18', project: 'Metro Complex', requestedBy: 'Amit Sharma' },
                { id: 'PO-2024-004', vendor: 'Asian Paints', items: ['Exterior Emulsion - 200L', 'Primer - 100L'], totalAmount: 85000, status: 'Pending', createdDate: '2024-02-14', deliveryDate: '', project: 'Horizon Tower', requestedBy: 'Vikram Yadav' },
                { id: 'PO-2024-005', vendor: 'Havells India', items: ['Electrical Cables - 2000m', 'MCB Panels - 10 units'], totalAmount: 320000, status: 'Approved', createdDate: '2024-02-13', deliveryDate: '2024-02-20', project: 'Green Valley', requestedBy: 'Deepak Gupta' },
            ];
            setPurchaseOrders(initialPO);
            localStorage.setItem('procurement_orders', JSON.stringify(initialPO));
        }

        if (storedReq) {
            setRequisitions(JSON.parse(storedReq));
        } else {
            const initialReq = [
                { id: 'REQ-001', item: 'Reinforcement Steel', quantity: '20 tons', project: 'Horizon Tower', requestedBy: 'Site Engineer - Tower A', priority: 'High', status: 'Pending', date: '2024-02-14' },
                { id: 'REQ-002', item: 'Plywood Sheets', quantity: '200 sheets', project: 'Green Valley', requestedBy: 'Site Engineer - Block B', priority: 'Medium', status: 'Approved', date: '2024-02-13' },
                { id: 'REQ-003', item: 'PVC Pipes 4 inch', quantity: '500m', project: 'Metro Complex', requestedBy: 'Plumbing Contractor', priority: 'Low', status: 'Pending', date: '2024-02-12' },
            ];
            setRequisitions(initialReq);
            localStorage.setItem('procurement_requisitions', JSON.stringify(initialReq));
        }
    }, []);

    const statusColors = {
        'Pending': 'bg-amber-100 text-amber-700',
        'Approved': 'bg-blue-100 text-blue-700',
        'In Transit': 'bg-purple-100 text-purple-700',
        'Delivered': 'bg-green-100 text-green-700',
        'Cancelled': 'bg-red-100 text-red-700'
    };

    const priorityColors = {
        'High': 'bg-red-100 text-red-700',
        'Medium': 'bg-amber-100 text-amber-700',
        'Low': 'bg-green-100 text-green-700'
    };

    const stats = {
        totalOrders: purchaseOrders.length,
        pendingApproval: purchaseOrders.filter(p => p.status === 'Pending').length,
        inTransit: purchaseOrders.filter(p => p.status === 'In Transit').length,
        totalValue: purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0),
        pendingRequisitions: requisitions.filter(r => r.status === 'Pending').length
    };

    const filteredOrders = purchaseOrders.filter(po => {
        const matchesSearch = po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              po.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || po.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreatePO = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const newPO = {
            id: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
            vendor: data.vendor,
            items: data.items.split(',').map(i => i.trim()),
            totalAmount: parseInt(data.amount),
            status: 'Pending',
            createdDate: new Date().toISOString().split('T')[0],
            deliveryDate: data.deliveryDate,
            project: data.project,
            requestedBy: data.requestedBy
        };

        const updated = [...purchaseOrders, newPO];
        setPurchaseOrders(updated);
        localStorage.setItem('procurement_orders', JSON.stringify(updated));
        setShowCreateModal(false);
        e.target.reset();
    };

    const updatePOStatus = (id, newStatus) => {
        const updated = purchaseOrders.map(po => 
            po.id === id ? { ...po, status: newStatus } : po
        );
        setPurchaseOrders(updated);
        localStorage.setItem('procurement_orders', JSON.stringify(updated));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Procurement</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Manage purchase orders, requisitions, and vendor supplies</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                        <Download size={16} /> Export
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                    >
                        <Plus size={16} /> New PO
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Total Orders</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Pending</span>
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.pendingApproval}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">In Transit</span>
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Truck size={16} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.inTransit}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Requisitions</span>
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle size={16} className="text-red-600" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.pendingRequisitions}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-lg col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 text-xs sm:text-sm font-medium">Total Value</span>
                        <IndianRupee size={16} className="text-white" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4 overflow-x-auto">
                {['orders', 'requisitions', 'vendors'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize whitespace-nowrap transition-all ${
                            activeTab === tab 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {tab === 'orders' ? 'Purchase Orders' : tab}
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by PO number or vendor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

            {/* Purchase Orders Tab */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {filteredOrders.map(po => (
                        <div key={po.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <ShoppingCart size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{po.id}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{po.vendor}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[po.status]}`}>
                                            {po.status}
                                        </span>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                                            <MoreVertical size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Project</p>
                                        <p className="text-sm font-semibold text-slate-900">{po.project}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                                        <p className="text-sm font-bold text-slate-900">₹{po.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Created</p>
                                        <p className="text-sm font-medium text-gray-700">{po.createdDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Delivery</p>
                                        <p className="text-sm font-medium text-gray-700">{po.deliveryDate || '-'}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Items</p>
                                    <p className="text-sm text-gray-700">{po.items.join(', ')}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
                                        <Eye size={12} /> View Details
                                    </button>
                                    {po.status === 'Pending' && (
                                        <>
                                            <button 
                                                onClick={() => updatePOStatus(po.id, 'Approved')}
                                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all flex items-center gap-1"
                                            >
                                                <CheckCircle2 size={12} /> Approve
                                            </button>
                                            <button 
                                                onClick={() => updatePOStatus(po.id, 'Cancelled')}
                                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {po.status === 'Approved' && (
                                        <button 
                                            onClick={() => updatePOStatus(po.id, 'In Transit')}
                                            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition-all flex items-center gap-1"
                                        >
                                            <Truck size={12} /> Mark In Transit
                                        </button>
                                    )}
                                    {po.status === 'In Transit' && (
                                        <button 
                                            onClick={() => updatePOStatus(po.id, 'Delivered')}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all flex items-center gap-1"
                                        >
                                            <CheckCircle2 size={12} /> Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Requisitions Tab */}
            {activeTab === 'requisitions' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Material Requisitions</h3>
                        <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
                            <Plus size={14} /> New Request
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {requisitions.map(req => (
                            <div key={req.id} className="p-4 hover:bg-gray-50 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Package size={18} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{req.item}</h4>
                                            <p className="text-xs text-gray-500">{req.id} • {req.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[req.priority]}`}>
                                            {req.priority}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Building2 size={12} /> {req.project}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {req.date}</span>
                                    <span>By: {req.requestedBy}</span>
                                </div>
                                {req.status === 'Pending' && (
                                    <div className="mt-3 flex gap-2">
                                        <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-all flex items-center gap-1">
                                            <ArrowRight size={12} /> Convert to PO
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Vendor Management</h3>
                    <p className="text-gray-500 text-sm mb-4">View and manage all your registered vendors</p>
                    <a href="/vendors" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all text-sm">
                        Go to Vendors <ArrowRight size={14} />
                    </a>
                </div>
            )}

            {/* Create PO Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Create Purchase Order</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleCreatePO} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor *</label>
                                <select
                                    name="vendor"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="">Select vendor</option>
                                    <option value="UltraTech Cement">UltraTech Cement</option>
                                    <option value="Tata Steel">Tata Steel</option>
                                    <option value="ACC Limited">ACC Limited</option>
                                    <option value="Asian Paints">Asian Paints</option>
                                    <option value="Havells India">Havells India</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Items (comma separated) *</label>
                                <textarea
                                    name="items"
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Portland Cement - 500 bags, Sand - 10 truckloads"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount (₹) *</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="250000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Delivery</label>
                                    <input
                                        name="deliveryDate"
                                        type="date"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Project *</label>
                                <select
                                    name="project"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="">Select project</option>
                                    <option value="Horizon Tower">Horizon Tower</option>
                                    <option value="Green Valley">Green Valley</option>
                                    <option value="Metro Complex">Metro Complex</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Requested By</label>
                                <input
                                    name="requestedBy"
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Manager name"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
                                >
                                    Create PO
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Procurement;
