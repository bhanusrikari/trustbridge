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
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">TrustBridge</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user && user.role !== 'ServiceProvider' && (
                            <>
                                {user.role === 'Admin' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Admin</Link>
                                )}
                                <Link to="/services" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Find Services</Link>
                                <Link to="/forum" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Community Forum</Link>
                            </>
                        )}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="relative group">
                                    <Link to="/chat" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150 flex items-center">
                                        Chat
                                        {unreadChatCount > 0 && (
                                            <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {unreadChatCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                                <NotificationDropdown />
                                <span className="text-gray-500 text-sm">Hi, {user.ufname || user.fname || user.sname || user.username}</span>
                                <Link
                                    to="/dashboard"
                                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200 transition duration-150"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-700 font-medium transition duration-150"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Login</Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-150 shadow-md hover:shadow-lg"
                                >
                                    Get Started
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
