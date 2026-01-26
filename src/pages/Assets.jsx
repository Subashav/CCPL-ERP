import { useState } from 'react';
import AssetFilters from '../components/assets/AssetFilters';
import AssetForm from '../components/assets/AssetForm';
import AssetAssignmentModal from '../components/assets/AssetAssignmentModal';
import MaintenanceLogModal from '../components/assets/MaintenanceLogModal';
import AssetHistoryModal from '../components/assets/AssetHistoryModal';

const Assets = () => {
    // Dummy Data
    const [assets, setAssets] = useState([
        { id: 1, name: 'Excavator EX-200', code: 'EQ-2023-001', category: 'Heavy Machinery', status: 'Active', fuelLevel: 75, brand: 'Hitachi', site: 'Metro Station Project', purchaseDate: '2022-05-10', value: '₹45,00,000' },
        { id: 2, name: 'Dump Truck DT-40', code: 'VH-2023-012', category: 'Vehicles', status: 'In Use', fuelLevel: 45, brand: 'Tata', custodian: 'John Driver', purchaseDate: '2022-08-15', value: '₹28,00,000' },
        { id: 3, name: 'Concrete Mixer', code: 'EQ-2023-005', category: 'Heavy Machinery', status: 'Under Maintenance', fuelLevel: 0, brand: 'Winget', site: 'Yard', purchaseDate: '2021-11-20', value: '₹5,50,000' },
        { id: 4, name: 'Drill Machine Pro', code: 'PT-2023-089', category: 'Power Tools', status: 'Active', brand: 'Bosch', site: 'Warehouse', purchaseDate: '2023-01-10', value: '₹12,000' },
        { id: 5, name: 'Safety Helmets (Batch A)', code: 'PPE-2023-100', category: 'PPE', status: 'In Use', brand: 'Karam', site: 'Highway Project', purchaseDate: '2023-03-01', value: '₹15,000' },
        { id: 6, name: 'JCB 3DX', code: 'EQ-2023-002', category: 'Heavy Machinery', status: 'Active', fuelLevel: 90, brand: 'JCB', site: 'Yard', purchaseDate: '2020-04-12', value: '₹32,00,000' },
    ]);

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const matchesCategory = activeFilter === 'All' || asset.category === activeFilter;
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Stats Calculation
    const stats = {
        total: assets.length,
        inUse: assets.filter(a => a.status === 'In Use').length,
        active: assets.filter(a => a.status === 'Active').length,
        maintenance: assets.filter(a => a.status === 'Under Maintenance').length
    };

    const StatCard = ({ label, value, icon, color }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-lg`}>
                <i className={`fas ${icon}`}></i>
            </div>
        </div>
    );

    // Handlers
    const handleRegisterAsset = (newAsset) => {
        setAssets([...assets, { ...newAsset, id: assets.length + 1, fuelLevel: 100, site: 'Yard' }]);
        setShowRegisterModal(false);
    };

    const handleAssignAsset = (assetId, assignmentDetails) => {
        setAssets(assets.map(a =>
            a.id === assetId
                ? { ...a, status: 'In Use', site: assignmentDetails.targetLocation, custodian: assignmentDetails.assignToType === 'User' ? assignmentDetails.targetLocation : null }
                : a
        ));
        setShowAssignmentModal(false);
        setSelectedAsset(null);
    };

    const handleLogMaintenance = (assetId, maintenanceDetails) => {
        setAssets(assets.map(a =>
            a.id === assetId ? { ...a, status: 'Under Maintenance' } : a
        ));
        setShowMaintenanceModal(false);
        setSelectedAsset(null);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50/50 p-2">

            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assets Management</h1>
                    <p className="text-gray-500 mt-1">Monitor fleet health, assignments, and utilization</p>
                </div>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-lg flex items-center shadow-lg shadow-gray-900/10 transition-all font-medium"
                >
                    <i className="fas fa-plus mr-2"></i> Register New Asset
                </button>
            </div>

            {/* Dashboard Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Assets" value={stats.total} icon="fa-cubes" color="bg-blue-50 text-blue-600" />
                <StatCard label="In Operation" value={stats.inUse} icon="fa-truck-moving" color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Available" value={stats.active} icon="fa-check-circle" color="bg-indigo-50 text-indigo-600" />
                <StatCard label="In Maintenance" value={stats.maintenance} icon="fa-wrench" color="bg-amber-50 text-amber-600" />
            </div>

            <AssetFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onSearch={setSearchQuery}
            />

            {filteredAssets.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="p-4 border-b">Asset Details</th>
                                    <th className="p-4 border-b">Category</th>
                                    <th className="p-4 border-b">Status</th>
                                    <th className="p-4 border-b">Current Location</th>
                                    <th className="p-4 border-b">Brand / Make</th>
                                    <th className="p-4 border-b text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredAssets.map(asset => (
                                    <tr
                                        key={asset.id}
                                        onClick={() => { setSelectedAsset(asset); setShowDetailModal(true); }}
                                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                        <td className="p-4">
                                            <div>
                                                <div className="font-bold text-gray-900">{asset.name}</div>
                                                <div className="text-xs text-gray-500 font-mono">{asset.code}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {asset.category}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${asset.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                asset.status === 'In Use' ? 'bg-blue-100 text-blue-700' :
                                                    asset.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-map-marker-alt text-gray-400"></i>
                                                {asset.site || 'N/A'}
                                            </div>
                                            {asset.custodian && <div className="text-xs text-gray-400 mt-1">Cust: {asset.custodian}</div>}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {asset.brand}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => { setSelectedAsset(asset); setShowAssignmentModal(true); }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip"
                                                    title="Assign Asset"
                                                >
                                                    <i className="fas fa-user-plus"></i>
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedAsset(asset); setShowMaintenanceModal(true); }}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg tooltip"
                                                    title="Log Maintenance"
                                                >
                                                    <i className="fas fa-wrench"></i>
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedAsset(asset); setShowHistoryModal(true); }}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg tooltip"
                                                    title="View History"
                                                >
                                                    <i className="fas fa-history"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-gray-300 text-6xl mb-4"><i className="fas fa-search"></i></div>
                    <h3 className="text-lg font-medium text-gray-500">No assets found</h3>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query</p>
                </div>
            )}

            {/* Modals */}
            {showRegisterModal && (
                <AssetForm
                    onSubmit={handleRegisterAsset}
                    onCancel={() => setShowRegisterModal(false)}
                />
            )}

            {showAssignmentModal && selectedAsset && (
                <AssetAssignmentModal
                    asset={selectedAsset}
                    onAssign={handleAssignAsset}
                    onCancel={() => {
                        setShowAssignmentModal(false);
                        setSelectedAsset(null);
                    }}
                />
            )}

            {showMaintenanceModal && selectedAsset && (
                <MaintenanceLogModal
                    asset={selectedAsset}
                    onSave={handleLogMaintenance}
                    onCancel={() => {
                        setShowMaintenanceModal(false);
                        setSelectedAsset(null);
                    }}
                />
            )}

            {showHistoryModal && selectedAsset && (
                <AssetHistoryModal
                    asset={selectedAsset}
                    onClose={() => {
                        setShowHistoryModal(false);
                        setSelectedAsset(null);
                    }}
                />
            )}

            {showDetailModal && selectedAsset && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{selectedAsset.name}</h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">{selectedAsset.code}</p>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                <i className="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h4>
                                        <p className="text-lg font-medium text-gray-800">{selectedAsset.category}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Brand / Make</h4>
                                        <p className="text-lg font-medium text-gray-800">{selectedAsset.brand}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Status</h4>
                                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${selectedAsset.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            selectedAsset.status === 'In Use' ? 'bg-blue-100 text-blue-700' :
                                                selectedAsset.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {selectedAsset.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Location</h4>
                                        <div className="flex items-center gap-3 text-lg font-medium text-gray-800">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                            {selectedAsset.site || 'N/A'}
                                        </div>
                                    </div>
                                    {selectedAsset.custodian && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assigned Custodian</h4>
                                            <div className="flex items-center gap-3 text-lg font-medium text-gray-800">
                                                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                                    <i className="fas fa-user"></i>
                                                </div>
                                                {selectedAsset.custodian}
                                            </div>
                                        </div>
                                    )}
                                    {selectedAsset.fuelLevel !== undefined && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fuel Level</h4>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${selectedAsset.fuelLevel}%` }}></div>
                                            </div>
                                            <p className="text-sm text-gray-600">{selectedAsset.fuelLevel}%</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Purchase Date</h4>
                                    <p className="font-medium text-gray-800">{selectedAsset.purchaseDate || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Asset Value</h4>
                                    <p className="font-medium text-gray-800">{selectedAsset.value || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Maintenance</h4>
                                    <p className="font-medium text-gray-800">20 Oct 2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end gap-3">
                            <button onClick={() => { setShowDetailModal(false); setShowHistoryModal(true); }} className="px-5 py-2.5 bg-white border border-gray-300 shadow-sm rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                                <i className="fas fa-history mr-2"></i> View History
                            </button>
                            <button onClick={() => { setShowDetailModal(false); setShowMaintenanceModal(true); }} className="px-5 py-2.5 bg-amber-500 text-white shadow-sm rounded-lg font-medium hover:bg-amber-600">
                                <i className="fas fa-wrench mr-2"></i> Log Maintenance
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assets;
