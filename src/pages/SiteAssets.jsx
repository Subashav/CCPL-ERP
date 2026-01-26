import { useState } from 'react';
import DailyStatusModal from '../components/assets/DailyStatusModal';

const SiteAssets = () => {
    // Dummy Data - Only showing assets for "Metro Station Project"
    const [myAssets] = useState([
        { id: 1, name: 'Excavator EX-200', code: 'EQ-2023-001', category: 'Heavy Machinery', status: 'In Use', fuelLevel: 75, brand: 'Hitachi' },
        { id: 4, name: 'Drill Machine Pro', code: 'PT-2023-089', category: 'Power Tools', status: 'In Use', brand: 'Bosch' },
        { id: 5, name: 'Safety Helmets (Batch A)', code: 'PPE-2023-100', category: 'PPE', status: 'In Use', brand: 'Karam' },
    ]);

    const [showStatusModal, setShowStatusModal] = useState(false);

    // Stats
    const stats = {
        total: myAssets.length,
        issues: 0, // Mock
        returning: 0 // Mock
    };

    const handleStatusSubmit = (updates) => {
        // Process updates (Mock)
        console.log("Updates received:", updates);

        // In a real app, this would send data to backend.
        // For now, we'll just simulate removing "Returned" items from the view or showing a success message.

        const returnedCount = Object.values(updates).filter(u => u.status === 'Return').length;
        const issueCount = Object.values(updates).filter(u => u.status === 'Issue').length;

        alert(`Report Submitted!\n${returnedCount} assets marked for return.\n${issueCount} issues reported.`);
        setShowStatusModal(false);
    };

    const AssetRow = ({ asset }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i className="fas fa-truck-pickup"></i>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">{asset.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide">{asset.code}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{asset.category}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        Active On Site
                    </span>
                </div>
                {asset.fuelLevel && (
                    <div className="text-right w-24 hidden md:block">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fuel Level</div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${asset.fuelLevel}%` }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-gray-50/50 p-4 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">Metro Station Project</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Site Assets</h1>
                    <p className="text-gray-500 mt-1">Manage inventory assigned to your location</p>
                </div>
                <button
                    onClick={() => setShowStatusModal(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center shadow-xl shadow-gray-900/10 transition-all font-semibold text-sm transform hover:-translate-y-0.5"
                >
                    <i className="fas fa-clipboard-check mr-2 text-lg"></i> End of Day Update
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total On Site</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <i className="fas fa-cubes"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Verified Today</p>
                        <h3 className="text-3xl font-bold text-emerald-600 mt-1">0</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                        <i className="fas fa-check-circle"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pending Return</p>
                        <h3 className="text-3xl font-bold text-orange-600 mt-1">0</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                        <i className="fas fa-clock"></i>
                    </div>
                </div>
            </div>

            {/* Asset List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Current Inventory</h3>
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{myAssets.length}</span> assets
                    </div>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                    {myAssets.map(asset => (
                        <AssetRow key={asset.id} asset={asset} />
                    ))}
                </div>
            </div>

            {/* End of Day Modal */}
            {showStatusModal && (
                <DailyStatusModal
                    assets={myAssets}
                    onSubmit={handleStatusSubmit}
                    onCancel={() => setShowStatusModal(false)}
                />
            )}
        </div>
    );
};

export default SiteAssets;
