import { useState, useEffect } from 'react';

const Inventory = () => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'requests'

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
    const isEngineer = currentUser.role === 'engineer';
    const isSuperAdmin = currentUser.role === 'superadmin';
    const isAdmin = currentUser.role === 'admin';

    // Mock Projects for Dropdown
    const projects = [
        'Skyline Residential Complex',
        'City Center Mall',
        'Highway Bridge Project'
    ];

    const [items, setItems] = useState([
        {
            id: 'INV001',
            name: 'Portland Cement',
            category: 'Construction Materials',
            currentStock: 150,
            minStock: 200,
            unit: 'bags',
            unitPrice: 350,
            status: 'low-stock',
            supplier: 'Ultratech Cement'
        },
        {
            id: 'INV002',
            name: 'TMT Steel Bars (12mm)',
            category: 'Steel & Metal',
            currentStock: 5000,
            minStock: 2000,
            unit: 'kg',
            unitPrice: 65,
            status: 'in-stock',
            supplier: 'Tata Steel'
        },
        {
            id: 'INV003',
            name: 'Red Bricks',
            category: 'Construction Materials',
            currentStock: 15000,
            minStock: 5000,
            unit: 'pcs',
            unitPrice: 8,
            status: 'in-stock',
            supplier: 'Local Brick Works'
        },
        {
            id: 'INV004',
            name: 'Safety Helmets',
            category: 'Safety Equipment',
            currentStock: 45,
            minStock: 50,
            unit: 'pcs',
            unitPrice: 150,
            status: 'low-stock',
            supplier: 'Safety First Co.'
        }
    ]);

    // Initialize Requests from LocalStorage
    const [requests, setRequests] = useState(() => {
        const savedRequests = localStorage.getItem('stockRequests');
        return savedRequests ? JSON.parse(savedRequests) : [
            {
                id: 1,
                project: 'Skyline Residential Complex',
                item: 'TMT Steel Bars (12mm)',
                quantity: 500,
                date: '2023-10-30',
                requester: 'David Lee',
                requesterRole: 'engineer',
                remarks: 'Urgent for foundation work',
                status: 'Pending'
            },
            {
                id: 2,
                project: 'City Center Mall',
                item: 'Portland Cement',
                quantity: 200,
                date: '2023-11-05',
                requester: 'Mike Wilson',
                requesterRole: 'engineer',
                remarks: 'Standard refill',
                status: 'Approved'
            }
        ];
    });

    const handleAddItem = (e) => {
        e.preventDefault();
        alert('Item Added Successfully! (Mock)');
        setShowAddItemModal(false);
    };

    const handleRequestStock = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newRequest = {
            id: Date.now(),
            project: formData.get('project'),
            item: formData.get('item'),
            quantity: formData.get('quantity'),
            date: formData.get('date'),
            requester: currentUser.name || 'Unknown User',
            requesterRole: currentUser.role,
            remarks: formData.get('remarks'),
            status: 'Pending'
        };

        const updatedRequests = [newRequest, ...requests];
        setRequests(updatedRequests);
        localStorage.setItem('stockRequests', JSON.stringify(updatedRequests));

        setShowRequestModal(false);
        alert('Stock Request Submitted Successfully!');
        setActiveTab('requests'); // Switch to requests tab to show the new item
    };

    const handleUpdateStatus = (id, newStatus) => {
        const updatedRequests = requests.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        );
        setRequests(updatedRequests);
        localStorage.setItem('stockRequests', JSON.stringify(updatedRequests));
    };

    // Filter Requests based on Role visibility
    const displayedRequests = requests.filter(req => {
        if (isEngineer) return req.requester === currentUser.name;
        if (isSuperAdmin) return true; // Super Admin sees all (could filter to only Forwarded if preferred, but usually full oversight is better)
        if (isAdmin) return true; // Admin sees all
        return false;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Cancelled': return 'bg-gray-100 text-gray-600';
            case 'Forwarded': return 'bg-purple-100 text-purple-700';
            case 'Final Approval': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <>
            {/* Mobile-First Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Materials & Stock</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">Manage inventory and stock requests</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setShowRequestModal(true)}
                            className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm font-semibold"
                        >
                            <i className="fas fa-file-import text-xs"></i>
                            <span>Request</span>
                        </button>
                        {!isEngineer && (
                            <button
                                onClick={() => setShowAddItemModal(true)}
                                className="flex-1 sm:flex-none bg-blue-600 text-white hover:bg-blue-700 px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 text-sm font-semibold"
                            >
                                <i className="fas fa-plus text-xs"></i>
                                <span>Add Item</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile-Friendly Tabs */}
            <div className="flex gap-1 sm:gap-4 mb-4 sm:mb-6 bg-gray-100 sm:bg-transparent p-1 sm:p-0 rounded-xl sm:border-b sm:border-gray-200 overflow-x-auto">
                <button
                    className={`flex-1 sm:flex-none px-4 py-2.5 sm:pb-4 sm:pt-0 sm:px-2 font-semibold text-xs sm:text-sm transition-colors rounded-lg sm:rounded-none relative ${
                        activeTab === 'inventory' 
                            ? 'bg-white sm:bg-transparent text-blue-600 shadow-sm sm:shadow-none' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('inventory')}
                >
                    <i className="fas fa-boxes mr-1.5 sm:mr-2"></i>
                    <span>Stock</span>
                    {activeTab === 'inventory' && <div className="hidden sm:block absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
                <button
                    className={`flex-1 sm:flex-none px-4 py-2.5 sm:pb-4 sm:pt-0 sm:px-2 font-semibold text-xs sm:text-sm transition-colors rounded-lg sm:rounded-none relative ${
                        activeTab === 'requests' 
                            ? 'bg-white sm:bg-transparent text-blue-600 shadow-sm sm:shadow-none' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('requests')}
                >
                    <i className="fas fa-clipboard-list mr-1.5 sm:mr-2"></i>
                    <span>Requests</span>
                    {requests.filter(r => r.status === 'Pending').length > 0 && (
                        <span className="ml-1.5 sm:ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {requests.filter(r => r.status === 'Pending').length}
                        </span>
                    )}
                    {activeTab === 'requests' && <div className="hidden sm:block absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
            </div>

            {/* TAB: INVENTORY ITEMS */}
            {activeTab === 'inventory' && (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm sm:text-base">
                                    <i className="fas fa-boxes"></i>
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-gray-800">{items.length}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Items</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-sm sm:text-base">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-gray-800">{items.filter(i => i.status === 'low-stock').length}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Low Stock</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-sm sm:text-base">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-gray-800">{requests.filter(r => r.status === 'Pending').length}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Pending</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-sm sm:text-base">
                                    <i className="fas fa-indian-rupee-sign"></i>
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-gray-800">₹2.8L</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Value</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card View for Inventory */}
                    <div className="space-y-3 sm:hidden">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                        <p className="text-xs text-gray-500">{item.supplier}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                                        item.status === 'in-stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {item.status.replace('-', ' ')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className={`text-sm font-bold ${item.currentStock <= item.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                                            {item.currentStock}
                                        </p>
                                        <p className="text-[10px] text-gray-500">Stock</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-sm font-bold text-gray-800">{item.minStock}</p>
                                        <p className="text-[10px] text-gray-500">Min</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-sm font-bold text-gray-800">₹{item.unitPrice}</p>
                                        <p className="text-[10px] text-gray-500">/{item.unit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">{item.category}</span>
                                    <span className="text-gray-400">{item.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">Inventory Items</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="p-4 font-semibold border-b">Item ID</th>
                                        <th className="p-4 font-semibold border-b">Name</th>
                                        <th className="p-4 font-semibold border-b">Category</th>
                                        <th className="p-4 font-semibold border-b">Current Stock</th>
                                        <th className="p-4 font-semibold border-b">Min Stock</th>
                                        <th className="p-4 font-semibold border-b">Unit Price</th>
                                        <th className="p-4 font-semibold border-b">Status</th>
                                        <th className="p-4 font-semibold border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-600">{item.id}</td>
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-medium text-gray-800">{item.name}</div>
                                                    <div className="text-xs text-gray-500">{item.supplier}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{item.category}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-semibold ${item.currentStock <= item.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                                                        {item.currentStock}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{item.unit}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{item.minStock} {item.unit}</td>
                                            <td className="p-4 text-gray-600">₹{item.unitPrice}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'in-stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="View">
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    {!isEngineer && (
                                                        <button className="text-gray-600 hover:bg-gray-100 p-1 rounded" title="Edit">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* TAB: STOCK REQUESTS */}
            {activeTab === 'requests' && (
                <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">Stock Requests</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                            {displayedRequests.length} requests
                        </span>
                    </div>
                    
                    {displayedRequests.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
                            <i className="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                            <p>No stock requests found.</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="space-y-3 sm:hidden">
                                {displayedRequests.map((req) => (
                                    <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{req.item}</h4>
                                                <p className="text-xs text-gray-500">Qty: {req.quantity}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <p className="text-gray-400 text-[10px]">Project</p>
                                                <p className="font-medium text-gray-700 truncate">{req.project}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <p className="text-gray-400 text-[10px]">Date</p>
                                                <p className="font-medium text-gray-700">{req.date}</p>
                                            </div>
                                        </div>
                                        
                                        {req.remarks && (
                                            <p className="text-xs text-gray-500 italic mb-3 line-clamp-1">
                                                <i className="fas fa-comment-dots mr-1 text-gray-400"></i>{req.remarks}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                                    {req.requester.charAt(0)}
                                                </div>
                                                <span className="truncate">{req.requester}</span>
                                            </div>
                                            
                                            {/* Mobile Action Buttons */}
                                            <div className="flex gap-1.5">
                                                {req.status === 'Pending' && isAdmin && !isSuperAdmin && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="w-8 h-8 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg flex items-center justify-center">
                                                            <i className="fas fa-check text-xs"></i>
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(req.id, 'Cancelled')} className="w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center">
                                                            <i className="fas fa-times text-xs"></i>
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(req.id, 'Forwarded')} className="bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg px-2 py-1.5 text-[10px] font-bold flex items-center gap-1">
                                                            <i className="fas fa-share"></i>Fwd
                                                        </button>
                                                    </>
                                                )}
                                                {req.status === 'Forwarded' && isSuperAdmin && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(req.id, 'Final Approval')} className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-2 py-1.5 text-[10px] font-bold">
                                                            <i className="fas fa-check-double mr-1"></i>OK
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} className="w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center">
                                                            <i className="fas fa-ban text-xs"></i>
                                                        </button>
                                                    </>
                                                )}
                                                {isEngineer && req.status === 'Pending' && (
                                                    <button onClick={() => handleUpdateStatus(req.id, 'Cancelled')} className="text-gray-400 hover:text-red-500 text-xs px-2 py-1">
                                                        <i className="fas fa-trash"></i> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Desktop Table View */}
                            <div className="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                            <tr>
                                                <th className="p-4 font-semibold border-b">Date</th>
                                                <th className="p-4 font-semibold border-b">Project</th>
                                                <th className="p-4 font-semibold border-b">Item Details</th>
                                                <th className="p-4 font-semibold border-b">Requester</th>
                                                <th className="p-4 font-semibold border-b">Status</th>
                                                <th className="p-4 font-semibold border-b text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {displayedRequests.map((req) => (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="p-4 text-gray-600 whitespace-nowrap">{req.date}</td>
                                                    <td className="p-4 font-medium text-gray-800">{req.project}</td>
                                                    <td className="p-4">
                                                        <div className="font-medium text-gray-800">{req.item}</div>
                                                        <div className="text-xs text-gray-500">Qty: {req.quantity} • {req.remarks}</div>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                                                                {req.requester.charAt(0)}
                                                            </div>
                                                            {req.requester}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(req.status)}`}>
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {req.status === 'Pending' && isAdmin && !isSuperAdmin && (
                                                                <>
                                                                    <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="btn-sm bg-green-50 text-green-600 hover:bg-green-100 rounded px-2 py-1 text-xs font-bold" title="Approve">
                                                                        <i className="fas fa-check"></i>
                                                                    </button>
                                                                    <button onClick={() => handleUpdateStatus(req.id, 'Cancelled')} className="btn-sm bg-red-50 text-red-600 hover:bg-red-100 rounded px-2 py-1 text-xs font-bold" title="Cancel">
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                    <button onClick={() => handleUpdateStatus(req.id, 'Forwarded')} className="btn-sm bg-purple-50 text-purple-600 hover:bg-purple-100 rounded px-2 py-1 text-xs font-bold" title="Forward to MD">
                                                                        <i className="fas fa-share"></i> Forward
                                                                    </button>
                                                                </>
                                                            )}
                                                            {req.status === 'Forwarded' && isSuperAdmin && (
                                                                <>
                                                                    <button onClick={() => handleUpdateStatus(req.id, 'Final Approval')} className="btn-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded px-2 py-1 text-xs font-bold" title="Final Approve">
                                                                        <i className="fas fa-check-double"></i> Approve
                                                                    </button>
                                                                    <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} className="btn-sm bg-red-50 text-red-600 hover:bg-red-100 rounded px-2 py-1 text-xs font-bold" title="Reject">
                                                                        <i className="fas fa-ban"></i> Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                            {isEngineer && req.status === 'Pending' && (
                                                                <button onClick={() => handleUpdateStatus(req.id, 'Cancelled')} className="text-gray-400 hover:text-red-500 text-xs">
                                                                    <i className="fas fa-trash"></i> Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Request Stock Modal - Mobile Bottom Sheet */}
            {showRequestModal && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden"></div>
                        
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b">
                            <h3 className="text-base sm:text-xl font-bold text-gray-800">Request Stock</h3>
                            <button onClick={() => setShowRequestModal(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <form onSubmit={handleRequestStock} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Project Site *</label>
                                    <select name="project" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Item *</label>
                                        <select name="item" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                                            <option value="">Select</option>
                                            {items.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Date *</label>
                                        <input type="date" name="date" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Quantity *</label>
                                    <input type="number" name="quantity" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter quantity" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Remarks</label>
                                    <textarea name="remarks" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="e.g. For slab casting"></textarea>
                                </div>
                                <div className="flex gap-3 pt-4 border-t safe-area-bottom">
                                    <button type="button" onClick={() => setShowRequestModal(false)} className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-sm">Cancel</button>
                                    <button type="submit" className="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-lg active:scale-95">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Item Modal - Mobile Bottom Sheet */}
            {showAddItemModal && (
                <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                        {/* Mobile Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden"></div>
                        
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b">
                            <h3 className="text-base sm:text-xl font-bold">Add Inventory Item</h3>
                            <button onClick={() => setShowAddItemModal(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Item Name *</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Category</label>
                                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                                            <option>Construction Materials</option>
                                            <option>Steel & Metal</option>
                                            <option>Safety Equipment</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Stock</label>
                                        <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Min</label>
                                        <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Unit</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" placeholder="kg" required />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t safe-area-bottom">
                                    <button type="button" onClick={() => setShowAddItemModal(false)} className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl font-semibold text-sm">Cancel</button>
                                    <button type="submit" className="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg active:scale-95">Add Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Inventory;
