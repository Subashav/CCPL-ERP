import React, { useState } from 'react';

const DailyStatusModal = ({ assets, onSubmit, onCancel }) => {
    // Initialize status for all assets to 'Retain' by default
    const [updates, setUpdates] = useState(
        assets.reduce((acc, asset) => ({
            ...acc,
            [asset.id]: { status: 'Retain', note: '' }
        }), {})
    );

    const handleStatusChange = (assetId, newStatus) => {
        setUpdates(prev => ({
            ...prev,
            [assetId]: { ...prev[assetId], status: newStatus }
        }));
    };

    const handleNoteChange = (assetId, note) => {
        setUpdates(prev => ({
            ...prev,
            [assetId]: { ...prev[assetId], note: note }
        }));
    };

    const handleSubmit = () => {
        onSubmit(updates);
    };

    const StatusButton = ({ assetId, type, icon, label, currentStatus }) => (
        <button
            onClick={() => handleStatusChange(assetId, type)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${currentStatus === type
                    ? type === 'Retain' ? 'bg-green-600 text-white border-green-600'
                        : type === 'Return' ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
        >
            <i className={`fas ${icon}`}></i>
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">End of Day Status Update</h3>
                        <p className="text-sm text-gray-500 mt-1">Review and update status for assets on your site</p>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {assets.map(asset => (
                        <div key={asset.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
                                        <i className="fas fa-truck-pickup"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{asset.name}</h4>
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-0.5">
                                            {asset.code}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase">Current Status</span>
                                    <div className="text-xs font-bold text-emerald-600">Active On Site</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <StatusButton
                                        assetId={asset.id}
                                        type="Retain"
                                        icon="fa-check"
                                        label="Retain (Keep)"
                                        currentStatus={updates[asset.id]?.status}
                                    />
                                    <StatusButton
                                        assetId={asset.id}
                                        type="Return"
                                        icon="fa-undo"
                                        label="Return to Yard"
                                        currentStatus={updates[asset.id]?.status}
                                    />
                                    <StatusButton
                                        assetId={asset.id}
                                        type="Issue"
                                        icon="fa-exclamation-triangle"
                                        label="Report Issue"
                                        currentStatus={updates[asset.id]?.status}
                                    />
                                </div>

                                {updates[asset.id]?.status === 'Issue' && (
                                    <textarea
                                        placeholder="Describe the issue..."
                                        className="w-full text-sm p-3 border border-red-200 rounded-lg bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-red-300 text-red-700"
                                        rows="2"
                                        onChange={(e) => handleNoteChange(asset.id, e.target.value)}
                                        value={updates[asset.id]?.note}
                                    ></textarea>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-white hover:border-gray-400 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 shadow-lg transition-all flex items-center"
                    >
                        <i className="fas fa-save mr-2"></i> Submit Status Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyStatusModal;
