import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError('Passwords do not match');
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setMessage('Password reset successfully! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token');
        }
    };

    if (!token) return <div className="text-center py-10">Invalid reset link. <Link to="/login" className="text-blue-600">Go to login</Link></div>;

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                {message && <div className="bg-green-100 p-3 text-green-700">{message}</div>}
                {error && <div className="bg-red-100 p-3 text-red-700">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="password" required placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <input type="password" required placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
