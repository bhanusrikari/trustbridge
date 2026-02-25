import { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('User');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState(''); // For demo purposes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email, role });
            setMessage(res.data.message);
            if (res.data.resetToken) {
                setResetToken(res.data.resetToken);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Enter your email to receive a reset link</p>
                </div>
                {message && <div className="bg-green-100 border-l-4 border-green-500 p-4 text-green-700">{message}</div>}
                {error && <div className="bg-red-100 border-l-4 border-red-500 p-4 text-red-700">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="User">Newcomer / User</option>
                                <option value="LocalResident">Local Resident</option>
                                <option value="ServiceProvider">Service Provider</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your email" />
                        </div>
                    </div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">Send Reset Link</button>
                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">Back to Login</Link>
                    </div>
                </form>

                {resetToken && (
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs font-bold text-yellow-800 mb-2">DEV MOCK: Reset Link</p>
                        <Link to={`/reset-password?token=${resetToken}`} className="text-blue-600 underline text-sm">Click here to reset password</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
