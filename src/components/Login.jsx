import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginUser = (userProfile) => {
        // Simulate login and store full profile
        sessionStorage.setItem('currentUser', JSON.stringify(userProfile));

        // Redirect based on role
        if (userProfile.role === 'engineer') {
            navigate('/engineer/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleDemoLogin = (role) => {
        let profile = {};
        if (role === 'superadmin') {
            profile = { name: 'John Smith', role: 'superadmin', roleName: 'Super Admin', avatar: 'JS' };
        } else if (role === 'admin') {
            profile = { name: 'Sarah Johnson', role: 'admin', roleName: 'Project Manager', avatar: 'SJ' };
        } else {
            profile = { name: 'David Lee', role: 'engineer', roleName: 'Site Engineer', avatar: 'DL' };
        }

        // Simulate form fill
        setUsername(profile.name);
        setPassword('demo123');

        // Login
        handleLoginUser(profile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Default fallback if typed manually
        // Check if username implies engineer for manual entry fallback
        const role = username.toLowerCase().includes('engineer') ? 'engineer' : 'superadmin';
        const profile = role === 'engineer'
            ? { name: 'David Lee', role: 'engineer', roleName: 'Site Engineer', avatar: 'DL' }
            : { name: 'John Smith', role: 'superadmin', roleName: 'Super Admin', avatar: 'JS' };

        handleLoginUser(profile);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="logo-section">
                        <h1><i className="fas fa-hard-hat"></i> CCPL Construction ERP</h1>
                        <p>Enterprise Resource Planning for Construction</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <small className="help-text">Select a demo account below</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <small className="help-text">Password: demo123</small>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>

                        <div className="demo-accounts">
                            <h4><i className="fas fa-id-badge text-gray-400"></i> Demo Access</h4>
                            <div className="demo-options flex flex-col gap-2">
                                <button type="button" className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200" onClick={() => handleDemoLogin('superadmin')}>
                                    <i className="fas fa-crown"></i> Login as Super Admin (Owner)
                                </button>
                                <button type="button" className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" onClick={() => handleDemoLogin('admin')}>
                                    <i className="fas fa-user-tie"></i> Login as Admin (Project Manager)
                                </button>
                                <button type="button" className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-green-50 hover:text-green-700 hover:border-green-200" onClick={() => handleDemoLogin('engineer')}>
                                    <i className="fas fa-hard-hat"></i> Login as Site Engineer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
