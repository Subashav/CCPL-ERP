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
            <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Materials & Stock</h1>
                    <p className="text-gray-500 mt-1">Manage global inventory and site stock requests</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
                    >
                        <i className="fas fa-file-import"></i> Request Stock
                    </button>
                    {!isEngineer && (
                        <button
                            onClick={() => setShowAddItemModal(true)}
                            className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                        >
                            <i className="fas fa-plus"></i> Add Item
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-6 mb-6 border-b border-gray-200">
                <button
                    className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'inventory' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    <i className="fas fa-boxes mr-2"></i> Current Stock
                    {activeTab === 'inventory' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
                <button
                    className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'requests' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('requests')}
                >
                    <i className="fas fa-clipboard-list mr-2"></i> Stock Requests
                    {requests.filter(r => r.status === 'Pending').length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{requests.filter(r => r.status === 'Pending').length}</span>}
                    {activeTab === 'requests' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
            </div>

            {/* TAB: INVENTORY ITEMS */}
            {activeTab === 'inventory' && (
                <>
                    <div className="stats-grid mb-8">
                        <div className="stat-card">
                            <div className="stat-icon primary">
                                <i className="fas fa-boxes"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{items.length}</h3>
                                <p>Total Items</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon danger">
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{items.filter(i => i.status === 'low-stock').length}</h3>
                                <p>Low Stock Items</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon warning">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{requests.filter(r => r.status === 'Pending').length}</h3>
                                <p>Pending Requests</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon success">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-content">
                                <h3>₹2.8L</h3>
                                <p>Total Value</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header border-b border-gray-100 p-4">
                            <h3 className="card-title font-bold text-gray-800">Inventory Items</h3>
                        </div>
                        <div className="card-body p-0">
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
                    </div>
                </>
            )}

            {/* TAB: STOCK REQUESTS */}
            {activeTab === 'requests' && (
                <div className="card">
                    <div className="card-header border-b border-gray-100 p-4 flex justify-between items-center">
                        <h3 className="card-title font-bold text-gray-800">Stock Requests</h3>
                        <div className="text-sm text-gray-500">
                            Showing {displayedRequests.length} requests
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {displayedRequests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                                <p>No stock requests found.</p>
                            </div>
                        ) : (
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
                                                        {/* ADMIN ACTIONS: Approve, Cancel, Forward */}
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

                                                        {/* SUPER ADMIN ACTIONS: Final Approve, Reject */}
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

                                                        {/* ENGINEER: No actions on requests, they just view status */}
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
                        )}
                    </div>
                </div>
            )}

            {/* Request Stock Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Request Material Stock</h3>
                            <button onClick={() => setShowRequestModal(false)}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleRequestStock} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Project Site *</label>
                                    <select name="project" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">Item Name *</label>
                                        <select name="item" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                                            <option value="">Select Item</option>
                                            {items.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">Required Date *</label>
                                        <input type="date" name="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Quantity Needed *</label>
                                    <input type="number" name="quantity" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter quantity" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Remarks / Purpose</label>
                                    <textarea name="remarks" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="e.g. For slab casting next week"></textarea>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setShowRequestModal(false)} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Item Modal (Only visual structure kept for Admin) */}
            {showAddItemModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Add New Inventory Item</h3>
                            <button onClick={() => setShowAddItemModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Item Name</label>
                                        <input type="text" className="w-full border rounded-lg px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Category</label>
                                        <select className="w-full border rounded-lg px-3 py-2 bg-white">
                                            <option>Construction Materials</option>
                                            <option>Steel & Metal</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Current Stock</label>
                                        <input type="number" className="w-full border rounded-lg px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Min Stock</label>
                                        <input type="number" className="w-full border rounded-lg px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Unit</label>
                                        <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="kg, pcs..." required />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setShowAddItemModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Item</button>
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
