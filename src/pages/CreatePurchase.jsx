import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePurchase = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [items, setItems] = useState([
        { materialName: '', unit: '', quantity: 0, unitPrice: 0, discount: 0, gstPercent: 18, baseAmount: 0, gstAmount: 0, totalAmount: 0 }
    ]);
    const [grandTotal, setGrandTotal] = useState(0);

    // Form fields
    const [projectId, setProjectId] = useState('');
    const [vendorId, setVendorId] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        // Mock fetch
        const stored = localStorage.getItem('mock_vendors');
        if (stored) {
            setVendors(JSON.parse(stored));
        } else {
            // Fallback if empty
            setVendors([]);
        }
    };

    const handleVendorChange = (e) => {
        const vId = e.target.value;
        setVendorId(vId);
        const vendor = vendors.find(v => v._id === vId);
        setSelectedVendor(vendor);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // Auto Calc
        if (selectedVendor && field === 'materialName') {
            const mat = selectedVendor.materials ? selectedVendor.materials.find(m => m.name === value) : null;
            if (mat) {
                newItems[index].unit = mat.unit;
                newItems[index].unitPrice = mat.pricePerUnit;
                newItems[index].gstPercent = mat.gst;
            }
        }

        // Logic
        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].unitPrice) || 0;
        const disc = parseFloat(newItems[index].discount) || 0;
        const gstP = parseFloat(newItems[index].gstPercent) || 0;

        const base = qty * price;
        const gstAmt = base * (gstP / 100);
        const total = base + gstAmt - disc;

        newItems[index].baseAmount = base;
        newItems[index].gstAmount = gstAmt;
        newItems[index].totalAmount = total;

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { materialName: '', unit: '', quantity: 0, unitPrice: 0, discount: 0, gstPercent: 18, baseAmount: 0, gstAmount: 0, totalAmount: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Calc Grand Total
    useEffect(() => {
        const total = items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
        setGrandTotal(total);
    }, [items]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Mock Submit
        const payload = {
            _id: 'PO-MOCK-' + Date.now(),
            poNumber: 'PO-' + Math.floor(Math.random() * 10000),
            createdAt: new Date().toISOString(),
            status: 'Pending',
            project: projectId,
            vendorId, // In real app, we might need vendor name here for display
            items,
            grandTotal
        };

        // Ensure mock_purchases exists
        const purchases = JSON.parse(localStorage.getItem('mock_purchases') || '[]');
        localStorage.setItem('mock_purchases', JSON.stringify([...purchases, payload]));

        alert('Purchase Order Created Successfully (Mock)');
        navigate('/vendors');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Create Purchase Order</h1>
                <button onClick={() => navigate('/vendors')} className="text-gray-500 hover:text-gray-700 text-sm sm:text-base self-start sm:self-auto">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow space-y-4 sm:space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-1">Select Vendor</label>
                        <select className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-sm" value={vendorId} onChange={handleVendorChange} required>
                            <option value="">-- Choose Vendor --</option>
                            {vendors.map(v => <option key={v._id} value={v._id}>{v.name} ({v.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-1">Project / Site Name</label>
                        <input className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-sm" value={projectId} onChange={e => setProjectId(e.target.value)} required placeholder="e.g. Skyline Towers" />
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Purchase Items</h3>
                    
                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-3">
                        {items.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Item #{idx + 1}</span>
                                    <button type="button" onClick={() => removeItem(idx)} className="text-red-500 text-xs">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Material</label>
                                        {selectedVendor ? (
                                            <select
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                                value={item.materialName}
                                                onChange={(e) => handleItemChange(idx, 'materialName', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Material</option>
                                                {selectedVendor.materials.map((m, i) => (
                                                    <option key={i} value={m.name}>{m.name}</option>
                                                ))}
                                            </select>
                                        ) : <span className="text-gray-400 italic text-xs">Select Vendor 1st</span>}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Unit</label>
                                            <div className="px-3 py-2 bg-white border rounded-lg text-sm text-gray-600">{item.unit || '-'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</label>
                                            <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} required />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Price</label>
                                            <div className="px-3 py-2 bg-white border rounded-lg text-sm text-gray-600">{item.unitPrice || 0}</div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">GST %</label>
                                            <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={item.gstPercent} onChange={(e) => handleItemChange(idx, 'gstPercent', e.target.value)} />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Base</p>
                                                <p className="text-xs font-semibold text-gray-700">₹{item.baseAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">GST Amt</p>
                                                <p className="text-xs font-semibold text-gray-700">₹{item.gstAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                                                <p className="text-sm font-bold text-gray-900">₹{item.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 w-1/4">Material</th>
                                    <th className="p-2">Unit</th>
                                    <th className="p-2 w-20">Qty</th>
                                    <th className="p-2">Price</th>
                                    <th className="p-2">GST %</th>
                                    <th className="p-2">Base</th>
                                    <th className="p-2">GST Amt</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="p-2">
                                            {selectedVendor ? (
                                                <select
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    value={item.materialName}
                                                    onChange={(e) => handleItemChange(idx, 'materialName', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Material</option>
                                                    {selectedVendor.materials.map((m, i) => (
                                                        <option key={i} value={m.name}>{m.name}</option>
                                                    ))}
                                                </select>
                                            ) : <span className="text-gray-400 italic">Select Vendor 1st</span>}
                                        </td>
                                        <td className="p-2 bg-gray-50">{item.unit}</td>
                                        <td className="p-2"><input type="number" className="w-full px-2 py-1.5 border rounded-lg text-sm" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} required /></td>
                                        <td className="p-2 bg-gray-50">{item.unitPrice}</td>
                                        <td className="p-2"><input type="number" className="w-full px-2 py-1.5 border rounded-lg text-sm" value={item.gstPercent} onChange={(e) => handleItemChange(idx, 'gstPercent', e.target.value)} /></td>
                                        <td className="p-2 text-gray-600">{item.baseAmount.toFixed(2)}</td>
                                        <td className="p-2 text-gray-600">{item.gstAmount.toFixed(2)}</td>
                                        <td className="p-2 font-bold">{item.totalAmount.toFixed(2)}</td>
                                        <td className="p-2 text-center text-red-500 cursor-pointer" onClick={() => removeItem(idx)}><i className="fas fa-trash"></i></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={addItem} className="mt-3 text-blue-600 text-xs sm:text-sm font-semibold hover:underline">+ Add Another Item</button>
                </div>

                {/* Footer Totals */}
                <div className="flex flex-col sm:flex-row sm:justify-end border-t pt-4">
                    <div className="w-full sm:w-64 space-y-2 sm:space-y-2">
                        <div className="flex justify-between text-base sm:text-lg font-bold">
                            <span>Grand Total:</span>
                            <span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-lg hover:bg-green-700 transition">
                            Generate Purchase Order
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePurchase;
