import { useState, useEffect, useRef } from 'react';
import { 
    Camera, Upload, Image, Grid3X3, List, Search, Filter,
    Calendar, MapPin, Tag, Trash2, Download, Eye, X, Plus,
    CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight,
    ZoomIn, RotateCw, Share2, FolderOpen
} from 'lucide-react';

const SitePhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const fileInputRef = useRef(null);

    const categories = [
        { id: 'all', label: 'All Photos', color: 'slate' },
        { id: 'progress', label: 'Progress', color: 'blue' },
        { id: 'safety', label: 'Safety', color: 'red' },
        { id: 'quality', label: 'Quality Check', color: 'green' },
        { id: 'material', label: 'Materials', color: 'amber' },
        { id: 'equipment', label: 'Equipment', color: 'purple' },
        { id: 'issue', label: 'Issues', color: 'orange' }
    ];

    useEffect(() => {
        const storedPhotos = localStorage.getItem('site_photos');
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            const initialPhotos = [
                { 
                    id: 1, 
                    name: 'Foundation Work Progress', 
                    category: 'progress', 
                    project: 'Horizon Tower',
                    location: 'Block A - Ground Floor',
                    date: '2026-02-20',
                    time: '09:30 AM',
                    uploadedBy: 'John Engineer',
                    description: 'Foundation pouring completed for Block A',
                    tags: ['foundation', 'concrete', 'block-a'],
                    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'
                },
                { 
                    id: 2, 
                    name: 'Safety Equipment Check', 
                    category: 'safety', 
                    project: 'Horizon Tower',
                    location: 'Main Site',
                    date: '2026-02-20',
                    time: '08:15 AM',
                    uploadedBy: 'John Engineer',
                    description: 'Daily safety equipment inspection',
                    tags: ['safety', 'helmet', 'equipment'],
                    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
                },
                { 
                    id: 3, 
                    name: 'Steel Reinforcement', 
                    category: 'material', 
                    project: 'Green Valley',
                    location: 'Storage Yard',
                    date: '2026-02-19',
                    time: '02:45 PM',
                    uploadedBy: 'John Engineer',
                    description: 'Steel bars received and stacked',
                    tags: ['steel', 'rebar', 'material'],
                    thumbnail: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=400&h=300&fit=crop'
                },
                { 
                    id: 4, 
                    name: 'Column Concrete Quality', 
                    category: 'quality', 
                    project: 'Horizon Tower',
                    location: 'Block B - Floor 2',
                    date: '2026-02-19',
                    time: '11:00 AM',
                    uploadedBy: 'John Engineer',
                    description: 'Quality check passed for column concrete',
                    tags: ['quality', 'concrete', 'column'],
                    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
                },
                { 
                    id: 5, 
                    name: 'Excavator Operation', 
                    category: 'equipment', 
                    project: 'Metro Complex',
                    location: 'Excavation Site',
                    date: '2026-02-18',
                    time: '10:30 AM',
                    uploadedBy: 'John Engineer',
                    description: 'Excavator working on basement level',
                    tags: ['excavator', 'equipment', 'basement'],
                    thumbnail: 'https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=400&h=300&fit=crop'
                },
                { 
                    id: 6, 
                    name: 'Water Leakage Issue', 
                    category: 'issue', 
                    project: 'Green Valley',
                    location: 'Basement - Section C',
                    date: '2026-02-18',
                    time: '04:15 PM',
                    uploadedBy: 'John Engineer',
                    description: 'Water seepage found in basement wall',
                    tags: ['issue', 'water', 'leakage'],
                    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
                },
            ];
            setPhotos(initialPhotos);
            localStorage.setItem('site_photos', JSON.stringify(initialPhotos));
        }
    }, []);

    const savePhotos = (updatedPhotos) => {
        setPhotos(updatedPhotos);
        localStorage.setItem('site_photos', JSON.stringify(updatedPhotos));
    };

    const filteredPhotos = photos.filter(photo => {
        const matchesSearch = photo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        total: photos.length,
        today: photos.filter(p => p.date === new Date().toISOString().split('T')[0]).length,
        issues: photos.filter(p => p.category === 'issue').length,
        progress: photos.filter(p => p.category === 'progress').length
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const file = fileInputRef.current?.files[0];
        
        const newPhoto = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            project: formData.get('project'),
            location: formData.get('location'),
            description: formData.get('description'),
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(Boolean),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            uploadedBy: 'Site Engineer',
            thumbnail: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'
        };

        savePhotos([newPhoto, ...photos]);
        setShowUploadModal(false);
        e.target.reset();
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this photo?')) {
            savePhotos(photos.filter(p => p.id !== id));
            if (showViewModal) setShowViewModal(false);
        }
    };

    const openPhotoView = (photo, index) => {
        setSelectedPhoto(photo);
        setCurrentPhotoIndex(index);
        setShowViewModal(true);
    };

    const navigatePhoto = (direction) => {
        const newIndex = direction === 'next' 
            ? (currentPhotoIndex + 1) % filteredPhotos.length
            : (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        setCurrentPhotoIndex(newIndex);
        setSelectedPhoto(filteredPhotos[newIndex]);
    };

    // Keyboard navigation for photo viewer
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showViewModal || filteredPhotos.length === 0) return;
            if (e.key === 'ArrowLeft') {
                const newIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
                setCurrentPhotoIndex(newIndex);
                setSelectedPhoto(filteredPhotos[newIndex]);
            } else if (e.key === 'ArrowRight') {
                const newIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
                setCurrentPhotoIndex(newIndex);
                setSelectedPhoto(filteredPhotos[newIndex]);
            } else if (e.key === 'Escape') {
                setShowViewModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showViewModal, currentPhotoIndex, filteredPhotos]);

    const getCategoryColor = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId);
        const colorMap = {
            slate: 'bg-slate-100 text-slate-700',
            blue: 'bg-blue-100 text-blue-700',
            red: 'bg-red-100 text-red-700',
            green: 'bg-green-100 text-green-700',
            amber: 'bg-amber-100 text-amber-700',
            purple: 'bg-purple-100 text-purple-700',
            orange: 'bg-orange-100 text-orange-700'
        };
        return colorMap[cat?.color] || colorMap.slate;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Site Photos</h1>
                    <p className="text-gray-500 mt-1 text-sm">Capture and manage site documentation</p>
                </div>
                <button 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium text-sm"
                >
                    <Upload size={18} />
                    <span>Upload Photo</span>
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Image size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-xs text-slate-500">Total Photos</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Calendar size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.today}</p>
                            <p className="text-xs text-slate-500">Today</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.progress}</p>
                            <p className="text-xs text-slate-500">Progress</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.issues}</p>
                            <p className="text-xs text-slate-500">Issues</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search photos, tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === cat.id
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Grid3X3 size={18} className={viewMode === 'grid' ? 'text-blue-600' : 'text-slate-500'} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <List size={18} className={viewMode === 'list' ? 'text-blue-600' : 'text-slate-500'} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Photo Grid/List */}
            {filteredPhotos.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredPhotos.map((photo, index) => (
                            <div 
                                key={photo.id} 
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => openPhotoView(photo, index)}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={photo.thumbnail} 
                                        alt={photo.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getCategoryColor(photo.category)}`}>
                                            {categories.find(c => c.id === photo.category)?.label}
                                        </span>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                                                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm text-slate-900 truncate">{photo.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                        <MapPin size={12} />
                                        <span className="truncate">{photo.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                        <Calendar size={12} />
                                        <span>{photo.date} • {photo.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Photo</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase hidden sm:table-cell">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase hidden md:table-cell">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase hidden lg:table-cell">Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPhotos.map((photo, index) => (
                                    <tr key={photo.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => openPhotoView(photo, index)}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={photo.thumbnail} alt={photo.name} className="w-12 h-12 rounded-lg object-cover" />
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900">{photo.name}</p>
                                                    <p className="text-xs text-slate-500">{photo.project}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getCategoryColor(photo.category)}`}>
                                                {categories.find(c => c.id === photo.category)?.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-sm text-slate-600">{photo.location}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-sm text-slate-600">{photo.date}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); openPhotoView(photo, index); }}
                                                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
                                                >
                                                    <Eye size={16} className="text-slate-600" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                                                    className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                                                >
                                                    <Trash2 size={16} className="text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Camera size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Photos Found</h3>
                    <p className="text-slate-500 text-sm mb-4">Upload your first site photo to get started</p>
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                    >
                        <Plus size={16} />
                        Upload Photo
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">Upload Site Photo</h2>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-4 space-y-4">
                            {/* File Upload Area */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                            >
                                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                                <Camera size={40} className="text-slate-400 mx-auto mb-3" />
                                <p className="font-medium text-slate-700">Click to upload or drag & drop</p>
                                <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Photo Title *</label>
                                <input 
                                    name="name" 
                                    required 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                    placeholder="e.g., Foundation Work Progress"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                                    <select name="category" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm">
                                        <option value="">Select...</option>
                                        <option value="progress">Progress</option>
                                        <option value="safety">Safety</option>
                                        <option value="quality">Quality Check</option>
                                        <option value="material">Materials</option>
                                        <option value="equipment">Equipment</option>
                                        <option value="issue">Issues</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Project *</label>
                                    <select name="project" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm">
                                        <option value="">Select...</option>
                                        <option value="Horizon Tower">Horizon Tower</option>
                                        <option value="Green Valley">Green Valley</option>
                                        <option value="Metro Complex">Metro Complex</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                                <input 
                                    name="location" 
                                    required 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                    placeholder="e.g., Block A - Floor 2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea 
                                    name="description" 
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                                    placeholder="Add details about the photo..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                                <input 
                                    name="tags" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                    placeholder="foundation, concrete, block-a (comma separated)"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all text-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all text-sm">
                                    Upload Photo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Photo View Modal */}
            {showViewModal && selectedPhoto && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                    {/* Close Button */}
                    <button 
                        onClick={() => setShowViewModal(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
                    >
                        <X size={24} className="text-white" />
                    </button>

                    {/* Navigation Arrows - Higher z-index and better positioning */}
                    {filteredPhotos.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
                                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all z-20 backdrop-blur-sm"
                            >
                                <ChevronLeft size={24} className="text-white" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all z-20 backdrop-blur-sm lg:right-[360px]"
                            >
                                <ChevronRight size={24} className="text-white" />
                            </button>
                        </>
                    )}

                    <div className="max-w-5xl w-full mx-12 sm:mx-16 lg:mx-4 flex flex-col lg:flex-row gap-4">
                        {/* Image */}
                        <div className="flex-1 flex items-center justify-center">
                            <img 
                                src={selectedPhoto.thumbnail} 
                                alt={selectedPhoto.name}
                                className="max-h-[70vh] w-auto rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Details Panel */}
                        <div className="lg:w-80 bg-white rounded-xl p-4 max-h-[70vh] overflow-y-auto">
                            <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${getCategoryColor(selectedPhoto.category)} mb-3`}>
                                {categories.find(c => c.id === selectedPhoto.category)?.label}
                            </span>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">{selectedPhoto.name}</h2>
                            <p className="text-sm text-slate-600 mb-4">{selectedPhoto.description}</p>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <FolderOpen size={16} className="text-slate-400" />
                                    <span>{selectedPhoto.project}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span>{selectedPhoto.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>{selectedPhoto.date} at {selectedPhoto.time}</span>
                                </div>
                            </div>

                            {selectedPhoto.tags.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-slate-500 mb-2">TAGS</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPhoto.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all text-sm font-medium">
                                    <Download size={16} />
                                    Download
                                </button>
                                <button 
                                    onClick={() => handleDelete(selectedPhoto.id)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SitePhotos;
