import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const EngineerLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="app-container">
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={closeSidebar}
                />
            )}

            <Sidebar 
                collapsed={sidebarCollapsed} 
                onToggle={toggleSidebar}
                role="engineer"
                isMobile={isMobile}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <main className={`main-content ${sidebarCollapsed && !isMobile ? 'expanded' : ''} ${isMobile ? 'mobile' : ''}`}>
                <Header onToggleSidebar={toggleSidebar} />

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default EngineerLayout;
