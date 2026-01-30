/**
 * CCPL Attendance Store
 * Handles persistence for attendance logs (headers) and entries (details)
 */

const INITIAL_LOGS = [
    {
        attendanceId: 'ATT-20260129-SKYL',
        date: new Date().toISOString().split('T')[0],
        projectId: 'PROJ-SKYL',
        projectName: 'Skyline Residential Complex',
        siteEngineerId: 'ENG001',
        siteEngineerName: 'Amit Verma',
        summary: { present: 24, absent: 2, halfDay: 1 },
        createdAt: new Date().toISOString()
    },
    {
        attendanceId: 'ATT-20260128-HWY',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        projectId: 'PROJ-HWY',
        projectName: 'Highway Extension - Phase 2',
        siteEngineerId: 'ENG002',
        siteEngineerName: 'Vikram Singh',
        summary: { present: 18, absent: 0, halfDay: 0 },
        createdAt: new Date(Date.now() - 86400000).toISOString()
    }
];

const INITIAL_ENTRIES = []; // We can add detail entries if needed, but summary is enough for the list view for now.

// Get all attendance logs (summaries of submissions)
export const getAttendanceLogs = () => {
    const data = localStorage.getItem('ccpl_attendance_logs');
    if (!data) {
        localStorage.setItem('ccpl_attendance_logs', JSON.stringify(INITIAL_LOGS));
        return INITIAL_LOGS;
    }
    return JSON.parse(data);
};

// Get all attendance entries (detailed records for people)
export const getAttendanceEntries = () => {
    const data = localStorage.getItem('ccpl_attendance_entries');
    return data ? JSON.parse(data) : [];
};

// Save a new submission
export const saveAttendanceSubmission = (log, entries) => {
    const logs = getAttendanceLogs();
    const allEntries = getAttendanceEntries();

    // Check if a submission already exists for this project + date + engineer
    // To allow overwriting/updating same day submission
    const existingLogIndex = logs.findIndex(l =>
        l.date === log.date &&
        l.projectId === log.projectId &&
        l.siteEngineerId === log.siteEngineerId
    );

    if (existingLogIndex >= 0) {
        // Remove old entries for this specific attendanceId
        const oldAttendanceId = logs[existingLogIndex].attendanceId;
        const filteredEntries = allEntries.filter(e => e.attendanceId !== oldAttendanceId);

        // Update log
        logs[existingLogIndex] = log;

        // Update entries
        localStorage.setItem('ccpl_attendance_entries', JSON.stringify([...filteredEntries, ...entries]));
        localStorage.setItem('ccpl_attendance_logs', JSON.stringify(logs));
    } else {
        // New submission
        localStorage.setItem('ccpl_attendance_logs', JSON.stringify([log, ...logs]));
        localStorage.setItem('ccpl_attendance_entries', JSON.stringify([...entries, ...allEntries]));
    }
};

// Get entries for a specific log
export const getEntriesForLog = (attendanceId) => {
    const allEntries = getAttendanceEntries();
    return allEntries.filter(e => e.attendanceId === attendanceId);
};

// Delete a submission
export const deleteAttendanceLog = (attendanceId) => {
    const logs = getAttendanceLogs();
    const entries = getAttendanceEntries();

    const filteredLogs = logs.filter(l => l.attendanceId !== attendanceId);
    const filteredEntries = entries.filter(e => e.attendanceId !== attendanceId);

    localStorage.setItem('ccpl_attendance_logs', JSON.stringify(filteredLogs));
    localStorage.setItem('ccpl_attendance_entries', JSON.stringify(filteredEntries));
};

// Check if a date is read-only for a user
export const isReadOnlyDate = (dateString, userRole) => {
    if (userRole === 'superadmin' || userRole === 'admin') return false;

    const today = new Date().toISOString().split('T')[0];
    return dateString !== today;
};
