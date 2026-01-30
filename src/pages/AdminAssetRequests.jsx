import React, { useState, useEffect } from 'react';
import { getRequestsStore, updateRequestStatus } from '../utils/assetStore';

const AdminAssetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setRequests(getRequestsStore());
    };

    const handleApprove = (reqId) => {
        if (window.confirm('Are you sure you want to approve this asset requirement? This will update the project inventory.')) {
            updateRequestStatus(reqId, 'Approved');
            loadData();
        }
    };

    const handleOpenRejection = (req) => {
        setSelectedReq(req);
        setIsRejectionModalOpen(true);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        const reason = new FormData(e.target).get('rejectionReason');
        updateRequestStatus(selectedReq.id, 'Rejected', reason);
        setIsRejectionModalOpen(false);
        loadData();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Asset Requirements</h1>
                    <p className="text-gray-500 mt-1">Manage resource allocation requests from site engineers</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Pending: {requests.filter(r => r.status === 'Pending').length}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Approved: {requests.filter(r => r.status === 'Approved').length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Source / Project</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Asset Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Req. Qty</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Justification</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5 align-top">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                {req.projectName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight">{req.requestedBy.split('(')[0].trim()}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-1">{req.requestedBy.split('(')[1]?.replace(')', '') || 'Site Engineer'}</p>
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <i className="fas fa-map-marker-alt text-[10px] text-gray-400"></i>
                                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight truncate max-w-[150px]" title={req.projectName}>{req.projectName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <div>
                                            <p className="font-bold text-gray-800 text-base">{req.assetName}</p>
                                            <p className="text-xs text-gray-400 font-mono mt-1">ID: {req.assetId}</p>
                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-gray-50 border border-gray-100">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 mr-2">In Stock:</span>
                                                <span className="text-xs font-bold text-gray-800">{req.currentInventory || 0} {req.unit}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top text-center">
                                        <div className="inline-flex flex-col items-center justify-center bg-blue-50 w-16 h-16 rounded-xl border border-blue-100 cursor-default group-hover:scale-105 transition-transform">
                                            <span className="text-2xl font-black text-blue-600 leading-none">+{req.requestedQty}</span>
                                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider mt-1">{req.unit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[80px]">
                                            <i className="fas fa-quote-left text-gray-300 text-xs mb-1 block"></i>
                                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                                {req.reason}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-middle text-center">
                                        {req.status === 'Pending' ? (
                                            <div className="flex flex-col gap-2 w-full max-w-[140px] mx-auto">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <i className="fas fa-check"></i> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleOpenRejection(req)}
                                                    className="w-full py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <i className="fas fa-times"></i> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        'bg-rose-50 text-rose-700 border-rose-100'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${req.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    {req.status}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium mt-2">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl">
                                                <i className="fas fa-inbox"></i>
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold">No requests found</p>
                                                <p className="text-gray-500 text-sm mt-1">Check back later for new asset requirements.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {isRejectionModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsRejectionModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="text-lg font-bold text-gray-900">Reject Request</h3>
                            <button onClick={() => setIsRejectionModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="p-6">
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 mb-6 flex gap-3 text-rose-800">
                                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                                <div className="text-sm">
                                    <p className="font-bold">Action Required</p>
                                    <p className="text-rose-600 opacity-90 mt-1 text-xs">Please provide a reason for rejecting this request. This will be sent to the site engineer.</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reason</label>
                                <textarea
                                    name="rejectionReason"
                                    required
                                    rows="4"
                                    placeholder="Enter rejection details..."
                                    className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsRejectionModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-rose-200 transition-all active:scale-95"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAssetRequests;
