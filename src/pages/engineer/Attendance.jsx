import React, { useState, useEffect } from 'react';
import { getManpowerStore, formatAadhaar } from '../../utils/manpowerStore';
import { getAttendanceLogs, saveAttendanceSubmission, getEntriesForLog, isReadOnlyDate } from '../../utils/attendanceStore';

const Attendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [manpower, setManpower] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Site Engineer context (mock)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"id": "ENG-001", "name": "Mike Wilson", "role": "engineer"}');
    const readOnly = isReadOnlyDate(selectedDate, currentUser.role);

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = () => {
        const persons = getManpowerStore().filter(m => m.status === 'Approved');
        setManpower(persons);

        // Find if there's already a submission for this date + engineer
        const logs = getAttendanceLogs();
        const existingLog = logs.find(l => l.date === selectedDate && l.siteEngineerId === currentUser.id);

        const initialData = {};

        if (existingLog) {
            const entries = getEntriesForLog(existingLog.attendanceId);
            entries.forEach(e => {
                initialData[e.personId] = e;
            });
        }

        // Fill in missing people
        persons.forEach(p => {
            if (!initialData[p.id]) {
                initialData[p.id] = {
                    personId: p.id,
                    name: p.name,
                    role: p.role,
                    skillType: p.skillType || null,
                    aadhaarNumber: p.aadhaarNumber,
                    status: '', // Require manual selection
                    inTime: '',
                    outTime: '',
                    remarks: '',
                };
            }
        });

        setAttendanceData(initialData);
    };

    const handleStatusChange = (personId, status) => {
        if (readOnly) return;
        setAttendanceData(prev => ({
            ...prev,
            [personId]: {
                ...prev[personId],
                status,
                inTime: status !== 'Absent' ? (prev[personId].inTime || '09:00') : '',
                outTime: status !== 'Absent' ? (prev[personId].outTime || '18:00') : ''
            }
        }));
    };

    const handleInputChange = (personId, field, value) => {
        if (readOnly) return;
        setAttendanceData(prev => ({
            ...prev,
            [personId]: { ...prev[personId], [field]: value }
        }));
    };

    const handleSubmit = () => {
        const records = Object.values(attendanceData).filter(r => r.status !== '');
        if (records.length === 0) {
            alert('Please mark attendance for at least one person.');
            return;
        }

        const unmarkedCount = manpower.length - records.length;
        if (unmarkedCount > 0) {
            if (!window.confirm(`You have ${unmarkedCount} workers unmarked. Continue submission?`)) return;
        }

        setIsSaving(true);
        const attendanceId = `ATT-${Date.now()}`;

        const summary = {
            present: records.filter(r => r.status === 'Present').length,
            absent: records.filter(r => r.status === 'Absent').length,
            halfDay: records.filter(r => r.status === 'Half Day').length
        };

        const log = {
            attendanceId,
            date: selectedDate,
            projectId: 'PROJ-SKYL', // Mocked active project
            projectName: 'Skyline Residential Complex',
            siteEngineerId: currentUser.id,
            siteEngineerName: currentUser.name,
            summary,
            createdAt: new Date().toISOString()
        };

        const entries = records.map(r => ({ ...r, attendanceId }));

        saveAttendanceSubmission(log, entries);

        setTimeout(() => {
            setIsSaving(false);
            alert('Attendance submitted successfully to Admin.');
            loadData();
        }, 800);
    };

    const supervisors = manpower.filter(m => m.role === 'Supervisor');
    const labours = manpower.filter(m => m.role === 'Labour');

    const AttendanceTable = ({ workers, title, color }) => (
        <div className="bg-white border border-slate-200 rounded-sm mb-8 overflow-hidden">
            <div className={`bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2`}>
                <div className={`w-1 h-4 bg-${color}-600 rounded-full`}></div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest m-0">{title} ({workers.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white text-slate-400">
                            <th className="px-6 py-3 font-semibold text-[10px] uppercase border-b border-slate-100">Name</th>
                            <th className="px-6 py-3 font-semibold text-[10px] uppercase border-b border-slate-100">Aadhaar</th>
                            <th className="px-6 py-3 font-semibold text-[10px] uppercase border-b border-slate-100 text-center w-64">Status</th>
                            <th className="px-6 py-3 font-semibold text-[10px] uppercase border-b border-slate-100">In / Out</th>
                            <th className="px-6 py-3 font-semibold text-[10px] uppercase border-b border-slate-100">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {workers.map(p => {
                            const entry = attendanceData[p.id] || {};
                            return (
                                <tr key={p.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-3">
                                        <p className="font-semibold text-slate-800 leading-tight">{p.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{p.role === 'Labour' ? p.skillType : p.department}</p>
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-slate-300">
                                        {formatAadhaar(p.aadhaarNumber)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex justify-center gap-1">
                                            {['Present', 'Absent', 'Half Day'].map(st => (
                                                <button
                                                    key={st}
                                                    disabled={readOnly}
                                                    onClick={() => handleStatusChange(p.id, st)}
                                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-all rounded-sm border ${entry.status === st
                                                        ? (st === 'Present' ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : st === 'Absent' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-blue-300 border-blue-300 text-white')
                                                        : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'
                                                        }`}
                                                >
                                                    {st}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="time"
                                                disabled={readOnly || entry.status === 'Absent' || !entry.status}
                                                value={entry.inTime || ''}
                                                onChange={(e) => handleInputChange(p.id, 'inTime', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-semibold text-slate-600 outline-none w-20"
                                            />
                                            <span className="text-slate-200">-</span>
                                            <input
                                                type="time"
                                                disabled={readOnly || entry.status === 'Absent' || !entry.status}
                                                value={entry.outTime || ''}
                                                onChange={(e) => handleInputChange(p.id, 'outTime', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-semibold text-slate-600 outline-none w-20"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input
                                            type="text"
                                            disabled={readOnly || !entry.status}
                                            placeholder="Notes..."
                                            value={entry.remarks || ''}
                                            onChange={(e) => handleInputChange(p.id, 'remarks', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-blue-500"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-full font-sans bg-slate-50 min-h-screen animate-in fade-in">
            {/* Control Bar */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 m-0 leading-tight">Project Attendance Submission</h1>
                    <p className="text-slate-500 text-xs font-medium">Site: Skyline Residential Complex | Log for {currentUser.name}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-0.5 tracking-wider">Attendance Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2 rounded-sm font-bold text-sm outline-none cursor-pointer hover:border-blue-400 transition-colors"
                        />
                    </div>
                    {!readOnly ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <><i className="fas fa-spinner fa-spin mr-2"></i> SUBMITTING...</> : 'Submit Attendance'}
                        </button>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 text-blue-500 px-6 py-3 rounded-sm flex items-center gap-2">
                            <i className="fas fa-lock text-xs"></i>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Locked (Past Date)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Attendance Tables */}
            <AttendanceTable workers={supervisors} title="Site Supervisors" color="blue" />
            <AttendanceTable workers={labours} title="Skilled & Unskilled Labours" color="blue" />

            <div className="pb-20"></div>
        </div>
    );
};

export default Attendance;
