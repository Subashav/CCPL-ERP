import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('superadmin');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setRole(JSON.parse(storedUser).role);
        }
    }, []);

    // 1. Menu Items for Admins (Super Admin & Project Manager)
    // We use the 'roles' property to further filter between Super Admin and PM
    const adminItems = [
        { header: 'CORE MODULES' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Projects', path: '/projects', icon: 'fas fa-project-diagram' },
        { name: 'Task Management', path: '/tasks', icon: 'fas fa-tasks' },
        { name: 'Daily Site Logs', path: '/monitoring', icon: 'fas fa-clipboard-list' }, // Renamed from Site Monitoring

        { header: 'RESOURCES' },
        { name: 'Assets', path: '/assets', icon: 'fas fa-tools' },
        { name: 'My Site Assets', path: '/site-assets', icon: 'fas fa-clipboard-list' },
        { name: 'Materials & Stock', path: '/inventory', icon: 'fas fa-boxes' },
        { name: 'Labour Management', path: '/labour', icon: 'fas fa-users' },
        { name: 'Asset Management', path: '/assets', icon: 'fas fa-tools', roles: ['superadmin', 'admin'] },
        { name: 'Inventory', path: '/inventory', icon: 'fas fa-boxes' },

        { header: 'OPERATIONS', roles: ['superadmin', 'admin'] },
        { name: 'Procurement', path: '/procurement', icon: 'fas fa-shopping-cart', roles: ['superadmin', 'admin'] },
        { name: 'Vendors', path: '/vendors', icon: 'fas fa-handshake', roles: ['superadmin', 'admin'] },

        // Finance section (from teammate)
        { name: 'Finance & Billing', path: '/billing', icon: 'fas fa-file-invoice-dollar', roles: ['superadmin'] },
        { name: 'Expenses', path: '/expenses', icon: 'fas fa-receipt', roles: ['superadmin'] },


        { header: 'SUPPORT' },
        { name: 'Issue Tickets', path: '/tickets', icon: 'fas fa-ticket-alt' },
        { name: 'Reports', path: '/reports', icon: 'fas fa-chart-bar', roles: ['superadmin', 'admin'] },
        { name: 'Documents', path: '/documents', icon: 'fas fa-folder' },

        { header: 'ADMINISTRATION', roles: ['superadmin'] },
        { name: 'User Management', path: '/users', icon: 'fas fa-users-cog', roles: ['superadmin'] },
        { name: 'Notifications', path: '/notifications', icon: 'fas fa-bell', roles: ['superadmin'] },
        { name: 'Settings', path: '/settings', icon: 'fas fa-cog', roles: ['superadmin'] },
    ];

    // 2. Dedicated Menu for Site Engineers (Field View)
    const siteManagerItems = [
        { header: 'SITE EXECUTION' },
        { name: 'My Dashboard', path: '/engineer/dashboard', icon: 'fas fa-home' },
        { name: 'My Projects', path: '/engineer/projects', icon: 'fas fa-hard-hat' },
        { name: 'My Tasks', path: '/engineer/tasks', icon: 'fas fa-clipboard-list' },

        { header: 'DAILY UPDATES' },
        { name: 'Daily Task Update', path: '/engineer/updates', icon: 'fas fa-edit' },
        { name: 'Upload Photos', path: '/engineer/photos', icon: 'fas fa-camera' },
        { name: 'Labour Attendance', path: '/engineer/attendance', icon: 'fas fa-user-clock' },
        { name: 'Asset Daily Log', path: '/engineer/assets', icon: 'fas fa-truck-pickup' },

        { header: 'REQUESTS & ISSUES' },
        { name: 'Stock Request', path: '/engineer/stock', icon: 'fas fa-box-open' },
        { name: 'Tickets / Issues', path: '/engineer/tickets', icon: 'fas fa-exclamation-circle' },
        { name: 'Documents', path: '/engineer/documents', icon: 'fas fa-file-alt' },
        { name: 'Notifications', path: '/engineer/notifications', icon: 'fas fa-bell' },
    ];

    // Select the correct menu set
    let activeMenuItems = [];
    if (role === 'engineer') {
        activeMenuItems = siteManagerItems;
    } else {
        // Filter admin items based on specific role (superadmin vs admin)
        activeMenuItems = adminItems.filter(item => {
            if (!item.roles) return true;
            return item.roles.includes(role);
        });
    }

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
                        return (
                            <div key={index} className="nav-section-title mt-4 mb-2">
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
                        >
                            <i className={`${item.icon} w-6 text-center`}></i>
                            <span className="truncate">{item.name}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
