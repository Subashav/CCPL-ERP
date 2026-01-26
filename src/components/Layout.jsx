import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="app-container">
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <Header onToggleSidebar={toggleSidebar} />

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
