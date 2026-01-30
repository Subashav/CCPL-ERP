import React, { useState } from 'react';

const Documents = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    const folders = [
        { id: 'f1', name: 'Project Blueprints', count: 12, icon: 'fas fa-drafting-compass', color: 'blue' },
        { id: 'f2', name: 'Legal Contracts', count: 8, icon: 'fas fa-file-contract', color: 'purple' },
        { id: 'f3', name: 'Invoices & Bills', count: 156, icon: 'fas fa-file-invoice-dollar', color: 'green' },
        { id: 'f4', name: 'Safety Guidelines', count: 5, icon: 'fas fa-hard-hat', color: 'orange' },
        { id: 'f5', name: 'Site Photos', count: 342, icon: 'fas fa-images', color: 'indigo' },
    ];

    const documents = [
        { id: 1, name: 'Skyline_Complex_L3_FloorPlan.pdf', folder: 'Project Blueprints', date: 'Jan 28, 2026', size: '4.2 MB', type: 'PDF', author: 'Planning Dept' },
        { id: 2, name: 'Vendor_Agreement_Cement.docx', folder: 'Legal Contracts', date: 'Jan 25, 2026', size: '1.5 MB', type: 'DOC', author: 'Legal Team' },
        { id: 3, name: 'Safety_Protocol_v4.pdf', folder: 'Safety Guidelines', date: 'Jan 20, 2026', size: '2.8 MB', type: 'PDF', author: 'HSE Officer' },
        { id: 4, name: 'Material_Invoice_#4921.xlsx', folder: 'Invoices & Bills', date: 'Jan 18, 2026', size: '45 KB', type: 'XLS', author: 'Accounts' },
        { id: 5, name: 'Site_Excavation_Jan15.jpg', folder: 'Site Photos', date: 'Jan 15, 2026', size: '3.1 MB', type: 'IMG', author: 'Amit Verma' },
        { id: 6, name: 'Main_Tower_Structure_Design.dwg', folder: 'Project Blueprints', date: 'Jan 10, 2026', size: '15.6 MB', type: 'CAD', author: 'Structural Eng' },
        { id: 7, name: 'Q1_Financial_Forecast.pptx', folder: 'Reports', date: 'Jan 05, 2026', size: '5.2 MB', type: 'PPT', author: 'Finance Head' },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'PDF': return { icon: 'fa-file-pdf', color: 'text-red-500', bg: 'bg-red-50' };
            case 'DOC': return { icon: 'fa-file-word', color: 'text-blue-500', bg: 'bg-blue-50' };
            case 'XLS': return { icon: 'fa-file-excel', color: 'text-green-500', bg: 'bg-green-50' };
            case 'PPT': return { icon: 'fa-file-powerpoint', color: 'text-orange-500', bg: 'bg-orange-50' };
            case 'IMG': return { icon: 'fa-file-image', color: 'text-purple-500', bg: 'bg-purple-50' };
            case 'CAD': return { icon: 'fa-layer-group', color: 'text-gray-600', bg: 'bg-gray-100' };
            default: return { icon: 'fa-file', color: 'text-gray-400', bg: 'bg-gray-50' };
        }
    };

    const filteredDocs = documents.filter(doc =>
        (activeTab === 'All' || doc.folder === activeTab) &&
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Document Repository</h1>
                    <p className="text-gray-500 mt-1">Centralized storage for all project documentation</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                        <i className="fas fa-cloud-upload-alt"></i> Upload Files
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                        <i className="fas fa-folder-plus"></i> New Folder
                    </button>
                </div>
            </div>

            {/* Quick Access Folders */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => setActiveTab(activeTab === folder.name ? 'All' : folder.name)}
                        className={`p-4 rounded-2xl border text-left transition-all group relative overflow-hidden ${activeTab === folder.name
                                ? `border-${folder.color}-200 bg-${folder.color}-50 ring-2 ring-${folder.color}-100`
                                : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${folder.color}-100 text-${folder.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                            <i className={folder.icon}></i>
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm truncate">{folder.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">{folder.count} files</p>

                        {/* Active Indicator */}
                        {activeTab === folder.name && (
                            <div className={`absolute top-0 right-0 p-2 text-${folder.color}-500`}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <h3 className="text-lg font-bold text-gray-800 px-2">{activeTab === 'All' ? 'Recent Files' : activeTab}</h3>
                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">{filteredDocs.length}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <i className="fas fa-list"></i>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <i className="fas fa-th-large"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    {viewMode === 'list' ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-xs text-gray-400 font-bold uppercase tracking-wider sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Date Modified</th>
                                    <th className="px-6 py-3 font-medium">Size</th>
                                    <th className="px-6 py-3 font-medium">Author</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDocs.map(doc => {
                                    const style = getTypeIcon(doc.type);
                                    return (
                                        <tr key={doc.id} className="hover:bg-blue-50/20 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${style.bg} ${style.color}`}>
                                                        <i className={`fas ${style.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{doc.name}</p>
                                                        <p className="text-xs text-gray-400">{doc.folder}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">{doc.date}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">{doc.size}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                        {doc.author.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{doc.author}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                                                        <i className="fas fa-download"></i>
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="More Options">
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                            {filteredDocs.map(doc => {
                                const style = getTypeIcon(doc.type);
                                return (
                                    <div key={doc.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all group cursor-pointer flex flex-col items-center text-center relative">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${style.bg} ${style.color} group-hover:scale-105 transition-transform`}>
                                            <i className={`fas ${style.icon}`}></i>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-blue-600">{doc.name}</h4>
                                        <p className="text-xs text-gray-400 mb-3">{doc.size} • {doc.date}</p>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredDocs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-3xl mb-4">
                                <i className="fas fa-search"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No documents found</h3>
                            <p className="text-gray-500">Try adjusting your search or folder selection</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Documents;
