import { useState } from 'react';

const Inventory = () => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

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

    const handleAddItem = (e) => {
        e.preventDefault();
        // Logic to add item would go here
        alert('Item Added Successfully!');
        setShowAddItemModal(false);
    };

    const handleRequestStock = (e) => {
        e.preventDefault();
        // Logic to request stock
        alert('Stock Request Submitted!');
        setShowRequestModal(false);
    };

    return (
        <>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1>Inventory Management</h1>
                    <p>Manage stock levels, track materials, and handle approval workflows</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="btn btn-outline hover:bg-white"
                    >
                        <i className="fas fa-file-import"></i> Request Stock
                    </button>
                    <button
                        onClick={() => setShowAddItemModal(true)}
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus"></i> Add Item
                    </button>
                </div>
            </div>

            <div className="stats-grid">
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
                        <h3>1</h3>
                        <p>Pending Approvals</p>
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

            <div className="card mb-6">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="form-group mb-0">
                            <label className="block mb-2 font-medium text-gray-700">Search</label>
                            <input type="text" className="form-control w-full px-3 py-2 border rounded-lg" placeholder="Search items..." />
                        </div>
                        <div className="form-group mb-0">
                            <label className="block mb-2 font-medium text-gray-700">Category</label>
                            <select className="form-control w-full px-3 py-2 border rounded-lg">
                                <option value="">All Categories</option>
                                <option value="Construction Materials">Construction Materials</option>
                                <option value="Steel & Metal">Steel & Metal</option>
                                <option value="Safety Equipment">Safety Equipment</option>
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <label className="block mb-2 font-medium text-gray-700">Stock Status</label>
                            <select className="form-control w-full px-3 py-2 border rounded-lg">
                                <option value="">All Status</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                            </select>
                        </div>
                        <div className="form-group mb-0 flex items-end">
                            <button className="btn btn-outline w-full hover:bg-gray-50">
                                <i className="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Inventory Items</h3>
                </div>
                <div className="card-body p-0">
                    <div className="table-container">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Item ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Min Stock</th>
                                    <th>Unit Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="font-medium text-sm">{item.id}</td>
                                        <td>
                                            <div>
                                                <div className="font-medium text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.supplier}</div>
                                            </div>
                                        </td>
                                        <td className="text-gray-600">{item.category}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${item.currentStock <= item.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {item.currentStock}
                                                </span>
                                                <span className="text-xs text-gray-500">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="text-gray-600">{item.minStock} {item.unit}</td>
                                        <td className="text-gray-600">₹{item.unitPrice}</td>
                                        <td>
                                            <span className={`badge ${item.status === 'in-stock' ? 'badge-success' : 'badge-danger'}`}>
                                                {item.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-sm btn-outline text-blue-600 border-blue-200 hover:bg-blue-50" title="View">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline text-gray-600 border-gray-200 hover:bg-gray-50" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Request Stock Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Request Stock</h3>
                            <button onClick={() => setShowRequestModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleRequestStock} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Select Item</label>
                                    <select className="w-full border rounded-lg px-3 py-2">
                                        <option>Portland Cement</option>
                                        <option>TMT Bars</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Quantity</label>
                                    <input type="number" className="w-full border rounded-lg px-3 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Justification</label>
                                    <textarea className="w-full border rounded-lg px-3 py-2" rows="2"></textarea>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
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
                                        <select className="w-full border rounded-lg px-3 py-2">
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
