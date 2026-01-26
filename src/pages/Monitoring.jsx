import { useState, useEffect } from 'react';

const DailyLogs = () => {
    // Role Management
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
    const isEngineer = currentUser.role === 'engineer';

    const [logs, setLogs] = useState(() => {
        const savedLogs = localStorage.getItem('siteLogs');
        return savedLogs ? JSON.parse(savedLogs) : [
            {
                id: 1,
                date: '2023-10-24',
                location: 'Block A, Floor 2',
                project: 'Skyline Residential Complex',
                weather: 'Sunny',
                temp: '28°C',
                workers: 45,
                description: 'Completed pouring of columns C1-C10. Curing process started for yesterday\'s slab.',
                photos: ['https://placehold.co/100x100/e2e8f0/64748b?text=Column1', 'https://placehold.co/100x100/e2e8f0/64748b?text=Slab'],
                engineer: 'Mike Wilson',
                status: 'Verified'
            },
            {
                id: 2,
                date: '2023-10-23',
                location: 'Perimeter Wall',
                project: 'Skyline Residential Complex',
                weather: 'Cloudy',
                temp: '24°C',
                workers: 32,
                description: 'Excavation for boundary wall foundation completed. Soil testing samples collected.',
                photos: [],
                engineer: 'David Lee',
                status: 'Pending'
            },
            {
                id: 3,
                date: '2023-10-25',
                location: 'Main Entrance',
                project: 'City Center Mall',
                weather: 'Rainy',
                temp: '22°C',
                workers: 15,
                description: 'Site clearing interrupted due to heavy rain. Indoor safety briefing conducted.',
                photos: [],
                engineer: 'David Lee',
                status: 'Pending'
            }
        ];
    });

    const [showModal, setShowModal] = useState(false);

    // Filter Logs based on Role
    const displayedLogs = isEngineer
        ? logs.filter(log => log.engineer === currentUser.name)
        : logs;

    const handleSaveLog = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newLog = {
            id: Date.now(),
            date: formData.get('date'),
            location: formData.get('location'),
            project: formData.get('project'),
            weather: formData.get('weather'),
            temp: `${formData.get('temp')}°C`,
            workers: formData.get('manpower'),
            description: formData.get('description'),
            photos: [], // In a real app we'd handle file uploads
            engineer: currentUser.name || 'Unknown Engineer',
            status: 'Pending'
        };

        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        localStorage.setItem('siteLogs', JSON.stringify(updatedLogs));
        setShowModal(false);
        alert('Log Entry Saved Successfully!');
    };

    return (
        <>
            <div className="page-header flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEngineer ? 'My Daily Activity Logs' : 'Site Monitoring Logs'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEngineer ? 'Submit and track your daily site progress' : 'Overview of all daily site reports from engineers'}
                    </p>
                </div>
                {isEngineer && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                    >
                        <i className="fas fa-plus"></i> New Site Entry
                    </button>
                )}
            </div>

            {/* Logs List / Grid */}
            <div className="grid grid-cols-1 gap-6">
                {displayedLogs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <i className="fas fa-clipboard-list text-4xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">No logs found.</p>
                    </div>
                ) : (
                    displayedLogs.map((log) => (
                        <div key={log.id} className="card bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                            <div className="card-body p-6">
                                <div className="flex flex-col md:flex-row gap-6">

                                    {/* Date & Meta */}
                                    <div className="md:w-48 flex-shrink-0 border-r border-gray-100 pr-6">
                                        <div className="text-3xl font-bold text-gray-800 mb-1">{new Date(log.date).getDate()}</div>
                                        <div className="text-gray-500 uppercase tracking-wide text-xs font-semibold mb-4">
                                            {new Date(log.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2" title="Weather">
                                                <i className="fas fa-cloud-sun text-yellow-500 w-5"></i> {log.weather}, {log.temp}
                                            </div>
                                            <div className="flex items-center gap-2" title="Manpower">
                                                <i className="fas fa-users text-blue-500 w-5"></i> {log.workers} Workers
                                            </div>
                                            <div className="flex items-center gap-2" title="Engineer">
                                                <i className="fas fa-user-hard-hat text-gray-400 w-5"></i> {log.engineer}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{log.project}</h3>
                                                <div className="text-sm text-blue-600 font-medium mb-1"><i className="fas fa-map-marker-alt"></i> {log.location}</div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {log.status}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed mb-4">{log.description}</p>

                                        {/* Photos Grid */}
                                        {log.photos.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {log.photos.map((photo, idx) => (
                                                    <img key={idx} src={photo} className="h-20 w-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80" alt="Site proof" />
                                                ))}
                                                <div className="h-20 w-20 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg text-xs border border-gray-200">
                                                    + Gallery
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Site Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800">New Site Entry</h3>
                            <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSaveLog} className="space-y-5">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Log Date</label>
                                        <input type="date" name="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" required defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Project</label>
                                        <select name="project" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                                            <option value="">Select Project</option>
                                            <option value="Skyline Residential Complex">Skyline Residential Complex</option>
                                            <option value="City Center Mall">City Center Mall</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Specific Location</label>
                                    <input type="text" name="location" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Block A, Floor 2" required />
                                </div>

                                <div className="grid grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Weather</label>
                                        <select name="weather" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none bg-white">
                                            <option>Sunny</option>
                                            <option>Cloudy</option>
                                            <option>Rainy</option>
                                            <option>Windy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Temp (°C)</label>
                                        <input type="number" name="temp" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none" placeholder="28" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Manpower</label>
                                        <input type="number" name="manpower" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none" placeholder="0" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Work Description</label>
                                    <textarea name="description" rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe the work completed today..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Site Photos</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50/50">
                                        <i className="fas fa-cloud-upload-alt text-3xl text-blue-500 mb-3 block"></i>
                                        <span className="text-gray-700 font-medium">Click to upload photos</span>
                                        <p className="text-xs text-gray-500 mt-1">or drag and drop files here</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium text-sm text-gray-600">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md">Save Log Entry</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DailyLogs;
