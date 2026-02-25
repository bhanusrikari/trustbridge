
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 3 seconds
            const interval = setInterval(fetchNotifications, 3000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all notifications as read", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.notification_id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const handleToggle = () => {
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.notification_id);
        }

        setIsOpen(false);

        if (notification.type === 'chat' && notification.related_id) {
            // Use the role from notification if available, otherwise fallback
            const otherRole = notification.related_role || (user.role === 'ServiceProvider' ? 'User' : 'ServiceProvider');
            navigate(`/chat?userId=${notification.related_id}&role=${otherRole}`);
        } else if ((notification.type === 'forum' || notification.type === 'like' || notification.type === 'comment') && notification.related_id) {
            // Redirection to specific post could be implemented if forum routes support it
            // For now, let's keep it to /forum or try /forum?postId=...
            navigate(`/forum`);
        } else if (notification.type === 'review' && notification.related_id) {
            navigate(`/services/${notification.related_id}`); // Redirect to the service page to see the review
        } else if (notification.type === 'booking') {
            navigate('/dashboard'); // Go to dashboard to manage bookings
        } else {
            // Fallback redirections
            if (notification.type === 'review') navigate('/dashboard');
            else if (notification.type === 'chat') navigate('/chat');
            else if (notification.type === 'booking') navigate('/dashboard');
            else navigate('/notifications');
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative ml-3">
            <div>
                <button
                    onClick={handleToggle}
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <span className="sr-only">View notifications</span>
                    <div className="relative">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">{unreadCount} NEW</span>
                        )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.notification_id}
                                    className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer ${notification.is_read ? 'opacity-75' : 'bg-blue-50/50 border-l-4 border-l-blue-500'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <p className={`text-sm ${notification.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
