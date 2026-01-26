import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { header: 'CORE MODULES' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Projects', path: '/projects', icon: 'fas fa-project-diagram' },
        { name: 'Task Management', path: '/tasks', icon: 'fas fa-tasks' },
        { name: 'Site Monitoring', path: '/monitoring', icon: 'fas fa-eye' },

        { header: 'RESOURCES' },
        { name: 'Labour Management', path: '/labour', icon: 'fas fa-users' },
        { name: 'Asset Management', path: '/assets', icon: 'fas fa-tools' },
        { name: 'Inventory', path: '/inventory', icon: 'fas fa-boxes' },

        { header: 'OPERATIONS' },
        { name: 'Procurement', path: '/procurement', icon: 'fas fa-shopping-cart' },
        { name: 'Vendors', path: '/vendors', icon: 'fas fa-handshake' },
        { name: 'Billing', path: '/billing', icon: 'fas fa-file-invoice-dollar' },
        { name: 'Expenses', path: '/expenses', icon: 'fas fa-receipt' },

        { header: 'SUPPORT' },
        { name: 'Issue Tickets', path: '/tickets', icon: 'fas fa-ticket-alt' },
        { name: 'Reports', path: '/reports', icon: 'fas fa-chart-bar' },
        { name: 'Documents', path: '/documents', icon: 'fas fa-folder' },

        { header: 'ADMINISTRATION' },
        { name: 'User Management', path: '/users', icon: 'fas fa-users-cog' },
        { name: 'Notifications', path: '/notifications', icon: 'fas fa-bell' },
        { name: 'Settings', path: '/settings', icon: 'fas fa-cog' },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <i className="fas fa-hard-hat text-2xl"></i>
                    <span className="font-bold text-xl tracking-tight">CCPL ERP</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => {
                    if (item.header) {
                        return (
                            <div key={index} className="nav-section-title mt-4 mb-2">
                                {item.header}
                            </div>
                        );
                    }

                    const isActive = location.pathname === item.path;
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
