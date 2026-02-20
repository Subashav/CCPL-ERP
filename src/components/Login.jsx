import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, loginAsRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const roleParam = params.get('role');

        if (roleParam === 'engineer') {
            setUsername('site.engineer@ccpl.com');
            // Optional: Auto-login for demo purposes or just pre-fill
        } else if (roleParam === 'admin') {
            setUsername('admin.manager@ccpl.com');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password);

        if (result.success) {
            const storedUser = JSON.parse(localStorage.getItem('userInfo'));
            if (storedUser.role === 'SITE_ENGINEER') {
                navigate('/engineer/dashboard');
            } else if (storedUser.role === 'SUPER_ADMIN') {
                navigate('/super-admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    const handleRoleLogin = async (role) => {
        const result = await loginAsRole(role);
        if (result.success) {
            if (role === 'SUPER_ADMIN') {
                navigate('/super-admin');
            } else if (role === 'ADMIN') {
                navigate('/dashboard');
            } else if (role === 'SITE_ENGINEER') {
                navigate('/engineer/dashboard');
            }
        }
    };

    return (
        <div className="login-page">
            <div className="floating-elements"></div>
            <div className="login-container">
                <div className="login-card">
                    <div className="logo-section py-6">
                        <h1><i className="fas fa-hard-hat"></i> Construction ERP</h1>
                        <p>Enterprise Resource Planning for Construction</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">Email ID</label>
                            <input
                                type="email"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin.manager@ccpl.com"
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-base transition-all bg-white focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-base transition-all bg-white focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full py-3 text-base font-semibold mb-6">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>

                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-center mb-3 text-gray-600 text-sm font-semibold"><i className="fas fa-id-badge text-gray-400"></i> Access</h4>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 py-2"
                                    onClick={() => handleRoleLogin('SUPER_ADMIN')}
                                >
                                    <i className="fas fa-crown"></i> Login as Super Admin (1-Click)
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 py-2"
                                    onClick={() => handleRoleLogin('ADMIN')}
                                >
                                    <i className="fas fa-user-tie"></i> Login as Admin (1-Click)
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-green-50 hover:text-green-700 hover:border-green-200 py-2"
                                    onClick={() => handleRoleLogin('SITE_ENGINEER')}
                                >
                                    <i className="fas fa-hard-hat"></i> Login as Site Engineer (1-Click)
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
