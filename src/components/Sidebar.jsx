import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPendingRequestsCount } from '../utils/assetStore';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth(); // User from context
    const [pendingAssetRequests, setPendingAssetRequests] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Determines if the sidebar is visually expanded (either actively open OR hovered while collapsed)
    const isExpanded = !collapsed || isHovered;

    const role = user?.role || 'GUEST';

    useEffect(() => {
        const updateCounts = () => {
            setPendingAssetRequests(getPendingRequestsCount());
        };

        updateCounts();
        const interval = setInterval(updateCounts, 5000);
        return () => clearInterval(interval);
    }, []);

    const adminItems = [
        { header: 'QUICK ACCESS' },
        { name: 'Home Screen', path: '/', icon: 'fas fa-globe' },
        { header: 'CORE MODULES' },
        { name: 'Executive Dashboard', path: '/super-admin', icon: 'fas fa-chart-line', roles: ['SUPER_ADMIN'] },
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Projects', path: '/projects', icon: 'fas fa-project-diagram' },
        { name: 'Task Management', path: '/tasks', icon: 'fas fa-tasks' },
        { name: 'Daily Site Logs', path: '/monitoring', icon: 'fas fa-clipboard-list' },

        { header: 'USER ADMINISTRATION', roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'User Management', path: '/users', icon: 'fas fa-users-cog', roles: ['SUPER_ADMIN', 'ADMIN'] },

        { header: 'RESOURCES' },
        {
            name: 'Assets',
            path: '/assets',
            icon: 'fas fa-tools',
            roles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
            name: 'Asset Requests',
            path: '/admin/asset-requests',
            icon: 'fas fa-bell-concierge',
            roles: ['SUPER_ADMIN', 'ADMIN'],
            showBadge: true
        },

        { name: 'Materials & Stock', path: '/inventory', icon: 'fas fa-boxes' },
        { name: 'Manpower Management', path: '/admin/manpower-summary', icon: 'fas fa-users-cog', roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'Attendance Records', path: '/admin/attendance-records', icon: 'fas fa-clipboard-check', roles: ['SUPER_ADMIN', 'ADMIN'] },

        { header: 'OPERATIONS', roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'Vendors & Contractors', path: '/vendors', icon: 'fas fa-handshake', roles: ['SUPER_ADMIN', 'ADMIN'] },

        { header: 'SUPPORT' },
        { name: 'Issue Tickets', path: '/tickets', icon: 'fas fa-ticket-alt' },
        { name: 'Reports', path: '/reports', icon: 'fas fa-chart-bar', roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'Documents', path: '/documents', icon: 'fas fa-folder' },

        { header: 'SYSTEM', roles: ['SUPER_ADMIN'] },
        { name: 'Notifications', path: '/notifications', icon: 'fas fa-bell', roles: ['SUPER_ADMIN'] },
        { name: 'Settings', path: '/settings', icon: 'fas fa-cog', roles: ['SUPER_ADMIN'] },
    ];

    const siteManagerItems = [
        { header: 'QUICK ACCESS' },
        { name: 'Home Screen', path: '/', icon: 'fas fa-globe' },
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

    let activeMenuItems = role === 'SITE_ENGINEER' ? siteManagerItems : adminItems.filter(item => !item.roles || item.roles.includes(role));

    return (
        <aside
            className={`sidebar ${!isExpanded ? 'collapsed' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <i className="fas fa-hard-hat text-2xl"></i>
                    {isExpanded && (
                        <span className="font-bold text-xl tracking-tight transition-opacity duration-300">Construction ERP</span>
                    )}</div>
            </div>

            <nav className="sidebar-nav">
                {activeMenuItems.map((item, index) => {
                    if (item.header) {
                        return (
                            <div key={index} className={`nav-section-title mt-4 mb-2 ${!isExpanded ? 'hidden' : 'block'}`}>
                                {item.header}
                            </div>
                        );
                    }

                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`nav-link w-full text-left ${isActive ? 'active' : ''}`}
                            title={!isExpanded ? item.name : ''}
                        >
                            <i className={`${item.icon} w-6 text-center`}></i>
                            <span className={`truncate ${!isExpanded ? 'hidden' : 'block'}`}>{item.name}</span>
                            {item.showBadge && pendingAssetRequests > 0 && (
                                <span className={`ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce ${!isExpanded ? 'hidden' : ''}`}>
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
