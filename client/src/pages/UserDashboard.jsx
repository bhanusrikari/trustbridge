import { useState, useEffect } from 'react';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsRes = await api.get('/bookings');
                setBookings(bookingsRes.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleReviewClick = (booking) => {
        setSelectedBooking(booking);
        setIsReviewOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
                {user?.role === 'LocalResident' && (
                    <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-sm ${user.residence_status === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' :
                            user.residence_status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04Store 0 00-2.433 3.328 11.955 11.955 0 005.106 8.35c.148.102.29.213.425.332a.5.5 0 00.686 0 11.979 11.979 0 00.425-.332 11.955 11.955 0 005.106-8.35 1.002 1.002 0 00-2.433-3.328z" />
                            </svg>
                            {user.residence_status || 'Pending'} Resident
                        </div>
                        {user.badge && user.badge !== 'None' && (
                            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-md">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                {user.badge}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/forum" className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Discussion Forum</h4>
                        <p className="text-sm text-gray-500">Connect with neighbors</p>
                    </div>
                </Link>
                <Link to="/chat" className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Messages</h4>
                        <p className="text-sm text-gray-500">Chat with providers</p>
                    </div>
                </Link>
                <Link to="/services" className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Book Services</h4>
                        <p className="text-sm text-gray-500">Professional help nearby</p>
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{bookings.length} Bookings</span>
                </div>

                {bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="mt-2 text-lg font-medium text-gray-900">No bookings yet</p>
                        <p className="mt-1 text-sm text-gray-500">Get started by finding a service provider.</p>
                        <div className="mt-6">
                            <Link to="/services" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                Find Services
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.Service?.service_name}</div>
                                            <div className="text-sm text-gray-500">{booking.Service?.price ? `₹${booking.Service.price}` : 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.ServiceProvider?.sname}</div>
                                            <div className="text-sm text-gray-500">{booking.ServiceProvider?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.booking_date}</div>
                                            <div className="text-sm text-gray-500">{booking.booking_time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    booking.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {booking.status === 'Completed' && (
                                                <button
                                                    onClick={() => handleReviewClick(booking)}
                                                    className="text-blue-600 hover:text-blue-900 font-semibold"
                                                >
                                                    Leave Review
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                bookingId={selectedBooking?.booking_id}
                serviceName={selectedBooking?.Service?.service_name}
            />
        </div>
    );
};

export default UserDashboard;
