import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Polling for unread message count
    useEffect(() => {
        if (user) {
            const fetchUnread = async () => {
                try {
                    const res = await api.get('/chat/unread-counts');
                    setUnreadChatCount(res.data.unreadMessages);
                } catch (err) {
                    console.error("Error fetching unread counts", err);
                }
            };
            fetchUnread();
            const interval = setInterval(fetchUnread, 3000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <nav className="glass sticky top-0 z-50 border-b border-surface-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent group-hover:scale-105 transition-transform">TrustBridge</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {user && user.role !== 'ServiceProvider' && (
                            <>
                                {user.role === 'Admin' && (
                                    <Link to="/admin" className="text-surface-600 hover:text-primary-600 font-semibold transition duration-300">Admin</Link>
                                )}
                                <Link to="/services" className="text-surface-600 hover:text-primary-600 font-semibold transition duration-300">Services</Link>
                                <Link to="/forum" className="text-surface-600 hover:text-primary-600 font-semibold transition duration-300">Forum</Link>
                            </>
                        )}
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link to="/chat" className="text-surface-600 hover:text-primary-600 font-semibold transition duration-300 flex items-center">
                                    Chat
                                    {unreadChatCount > 0 && (
                                        <span className="ml-2 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white">
                                            {unreadChatCount}
                                        </span>
                                    )}
                                </Link>
                                <NotificationDropdown />
                                <div className="h-8 w-[1px] bg-surface-200"></div>
                                <Link
                                    to="/dashboard"
                                    className="btn-premium bg-primary-100 text-primary-700 hover:bg-primary-200 px-6 py-2.5 text-sm"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-surface-400 hover:text-accent-600 font-bold text-xs uppercase tracking-widest transition duration-300"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link to="/login" className="text-surface-600 hover:text-primary-600 font-semibold transition duration-300">Login</Link>
                                <Link
                                    to="/register"
                                    className="btn-premium bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 text-sm"
                                >
                                    SIGN UP
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                        {user && user.role !== 'ServiceProvider' && (
                            <>
                                {user.role === 'Admin' && (
                                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Admin</Link>
                                )}
                                <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Find Services</Link>
                                <Link to="/forum" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Community Forum</Link>
                            </>
                        )}
                        {user ? (
                            <>
                                <Link to="/chat" className="flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                    Chat
                                    {unreadChatCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {unreadChatCount} NEW
                                        </span>
                                    )}
                                </Link>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50">Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
