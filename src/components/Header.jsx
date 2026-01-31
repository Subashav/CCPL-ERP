import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onToggleSidebar }) => {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'Super Admin';
            case 'ADMIN': return 'Admin';
            case 'SITE_ENGINEER': return 'Site Engineer';
            default: return 'User';
        }
    };

    const getAvatarInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Fallback if user is null (though should be protected)
    const displayUser = user || { name: 'Guest', role: 'GUEST' };
    const roleLabel = getRoleLabel(displayUser.role);
    const avatarInitials = getAvatarInitials(displayUser.name);

    // Color based on role
    const getAvatarColor = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'bg-purple-600';
            case 'ADMIN': return 'bg-blue-600';
            case 'SITE_ENGINEER': return 'bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="sidebar-toggle" onClick={onToggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 bg-gray-100/50 hover:bg-gray-200 text-navy-900 px-3 py-1.5 rounded-lg ml-3 transition-all duration-200 border border-gray-200/50"
                    title="Go to Landing Page"
                >
                    <i className="fas fa-home text-primary"></i>
                    <span className="hidden sm:inline font-semibold text-xs tracking-wider uppercase">Home</span>
                </button>
                <div className="search-bar hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 ml-4">
                    <i className="fas fa-search text-gray-400 mr-2"></i>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="bg-transparent border-none focus:outline-none text-sm w-48"
                    />
                </div>
            </div>

            <div className="header-right">
                <div className="notifications">
                    <button className="notification-btn">
                        <i className="fas fa-bell"></i>
                        <span className="notification-badge">3</span>
                    </button>
                </div>

                <div className="user-menu">
                    <button
                        className="user-menu-btn"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                        <div className={`user-avatar flex items-center justify-center font-bold text-white rounded-full w-8 h-8 ${getAvatarColor(displayUser.role)}`}>
                            {avatarInitials}
                        </div>
                        <div className="text-left hidden md:block">
                            <div className="user-name text-sm font-semibold text-gray-800">{displayUser.name}</div>
                            <div className="user-role text-xs text-gray-500">{roleLabel}</div>
                        </div>
                        <i className="fas fa-chevron-down text-gray-400 text-xs ml-2"></i>
                    </button>

                    {showUserDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                                <div className="font-semibold text-gray-800">{displayUser.name}</div>
                                <div className="text-xs text-gray-500">{roleLabel}</div>
                            </div>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <i className="fas fa-user w-4 text-center"></i> Profile
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <i className="fas fa-cog w-4 text-center"></i> Settings
                            </a>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt w-4 text-center"></i> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
