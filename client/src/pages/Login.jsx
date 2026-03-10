import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'User'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password, formData.role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-100/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="card-premium max-w-md w-full p-10 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-surface-500 font-medium tracking-tight">
                        New here? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold decoration-primary-200 underline-offset-4 hover:underline transition-all">Create an account</Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-accent-50/50 border border-accent-100 p-4 rounded-2xl mb-8 animate-shake">
                        <div className="flex items-center gap-3">
                            <svg className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-accent-700 font-bold">{error}</p>
                        </div>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Select Your Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-3.5 px-4 font-bold text-surface-900 transition-all appearance-none cursor-pointer"
                            >
                                <option value="User">Standard User</option>
                                <option value="LocalResident">Verified Resident</option>
                                <option value="ServiceProvider">Service Professional</option>
                                <option value="Admin">System Administrator</option>
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                name="email"
                                type="text"
                                required
                                className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-3.5 px-4 font-bold text-surface-900 transition-all"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-3.5 px-4 font-bold text-surface-900 transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <Link to="/forgot-password" size="sm" className="text-xs font-black text-surface-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="btn-premium w-full bg-surface-900 text-white hover:bg-primary-600 py-4 flex items-center justify-center gap-3 shadow-premium"
                        >
                            <span className="text-xs font-black tracking-[0.2em]">LOG IN</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
