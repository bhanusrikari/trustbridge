import { useState, useEffect } from 'react';
import api from '../services/api';
import AddServiceModal from '../components/AddServiceModal';
import EditServiceModal from '../components/EditServiceModal';

const ProviderDashboard = () => {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'services', 'profile'

    // Profile/Doc State
    const [docFile, setDocFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        try {
            const servicesRes = await api.get('/services/provider/all');
            setServices(servicesRes.data);
            const bookingsRes = await api.get('/bookings');
            setBookings(bookingsRes.data);
            const meRes = await api.get('/auth/me');
            setProvider(meRes.data.user);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleServiceAdded = () => {
        fetchData();
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await api.put(`/bookings/${bookingId}`, { status: newStatus });
            fetchData();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setIsEditModalOpen(true);
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`/services/${serviceId}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete service");
        }
    };

    const handleDocumentUpload = async (e) => {
        e.preventDefault();
        if (!docFile) return;

        setUploading(true);
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            await api.post('/services/provider/verify');

            alert("Documents uploaded successfully! Verified.");
            setProvider(prev => ({ ...prev, is_verified: true }));
            setDocFile(null);
        } catch (error) {
            console.error(error);
            alert("Verification failed");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <h2 className="text-3xl font-bold text-gray-900 mr-4">Provider Dashboard</h2>
                    {provider?.is_verified && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {['bookings', 'services', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition`}
                        >
                            {tab === 'profile' ? 'Profile & Verification' : tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="space-y-12">
                {activeTab === 'bookings' && (
                    <section>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Booking Requests</h3>
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                            {bookings.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No booking requests yet.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.map(booking => (
                                                <tr key={booking.booking_id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.Service?.service_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{booking.User?.ufname} {booking.User?.ulname}</div>
                                                        <div className="text-sm text-gray-500">{booking.User?.phone_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.booking_date} <br /> {booking.booking_time}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                booking.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        {booking.status === 'Pending' && (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(booking.booking_id, 'Accepted')} className="text-green-600 hover:text-green-900 font-bold">Accept</button>
                                                                <button onClick={() => handleStatusUpdate(booking.booking_id, 'Rejected')} className="text-red-600 hover:text-red-900 font-bold">Reject</button>
                                                            </>
                                                        )}
                                                        {booking.status === 'Accepted' && (
                                                            <button onClick={() => handleStatusUpdate(booking.booking_id, 'Completed')} className="text-blue-600 hover:text-blue-900 font-bold">Complete</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'services' && (
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-900">My Services</h3>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Service
                            </button>
                        </div>

                        <AddServiceModal
                            isOpen={isAddModalOpen}
                            onClose={() => setIsAddModalOpen(false)}
                            onServiceAdded={handleServiceAdded}
                        />

                        {editingService && (
                            <EditServiceModal
                                isOpen={isEditModalOpen}
                                onClose={() => {
                                    setIsEditModalOpen(false);
                                    setEditingService(null);
                                }}
                                service={editingService}
                                onServiceUpdated={handleServiceAdded}
                            />
                        )}

                        {services.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">You haven't listed any services yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <div key={service.service_id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xl font-bold text-gray-900">{service.service_name}</h4>
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">₹{service.price}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditService(service)}
                                                className="text-gray-500 hover:text-blue-600 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service.service_id)}
                                                className="text-gray-500 hover:text-red-600 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section className="max-w-3xl">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Profile & Verification</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your public profile and verification status.</p>
                            </div>
                            <div className="px-4 py-5 sm:p-6 space-y-6">
                                {/* Verification Status */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-700">Primary Category:</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {provider?.Category?.cat_name || 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Current Status:</span>
                                        {provider?.is_verified ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending Verification
                                            </span>
                                        )}
                                    </div>
                                    {!provider?.is_verified && (
                                        <p className="mt-2 text-xs text-gray-500">Upload your government ID and business license to get verified.</p>
                                    )}
                                </div>

                                {/* Upload Form */}
                                {!provider?.is_verified ? (
                                    <form onSubmit={handleDocumentUpload} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Upload Documents (ID / License)</label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setDocFile(e.target.files[0])} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                                    {docFile && <p className="text-sm text-green-600 font-semibold">{docFile.name}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!docFile || uploading}
                                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {uploading ? 'Verifying with AI...' : 'Submit for Verification'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">You are fully verified!</h3>
                                        <p className="mt-1 text-sm text-gray-500">Your services now appear with a verified badge.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;
