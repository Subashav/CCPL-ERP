import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (u, p) => {
        // Simulate login
        console.log('Login attempt:', { username: u, password: p });
        sessionStorage.setItem('currentUser', JSON.stringify({ username: u, role: 'superadmin' }));
        navigate('/dashboard');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    const handleDemoLogin = (role) => {
        setUsername(role);
        setPassword('demo123');
        handleLogin(role, 'demo123');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="logo-section">
                        <h1>
                            <i className="fas fa-hard-hat"></i> CCPL Construction ERP
                        </h1>
                        <p>Enterprise Resource Planning for Construction</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <small className="help-text">Demo users: superadmin, admin, engineer</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <small className="help-text">Password: demo123</small>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>

                        <div className="demo-accounts">
                            <h4>Demo Accounts</h4>
                            <div className="demo-options">
                                <button
                                    type="button"
                                    className="btn btn-outline demo-login"
                                    onClick={() => handleDemoLogin('superadmin')}
                                >
                                    <i className="fas fa-crown"></i> Super Admin
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline demo-login"
                                    onClick={() => handleDemoLogin('admin')}
                                >
                                    <i className="fas fa-user-tie"></i> Admin
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline demo-login"
                                    onClick={() => handleDemoLogin('engineer')}
                                >
                                    <i className="fas fa-hard-hat"></i> Site Engineer
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
