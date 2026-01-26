import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPendingRequestsCount } from '../utils/assetStore';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('superadmin');
    const [pendingAssetRequests, setPendingAssetRequests] = useState(0);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setRole(JSON.parse(storedUser).role);
        }

        const updateCounts = () => {
            setPendingAssetRequests(getPendingRequestsCount());
        };

        updateCounts();
        const interval = setInterval(updateCounts, 5000);
        return () => clearInterval(interval);
    }, []);

    const adminItems = [
        { header: 'CORE MODULES' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Projects', path: '/projects', icon: 'fas fa-project-diagram' },
        { name: 'Task Management', path: '/tasks', icon: 'fas fa-tasks' },
        { name: 'Daily Site Logs', path: '/monitoring', icon: 'fas fa-clipboard-list' },

        { header: 'RESOURCES' },
        {
            name: 'Assets',
            path: '/assets',
            icon: 'fas fa-tools',
            roles: ['superadmin', 'admin']
        },
        {
            name: 'Asset Requests',
            path: '/admin/asset-requests',
            icon: 'fas fa-bell-concierge',
            roles: ['superadmin', 'admin'],
            showBadge: true
        },

        { name: 'Materials & Stock', path: '/inventory', icon: 'fas fa-boxes' },
        { name: 'Labour Management', path: '/labour', icon: 'fas fa-users' },
        { name: 'Manpower Management', path: '/admin/manpower-summary', icon: 'fas fa-users-cog', roles: ['superadmin', 'admin'] },
        { name: 'Attendance Records', path: '/admin/attendance-records', icon: 'fas fa-clipboard-check', roles: ['superadmin', 'admin'] },

        { header: 'OPERATIONS', roles: ['superadmin', 'admin'] },
        { name: 'Procurement', path: '/procurement', icon: 'fas fa-shopping-cart', roles: ['superadmin', 'admin'] },
        { name: 'Vendors', path: '/vendors', icon: 'fas fa-handshake', roles: ['superadmin', 'admin'] },

        { header: 'SUPPORT' },
        { name: 'Issue Tickets', path: '/tickets', icon: 'fas fa-ticket-alt' },
        { name: 'Reports', path: '/reports', icon: 'fas fa-chart-bar', roles: ['superadmin', 'admin'] },
        { name: 'Documents', path: '/documents', icon: 'fas fa-folder' },

        { header: 'ADMINISTRATION', roles: ['superadmin'] },
        { name: 'User Management', path: '/users', icon: 'fas fa-users-cog', roles: ['superadmin'] },
        { name: 'Notifications', path: '/notifications', icon: 'fas fa-bell', roles: ['superadmin'] },
        { name: 'Settings', path: '/settings', icon: 'fas fa-cog', roles: ['superadmin'] },
    ];

    const siteManagerItems = [
        { header: 'SITE EXECUTION' },
        { name: 'My Dashboard', path: '/engineer/dashboard', icon: 'fas fa-home' },
        { name: 'My Projects', path: '/engineer/projects', icon: 'fas fa-hard-hat' },
        { name: 'My Tasks', path: '/engineer/tasks', icon: 'fas fa-clipboard-list' },
        { name: 'Total Assets Provided', path: '/engineer/assets-provided', icon: 'fas fa-truck-loading' },
        { name: 'Manpower Onboarding', path: '/engineer/manpower', icon: 'fas fa-user-plus' },

        { header: 'DAILY UPDATES' },
        { name: 'Daily Task Update', path: '/engineer/updates', icon: 'fas fa-edit' },
        { name: 'Daily Attendance', path: '/engineer/attendance-log', icon: 'fas fa-clipboard-check' },
        { name: 'Upload Photos', path: '/engineer/photos', icon: 'fas fa-camera' },
        { name: 'Asset Daily Log', path: '/engineer/assets', icon: 'fas fa-truck-pickup' },

        { header: 'REQUESTS & ISSUES' },
        { name: 'Stock Request', path: '/engineer/stock', icon: 'fas fa-box-open' },
        { name: 'Tickets / Issues', path: '/engineer/tickets', icon: 'fas fa-exclamation-circle' },
        { name: 'Documents', path: '/engineer/documents', icon: 'fas fa-file-alt' },
        { name: 'Notifications', path: '/engineer/notifications', icon: 'fas fa-bell' },
    ];

    let activeMenuItems = role === 'engineer' ? siteManagerItems : adminItems.filter(item => !item.roles || item.roles.includes(role));

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <i className="fas fa-hard-hat text-2xl"></i>
                    <span className="font-bold text-xl tracking-tight">CCPL ERP</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {activeMenuItems.map((item, index) => {
                    if (item.header) {
                        return <div key={index} className="nav-section-title mt-4 mb-2">{item.header}</div>;
                    }

                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`nav-link w-full text-left ${isActive ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} w-6 text-center`}></i>
                            <span className="truncate">{item.name}</span>
                            {item.showBadge && pendingAssetRequests > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                    {pendingAssetRequests}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
