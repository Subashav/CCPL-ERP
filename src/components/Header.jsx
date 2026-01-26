import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar }) => {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear session storage
        sessionStorage.removeItem('currentUser');
        // Navigate to login
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="sidebar-toggle" onClick={onToggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <nav className="breadcrumb">
                    <span className="breadcrumb-item">Home</span>
                    <i className="fas fa-chevron-right"></i>
                    <span className="breadcrumb-item active">Dashboard</span>
                </nav>
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
                        <div className="user-avatar">JS</div>
                        <div>
                            <div className="user-name">John Smith</div>
                            <div className="user-role">Super Admin</div>
                        </div>
                        <i className="fas fa-chevron-down"></i>
                    </button>

                    <div className={`user-dropdown ${showUserDropdown ? 'active' : ''}`}>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-user"></i> Profile
                        </a>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-cog"></i> Settings
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
